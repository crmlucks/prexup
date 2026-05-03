import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

// GET: Obtener todos los leads
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM leads ORDER BY created_at DESC');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching leads:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Guardar un nuevo lead
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, phone, email, status, source, 
      project_interest, assigned_agent, budget, currency, details 
    } = body;

    const connection = await mysql.createConnection(dbConfig);
    
    const [result]: any = await connection.execute(
      `INSERT INTO leads 
      (name, phone, email, status, source, project_interest, assigned_agent, budget, currency, details) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, phone, email || null, status || 'new', source || 'WhatsApp', 
        project_interest || null, assigned_agent || null, budget || '0', currency || 'USD', details || null
      ]
    );

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Lead guardado correctamente en MariaDB' 
    });

  } catch (error: any) {
    console.error('Error saving lead:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
