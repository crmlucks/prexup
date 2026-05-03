import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = "force-dynamic";

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'prexup_crm'
};

// Update lead status/tags from chat
export async function PUT(req: Request) {
  let connection;
  try {
    const body = await req.json();
    const { phone, status, source } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Falta teléfono' }, { status: 400 });
    }

    connection = await mysql.createConnection(dbConfig);

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (source) {
      updates.push('source = ?');
      params.push(source);
    }

    if (updates.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'Sin cambios' }, { status: 400 });
    }

    params.push(phone);

    await connection.execute(
      `UPDATE leads SET ${updates.join(', ')} WHERE phone = ?`,
      params
    );

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
