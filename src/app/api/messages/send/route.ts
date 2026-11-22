import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export interface SendMessagePayload {
  conversationId?: string;
  recipientPhone: string;
  recipientName?: string;
  channel?: 'WHATSAPP' | 'EMAIL' | 'SMS';
  message: string;
  senderName?: string;
}

export async function POST(request: Request) {
  try {
    const body: SendMessagePayload = await request.json();

    if (!body.recipientPhone || !body.message) {
      return NextResponse.json(
        { success: false, error: 'recipientPhone and message are required' },
        { status: 400 }
      );
    }

    // Clean phone number (remove spaces, dashes)
    const cleanPhone = body.recipientPhone.replace(/[^0-9]/g, '');

    // 1. Generate Direct WhatsApp Link (wa.me) for instant 1-click delivery
    const encodedText = encodeURIComponent(body.message);
    const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // 2. Log message to Supabase database if tables are active
    try {
      if (body.conversationId) {
        await supabase.from('conversation_messages').insert({
          id: `msg-${Date.now()}`,
          conversation_id: body.conversationId,
          tenant_id: 'tenant-001',
          channel: body.channel || 'WHATSAPP',
          direction: 'OUTBOUND',
          sender_name: body.senderName || 'Acharya Raghavendra Sharma',
          body: body.message,
          is_ai_generated_draft: false,
          is_approved_by_human: true,
        });

        await supabase.from('conversations').update({
          last_message_snippet: body.message.substring(0, 100),
          last_activity_at: new Date().toISOString(),
          unread_count: 0,
        }).eq('id', body.conversationId);
      }
    } catch (dbErr) {
      console.warn('Database logging warning:', dbErr);
    }

    // 3. Optional: WhatsApp Business Cloud API automated background dispatch
    // If WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID are configured in .env.local
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    let automatedApiDispatched = false;

    if (whatsappToken && whatsappPhoneId) {
      try {
        const metaRes = await fetch(
          `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: cleanPhone,
              type: 'text',
              text: { body: body.message },
            }),
          }
        );
        automatedApiDispatched = metaRes.ok;
      } catch (apiErr) {
        console.error('Meta WhatsApp Cloud API error:', apiErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Message processed successfully',
      directWhatsAppUrl,
      automatedApiDispatched,
      recipient: cleanPhone,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
