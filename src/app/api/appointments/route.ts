import { NextResponse } from 'next/server';
import { getAppointments, insertAppointment } from '@/lib/services/supabase-service';

export async function GET() {
  const appointments = await getAppointments();
  return NextResponse.json({ success: true, count: appointments.length, data: appointments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const appointment = await insertAppointment(body);
    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
