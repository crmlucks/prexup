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
    
    // Verificamos si es un evento de mensaje
    if (body.event === 'messages.upsert') {
      const message = body.data;
      const phone = message.key.remoteJid.split('@')[0];
      const isFromMe = message.key.fromMe ? 1 : 0;
      
      let messageText = '';
      let messageType = 'text';
      let mediaUrl = null;

      // Detectar tipo de mensaje y contenido
      if (message.message?.conversation) {
        messageText = message.message.conversation;
      } else if (message.message?.extendedTextMessage?.text) {
        messageText = message.message.extendedTextMessage.text;
      } else if (message.message?.imageMessage) {
        messageType = 'image';
        messageText = message.message.imageMessage.caption || 'Imagen';
        // Aquí Evolution API suele enviar el buffer o URL si está configurado
        mediaUrl = message.message.imageMessage.url || null; 
      } else if (message.message?.videoMessage) {
        messageType = 'video';
        messageText = message.message.videoMessage.caption || 'Video';
        mediaUrl = message.message.videoMessage.url || null;
      } else if (message.message?.documentMessage) {
        messageType = 'document';
        messageText = message.message.documentMessage.title || 'Documento';
        mediaUrl = message.message.documentMessage.url || null;
      }

      const connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        'INSERT INTO chat_messages (sender_id, message_text, message_type, media_url, is_from_me, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
        [phone, messageText, messageType, mediaUrl, isFromMe]
      );
      await connection.end();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
