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

// GET all quick responses
export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows]: any = await connection.execute(
      'SELECT * FROM quick_responses ORDER BY sort_order ASC, id ASC'
    );
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    if (connection) await connection.end();
    // If table doesn't exist, return defaults
    return NextResponse.json([
      { id: 1, label: "Saludo", text: "¡Hola! Gracias por contactar a PrexUp. ¿En qué proyecto estás interesado?", category: "general" },
      { id: 2, label: "Catálogo", text: "Te comparto el catálogo de propiedades disponibles.", category: "general" },
      { id: 3, label: "Visita", text: "Agendemos una visita para que puedas conocer el proyecto.", category: "seguimiento" },
      { id: 4, label: "Financiamiento", text: "Nuestras opciones incluyen crédito directo y bancario.", category: "ventas" },
      { id: 5, label: "Seguimiento", text: "¿Tuviste oportunidad de revisar la propuesta que te envié?", category: "seguimiento" },
      { id: 6, label: "Cierre", text: "¡Felicidades! Te enviaré los detalles del contrato.", category: "ventas" }
    ], { status: 200 });
  }
}

// POST (create) a quick response
export async function POST(req: Request) {
  let connection;
  try {
    const { label, text, category } = await req.json();
    if (!label || !text) {
      return NextResponse.json({ error: 'Falta label o texto' }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [result]: any = await connection.execute(
      'INSERT INTO quick_responses (label, text, category) VALUES (?, ?, ?)',
      [label, text, category || 'general']
    );
    await connection.end();
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (update) a quick response
export async function PUT(req: Request) {
  let connection;
  try {
    const { id, label, text, category } = await req.json();
    if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 });
    connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE quick_responses SET label = ?, text = ?, category = ? WHERE id = ?',
      [label, text, category || 'general', id]
    );
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a quick response
export async function DELETE(req: Request) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Falta ID' }, { status: 400 });
    connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM quick_responses WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
