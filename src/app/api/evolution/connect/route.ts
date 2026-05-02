import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { serverUrl, apiKey, instanceName } = await req.json();

    if (!serverUrl || !apiKey || !instanceName) {
      return NextResponse.json({ error: 'Faltan parámetros de configuración' }, { status: 400 });
    }

    // 1. Intentar crear la instancia en Evolution API
    const createResponse = await fetch(`${serverUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        instanceName: instanceName,
        token: apiKey, // Opcional: puedes definir un token específico
        qrcode: true
      })
    });

    const createData = await createResponse.json();

    // 2. Si la instancia ya existe o se creó, pedimos el QR
    const qrResponse = await fetch(`${serverUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: {
        'apikey': apiKey
      }
    });

    const qrData = await qrResponse.json();

    return NextResponse.json({
      success: true,
      instance: createData.instance || instanceName,
      qrcode: qrData.base64 || qrData.code || null
    });

  } catch (error: any) {
    console.error('Error connecting to Evolution:', error);
    return NextResponse.json({ error: 'No se pudo conectar con el servidor VPS' }, { status: 500 });
  }
}
