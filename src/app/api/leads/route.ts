import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();
    console.log('📥 Recibiendo lead:', body);

    connection = await mysql.createConnection(dbConfig);
    
    // Usamos nombres de columnas exactos y limpiamos valores
    const [result]: any = await connection.execute(
      `INSERT INTO leads 
      (name, phone, email, status, source, project_interest, assigned_agent, budget, currency, details) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name || 'Sin nombre',
        body.phone || '000000000',
        body.email || null,
        body.status || 'new',
        body.source || 'WhatsApp',
        body.project_interest || null,
        body.assigned_agent || null,
        body.budget || '0',
        body.currency || 'USD',
        body.details || null
      ]
    );

    await connection.end();
    return NextResponse.json({ success: true, id: result.insertId });

  } catch (error: any) {
    console.error('❌ Error fatal en MariaDB:', error.message);
    if (connection) await connection.end();
    
    // Enviamos el mensaje de error real al frontend para verlo en el Toast
    return NextResponse.json({ 
      success: false, 
      error: `Error de Base de Datos: ${error.message}` 
    }, { status: 500 });
  }
}

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
