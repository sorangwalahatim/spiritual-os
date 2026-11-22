/**
 * Calendar Synchronization & RFC 5545 iCalendar (.ics) Generator
 * Conforms to Section 18: Two-Way Calendar Integration (Google Calendar, Outlook, Apple Calendar)
 */

export interface CalendarEventDetails {
  id: string;
  title: string;
  description: string;
  location?: string;
  startTime: string; // ISO 8601 or YYYY-MM-DDTHH:mm:ss
  endTime: string;   // ISO 8601 or YYYY-MM-DDTHH:mm:ss
  organizerName: string;
  organizerEmail: string;
  attendeeName: string;
  attendeeEmail: string;
  url?: string;
}

/**
 * Format date string into UTC iCalendar timestamp: YYYYMMDDTHHMMSSZ
 */
function formatICSDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates RFC 5545 compliant VCALENDAR / VEVENT iCalendar content (.ics)
 */
export function generateICSContent(event: CalendarEventDetails): string {
  const dtStamp = formatICSDate(new Date().toISOString());
  const dtStart = formatICSDate(event.startTime);
  const dtEnd = formatICSDate(event.endTime);
  const uid = `astroveda-${event.id}-${Date.now()}@spiritualos.com`;

  const cleanDescription = (event.description || '').replace(/\n/g, '\\n');
  const cleanSummary = (event.title || 'Spiritual Consultation').replace(/\n/g, ' ');
  const cleanLocation = (event.location || 'Google Meet / Online Video Sanctuary').replace(/\n/g, ' ');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AstroVeda//Spiritual Practice OS v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    `ORGANIZER;CN=${event.organizerName}:mailto:${event.organizerEmail}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${event.attendeeName}:mailto:${event.attendeeEmail}`,
    event.url ? `URL:${event.url}` : '',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Spiritual Consultation with AstroVeda in 24 hours',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Spiritual Consultation starting in 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
}

/**
 * Generates one-click Google Calendar web link
 */
export function getGoogleCalendarUrl(event: CalendarEventDetails): string {
  const dtStart = formatICSDate(event.startTime);
  const dtEnd = formatICSDate(event.endTime);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${dtStart}/${dtEnd}`,
    details: `${event.description}\n\nJoin Link: ${event.url || event.location || 'Online'}`,
    location: event.location || 'Online Video Sanctuary',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates one-click Microsoft Outlook Web / Office 365 link
 */
export function getOutlookCalendarUrl(event: CalendarEventDetails): string {
  const start = new Date(event.startTime).toISOString();
  const end = new Date(event.endTime).toISOString();
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start,
    enddt: end,
    body: `${event.description}\n\nJoin: ${event.url || event.location || 'Online'}`,
    location: event.location || 'Online Video Sanctuary',
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Triggers direct browser file download for .ics
 */
export function downloadICSFile(event: CalendarEventDetails, fileName?: string): void {
  if (typeof window === 'undefined') return;
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `Consultation-${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
