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
    return NextResponse.json({ error: 'Se requiere el teléfono del cliente' }, { status: 400 });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Obtener los últimos 50 mensajes de este contacto
    const [messages] = await connection.execute(
      'SELECT * FROM chat_messages WHERE sender_id = ? ORDER BY timestamp ASC LIMIT 50',
      [phone]
    );

    await connection.end();
    return NextResponse.json(messages);

  } catch (error: any) {
    console.error('❌ Error obteniendo mensajes:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
