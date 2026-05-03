import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'prexup_crm',
};

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows]: any = await connection.query('SELECT * FROM chatbot_settings ORDER BY id DESC LIMIT 1');
    await connection.end();
    
    if (rows && rows.length > 0) {
      return NextResponse.json(rows[0]);
    }
    
    // Default settings if empty
    return NextResponse.json({
      webhook_url: '',
      prompt: 'Eres un experto asesor inmobiliario de PrexUp. Tu objetivo es responder consultas de forma amable y profesional.',
      is_active: 0,
      evolution_instance: 'chatprex'
    });
  } catch (error: any) {
    if (connection) await connection.end();
    console.error('Error fetching chatbot settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let connection;
  try {
    const data = await req.json();
    const { webhook_url, prompt, is_active, evolution_instance } = data;

    connection = await mysql.createConnection(dbConfig);
    
    // Check if any row exists
    const [rows]: any = await connection.query('SELECT id FROM chatbot_settings LIMIT 1');
    
    if (rows && rows.length > 0) {
      // Update existing
      await connection.query(
        'UPDATE chatbot_settings SET webhook_url = ?, prompt = ?, is_active = ?, evolution_instance = ? WHERE id = ?',
        [webhook_url || '', prompt || '', is_active ? 1 : 0, evolution_instance || 'chatprex', rows[0].id]
      );
    } else {
      // Insert new
      await connection.query(
        'INSERT INTO chatbot_settings (webhook_url, prompt, is_active, evolution_instance) VALUES (?, ?, ?, ?)',
        [webhook_url || '', prompt || '', is_active ? 1 : 0, evolution_instance || 'chatprex']
      );
    }

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (connection) await connection.end();
    console.error('Error saving chatbot settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
