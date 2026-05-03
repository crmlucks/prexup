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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json([], { status: 200 });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows]: any = await connection.execute(
      'SELECT * FROM chat_messages WHERE sender_id = ? ORDER BY timestamp ASC',
      [phone]
    );

    // Mark inbound messages as read
    try {
      await connection.execute(
        'UPDATE chat_messages SET is_read = 1 WHERE sender_id = ? AND is_from_me = 0 AND is_read = 0',
        [phone]
      );
    } catch (_) {}

    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json([], { status: 200 });
  }
}
