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
  AuditEvent,
  ClientNote,
  ConsentRecord
} from '../types/domain.ts';

export const initialTenant: Tenant = {
  id: 'tenant-001',
  name: 'AstroVeda & Intuitive Sanctuary',
  slug: 'astroveda',
  configProfile: 'astrology',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  locale: 'en-IN',
  brandColors: {
    primary: '#D37D1A', // Warm golden ochre
    accent: '#1E1B4B',  // Deep cosmic indigo
    canvas: '#FAFAF9',  // Warm serene neutral
  },
  contactEmail: 'guidance@astroveda.com',
  contactPhone: '+91 98201 54321',
  ethicsDisclaimer: 'Spiritual, astrological, and tarot consultations offer self-reflection and guidance. They do not constitute certified medical, financial, or legal advice.',
  createdAt: '2026-01-10T09:00:00Z',
  updatedAt: '2026-11-15T10:00:00Z',
};

export const initialUsers: User[] = [
  {
    id: 'user-001',
    tenantId: 'tenant-001',
    name: 'Acharya Raghavendra Sharma',
    email: 'raghavendra@astroveda.com',
    role: 'OWNER',
    phone: '+91 98201 54321',
    title: 'Lead Vedic Astrologer & Vastu Acharya',
    bio: 'Over 22 years of practice in Parashari Jyotish, Prashna, and Vastu Shastra.',
    isActive: true,
  },
  {
    id: 'user-002',
    tenantId: 'tenant-001',
    name: 'Ananya Deshmukh',
    email: 'ananya@astroveda.com',
    role: 'PRACTITIONER',
    phone: '+91 98201 98765',
    title: 'Master Tarot & Intuitive Guide',
    bio: 'Specialist in Celtic Cross relationship spreads and shadow work integration.',
    isActive: true,
  },
  {
    id: 'user-003',
    tenantId: 'tenant-001',
    name: 'Rohit Verma',
    email: 'rohit@astroveda.com',
    role: 'ASSISTANT',
    phone: '+91 98201 11223',
    title: 'Practice Coordinator & Receptionist',
    isActive: true,
  }
];

