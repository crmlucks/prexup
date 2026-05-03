import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Consulta Mejorada: Trae leads y gente que escribió, manejando casos sin mensajes
    const query = `
      SELECT 
        combined.phone,
        COALESCE(l.name, combined.phone) as name,
        COALESCE(m.message_text, 'Nuevo Lead (Sin mensajes)') as lastMsg,
        COALESCE(m.timestamp, l.created_at) as time,
        (SELECT COUNT(*) FROM chat_messages WHERE sender_id = combined.phone AND is_from_me = 0 AND timestamp > COALESCE(m.timestamp, '1970-01-01')) as unread
      FROM (
        SELECT DISTINCT sender_id as phone FROM chat_messages
        UNION
        SELECT phone FROM leads
      ) combined
      LEFT JOIN leads l ON l.phone = combined.phone
      LEFT JOIN chat_messages m ON m.id = (
        SELECT id FROM chat_messages 
        WHERE sender_id = combined.phone 
        ORDER BY timestamp DESC LIMIT 1
      )
      ORDER BY time DESC, combined.phone ASC
    `;

    const [rows]: any = await connection.execute(query);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('❌ Error fetching contacts:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
