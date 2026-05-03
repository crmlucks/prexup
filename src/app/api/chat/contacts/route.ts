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

    // Buscamos todos los leads y el último mensaje de cada uno si existe
    // Hacemos un LEFT JOIN con chat_messages para ver quién nos escribió último
    const [rows]: any = await connection.execute(`
      SELECT 
        l.phone, 
        l.name, 
        (SELECT message_text FROM chat_messages WHERE sender_id = l.phone OR (is_from_me = 1 AND sender_id = l.phone) ORDER BY timestamp DESC LIMIT 1) as lastMsg,
        (SELECT timestamp FROM chat_messages WHERE sender_id = l.phone OR (is_from_me = 1 AND sender_id = l.phone) ORDER BY timestamp DESC LIMIT 1) as time,
        0 as unread
      FROM leads l
      ORDER BY time DESC, l.created_at DESC
    `);

    await connection.end();

    // Formateamos para el frontend
    const contacts = rows.map((row: any) => ({
      phone: row.phone,
      name: row.name,
      lastMsg: row.lastMsg || 'Sin mensajes aún',
      time: row.time || null,
      unread: row.unread || 0
    }));

    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('❌ Error fetching contacts:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
