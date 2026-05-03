import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Evolution API envía el evento 'MESSAGES_UPSERT' cuando llega un mensaje
    if (body.event === 'messages.upsert') {
      const message = body.data;
      const remoteJid = message.key.remoteJid;
      const pushName = message.pushName || 'Cliente';
      const text = message.message?.conversation || message.message?.extendedTextMessage?.text || 'Mensaje Multimedia';
      const isFromMe = message.key.fromMe;

      console.log(`📩 Nuevo mensaje de ${pushName} (${remoteJid}): ${text}`);

      // Conexión a la DB (Usando tus variables de entorno)
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'prexup_crm'
      });

      // 1. Asegurar que el contacto existe en el CRM
      await connection.execute(
        'INSERT INTO leads (name, phone, status) VALUES (?, ?, "new") ON DUPLICATE KEY UPDATE name = ?',
        [pushName, remoteJid.split('@')[0], pushName]
      );

      // 2. Guardar el mensaje
      await connection.execute(
        'INSERT INTO chat_messages (sender_id, message_text, is_from_me, timestamp) VALUES (?, ?, ?, NOW())',
        [remoteJid.split('@')[0], text, isFromMe ? 1 : 0]
      );

      await connection.end();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error en Webhook:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
