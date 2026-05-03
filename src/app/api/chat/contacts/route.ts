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
    
    // Obtener los contactos únicos que tienen mensajes, con el último mensaje y tiempo
    const [contacts] = await connection.execute(`
      SELECT 
        l.name, 
        l.phone, 
        m.message_text as lastMsg, 
        m.timestamp as time,
        (SELECT COUNT(*) FROM chat_messages WHERE sender_id = l.phone AND is_from_me = 0) as unread
      FROM leads l
      INNER JOIN chat_messages m ON m.sender_id = l.phone
      WHERE m.id IN (
        SELECT MAX(id) FROM chat_messages GROUP BY sender_id
      )
      ORDER BY m.timestamp DESC
    `);

    await connection.end();
    return NextResponse.json(contacts);

  } catch (error: any) {
    console.error('❌ Error obteniendo contactos:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
