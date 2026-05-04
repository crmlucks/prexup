import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'prexup_crm'
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Verificamos si es un evento de mensaje
    if (body.event === 'messages.upsert') {
      let message = Array.isArray(body.data) ? body.data[0] : body.data;
      if (!message || !message.key || !message.key.remoteJid) {
         return NextResponse.json({ success: true });
      }

      const phone = message.key.remoteJid.split('@')[0];
      const isFromMe = message.key.fromMe ? 1 : 0;
      
      let messageText = '';
      let messageType = 'text';
      let mediaUrl = null;

      // Extract the actual message object (sometimes wrapped in ephemeralMessage or viewOnceMessage)
      const msgData = message.message?.ephemeralMessage?.message || message.message?.viewOnceMessage?.message || message.message;

      // Extraction of base64 media from Evolution API when base64:true is set
      let mediaUrl = message.base64 || message.message?.base64 || msgData?.imageMessage?.base64 || msgData?.videoMessage?.base64 || null;
      if (mediaUrl && !mediaUrl.startsWith('data:')) {
        let mime = msgData?.imageMessage?.mimetype || msgData?.videoMessage?.mimetype || msgData?.audioMessage?.mimetype || msgData?.documentMessage?.mimetype || 'application/octet-stream';
        mediaUrl = `data:${mime};base64,${mediaUrl}`;
      }

      // Detectar tipo de mensaje y contenido
      if (msgData?.conversation) {
        messageText = msgData.conversation;
      } else if (msgData?.extendedTextMessage?.text) {
        messageText = msgData.extendedTextMessage.text;
      } else if (msgData?.imageMessage) {
        messageType = 'image';
        messageText = msgData.imageMessage.caption || 'Imagen';
        mediaUrl = mediaUrl || msgData.imageMessage.url || null; 
      } else if (msgData?.videoMessage) {
        messageType = 'video';
        messageText = msgData.videoMessage.caption || 'Video';
        mediaUrl = mediaUrl || msgData.videoMessage.url || null;
      } else if (msgData?.audioMessage) {
        messageType = 'audio';
        messageText = 'Audio';
        mediaUrl = mediaUrl || msgData.audioMessage.url || null;
      } else if (msgData?.documentMessage) {
        messageType = 'document';
        messageText = msgData.documentMessage.title || msgData.documentMessage.fileName || 'Documento';
        mediaUrl = mediaUrl || msgData.documentMessage.url || null;
      } else if (msgData?.stickerMessage) {
        messageType = 'image';
        messageText = 'Sticker';
      } else {
        messageText = 'Mensaje multimedia o sistema';
      }

      const connection = await mysql.createConnection(dbConfig);
      
      // Auto-create lead if it doesn't exist
      if (!isFromMe) {
        const [existing]: any = await connection.execute('SELECT id FROM leads WHERE phone = ? OR phone LIKE ? LIMIT 1', [phone, `%${phone}%`]);
        if (existing.length === 0) {
          const pushName = message.pushName || phone;
          await connection.execute(
            'INSERT INTO leads (name, phone, status, source, created_at, updated_at) VALUES (?, ?, "new", "WhatsApp", NOW(), NOW())',
            [pushName, phone]
          );
        }
      }

      await connection.execute(
        'INSERT INTO chat_messages (sender_id, message_text, message_type, media_url, is_from_me, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
        [phone, messageText, messageType, mediaUrl, isFromMe]
      );

      // --- n8n Webhook Forwarding ---
      if (!isFromMe && (messageType === 'text' || messageType === 'audio')) {
        try {
          const [settingsRows]: any = await connection.query('SELECT webhook_url, prompt, is_active, evolution_instance FROM chatbot_settings ORDER BY id DESC LIMIT 1');
          if (settingsRows && settingsRows.length > 0) {
            const settings = settingsRows[0];
            if (settings.is_active === 1 && settings.webhook_url) {
              
              // Extraemos el messageId original si es necesario para Evolution
              const messageId = message.key.id;

              // Enviar en background
              fetch(settings.webhook_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  phone: phone,
                  message: messageText,
                  messageType: messageType,
                  mediaUrl: mediaUrl,
                  messageId: messageId,
                  prompt: settings.prompt || '',
                  instance: settings.evolution_instance || body.instance || 'chatprex',
                  timestamp: new Date().toISOString(),
                  rawMessage: message // Objeto completo necesario para obtener media
                })
              }).catch(err => console.error("Error al reenviar a n8n:", err));
            }
          }
        } catch (e) {
          console.error("Error al obtener config del chatbot:", e);
        }
      }

      await connection.end();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
