import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = "force-dynamic";

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Traemos leads con toda la info necesaria para el chat
    const [leads]: any = await connection.execute(
      'SELECT id, name, phone, email, status, source, budget, currency, project_interest, assigned_agent, details, created_at FROM leads ORDER BY created_at DESC'
    );

    const contacts = [];
    for (const lead of leads) {
      let lastMsg = 'Sin mensajes aún';
      let time = lead.created_at;
      let unread = 0;
      let lastMsgType = 'text';

      try {
        const [msgs]: any = await connection.execute(
          'SELECT message_text, message_type, timestamp, is_from_me FROM chat_messages WHERE sender_id = ? ORDER BY timestamp DESC LIMIT 1',
          [lead.phone]
        );
        if (msgs.length > 0) {
          lastMsgType = msgs[0].message_type || 'text';
          if (lastMsgType === 'image') lastMsg = '📷 Imagen';
          else if (lastMsgType === 'video') lastMsg = '🎬 Video';
          else if (lastMsgType === 'audio') lastMsg = '🎤 Audio';
          else if (lastMsgType === 'document') lastMsg = '📄 Documento';
          else lastMsg = msgs[0].message_text || 'Multimedia';
          time = msgs[0].timestamp;
        }
      } catch (_) {}

      // Count unread messages (inbound messages not from me)
      try {
        const [unreadRows]: any = await connection.execute(
          'SELECT COUNT(*) as cnt FROM chat_messages WHERE sender_id = ? AND is_from_me = 0 AND is_read = 0',
          [lead.phone]
        );
        unread = unreadRows[0]?.cnt || 0;
      } catch (_) {}

      contacts.push({
        lead_id: lead.id,
        phone: lead.phone,
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        budget: lead.budget,
        currency: lead.currency,
        project_interest: lead.project_interest,
        assigned_agent: lead.assigned_agent,
        details: lead.details,
        lastMsg,
        lastMsgType,
        time,
        unread
      });
    }

    await connection.end();
    return NextResponse.json(contacts);
  } catch (error: any) {
    if (connection) await connection.end();
    console.error('Error fetching contacts:', error.message);
    return NextResponse.json([], { status: 200 });
  }
}
