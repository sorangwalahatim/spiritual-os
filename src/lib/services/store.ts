import type { 
  Tenant, 
  User, 
  Lead, 
  Client, 
  Service, 
  Appointment, 
  Invoice, 
  LedgerEntry, 
  Conversation, 
  ConversationMessage,
  AuditEvent,
  ClientNote,
  ConsentRecord,
  LeadStage,
  AppointmentStatus,
  ConfigurationProfile
} from '../types/domain.ts';
import { 
  initialTenant, 
  initialUsers, 
  initialServices, 
  initialClients, 
  initialNotes, 
  initialConsents, 
  initialLeads, 
  initialAppointments, 
  initialInvoices, 
  initialLedger, 
  initialConversations, 
  initialAuditEvents 
} from './mock-data.ts';

export interface AppState {
  tenant: Tenant;
  users: User[];
  services: Service[];
  clients: Client[];
  notes: ClientNote[];
  consents: ConsentRecord[];
  leads: Lead[];
  appointments: Appointment[];
  invoices: Invoice[];
  ledger: LedgerEntry[];
  conversations: Conversation[];
  auditEvents: AuditEvent[];
}

let memoryState: AppState = {
  tenant: { ...initialTenant },
  users: [...initialUsers],
  services: [...initialServices],
  clients: [...initialClients],
  notes: [...initialNotes],
  consents: [...initialConsents],
  leads: [...initialLeads],
  appointments: [...initialAppointments],
  invoices: [...initialInvoices],
  ledger: [...initialLedger],
  conversations: [...initialConversations],
  auditEvents: [...initialAuditEvents],
};

const STORAGE_KEY = 'spiritual_os_state_v1';

export function getAppState(): AppState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored state', e);
      }
    }
  }
  return memoryState;
}

export function saveAppState(newState: AppState): void {
  memoryState = newState;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      window.dispatchEvent(new Event('app_state_updated'));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }
}

export function resetAppState(): AppState {
  memoryState = {
    tenant: { ...initialTenant },
    users: [...initialUsers],
    services: [...initialServices],
    clients: [...initialClients],
    notes: [...initialNotes],
    consents: [...initialConsents],
    leads: [...initialLeads],
    appointments: [...initialAppointments],
    invoices: [...initialInvoices],
    ledger: [...initialLedger],
    conversations: [...initialConversations],
    auditEvents: [...initialAuditEvents],
  };
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('app_state_updated'));
  }
  return memoryState;
}

// ----------------------------------------------------
// Domain Action Operations with Server/Audit validation
// ----------------------------------------------------

export function logAudit(action: string, resourceType: string, resourceId: string, metadata?: Record<string, any>, actorName: string = 'Current Practitioner'): void {
  const state = getAppState();
  const event: AuditEvent = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tenantId: state.tenant.id,
    actorName,
    action,
    resourceType,
    resourceId,
    metadata,
    timestamp: new Date().toISOString()
  };
  state.auditEvents.unshift(event);
  saveAppState(state);
}

