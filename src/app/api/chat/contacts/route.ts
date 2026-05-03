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

    // Consulta Universal:
    // Traemos todos los números que tienen mensajes Y los unimos con la tabla de leads para sacar sus nombres
    const query = `
      SELECT 
        combined.phone,
        COALESCE(l.name, combined.phone) as name,
        m.message_text as lastMsg,
        m.timestamp as time,
        (SELECT COUNT(*) FROM chat_messages WHERE sender_id = combined.phone AND is_from_me = 0 AND timestamp > m.timestamp) as unread
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
    console.error('❌ Error fetching universal contacts:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
