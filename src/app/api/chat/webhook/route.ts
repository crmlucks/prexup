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
    const body = await req.json();
    console.log('📩 Webhook recibido de Evolution:', body.event);

    // Solo procesamos eventos de mensaje (MESSAGES_UPSERT)
    if (body.event === 'messages.upsert') {
      const message = body.data;
      const phone = message.key.remoteJid.split('@')[0];
      const text = message.message?.conversation || message.message?.extendedTextMessage?.text || 'Mensaje de medios (imagen/audio)';
      const isFromMe = message.key.fromMe ? 1 : 0;

      const connection = await mysql.createConnection(dbConfig);
      
      // Guardamos el mensaje en la base de datos
      await connection.execute(
        'INSERT INTO chat_messages (sender_id, message_text, is_from_me, timestamp) VALUES (?, ?, ?, NOW())',
        [phone, text, isFromMe]
      );

      await connection.end();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error en Webhook:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
