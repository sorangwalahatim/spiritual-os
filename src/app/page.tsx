'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  CreditCard, 
  Users, 
  MessageSquare,
  CheckCircle2,
  Compass,
  FileText
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';

export default function RootLandingPage() {
  const state = getAppState();

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-stone-800 bg-stone-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-500 font-serif font-bold text-xl shadow-inner">
              ॐ
            </div>
            <div>
              <span className="font-bold text-stone-100 text-sm tracking-tight">Spiritual Practice OS</span>
              <p className="text-[10px] text-amber-400 font-medium">Management & Client Intelligence Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/login"
              className="px-3.5 py-2 text-stone-300 hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Practitioner Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Production-Ready Modular Monolith • Phase 0 & 1 Operational</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white max-w-3xl mx-auto leading-tight">
          A Configurable Operating System for Modern Spiritual Practices
        </h1>

        <p className="text-sm md:text-base text-stone-400 max-w-2xl mx-auto leading-relaxed">
          Engineered for Vedic Astrologers, Tarot Readers, Pandits, Vastu Consultants, and Spiritual Mentors. Unifying lead capture, booking workflows, immutable financial ledger, and confidential client intelligence.
        </p>

        {/* Triple Surfaces Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
          {/* Surface 1: Admin */}
          <Link
            href="/admin"
            className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 hover:border-amber-500/80 hover:bg-stone-800 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Practitioner Workspace
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Full operational suite: Executive pulse, My Day view, drag-and-drop lead pipeline, Client 360 with Kundli/Tarot extensions, and unified inbox.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Surface 2: Public Booking */}
          <Link
            href={`/book/${state.tenant.slug}`}
            className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 hover:border-amber-500/80 hover:bg-stone-800 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                Public Booking Site
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Branded client discovery, service descriptions, timezone-aware slot picker, and 4-step intake form with instant payment holds.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-blue-400">
              <span>View Booking Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Surface 3: Client Portal */}
          <Link
            href="/portal"
            className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/80 hover:border-amber-500/80 hover:bg-stone-800 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Client Self-Service Portal
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Protected client environment to launch live video calls, review approved consultation summaries, and download invoice receipts.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Open Client Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-12 px-6 border-t border-stone-800 bg-stone-950/40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-stone-400">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              Immutable Ledger
            </h3>
            <p>Double-entry accounting with integer minor units. Zero mutable paid balances.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Buffer Protected Slots
            </h3>
            <p>Automatic buffer times before and after sessions to prevent practitioner burnout.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Assistive AI Copilot
            </h3>
            <p>Human-in-the-loop AI reply drafts and intake summaries. Strict ethical controls.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Class 4 Privacy
            </h3>
            <p>Confidential spiritual reading notes isolated from assistants and marketing staff.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
