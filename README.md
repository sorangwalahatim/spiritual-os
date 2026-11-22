# 🕉️ AstroVeda — Spiritual Practice OS & Client Intelligence

> **Full-Stack Multi-Tenant Practice Management Platform for Vedic Astrologers, Tarot Readers, Pandits, and Spiritual Coaches.**

Built with Next.js 15, TypeScript, Tailwind CSS, Supabase Realtime, and deterministic ephemeris algorithms.

---

## ✨ Features & Architecture

### 1. 🔐 Role-Based Access Control (RBAC) & Privacy Shield
- Dedicated Role Switcher with instant session simulation for **Owner**, **Practitioner**, **Assistant**, and **Accountant**.
- **Class 4 Confidential Notes Shield:** Astrological notes and spiritual disclosures are strictly visible only to the assigned practitioner and owner; assistant roles see masked placeholders.
- Financial Ledger and Practice Settings write locks.

### 2. ⚡ Realtime State Hydration (Supabase WebSockets)
- Cross-tab and live database broadcasting for `NEW_BOOKING`, `PAYMENT_RECEIVED`, and `NEW_LEAD` events.
- Optimistic UI updates with instant notification banners.

### 3. 💳 Double-Entry Ledger & Payments (Razorpay & Invoicing)
- Multi-tier checkout supporting UPI, Credit/Debit Cards, and NetBanking.
- Automated 18% GST Tax Invoice generation (`/api/invoices/[id]`).
- Double-entry bookkeeping: payments write immutable Debit (`BANK_GATEWAY`) and Credit (`REVENUE` / `CLIENT_DEPOSIT`) ledger entries.

### 4. 🪐 Mathematical Sidereal Ephemeris & Kundli Dossier
- High-accuracy Lahiri Ayanamsa calculation without generative hallucinations.
- 9 Grahas (Sun to Ketu), 27 Nakshatras & Pada, 12 Bhavas (houses), and Vimshottari Mahadasha timeline.
- Dynamic geometric SVG **North Indian Diamond Kundli Chart**.
- One-click **Print / PDF Kundli Dossier Export**.

### 5. 📅 Calendar Sync & Messaging Automation
- RFC 5545 `.ics` file downloads compatible with Apple Calendar, Outlook, and Google Calendar.
- One-click Google Calendar web scheduling.
- Automated WhatsApp pre-consultation reminder formatter (24h prior, 1h prior, post-session reflections).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- Git

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/astro-spiritual-os.git
cd astro-spiritual-os

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Add your Supabase & Razorpay keys in .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Verification

Run the automated domain and security verification suite:

```bash
node --test tests/domain.test.mjs
```

All 8 domain verification rules (AC-01 through AC-14) test and pass natively.

---

## 🏛️ License
Proprietary & Confidential • Spiritual Practice OS
