import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, text, type = 'text', mediaUrl = null } = await req.json();

    if (!phone || !text) {
      return NextResponse.json({ error: 'Falta teléfono o texto' }, { status: 400 });
    }

    // Limpiar número
    const cleanPhone = phone.replace(/\D/g, '');

    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;

    // 1. Enviar a Evolution API
    // (Por ahora enviamos solo texto, pero Evolution soporta mediaMessage)
    const response = await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey || ''
      },
      body: JSON.stringify({
        number: cleanPhone,
        options: { delay: 1200, presence: "composing" },
        textMessage: { text: text }
      })
    });

    const result = await response.json();

    if (result.key) {
      // 2. Guardar en MariaDB
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || 'default'
      });

      await connection.execute(
        'INSERT INTO chat_messages (sender_id, message_text, message_type, media_url, is_from_me, timestamp) VALUES (?, ?, ?, ?, 1, NOW())',
        [cleanPhone, text, type, mediaUrl]
      );
      await connection.end();

      return NextResponse.json({ success: true, message: 'Enviado y guardado' });
    } else {
      return NextResponse.json({ error: 'Error Evolution: ' + JSON.stringify(result) }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error enviando chat:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
