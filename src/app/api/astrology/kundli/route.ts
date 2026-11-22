import { NextResponse } from 'next/server';
import { calculateVedicChart } from '@/lib/astrology/engine';
import { getAppState } from '@/lib/services/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chart = calculateVedicChart({
      clientName: body.clientName || 'Valued Client',
      birthDate: body.birthDate || '1992-08-15',
      birthTime: body.birthTime || '06:30',
      birthCity: body.birthCity || 'Pune, India',
      latitude: body.latitude,
      longitude: body.longitude,
    });

    return NextResponse.json({ success: true, chart });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  const state = getAppState();
  const client = state.clients.find(c => c.id === clientId) || state.clients[0];

  const birthDate = client.specialistData.astrology?.birthDate || client.dob || '1991-08-14';
  const birthTime = client.specialistData.astrology?.birthTime || '06:45';
  const birthCity = client.specialistData.astrology?.birthCity || 'Pune, India';

  const chart = calculateVedicChart({
    clientName: client.name,
    birthDate,
    birthTime,
    birthCity,
  });

  return NextResponse.json({ success: true, client, chart });
}
