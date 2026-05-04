import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { serverUrl, apiKey, instanceName } = await req.json();

    if (!serverUrl || !apiKey || !instanceName) {
      return NextResponse.json({ error: 'Faltan parámetros de configuración' }, { status: 400 });
    }

    // 1. Verificar si la instancia ya existe y su estado
    const statusRes = await fetch(`${serverUrl}/instance/connectionState/${instanceName}`, {
      method: 'GET',
      headers: { 'apikey': apiKey }
    });
    
    const statusData = await statusRes.json();

    // Si ya está conectado, no necesitamos QR
    if (statusData.instance?.state === 'open') {
      return NextResponse.json({
        success: true,
        status: 'connected',
        message: 'WhatsApp ya está vinculado y activo.'
      });
    }

    // 2. Si no está conectado, intentamos crearla (por si acaso no existe)
    await fetch(`${serverUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        instanceName: instanceName,
        token: apiKey,
        qrcode: true
      })
    });

    // 3. Configurar el Webhook automáticamente para que los mensajes lleguen al CRM
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.chatprex.com';
    await fetch(`${serverUrl}/webhook/set/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        webhook: {
          url: `${appUrl}/api/chat/webhook`,
          byEvents: false,
          base64: false,
          events: ["MESSAGES_UPSERT"]
        }
      })
    }).catch(err => console.error("Error seteando webhook automático:", err));

    // 4. Solicitar un código QR fresco
    const qrResponse = await fetch(`${serverUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: { 'apikey': apiKey }
    });

    const qrData = await qrResponse.json();

    // Manejo de respuesta de Evolution v2
    const qrBase64 = qrData.base64 || (qrData.code ? qrData.code : null);

    if (!qrBase64) {
      return NextResponse.json({ 
        error: 'El servidor no devolvió un código QR. Intenta reiniciar la instancia en tu panel de Evolution.' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: 'disconnected',
      qrcode: qrBase64
    });

  } catch (error: any) {
    console.error('❌ Error Evolution Connect:', error.message);
    return NextResponse.json({ error: 'No se pudo comunicar con el VPS de Evolution. Revisa la URL y la API Key.' }, { status: 500 });
  }
}