// Leads Operations
export function addLead(leadData: Omit<Lead, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Lead {
  const state = getAppState();
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    tenantId: state.tenant.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.leads.unshift(newLead);
  logAudit('LEAD_CREATED', 'LEAD', newLead.id, { name: newLead.name, source: newLead.source });
  saveAppState(state);
  return newLead;
}

export function updateLeadStage(leadId: string, newStage: LeadStage, reason?: string): Lead | null {
  const state = getAppState();
  const lead = state.leads.find(l => l.id === leadId);
  if (!lead) return null;

  const previousStage = lead.stage;
  lead.stage = newStage;
  if (reason) lead.lostReason = reason;
  lead.updatedAt = new Date().toISOString();

  logAudit('LEAD_STAGE_CHANGED', 'LEAD', lead.id, { from: previousStage, to: newStage, reason });
  saveAppState(state);
  return lead;
}

export function convertLeadToClient(leadId: string): Client | null {
  const state = getAppState();
  const lead = state.leads.find(l => l.id === leadId);
  if (!lead) return null;

  // Check if client already exists for this phone/email
  let client = state.clients.find(c => c.phone === lead.phone || c.email === lead.email);
  if (!client) {
    client = {
      id: `client-${Date.now()}`,
      tenantId: state.tenant.id,
      contactId: lead.contactId || `contact-${Date.now()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      whatsappNumber: lead.phone,
      status: 'ACTIVE',
      preferredLanguage: 'English',
      preferredChannel: lead.source === 'WHATSAPP' ? 'WHATSAPP' : 'EMAIL',
      tags: ['Converted Lead'],
      specialistData: {},
      lifetimeValueCents: 0,
      outstandingBalanceCents: 0,
      lastContactAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.clients.unshift(client);
  }

  lead.stage = 'WON';
  lead.updatedAt = new Date().toISOString();

  logAudit('LEAD_CONVERTED_TO_CLIENT', 'LEAD', lead.id, { clientId: client.id, clientName: client.name });
  saveAppState(state);
  return client;
}

// Client Notes Operations
export function addClientNote(clientId: string, title: string, content: string, isConfidential: boolean, isSharedWithClient: boolean, authorName: string = 'Current Practitioner'): ClientNote {
  const state = getAppState();
  const note: ClientNote = {
    id: `note-${Date.now()}`,
    tenantId: state.tenant.id,
    clientId,
    authorUserId: 'user-001',
    authorName,
    title,
    content,
    isConfidential,
    isSharedWithClient,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.notes.unshift(note);
  logAudit(isConfidential ? 'CONFIDENTIAL_NOTE_CREATED' : 'NOTE_CREATED', 'CLIENT_NOTE', note.id, { clientId, isConfidential, isSharedWithClient });
  saveAppState(state);
  return note;
}

// Appointments Operations
export function bookAppointment(data: {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  practitionerId: string;
  practitionerName: string;
  serviceId: string;
  serviceName: string;
  startTimeUtc: string;
  endTimeUtc: string;
  deliveryMode: any;
  meetingLink?: string;
  locationAddress?: string;
  totalPriceCents: number;
  depositCents: number;
  intakeResponses?: Record<string, any>;
  isDepositPaid?: boolean;
}): Appointment {
  const state = getAppState();
  const apt: Appointment = {
    id: `apt-${Date.now()}`,
    tenantId: state.tenant.id,
    clientId: data.clientId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
    practitionerId: data.practitionerId,
    practitionerName: data.practitionerName,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    startTimeUtc: data.startTimeUtc,
    endTimeUtc: data.endTimeUtc,
    status: data.isDepositPaid ? 'CONFIRMED' : 'PENDING_PAYMENT',
    deliveryMode: data.deliveryMode,
    meetingLink: data.meetingLink || 'https://meet.jit.si/AstroVeda-Session-' + Date.now().toString().slice(-4),
    locationAddress: data.locationAddress,
    intakeResponses: data.intakeResponses,
    totalPriceCents: data.totalPriceCents,
    depositCents: data.depositCents,
    isDepositPaid: !!data.isDepositPaid,
    isFullyPaid: Boolean(data.isDepositPaid && data.depositCents >= data.totalPriceCents),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.appointments.unshift(apt);
  logAudit('APPOINTMENT_BOOKED', 'APPOINTMENT', apt.id, { clientName: apt.clientName, serviceName: apt.serviceName, status: apt.status });
  saveAppState(state);
  return apt;
}

export function updateAppointmentStatus(appointmentId: string, newStatus: AppointmentStatus, reason?: string): Appointment | null {
  const state = getAppState();
  const apt = state.appointments.find(a => a.id === appointmentId);
  if (!apt) return null;

  const prev = apt.status;
  apt.status = newStatus;
  apt.updatedAt = new Date().toISOString();

  logAudit('APPOINTMENT_STATUS_CHANGED', 'APPOINTMENT', apt.id, { from: prev, to: newStatus, reason });
  saveAppState(state);
  return apt;
}

// Financial Ledger & Invoicing Operations
export function recordPayment(data: {
  clientId: string;
  clientName: string;
  amountCents: number;
  currency: string;
  paymentMethod: 'RAZORPAY' | 'STRIPE' | 'MANUAL_UPI' | 'CASH';
  referenceId: string;
  description: string;
  invoiceId?: string;
  appointmentId?: string;
}): LedgerEntry {
  const state = getAppState();
  
  // 1. Immutable Debit Entry (Bank / Gateway)
  const debitEntry: LedgerEntry = {
    id: `led-${Date.now()}-1`,
    tenantId: state.tenant.id,
    entryType: 'DEBIT',
    accountCode: 'BANK_GATEWAY',
    amountCents: data.amountCents,
    currency: data.currency,
    referenceType: data.paymentMethod === 'MANUAL_UPI' || data.paymentMethod === 'CASH' ? 'MANUAL_CASH_UPI' : 'PAYMENT_INTENT',
    referenceId: data.referenceId,
    description: `Received via ${data.paymentMethod}: ${data.description}`,
    createdAt: new Date().toISOString(),
  };

  // 2. Immutable Credit Entry (Revenue or Client Deposit)
  const creditEntry: LedgerEntry = {
    id: `led-${Date.now()}-2`,
    tenantId: state.tenant.id,
    entryType: 'CREDIT',
    accountCode: data.invoiceId ? 'REVENUE' : 'CLIENT_DEPOSIT',
    amountCents: data.amountCents,
    currency: data.currency,
    referenceType: 'INVOICE',
    referenceId: data.invoiceId || data.referenceId,
    description: `Allocation for ${data.clientName}`,
    createdAt: new Date().toISOString(),
  };

  state.ledger.unshift(debitEntry);
  state.ledger.unshift(creditEntry);

  // Update client lifetime value and balance
  const client = state.clients.find(c => c.id === data.clientId);
  if (client) {
    client.lifetimeValueCents += data.amountCents;
    client.outstandingBalanceCents = Math.max(0, client.outstandingBalanceCents - data.amountCents);
    client.updatedAt = new Date().toISOString();
  }

  // Update invoice if linked
  if (data.invoiceId) {
    const inv = state.invoices.find(i => i.id === data.invoiceId);
    if (inv) {
      inv.paidAmountCents += data.amountCents;
      inv.balanceDueCents = Math.max(0, inv.totalCents - inv.paidAmountCents);
      inv.status = inv.balanceDueCents === 0 ? 'PAID' : 'PARTIALLY_PAID';
    }
  }

  // Update appointment if linked
  if (data.appointmentId) {
    const apt = state.appointments.find(a => a.id === data.appointmentId);
    if (apt) {
      apt.isDepositPaid = true;
      if (data.amountCents >= apt.totalPriceCents) {
        apt.isFullyPaid = true;
      }
      apt.status = 'CONFIRMED';
      apt.updatedAt = new Date().toISOString();
    }
  }

  logAudit('PAYMENT_RECORDED_LEDGER', 'LEDGER_ENTRY', debitEntry.id, { 
    client: data.clientName, 
    amountCents: data.amountCents, 
    method: data.paymentMethod 
  });

  saveAppState(state);
  return debitEntry;
}

// Unified Inbox Operations
export function approveAiReply(conversationId: string, messageId: string): ConversationMessage | null {
  const state = getAppState();
  const conv = state.conversations.find(c => c.id === conversationId);
  if (!conv) return null;

  const msg = conv.messages.find(m => m.id === messageId);
  if (!msg) return null;

  msg.isAiGeneratedDraft = false;
  msg.isApprovedByHuman = true;
  msg.senderName = 'Acharya Raghavendra Sharma (Approved)';
  conv.unreadCount = 0;
  conv.lastActivityAt = new Date().toISOString();
  conv.lastMessageSnippet = msg.body;

  logAudit('AI_REPLY_APPROVED_AND_SENT', 'CONVERSATION', conv.id, { messageId, recipient: conv.contactName });
  saveAppState(state);
  return msg;
}

export function sendManualMessage(conversationId: string, body: string): ConversationMessage | null {
  const state = getAppState();
  const conv = state.conversations.find(c => c.id === conversationId);
  if (!conv) return null;

  const newMsg: ConversationMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    tenantId: state.tenant.id,
    channel: conv.channel,
    direction: 'OUTBOUND',
    senderName: 'Practitioner Team',
    body,
    isAiGeneratedDraft: false,
    isApprovedByHuman: true,
    createdAt: new Date().toISOString(),
  };

  conv.messages.push(newMsg);
  conv.unreadCount = 0;
  conv.lastActivityAt = new Date().toISOString();
  conv.lastMessageSnippet = body;

  logAudit('MESSAGE_SENT', 'CONVERSATION', conv.id, { recipient: conv.contactName, channel: conv.channel });
  saveAppState(state);
  return newMsg;
}

// Tenant Configuration Profile switch
export function updateConfigurationProfile(newProfile: ConfigurationProfile): Tenant {
  const state = getAppState();
  state.tenant.configProfile = newProfile;
  state.tenant.updatedAt = new Date().toISOString();
  logAudit('CONFIGURATION_PROFILE_UPDATED', 'TENANT', state.tenant.id, { profile: newProfile });
  saveAppState(state);
  return state.tenant;
}
