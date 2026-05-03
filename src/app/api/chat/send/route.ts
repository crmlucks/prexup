import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

const EVO_URL = process.env.EVOLUTION_API_URL;
const EVO_KEY = process.env.EVOLUTION_API_KEY;
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE || 'PrexUp';

export async function POST(req: Request) {
  try {
    const { phone, text } = await req.json();

    if (!phone || !text) {
      return NextResponse.json({ error: 'Faltan parámetros: phone o text' }, { status: 400 });
    }

    if (!EVO_URL || !EVO_KEY) {
      return NextResponse.json({ error: 'Configuración de Evolution API no encontrada en el servidor' }, { status: 500 });
    }

    // 1. Limpiar el número de teléfono (solo números)
    const cleanPhone = phone.replace(/\D/g, '');

    // 2. Enviar el mensaje a través de Evolution API
    const response = await fetch(`${EVO_URL}/message/sendText/${EVO_INSTANCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVO_KEY
      },
      body: JSON.stringify({
        number: cleanPhone,
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

    const evoData = await response.json();

    // 3. Guardar el mensaje enviado en nuestra MariaDB
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO chat_messages (sender_id, message_text, is_from_me, timestamp) VALUES (?, ?, ?, NOW())',
      [cleanPhone, text, 1]
    );
    await connection.end();

    return NextResponse.json({ success: true, data: evoData });

  } catch (error: any) {
    console.error('❌ Error enviando mensaje:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
