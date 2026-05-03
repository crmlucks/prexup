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

    // Simplificado: Traemos TODOS los leads directamente
    const [leads]: any = await connection.execute(
      'SELECT id, name, phone, status, source, created_at FROM leads ORDER BY created_at DESC'
    );

    // Construimos la lista de contactos desde los leads
    const contacts = [];
    for (const lead of leads) {
      let lastMsg = 'Sin mensajes aún';
      let time = lead.created_at;

      // Intentamos buscar el último mensaje (si la tabla existe)
      try {
        const [msgs]: any = await connection.execute(
          'SELECT message_text, timestamp FROM chat_messages WHERE sender_id = ? ORDER BY timestamp DESC LIMIT 1',
          [lead.phone]
        );
        if (msgs.length > 0) {
          lastMsg = msgs[0].message_text || 'Multimedia';
          time = msgs[0].timestamp;
        }
      } catch (_) {
        // Si chat_messages no existe, no pasa nada
      }

      contacts.push({
        phone: lead.phone,
        name: lead.name,
        status: lead.status,
        source: lead.source,
        lastMsg,
        time
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
