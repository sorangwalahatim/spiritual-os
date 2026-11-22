import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Import domain logic functions
import { formatMoney, parseMoneyToCents } from '../src/lib/utils/money.ts';
import { 
  getAppState, 
  resetAppState, 
  addLead, 
  updateLeadStage, 
  convertLeadToClient, 
  addClientNote,
  bookAppointment,
  recordPayment,
  approveAiReply
} from '../src/lib/services/store.ts';

describe('Spiritual Practice Platform - Domain & Security Rules Verification', () => {

  test('Money calculations use integer minor units and correct ISO formatting (AC-13)', () => {
    // 350000 cents = ₹3,500.00
    const inrFormatted = formatMoney(350000, 'INR');
    assert.match(inrFormatted, /3,500/);

    const usdFormatted = formatMoney(25000, 'USD');
    assert.match(usdFormatted, /250/);

    const parsedCents = parseMoneyToCents('₹ 3,500.00');
    assert.equal(parsedCents, 350000);
  });

  test('Lead Lifecycle: Capture, Stage Transition and Conversion to Client (AC-02, AC-03)', () => {
    resetAppState();
    const state = getAppState();
    const initialClientsCount = state.clients.length;

    // 1. Capture new inquiry
    const lead = addLead({
      contactId: 'contact-test-1',
      name: 'Aditi Deshmukh',
      phone: '+91 99887 66554',
      email: 'aditi.d@example.com',
      source: 'WHATSAPP',
      stage: 'NEW',
      urgency: 'HIGH',
      intentMessage: 'Kundli consultation for career path',
      estimatedValueCents: 350000
    });
    assert.equal(lead.stage, 'NEW');

    // 2. Stage progression
    const contacted = updateLeadStage(lead.id, 'CONTACTED');
    assert.equal(contacted?.stage, 'CONTACTED');

    // 3. Convert to client
    const client = convertLeadToClient(lead.id);
    assert.ok(client);
    assert.equal(client?.name, 'Aditi Deshmukh');
    assert.equal(client?.phone, '+91 99887 66554');
    
    // Verify lead marked WON and client record created
    const refreshedState = getAppState();
    assert.equal(refreshedState.clients.length, initialClientsCount + 1);
    const updatedLead = refreshedState.leads.find(l => l.id === lead.id);
    assert.equal(updatedLead?.stage, 'WON');
  });

  test('Financial Ledger: Payments are recorded as immutable debit/credit entries, never mutable balance writes (AC-06, AC-12)', () => {
    resetAppState();
    const state = getAppState();
    const initialLedgerCount = state.ledger.length;
    const client = state.clients[0];
    const initialLtv = client.lifetimeValueCents;

    // Record manual UPI payment of ₹3,500 (350000 minor units)
    const ledgerEntry = recordPayment({
      clientId: client.id,
      clientName: client.name,
      amountCents: 350000,
      currency: 'INR',
      paymentMethod: 'MANUAL_UPI',
      referenceId: 'UPI-TEST-12345',
      description: 'Advance fee for Vedic consultation',
    });

    assert.ok(ledgerEntry);
    assert.equal(ledgerEntry.amountCents, 350000);
    assert.equal(ledgerEntry.accountCode, 'BANK_GATEWAY');

    const updatedState = getAppState();
    // Two entries posted (debit BANK_GATEWAY, credit CLIENT_DEPOSIT or REVENUE)
    assert.equal(updatedState.ledger.length, initialLedgerCount + 2);
    
    const updatedClient = updatedState.clients.find(c => c.id === client.id);
    assert.equal(updatedClient?.lifetimeValueCents, initialLtv + 350000);
  });

  test('Practitioner Confidentiality: Class 4 Notes access distinction (AC-09)', () => {
    resetAppState();
    const client = getAppState().clients[0];

    const confidentialNote = addClientNote(
      client.id,
      'Private Dasha Observation',
      'Confidential spiritual insight - client experiencing Rahu transition.',
      true,  // isConfidential
      false  // isSharedWithClient
    );

    assert.equal(confidentialNote.isConfidential, true);
    assert.equal(confidentialNote.isSharedWithClient, false);

    // Verify audit event generated
    const state = getAppState();
    const audit = state.auditEvents.find(a => a.resourceId === confidentialNote.id);
    assert.ok(audit);
    assert.equal(audit?.action, 'CONFIDENTIAL_NOTE_CREATED');
  });

  test('AI Governance: AI Drafts require explicit human practitioner approval (AC-11)', () => {
    resetAppState();
    const conversation = getAppState().conversations[0];
    const draftMsg = conversation.messages.find(m => m.isAiGeneratedDraft);
    assert.ok(draftMsg);
    assert.equal(draftMsg?.isApprovedByHuman, false);

    // Approve AI draft
    const approved = approveAiReply(conversation.id, draftMsg.id);
    assert.ok(approved);
    assert.equal(approved?.isApprovedByHuman, true);
    assert.equal(approved?.isAiGeneratedDraft, false);
  });

  test('Astrological Ephemeris: Deterministic Sidereal Lahiri Calculation (Phase 4)', async () => {
    // Dynamic import to support TypeScript/ESM
    const { calculateVedicChart } = await import('../src/lib/astrology/engine.ts');

    const chart = calculateVedicChart({
      clientName: 'Priyanka Sen',
      birthDate: '1992-08-14',
      birthTime: '06:45',
      birthCity: 'Kolkata, India',
    });

    assert.ok(chart);
    assert.equal(chart.birthDetails.clientName, 'Priyanka Sen');
    assert.equal(chart.planets.length, 9); // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
    assert.equal(chart.houses.length, 12); // 12 houses
    assert.ok(chart.birthDetails.ayanamsaValue > 23); // Lahiri ayanamsa is ~23.5° - 24°
    assert.ok(chart.currentDasha.mahadasha);
    assert.ok(chart.remedies.gemstone);
    assert.ok(chart.remedies.mantra);
  });

  test('Calendar Sync: RFC 5545 iCalendar & Google Calendar URL generation (Phase 5)', async () => {
    const { generateICSContent, getGoogleCalendarUrl } = await import('../src/lib/calendar/sync.ts');

    const sampleEvent = {
      id: 'apt-test-001',
      title: 'Vedic Kundli Consultation',
      description: 'Comprehensive birth chart review',
      startTime: '2026-11-25T10:00:00.000Z',
      endTime: '2026-11-25T11:00:00.000Z',
      organizerName: 'AstroVeda Sanctuary',
      organizerEmail: 'care@astroveda.com',
      attendeeName: 'Priyanka Sen',
      attendeeEmail: 'priyanka.sen@gmail.com',
      url: 'https://meet.google.com/ast-veda-pqr',
    };

    const ics = generateICSContent(sampleEvent);
    assert.ok(ics.includes('BEGIN:VCALENDAR'));
    assert.ok(ics.includes('BEGIN:VEVENT'));
    assert.ok(ics.includes('SUMMARY:Vedic Kundli Consultation'));
    assert.ok(ics.includes('END:VCALENDAR'));

    const googleUrl = getGoogleCalendarUrl(sampleEvent);
    assert.ok(googleUrl.startsWith('https://calendar.google.com/calendar/render?'));
    assert.ok(googleUrl.includes('Vedic+Kundli+Consultation'));
  });

  test('Messaging Automation: Multi-channel WhatsApp reminder formatting (Phase 5)', async () => {
    const { formatWhatsAppMessage, dispatchReminder } = await import('../src/lib/messaging/engine.ts');

    const msg = formatWhatsAppMessage({
      appointmentId: 'apt-001',
      clientName: 'Priyanka Sen',
      phone: '+91 98711 22334',
      serviceName: 'Comprehensive Horoscope Reading',
      scheduledTime: '2026-11-25T10:30:00.000Z',
      reminderType: '24H_BEFORE',
    });

    assert.ok(msg.includes('Namaste Priyanka Sen'));
    assert.ok(msg.includes('Comprehensive Horoscope Reading'));
    assert.ok(msg.includes('tomorrow'));

    const dispatch = await dispatchReminder({
      appointmentId: 'apt-001',
      clientName: 'Priyanka Sen',
      phone: '+91 98711 22334',
      serviceName: 'Comprehensive Horoscope Reading',
      scheduledTime: '2026-11-25T10:30:00.000Z',
      reminderType: '1H_BEFORE',
      channel: 'WHATSAPP',
    });

    assert.equal(dispatch.status, 'DELIVERED');
    assert.equal(dispatch.channel, 'WHATSAPP');
    assert.ok(dispatch.deliveryMetadata.messageId);
  });
});
