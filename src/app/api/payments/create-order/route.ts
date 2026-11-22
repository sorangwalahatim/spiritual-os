import { NextResponse } from 'next/server';
import { createPaymentOrder } from '@/lib/payments/payment-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.amountCents || !body.clientId) {
      return NextResponse.json(
        { success: false, error: 'amountCents and clientId are required' },
        { status: 400 }
      );
    }

    const order = await createPaymentOrder({
      appointmentId: body.appointmentId,
      clientId: body.clientId,
      clientName: body.clientName || 'Valued Client',
      amountCents: body.amountCents,
      currency: body.currency || 'INR',
      provider: body.provider || 'RAZORPAY',
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
