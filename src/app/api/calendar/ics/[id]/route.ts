import { NextRequest, NextResponse } from 'next/server';
import { generateICSContent } from '@/lib/calendar/sync';
import { initialAppointments, initialServices } from '@/lib/services/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = initialAppointments.find(a => a.id === id);

    if (!appointment) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    const service = initialServices.find(s => s.id === appointment.serviceId);

    const icsContent = generateICSContent({
      id: appointment.id,
      title: `${service?.name || 'Spiritual Consultation'} • ${appointment.clientName}`,
      description: `Spiritual consultation session with Acharya Raghavendra Sharma. Please join 5 minutes before scheduled start.\nNotes: ${service?.shortDescription || service?.fullDescription || ''}`,
      location: appointment.meetingLink || 'Google Meet (https://meet.google.com/ast-veda-pqr)',
      startTime: appointment.startTimeUtc,
      endTime: appointment.endTimeUtc,
      organizerName: 'AstroVeda Sanctuary',
      organizerEmail: 'care@astroveda.com',
      attendeeName: appointment.clientName,
      attendeeEmail: appointment.clientEmail || 'client@astroveda.com',
      url: appointment.meetingLink,
    });

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="AstroVeda-${appointment.id}.ics"`,
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate calendar invite' }, { status: 500 });
  }
}
