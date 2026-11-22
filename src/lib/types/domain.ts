/**
 * Spiritual Practice Management & Client Intelligence Platform
 * Core Domain Definitions & Type Contracts
 */

export type ConfigurationProfile = 
  | 'astrology'
  | 'pandit_ritual'
  | 'tarot_card'
  | 'spiritual_coaching'
  | 'vastu'
  | 'creator';

export type UserRole = 
  | 'OWNER'
  | 'PRACTICE_ADMIN'
  | 'PRACTITIONER'
  | 'ASSISTANT'
  | 'MARKETING'
  | 'FINANCE'
  | 'AUDITOR';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  configProfile: ConfigurationProfile;
  currency: string; // ISO 4217, e.g. 'INR', 'USD', 'GBP'
  timezone: string; // IANA timezone, e.g. 'Asia/Kolkata', 'America/New_York'
  locale: string;
  logoUrl?: string;
  brandColors: {
    primary: string;
    accent: string;
    canvas: string;
  };
  contactEmail: string;
  contactPhone: string;
  ethicsDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  isActive: boolean;
}

export type LeadStage = 
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'WON'
  | 'LOST'
  | 'NURTURE';

export interface Lead {
  id: string;
  tenantId: string;
  contactId: string;
  name: string;
  email: string;
  phone: string;
  source: 'WEBSITE' | 'WHATSAPP' | 'INSTAGRAM' | 'REFERRAL' | 'MANUAL';
  serviceInterestId?: string;
  stage: LeadStage;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  intentMessage?: string;
  assignedUserId?: string;
  estimatedValueCents?: number;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientStatus = 'PROSPECT' | 'ACTIVE' | 'REPEAT' | 'INACTIVE' | 'DO_NOT_CONTACT';

export interface ClientSpecialistData {
  astrology?: {
    birthDate?: string;
    birthTime?: string;
    birthTimeAccuracy?: 'EXACT' | 'APPROXIMATE' | 'UNKNOWN';
    birthCity?: string;
    birthCountry?: string;
    chartSystem?: 'NORTH_INDIAN' | 'SOUTH_INDIAN' | 'WESTERN';
    ayanamsa?: 'LAHIRI' | 'RAMAN' | 'KRISHNAMURTI';
    notes?: string;
  };
  tarot?: {
    preferredDecks?: string[];
    coreFocusTheme?: string;
    sessionFormat?: 'LIVE_VIDEO' | 'RECORDED_VIDEO' | 'AUDIO_REPORT';
  };
  puja?: {
    tradition?: string;
    deityOrOccasion?: string;
    gotraVoluntary?: string;
    familyMembers?: string[];
    preferredMuhurat?: string;
  };
  vastu?: {
    propertyType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
    propertyAddress?: string;
    orientation?: string;
  };
  coaching?: {
    primaryGoals?: string[];
    milestonesSummary?: string;
  };
}

export interface Client {
  id: string;
  tenantId: string;
  contactId: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  dob?: string;
  status: ClientStatus;
  preferredLanguage: string;
  preferredChannel: 'WHATSAPP' | 'EMAIL' | 'PHONE' | 'PORTAL';
  tags: string[];
  specialistData: ClientSpecialistData;
  lifetimeValueCents: number;
  outstandingBalanceCents: number;
  lastContactAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientNote {
  id: string;
  tenantId: string;
  clientId: string;
  authorUserId: string;
  authorName: string;
  title: string;
  content: string;
  isConfidential: boolean; // Access-restricted: only assigned practitioner & owner
  isSharedWithClient: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentRecord {
  id: string;
  tenantId: string;
  clientId: string;
  purpose: 'SERVICE_DELIVERY' | 'MARKETING' | 'WHATSAPP' | 'RECORDING';
  status: 'GRANTED' | 'REVOKED';
  noticeVersion: string;
  source: string;
  timestamp: string;
}

export type DeliveryMode = 
  | 'IN_PERSON'
  | 'ONLINE_VIDEO'
  | 'PHONE'
  | 'WRITTEN_REPORT'
  | 'RITUAL_VENUE';

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  deliveryMode: DeliveryMode;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  priceCents: number;
  depositRequiredCents: number;
  requiresIntake: boolean;
  intakeSchema?: {
    fields: Array<{
      id: string;
      label: string;
      type: 'text' | 'date' | 'time' | 'select' | 'textarea' | 'checkbox';
      required: boolean;
      options?: string[];
    }>;
  };
  isActive: boolean;
  displayOrder: number;
}

export type AppointmentStatus = 
  | 'REQUESTED'
  | 'HELD'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  tenantId: string;
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
  status: AppointmentStatus;
  deliveryMode: DeliveryMode;
  meetingLink?: string;
  locationAddress?: string;
  intakeResponses?: Record<string, any>;
  internalBrief?: string;
  holdExpiresAt?: string;
  totalPriceCents: number;
  depositCents: number;
  isDepositPaid: boolean;
  isFullyPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentEvent {
  id: string;
  appointmentId: string;
  fromStatus: AppointmentStatus;
  toStatus: AppointmentStatus;
  actorUserId?: string;
  reason?: string;
  timestamp: string;
}

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'VOID';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paidAmountCents: number; // Derived from ledger
  balanceDueCents: number;
  currency: string;
  dueDate: string;
  issuedAt: string;
}

export interface LedgerEntry {
  id: string;
  tenantId: string;
  entryType: 'DEBIT' | 'CREDIT';
  accountCode: 'ACCOUNTS_RECEIVABLE' | 'BANK_GATEWAY' | 'REVENUE' | 'REFUND_EXPENSE' | 'CLIENT_DEPOSIT';
  amountCents: number;
  currency: string;
  referenceType: 'PAYMENT_INTENT' | 'INVOICE' | 'REFUND' | 'MANUAL_CASH_UPI';
  referenceId: string;
  description: string;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  tenantId: string;
  appointmentId?: string;
  invoiceId?: string;
  clientId: string;
  amountCents: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED';
  provider: 'RAZORPAY' | 'STRIPE' | 'CASHFREE' | 'MANUAL_UPI';
  providerReference?: string;
  paymentLinkUrl?: string;
  expiresAt: string;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  tenantId: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'PORTAL';
  direction: 'INBOUND' | 'OUTBOUND';
  senderName: string;
  body: string;
  isAiGeneratedDraft?: boolean;
  isApprovedByHuman?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  tenantId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'PORTAL';
  status: 'OPEN' | 'ASSIGNED' | 'WAITING_ON_CLIENT' | 'RESOLVED';
  unreadCount: number;
  lastMessageSnippet: string;
  lastActivityAt: string;
  messages: ConversationMessage[];
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorUserId?: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
