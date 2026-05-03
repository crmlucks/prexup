import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = "force-dynamic";

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'default'
};

export async function POST(req: Request) {
  let connection;
  try {
    const formData = await req.formData();
    const phone = formData.get('phone') as string;
    const caption = (formData.get('caption') as string) || '';
    const file = formData.get('file') as File | null;

    if (!phone) return NextResponse.json({ error: 'Falta teléfono' }, { status: 400 });

    const cleanPhone = phone.replace(/\D/g, '');
    const evolutionUrl = process.env.EVOLUTION_API_URL;
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE;

    if (file) {
      // Convertir archivo a base64
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = file.type;
      const fileName = file.name;

      // Determinar tipo de mensaje
      let mediaType = 'document';
      if (mimeType.startsWith('image/')) mediaType = 'image';
      else if (mimeType.startsWith('video/')) mediaType = 'video';
      else if (mimeType.startsWith('audio/')) mediaType = 'audio';

      // Enviar a Evolution API v2
      const response = await fetch(`${evolutionUrl}/message/sendMedia/${instance}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': apiKey || '' },
        body: JSON.stringify({
          number: cleanPhone,
          mediatype: mediaType,
          caption: caption,
          media: `data:${mimeType};base64,${base64}`,
          fileName: fileName
        })
      });

      const result = await response.json();

      // Guardar en DB
      try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
          'INSERT INTO chat_messages (sender_id, message_text, message_type, is_from_me, timestamp) VALUES (?, ?, ?, 1, NOW())',
          [cleanPhone, caption || fileName, mediaType]
        );
        await connection.end();
      } catch (_) {}

      return NextResponse.json({ success: !!result.key, result });
    }

    return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
  } catch (error: any) {
    if (connection) await connection.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
