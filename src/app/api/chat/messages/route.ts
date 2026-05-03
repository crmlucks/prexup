import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Falta el parámetro phone' }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtenemos los mensajes donde el sender_id es el teléfono del lead
    // (Tanto los enviados por nosotros como los recibidos)
    const [rows]: any = await connection.execute(
      'SELECT * FROM chat_messages WHERE sender_id = ? ORDER BY timestamp ASC',
      [phone]
    );

    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('❌ Error fetching messages:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
