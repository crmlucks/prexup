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

export async function POST(req: Request) {
  let connection;
  try {
    const { phone, text } = await req.json();

    if (!phone || !text) {
      return NextResponse.json({ error: 'Falta teléfono o texto' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;

    // 1. Enviar a Evolution API
    const response = await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey || ''
      },
      body: JSON.stringify({
        number: cleanPhone,
        text: text
      })
    });

    const result = await response.json();

    // 2. Guardar en MariaDB (independientemente de la respuesta de Evolution)
    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        'INSERT INTO chat_messages (sender_id, message_text, message_type, is_from_me, timestamp) VALUES (?, ?, ?, 1, NOW())',
        [cleanPhone, text, 'text']
      );
      await connection.end();
    } catch (_) {
      // Si falla el guardado, no bloqueamos el envío
    }

    if (result.key) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: JSON.stringify(result) }, { status: 500 });
    }
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
