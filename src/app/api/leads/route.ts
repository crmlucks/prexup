import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'prexup_crm'
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM leads ORDER BY created_at DESC');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();
    connection = await mysql.createConnection(dbConfig);
    const [result]: any = await connection.execute(
      `INSERT INTO leads 
      (name, phone, email, status, source, project_interest, assigned_agent, budget, currency, details) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [body.name, body.phone, body.email, body.status, body.source, body.project_interest, body.assigned_agent, body.budget, body.currency, body.details]
    );
    await connection.end();
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// EDITAR LEAD
export async function PUT(req: Request) {
  let connection;
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) return NextResponse.json({ error: 'Falta ID del lead' }, { status: 400 });

    connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `UPDATE leads SET 
        name = ?, phone = ?, email = ?, status = ?, source = ?, 
        project_interest = ?, assigned_agent = ?, budget = ?, 
        currency = ?, details = ? 
      WHERE id = ?`,
      [data.name, data.phone, data.email, data.status, data.source, data.project_interest, data.assigned_agent, data.budget, data.currency, data.details, id]
    );
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ELIMINAR LEAD
export async function DELETE(req: Request) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Falta ID del lead' }, { status: 400 });

    connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM leads WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
