-- ====================================================================
-- Spiritual Practice Management & Client Intelligence Platform (AstroVeda)
-- Supabase PostgreSQL Schema & Initial Seed
-- Project: kayzshszvoxslyoqwhym
-- ====================================================================

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS public.tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    config_profile TEXT NOT NULL DEFAULT 'astrology',
    currency TEXT NOT NULL DEFAULT 'INR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    locale TEXT NOT NULL DEFAULT 'en-IN',
    logo_url TEXT,
    brand_colors JSONB NOT NULL DEFAULT '{"primary": "#D37D1A", "accent": "#1E1B4B", "canvas": "#FAFAF9"}'::jsonb,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    ethics_disclaimer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Users (Practitioners & Staff)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'PRACTITIONER',
    phone TEXT,
    avatar_url TEXT,
    title TEXT,
    bio TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Services Catalog
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    delivery_mode TEXT NOT NULL DEFAULT 'ONLINE_VIDEO',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    buffer_before_minutes INTEGER NOT NULL DEFAULT 15,
    buffer_after_minutes INTEGER NOT NULL DEFAULT 15,
    price_cents BIGINT NOT NULL DEFAULT 350000, -- Minor units (paisa)
    deposit_required_cents BIGINT NOT NULL DEFAULT 100000,
    requires_intake BOOLEAN NOT NULL DEFAULT true,
    intake_schema JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    contact_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT,
    dob TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    preferred_language TEXT NOT NULL DEFAULT 'en',
    preferred_channel TEXT NOT NULL DEFAULT 'WHATSAPP',
    tags TEXT[] NOT NULL DEFAULT '{}',
    specialist_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    lifetime_value_cents BIGINT NOT NULL DEFAULT 0,
    outstanding_balance_cents BIGINT NOT NULL DEFAULT 0,
    last_contact_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Confidential Client Notes (Class 4 Protection)
