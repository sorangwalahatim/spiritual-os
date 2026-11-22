/**
 * Date and timezone utilities ensuring canonical UTC storage and locale formatting
 */

export function formatDateTime(utcIsoString: string, timezone: string = 'Asia/Kolkata'): string {
  try {
    const date = new Date(utcIsoString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: timezone,
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return utcIsoString;
  }
}

export function formatDateOnly(utcIsoString: string, timezone: string = 'Asia/Kolkata'): string {
  try {
    const date = new Date(utcIsoString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: timezone,
      dateStyle: 'medium',
    }).format(date);
  } catch {
    return utcIsoString;
  }
}

export function formatTimeOnly(utcIsoString: string, timezone: string = 'Asia/Kolkata'): string {
  try {
    const date = new Date(utcIsoString);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: timezone,
      timeStyle: 'short',
    }).format(date);
  } catch {
    return utcIsoString;
  }
}