export const initialServices: Service[] = [
  {
    id: 'srv-001',
    tenantId: 'tenant-001',
    name: 'Vedic Kundli & Dasha Consultation',
    category: 'Vedic Astrology',
    shortDescription: 'Comprehensive horoscope analysis, Mahadasha timing, career, health, and relationship insights.',
    fullDescription: 'Detailed 60-minute session examining your Rasi (D1), Navamsha (D9), current Vimshottari Dasha, and transits. Includes remedies (Upayas) and gemstones suggestions.',
    deliveryMode: 'ONLINE_VIDEO',
    durationMinutes: 60,
    bufferBeforeMinutes: 10,
    bufferAfterMinutes: 10,
    priceCents: 350000, // ₹3,500.00
    depositRequiredCents: 100000, // ₹1,000.00
    requiresIntake: true,
    isActive: true,
    displayOrder: 1,
    intakeSchema: {
      fields: [
        { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
        { id: 'birthTime', label: 'Exact Birth Time', type: 'time', required: true },
        { id: 'birthCity', label: 'City of Birth', type: 'text', required: true },
        { id: 'consultationFocus', label: 'Primary Consultation Focus', type: 'select', required: true, options: ['Career & Business', 'Marriage & Relationships', 'Health & Well-being', 'Spiritual Growth & Moksha'] }
      ]
    }
  },
  {
    id: 'srv-002',
    tenantId: 'tenant-001',
    name: 'Tarot Celtic Cross & Relationship Spread',
    category: 'Tarot & Intuitive',
    shortDescription: '45-minute deep-dive card reading for emotional clarity, crossroads, and relationship dynamics.',
    fullDescription: 'In-depth 10-card Celtic Cross spread exploring subconscious influences, immediate challenges, and emerging outcomes. Includes post-session card spread photo and key reflections.',
    deliveryMode: 'ONLINE_VIDEO',
    durationMinutes: 45,
    bufferBeforeMinutes: 10,
    bufferAfterMinutes: 5,
    priceCents: 250000, // ₹2,500.00
    depositRequiredCents: 100000,
    requiresIntake: true,
    isActive: true,
    displayOrder: 2,
    intakeSchema: {
      fields: [
        { id: 'question', label: 'Primary Question or Situation', type: 'textarea', required: true },
        { id: 'situationContext', label: 'Brief Context (Optional)', type: 'textarea', required: false }
      ]
    }
  },
  {
    id: 'srv-003',
    tenantId: 'tenant-001',
    name: 'Navagraha Shanti & Vedic Puja',
    category: 'Rituals & Pujas',
    shortDescription: 'Sacred ritual performed with Vedic pandits for planetary peace, prosperity, and obstacle removal.',
    fullDescription: 'Authentic 120-minute ritual including Sankalp in client name and Gotra, complete samagri recitation, and prasadam delivery with live stream video option.',
    deliveryMode: 'RITUAL_VENUE',
    durationMinutes: 120,
    bufferBeforeMinutes: 30,
    bufferAfterMinutes: 30,
    priceCents: 1100000, // ₹11,000.00
    depositRequiredCents: 500000, // ₹5,000.00
    requiresIntake: true,
    isActive: true,
    displayOrder: 3,
    intakeSchema: {
      fields: [
        { id: 'sankalpName', label: 'Main Yajman Full Name', type: 'text', required: true },
        { id: 'gotra', label: 'Gotra (if known)', type: 'text', required: false },
        { id: 'occasion', label: 'Occasion or Purpose', type: 'text', required: true }
      ]
    }
  },
  {
    id: 'srv-004',
    tenantId: 'tenant-001',
    name: 'Vastu Residential Floorplan Evaluation',
    category: 'Vastu Shastra',
    shortDescription: 'Scientific & Vedic spatial energy alignment for homes, apartments, and personal sanctuaries.',
    fullDescription: 'Complete 90-minute directional analysis based on 16 Vastu zones and Pancha Tattva balances. Non-demolition remedies recommended.',
    deliveryMode: 'ONLINE_VIDEO',
    durationMinutes: 90,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 15,
    priceCents: 750000, // ₹7,500.00
    depositRequiredCents: 250000,
    requiresIntake: true,
    isActive: true,
    displayOrder: 4,
    intakeSchema: {
      fields: [
        { id: 'propertyType', label: 'Property Type', type: 'select', required: true, options: ['Apartment / Flat', 'Independent Villa', 'Plot'] },
        { id: 'facingDirection', label: 'Main Entrance Facing', type: 'select', required: true, options: ['North', 'East', 'North-East', 'South', 'West', 'Other'] }
      ]
    }
  }
];

export const initialClients: Client[] = [
  {
    id: 'client-101',
    tenantId: 'tenant-001',
    contactId: 'contact-101',
    name: 'Priyanka Sen',
    email: 'priyanka.sen@gmail.com',
    phone: '+91 98711 22334',
    whatsappNumber: '+91 98711 22334',
    dob: '1992-08-14',
    status: 'ACTIVE',
    preferredLanguage: 'English',
    preferredChannel: 'WHATSAPP',
    tags: ['Career Transition', 'VIP', 'Vedic Astrology'],
    specialistData: {
      astrology: {
        birthDate: '1992-08-14',
        birthTime: '06:45',
        birthTimeAccuracy: 'EXACT',
        birthCity: 'Kolkata, West Bengal',
        birthCountry: 'India',
        chartSystem: 'NORTH_INDIAN',
        ayanamsa: 'LAHIRI',
        notes: 'Simha Lagna, Rahu in 5th, entering Jupiter Mahadasha in early 2027.'
      }
    },
    lifetimeValueCents: 700000, // ₹7,000
    outstandingBalanceCents: 0,
    lastContactAt: '2026-11-17T11:30:00Z',
    createdAt: '2026-06-12T10:00:00Z',
    updatedAt: '2026-11-17T11:30:00Z',
  },
  {
    id: 'client-102',
    tenantId: 'tenant-001',
    contactId: 'contact-102',
    name: 'Vikramaditya Roy',
    email: 'vikram.roy@outlook.com',
    phone: '+91 98199 44556',
    whatsappNumber: '+91 98199 44556',
    dob: '1985-04-20',
    status: 'REPEAT',
    preferredLanguage: 'Hindi / English',
    preferredChannel: 'WHATSAPP',
    tags: ['Business Expansion', 'Puja Patron'],
    specialistData: {
      puja: {
        tradition: 'Vedic Smarti',
        deityOrOccasion: 'Navagraha & Lakshmi Kubera',
        gotraVoluntary: 'Kashyapa',
        familyMembers: ['Sunita Roy (Spouse)', 'Aarav Roy (Son)'],
        preferredMuhurat: 'Morning Brahma Muhurat or Shukla Paksha'
      }
    },
    lifetimeValueCents: 1850000, // ₹18,500
    outstandingBalanceCents: 600000, // ₹6,000 pending
    lastContactAt: '2026-11-18T09:15:00Z',
    createdAt: '2026-03-01T14:00:00Z',
    updatedAt: '2026-11-18T09:15:00Z',
  },
  {
    id: 'client-103',
    tenantId: 'tenant-001',
    contactId: 'contact-103',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    phone: '+1 415 889 2310',
    whatsappNumber: '+1 415 889 2310',
    dob: '1995-11-03',
    status: 'ACTIVE',
    preferredLanguage: 'English',
    preferredChannel: 'EMAIL',
    tags: ['Tarot', 'International Client', 'Relationship Guidance'],
    specialistData: {
      tarot: {
        preferredDecks: ['Rider-Waite-Smith', 'Thoth Tarot'],
        coreFocusTheme: 'Navigating relocation and partnership crossroads',
        sessionFormat: 'LIVE_VIDEO'
      }
    },
    lifetimeValueCents: 250000, // ₹2,500
    outstandingBalanceCents: 0,
    lastContactAt: '2026-11-16T17:45:00Z',
    createdAt: '2026-10-04T12:00:00Z',
    updatedAt: '2026-11-16T17:45:00Z',
  }
];

export const initialNotes: ClientNote[] = [
  {
    id: 'note-001',
    tenantId: 'tenant-001',
    clientId: 'client-101',
    authorUserId: 'user-001',
    authorName: 'Acharya Raghavendra Sharma',
    title: 'Career Relocation Analysis & Dasha Transition',
    content: 'Client requested clarity on whether to accept leadership offer in Singapore. Lagna lord Sun exalted in 9th house indicates high overseas prospects. Advised Surya Arghya and wearing Ruby only after checking current transit of Saturn through 7th.',
    isConfidential: true, // Restricted from assistants/marketing!
    isSharedWithClient: false,
    createdAt: '2026-11-17T11:45:00Z',
    updatedAt: '2026-11-17T11:45:00Z',
  },
  {
    id: 'note-002',
    tenantId: 'tenant-001',
    clientId: 'client-101',
    authorUserId: 'user-001',
    authorName: 'Acharya Raghavendra Sharma',
    title: 'Consultation Summary & Key Milestones',
    content: 'Favorable planetary window opens between March 2027 and September 2027. Continue morning meditation and daily mindfulness practices.',
    isConfidential: false,
    isSharedWithClient: true,
    createdAt: '2026-11-17T12:00:00Z',
    updatedAt: '2026-11-17T12:00:00Z',
  }
];

export const initialConsents: ConsentRecord[] = [
  {
    id: 'con-001',
    tenantId: 'tenant-001',
    clientId: 'client-101',
    purpose: 'SERVICE_DELIVERY',
    status: 'GRANTED',
    noticeVersion: 'v1.0-2026',
    source: 'Website Booking Form',
    timestamp: '2026-06-12T10:00:00Z',
  },
  {
    id: 'con-002',
    tenantId: 'tenant-001',
    clientId: 'client-101',
    purpose: 'WHATSAPP',
    status: 'GRANTED',
    noticeVersion: 'v1.0-2026',
    source: 'Opt-in Checkbox',
    timestamp: '2026-06-12T10:00:00Z',
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead-201',
    tenantId: 'tenant-001',
    contactId: 'contact-201',
    name: 'Siddharth Saxena',
    email: 'siddharth.saxena@techcorp.in',
    phone: '+91 99100 88221',
    source: 'WHATSAPP',
    serviceInterestId: 'srv-001',
    stage: 'NEW',
    urgency: 'HIGH',
    intentMessage: 'Hello Acharya ji, wanted to get my horoscope checked for business partnership compatibility before next Monday.',
    assignedUserId: 'user-001',
    estimatedValueCents: 350000,
    createdAt: '2026-11-18T10:30:00Z',
    updatedAt: '2026-11-18T10:30:00Z',
  },
  {
    id: 'lead-202',
    tenantId: 'tenant-001',
    contactId: 'contact-202',
    name: 'Meera Kapur',
    email: 'meera.kapur@gmail.com',
    phone: '+91 98450 33441',
    source: 'WEBSITE',
    serviceInterestId: 'srv-002',
    stage: 'CONTACTED',
    urgency: 'MEDIUM',
    intentMessage: 'Looking for a tarot session to understand my recurring dreams and creative block.',
    assignedUserId: 'user-002',
    estimatedValueCents: 250000,
    createdAt: '2026-11-17T16:20:00Z',
    updatedAt: '2026-11-18T08:00:00Z',
  },
  {
    id: 'lead-203',
    tenantId: 'tenant-001',
    contactId: 'contact-203',
    name: 'Rajesh & Kavita Singhal',
    email: 'rajesh.singhal@gmail.com',
    phone: '+91 97110 55667',
    source: 'REFERRAL',
    serviceInterestId: 'srv-004',
    stage: 'QUALIFIED',
    urgency: 'MEDIUM',
    intentMessage: 'Referred by Vikramaditya Roy. Purchased new 3BHK flat in Gurgaon; need Vastu directional check before Griha Pravesh.',
    assignedUserId: 'user-001',
    estimatedValueCents: 750000,
    createdAt: '2026-11-16T12:00:00Z',
    updatedAt: '2026-11-17T14:30:00Z',
  },
  {
    id: 'lead-204',
    tenantId: 'tenant-001',
    contactId: 'contact-204',
    name: 'Aarushi Mehta',
    email: 'aarushi.m@outlook.com',
    phone: '+91 98330 11998',
    source: 'INSTAGRAM',
    serviceInterestId: 'srv-002',
    stage: 'PROPOSAL_SENT',
    urgency: 'LOW',
    intentMessage: 'Inquired via Instagram DM regarding relationship timeline.',
    assignedUserId: 'user-002',
    estimatedValueCents: 250000,
    createdAt: '2026-11-15T09:00:00Z',
    updatedAt: '2026-11-16T11:00:00Z',
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-301',
    tenantId: 'tenant-001',
    clientId: 'client-101',
    clientName: 'Priyanka Sen',
    clientEmail: 'priyanka.sen@gmail.com',
    clientPhone: '+91 98711 22334',
    practitionerId: 'user-001',
    practitionerName: 'Acharya Raghavendra Sharma',
    serviceId: 'srv-001',
    serviceName: 'Vedic Kundli & Dasha Consultation',
    startTimeUtc: '2026-11-18T14:30:00Z', // Today at 8:00 PM IST
    endTimeUtc: '2026-11-18T15:30:00Z',
    status: 'CONFIRMED',
    deliveryMode: 'ONLINE_VIDEO',
    meetingLink: 'https://meet.jit.si/AstroVeda-Consult-301',
    totalPriceCents: 350000,
    depositCents: 100000,
    isDepositPaid: true,
    isFullyPaid: true,
    internalBrief: 'Follow up on previous Singapore relocation chart reading. Check Jupiter Dasha transits.',
    createdAt: '2026-11-14T10:00:00Z',
    updatedAt: '2026-11-15T10:00:00Z',
  },
  {
    id: 'apt-302',
    tenantId: 'tenant-001',
    clientId: 'client-103',
    clientName: 'Elena Rostova',
    clientEmail: 'elena.rostova@gmail.com',
    clientPhone: '+1 415 889 2310',
    practitionerId: 'user-002',
    practitionerName: 'Ananya Deshmukh',
    serviceId: 'srv-002',
    serviceName: 'Tarot Celtic Cross & Relationship Spread',
    startTimeUtc: '2026-11-18T16:00:00Z', // Today at 9:30 PM IST
    endTimeUtc: '2026-11-18T16:45:00Z',
    status: 'CONFIRMED',
    deliveryMode: 'ONLINE_VIDEO',
    meetingLink: 'https://meet.jit.si/AstroVeda-Tarot-302',
    totalPriceCents: 250000,
    depositCents: 100000,
    isDepositPaid: true,
    isFullyPaid: true,
    internalBrief: 'Crossroads reading regarding relocating from SF to London with current partner.',
    createdAt: '2026-11-16T18:00:00Z',
    updatedAt: '2026-11-16T18:30:00Z',
  },
  {
    id: 'apt-303',
    tenantId: 'tenant-001',
    clientId: 'client-102',
    clientName: 'Vikramaditya Roy',
    clientEmail: 'vikram.roy@outlook.com',
    clientPhone: '+91 98199 44556',
    practitionerId: 'user-001',
    practitionerName: 'Acharya Raghavendra Sharma',
    serviceId: 'srv-003',
    serviceName: 'Navagraha Shanti & Vedic Puja',
    startTimeUtc: '2026-11-20T03:30:00Z', // 9:00 AM IST
    endTimeUtc: '2026-11-20T05:30:00Z',
    status: 'CONFIRMED',
    deliveryMode: 'RITUAL_VENUE',
    locationAddress: 'Shri Lakshmi Narayana Temple Hall, Mayur Vihar, New Delhi',
    totalPriceCents: 1100000,
    depositCents: 500000,
    isDepositPaid: true,
    isFullyPaid: false,
    internalBrief: 'Advance received ₹5,000. Balance of ₹6,000 due upon completion. Samagri kit packed.',
    createdAt: '2026-11-12T11:00:00Z',
    updatedAt: '2026-11-12T11:30:00Z',
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-401',
    tenantId: 'tenant-001',
    clientId: 'client-101',
    clientName: 'Priyanka Sen',
    invoiceNumber: 'INV-2026-0089',
    status: 'PAID',
    items: [
      { id: 'item-1', description: 'Vedic Kundli & Dasha Consultation (60 mins)', quantity: 1, unitPriceCents: 350000, totalCents: 350000 }
    ],
    subtotalCents: 350000,
    taxCents: 0,
    totalCents: 350000,
    paidAmountCents: 350000,
    balanceDueCents: 0,
    currency: 'INR',
    dueDate: '2026-11-18',
    issuedAt: '2026-11-14T10:05:00Z'
  },
  {
    id: 'inv-402',
    tenantId: 'tenant-001',
    clientId: 'client-102',
    clientName: 'Vikramaditya Roy',
    invoiceNumber: 'INV-2026-0090',
    status: 'PARTIALLY_PAID',
    items: [
      { id: 'item-2', description: 'Navagraha Shanti & Vedic Puja with Full Samagri', quantity: 1, unitPriceCents: 1100000, totalCents: 1100000 }
    ],
    subtotalCents: 1100000,
    taxCents: 0,
    totalCents: 1100000,
    paidAmountCents: 500000,
    balanceDueCents: 600000,
    currency: 'INR',
    dueDate: '2026-11-20',
    issuedAt: '2026-11-12T11:10:00Z'
  }
];

export const initialLedger: LedgerEntry[] = [
  {
    id: 'led-501',
    tenantId: 'tenant-001',
    entryType: 'DEBIT',
    accountCode: 'BANK_GATEWAY',
    amountCents: 350000,
    currency: 'INR',
    referenceType: 'PAYMENT_INTENT',
    referenceId: 'pi-101',
    description: 'Online Payment via Razorpay - Priyanka Sen (INV-2026-0089)',
    createdAt: '2026-11-14T10:02:15Z'
  },
  {
    id: 'led-502',
    tenantId: 'tenant-001',
    entryType: 'CREDIT',
    accountCode: 'REVENUE',
    amountCents: 350000,
    currency: 'INR',
    referenceType: 'INVOICE',
    referenceId: 'inv-401',
    description: 'Revenue recognized for Kundli Consultation',
    createdAt: '2026-11-14T10:02:15Z'
  },
  {
    id: 'led-503',
    tenantId: 'tenant-001',
    entryType: 'DEBIT',
    accountCode: 'BANK_GATEWAY',
    amountCents: 500000,
    currency: 'INR',
    referenceType: 'MANUAL_CASH_UPI',
    referenceId: 'upi-102',
    description: 'Advance received via UPI (Ref: 432198007) - Vikramaditya Roy',
    createdAt: '2026-11-12T11:20:00Z'
  },
  {
    id: 'led-504',
    tenantId: 'tenant-001',
    entryType: 'CREDIT',
    accountCode: 'CLIENT_DEPOSIT',
    amountCents: 500000,
    currency: 'INR',
    referenceType: 'INVOICE',
    referenceId: 'inv-402',
    description: 'Deposit held for upcoming Puja ritual',
    createdAt: '2026-11-12T11:20:00Z'
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv-601',
    tenantId: 'tenant-001',
    contactId: 'contact-201',
    contactName: 'Siddharth Saxena',
    contactPhone: '+91 99100 88221',
    channel: 'WHATSAPP',
    status: 'OPEN',
    unreadCount: 1,
    lastMessageSnippet: 'Hello Acharya ji, wanted to get my horoscope checked for business partnership compatibility before next Monday.',
    lastActivityAt: '2026-11-18T10:30:00Z',
    messages: [
      {
        id: 'msg-701',
        conversationId: 'conv-601',
        tenantId: 'tenant-001',
        channel: 'WHATSAPP',
        direction: 'INBOUND',
        senderName: 'Siddharth Saxena',
        body: 'Hello Acharya ji, wanted to get my horoscope checked for business partnership compatibility before next Monday.',
        createdAt: '2026-11-18T10:30:00Z',
      },
      {
        id: 'msg-702',
        conversationId: 'conv-601',
        tenantId: 'tenant-001',
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        senderName: 'AI Copilot (Draft)',
        body: 'Namaste Siddharth ji. Thank you for reaching out to AstroVeda. Acharya Raghavendra has availability this Friday afternoon for business partnership analysis. Would 4:00 PM IST or 5:30 PM IST work better for you? We also need your exact date, time, and city of birth.',
        isAiGeneratedDraft: true,
        isApprovedByHuman: false,
        createdAt: '2026-11-18T10:31:00Z',
      }
    ]
  },
  {
    id: 'conv-602',
    tenantId: 'tenant-001',
    contactId: 'contact-101',
    contactName: 'Priyanka Sen',
    contactPhone: '+91 98711 22334',
    channel: 'WHATSAPP',
    status: 'WAITING_ON_CLIENT',
    unreadCount: 0,
    lastMessageSnippet: 'Looking forward to our call tonight at 8 PM!',
    lastActivityAt: '2026-11-18T09:00:00Z',
    messages: [
      {
        id: 'msg-703',
        conversationId: 'conv-602',
        tenantId: 'tenant-001',
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        senderName: 'Acharya Raghavendra Sharma',
        body: 'Namaste Priyanka ji, our consultation is confirmed for today at 8:00 PM IST. Meeting link: https://meet.jit.si/AstroVeda-Consult-301. Your chart has been prepared.',
        createdAt: '2026-11-18T08:30:00Z',
      },
      {
        id: 'msg-704',
        conversationId: 'conv-602',
        tenantId: 'tenant-001',
        channel: 'WHATSAPP',
        direction: 'INBOUND',
        senderName: 'Priyanka Sen',
        body: 'Thank you so much Acharya ji! Looking forward to our call tonight at 8 PM!',
        createdAt: '2026-11-18T09:00:00Z',
      }
    ]
  }
];

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'aud-001',
    tenantId: 'tenant-001',
    actorName: 'System Gateway',
    action: 'PAYMENT_CAPTURED',
    resourceType: 'PAYMENT_INTENT',
    resourceId: 'pi-101',
    metadata: { amountCents: 350000, provider: 'RAZORPAY', client: 'Priyanka Sen' },
    timestamp: '2026-11-14T10:02:15Z',
  },
  {
    id: 'aud-002',
    tenantId: 'tenant-001',
    actorName: 'Acharya Raghavendra Sharma',
    action: 'CONFIDENTIAL_NOTE_CREATED',
    resourceType: 'CLIENT_NOTE',
    resourceId: 'note-001',
    metadata: { clientId: 'client-101', isConfidential: true },
    timestamp: '2026-11-17T11:45:00Z',
  }
];