CREATE TABLE IF NOT EXISTS public.client_notes (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    author_user_id TEXT NOT NULL REFERENCES public.users(id),
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_confidential BOOLEAN NOT NULL DEFAULT true,
    is_shared_with_client BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Leads Pipeline
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    contact_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'WEBSITE',
    service_interest_id TEXT REFERENCES public.services(id),
    stage TEXT NOT NULL DEFAULT 'NEW',
    urgency TEXT NOT NULL DEFAULT 'MEDIUM',
    intent_message TEXT,
    assigned_user_id TEXT REFERENCES public.users(id),
    estimated_value_cents BIGINT NOT NULL DEFAULT 350000,
    lost_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Appointments & Bookings
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    practitioner_id TEXT NOT NULL REFERENCES public.users(id),
    practitioner_name TEXT NOT NULL,
    service_id TEXT NOT NULL REFERENCES public.services(id),
    service_name TEXT NOT NULL,
    start_time_utc TIMESTAMPTZ NOT NULL,
    end_time_utc TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    delivery_mode TEXT NOT NULL DEFAULT 'ONLINE_VIDEO',
    meeting_link TEXT,
    location_address TEXT,
    intake_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    internal_brief TEXT,
    hold_expires_at TIMESTAMPTZ,
    total_price_cents BIGINT NOT NULL DEFAULT 0,
    deposit_cents BIGINT NOT NULL DEFAULT 0,
    is_deposit_paid BOOLEAN NOT NULL DEFAULT true,
    is_fully_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    invoice_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAID',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal_cents BIGINT NOT NULL DEFAULT 0,
    tax_cents BIGINT NOT NULL DEFAULT 0,
    total_cents BIGINT NOT NULL DEFAULT 0,
    paid_amount_cents BIGINT NOT NULL DEFAULT 0,
    balance_due_cents BIGINT NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'INR',
    due_date TIMESTAMPTZ NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Double-Entry Immutable Financial Ledger
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    entry_type TEXT NOT NULL, -- 'DEBIT' or 'CREDIT'
    account_code TEXT NOT NULL, -- 'BANK_GATEWAY', 'REVENUE', 'CLIENT_DEPOSIT', etc.
    amount_cents BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    reference_type TEXT NOT NULL, -- 'PAYMENT_INTENT', 'INVOICE', 'MANUAL_CASH_UPI'
    reference_id TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Unified Conversations & Messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    contact_id TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'WHATSAPP',
    status TEXT NOT NULL DEFAULT 'OPEN',
    unread_count INTEGER NOT NULL DEFAULT 0,
    last_message_snippet TEXT,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    channel TEXT NOT NULL DEFAULT 'WHATSAPP',
    direction TEXT NOT NULL DEFAULT 'INBOUND', -- 'INBOUND' or 'OUTBOUND'
    sender_name TEXT NOT NULL,
    body TEXT NOT NULL,
    is_ai_generated_draft BOOLEAN NOT NULL DEFAULT false,
    is_approved_by_human BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Security Audit Trail
CREATE TABLE IF NOT EXISTS public.audit_events (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    actor_user_id TEXT,
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Enable Row Level Security (RLS) on all tables
-- ====================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for demo & API service key
CREATE POLICY "Public full access tenants" ON public.tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access client_notes" ON public.client_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access ledger_entries" ON public.ledger_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access conversation_messages" ON public.conversation_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access audit_events" ON public.audit_events FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime publication for live instant notifications
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.appointments, 
    public.leads, 
    public.conversation_messages, 
    public.ledger_entries;
COMMIT;

-- ====================================================================
-- Initial Seed Data
-- ====================================================================

-- Tenant
INSERT INTO public.tenants (id, name, slug, config_profile, currency, timezone, locale, contact_email, contact_phone, ethics_disclaimer)
VALUES (
    'tenant-001',
    'AstroVeda & Intuitive Sanctuary',
    'astroveda',
    'astrology',
    'INR',
    'Asia/Kolkata',
    'en-IN',
    'guidance@astroveda.com',
    '+91 98201 54321',
    'Spiritual, astrological, and tarot consultations offer self-reflection and guidance. They do not constitute certified medical, financial, or legal advice.'
) ON CONFLICT (id) DO NOTHING;

-- Practitioners
INSERT INTO public.users (id, tenant_id, email, name, role, phone, title, bio, is_active)
VALUES 
(
    'user-001',
    'tenant-001',
    'raghavendra@astroveda.com',
    'Acharya Raghavendra Sharma',
    'OWNER',
    '+91 98201 54321',
    'Lead Vedic Astrologer & Vastu Acharya',
    'Over 22 years of practice in Parashari Jyotish, Prashna, and Vastu Shastra.',
    true
),
(
    'user-002',
    'tenant-001',
    'ananya@astroveda.com',
    'Ananya Deshmukh',
    'PRACTITIONER',
    '+91 98201 98765',
    'Master Tarot & Intuitive Guide',
    'Specialist in Celtic Cross relationship spreads and shadow work integration.',
    true
) ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO public.services (id, tenant_id, name, category, short_description, full_description, delivery_mode, duration_minutes, price_cents, deposit_required_cents, is_active, display_order)
VALUES
(
    'srv-001',
    'tenant-001',
    'Vedic Kundli & Dasha Consultation',
    'Vedic Astrology',
    'Comprehensive horoscope analysis, Mahadasha timing, career, health, and relationship insights.',
    'Detailed 60-minute session examining your Rasi (D1), Navamsha (D9), current Vimshottari Dasha, and transits.',
    'ONLINE_VIDEO',
    60,
    350000,
    100000,
    true,
    1
),
(
    'srv-002',
    'tenant-001',
    'Celtic Cross Tarot In-Depth Spread',
    'Tarot & Intuitive',
    'Deep 10-card exploration of past influences, subconscious roots, obstacles, and probable outcome.',
    'Intensive intuitive reading focused on relational dynamics, career crossroads, and spiritual growth.',
    'ONLINE_VIDEO',
    45,
    250000,
    100000,
    true,
    2
),
(
    'srv-003',
    'tenant-001',
    'Residential Vastu Energy Audit',
    'Vastu Shastra',
    'Complete directional analysis of your floor plan, remedies for directional doshas without structural demolition.',
    'Comprehensive architectural energy mapping with non-invasive remedies (colors, metals, mirrors).',
    'IN_PERSON',
    90,
    750000,
    250000,
    true,
    3
) ON CONFLICT (id) DO NOTHING;

-- Initial Clients
INSERT INTO public.clients (id, tenant_id, contact_id, name, email, phone, status, preferred_language, preferred_channel, tags, specialist_data, lifetime_value_cents, outstanding_balance_cents)
VALUES
(
    'client-001',
    'tenant-001',
    'contact-001',
    'Priya Sharma',
    'priya.sharma@example.com',
    '+91 98201 11222',
    'ACTIVE',
    'en',
    'WHATSAPP',
    ARRAY['VIP', 'Vedic Astrology', 'Career Consultation'],
    '{"astrology": {"birthDate": "1991-08-14", "birthTime": "06:45", "birthCity": "Pune", "birthCountry": "India", "chartSystem": "NORTH_INDIAN", "notes": "Entering Jupiter-Saturn period"}}'::jsonb,
    1050000,
    0
),
(
    'client-002',
    'tenant-001',
    'contact-002',
    'Vikramaditya Singhania',
    'vikram.singhania@example.com',
    '+91 98111 22334',
    'ACTIVE',
    'en',
    'WHATSAPP',
    ARRAY['HNI', 'Vastu', 'Business Consultation'],
    '{"vastu": {"propertyType": "COMMERCIAL", "propertyAddress": "Cyber City, Gurugram", "orientation": "North-East"}}'::jsonb,
    2100000,
    0
) ON CONFLICT (id) DO NOTHING;

-- Initial Leads
INSERT INTO public.leads (id, tenant_id, contact_id, name, email, phone, source, service_interest_id, stage, urgency, intent_message, estimated_value_cents)
VALUES
(
    'lead-001',
    'tenant-001',
    'contact-101',
    'Aditi Deshmukh',
    'aditi.d@example.com',
    '+91 99887 66554',
    'WHATSAPP',
    'srv-001',
    'NEW',
    'HIGH',
    'Seeking urgent Vedic horoscope reading for relocation decision before end of month.',
    350000
),
(
    'lead-002',
    'tenant-001',
    'contact-102',
    'Karan Mehra',
    'karan.m@example.com',
    '+91 97654 32100',
    'WEBSITE',
    'srv-002',
    'CONTACTED',
    'MEDIUM',
    'Interested in Tarot consultation regarding partnership compatibility.',
    250000
) ON CONFLICT (id) DO NOTHING;

-- Initial Appointments
INSERT INTO public.appointments (id, tenant_id, client_id, client_name, client_email, client_phone, practitioner_id, practitioner_name, service_id, service_name, start_time_utc, end_time_utc, status, delivery_mode, meeting_link, total_price_cents, deposit_cents, is_deposit_paid, is_fully_paid)
VALUES
(
    'appt-001',
    'tenant-001',
    'client-001',
    'Priya Sharma',
    'priya.sharma@example.com',
    '+91 98201 11222',
    'user-001',
    'Acharya Raghavendra Sharma',
    'srv-001',
    'Vedic Kundli & Dasha Consultation',
    timezone('utc'::text, now() + interval '2 hours'),
    timezone('utc'::text, now() + interval '3 hours'),
    'CONFIRMED',
    'ONLINE_VIDEO',
    'https://meet.google.com/xyz-veda-demo',
    350000,
    100000,
    true,
    true
) ON CONFLICT (id) DO NOTHING;

-- Double-Entry Ledger
INSERT INTO public.ledger_entries (id, tenant_id, entry_type, account_code, amount_cents, currency, reference_type, reference_id, description)
VALUES
(
    'ledg-001',
    'tenant-001',
    'DEBIT',
    'BANK_GATEWAY',
    350000,
    'INR',
    'MANUAL_CASH_UPI',
    'UPI-PAY-77881',
    'Payment received for Priya Sharma - Vedic Kundli Consultation'
),
(
    'ledg-002',
    'tenant-001',
    'CREDIT',
    'REVENUE',
    350000,
    'INR',
    'MANUAL_CASH_UPI',
    'UPI-PAY-77881',
    'Revenue recognized for Vedic Kundli Consultation'
) ON CONFLICT (id) DO NOTHING;
