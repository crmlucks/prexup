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
  try {
    const { phone, text, instance, serverUrl, apiKey } = await req.json();

    if (!phone || !text || !serverUrl || !apiKey) {
      return NextResponse.json({ error: 'Faltan parámetros de envío' }, { status: 400 });
    }

    // 1. Enviar el mensaje a través de Evolution API en el VPS
    const evolutionResponse = await fetch(`${serverUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        number: phone,
        options: {
          delay: 1200,
          presence: "composing",
          linkPreview: false
        },
        textMessage: {
          text: text
        }
      })
    });

    const evoData = await evolutionResponse.json();

    // 2. Guardar el mensaje enviado en nuestra MariaDB
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO chat_messages (sender_id, message_text, is_from_me, timestamp) VALUES (?, ?, ?, NOW())',
      [phone, text, 1] // 1 significa que lo envié yo
    );
    await connection.end();

    return NextResponse.json({ success: true, data: evoData });

  } catch (error: any) {
    console.error('❌ Error enviando mensaje:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
