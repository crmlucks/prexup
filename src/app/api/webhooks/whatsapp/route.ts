import { NextResponse } from 'next/server';
import { qualifyLeadFromMessage, generateWhatsAppResponse } from '@/lib/ai';

/**
 * WhatsApp Webhook Endpoint
 * Ready for Meta WhatsApp Cloud API or Evolution API
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Extract message data (structure varies by provider)
    const message = payload.message?.text || payload.data?.message?.text;
    const sender = payload.sender?.phone || payload.data?.sender?.phone;
    
    if (!message || !sender) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 1. AI Analysis / Qualification
    const qualification = await qualifyLeadFromMessage(message);
    
    // 2. Log message to database (multi-tenant logic would go here)
    console.log(`[WhatsApp Webhook] New message from ${sender}: ${message}`);
    console.log(`[AI Analysis] Qualified: ${qualification.qualified}, Intent: ${qualification.intent}`);

    // 3. Automated Response if qualified
    if (qualification.qualified) {
      const responseText = await generateWhatsAppResponse(message, qualification);
      
      // Here you would call the WhatsApp API (Meta or Evolution) to send the message back
      console.log(`[WhatsApp Outbound] Sending AI response: ${responseText}`);
    }

    return NextResponse.json({ success: true, analysis: qualification });
  } catch (error) {
    console.error('[Webhook Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
