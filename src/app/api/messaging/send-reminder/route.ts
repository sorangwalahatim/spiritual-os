import { NextRequest, NextResponse } from 'next/server';
import { dispatchReminder, type DispatchReminderParams } from '@/lib/messaging/engine';

export async function POST(request: NextRequest) {
  try {
    const body: DispatchReminderParams = await request.json();

    if (!body.phone || !body.clientName || !body.scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields: phone, clientName, scheduledTime' },
        { status: 400 }
      );
    }

    const payload = await dispatchReminder(body);

    return NextResponse.json({
      success: true,
      message: `Automated reminder (${body.reminderType}) dispatched successfully via ${payload.channel}`,
      payload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch reminder' },
      { status: 500 }
    );
  }
}
