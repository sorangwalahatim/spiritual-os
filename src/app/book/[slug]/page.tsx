'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Clock, 
  Video, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';

export default function PublicBookingPage() {
  const state = getAppState();

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Public Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-serif font-bold text-lg">
              ॐ
            </div>
            <div>
              <h1 className="font-bold text-stone-900 text-sm tracking-tight">{state.tenant.name}</h1>
              <p className="text-[10px] text-stone-500">Certified Spiritual Practice & Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Client Portal Login
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
            >
              Practitioner Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6 bg-gradient-to-b from-amber-50/60 to-transparent border-b border-stone-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Vedic Astrological Consultations & Intuitive Sanctuary</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-900">
            Clarity, Timing & Sacred Alignment for Your Life Journey
          </h2>
          <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Led by <strong>Acharya Raghavendra Sharma</strong>. Authentic Parashari Jyotish, Prashna, Vastu Shastra, and Tarot intuitive guidance. Select your consultation below to schedule your private session.
          </p>
        </div>
      </section>

      {/* Services Catalogue */}
      <section className="py-12 px-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div>
            <h3 className="text-lg font-bold font-serif text-stone-900">Consultation Offerings</h3>
            <p className="text-xs text-stone-500">Live 1-on-1 video consultations and Vedic sacred rituals</p>
          </div>
          <span className="text-xs text-stone-500 font-medium">All sessions timezone-synced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {service.category}
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-stone-900">{formatMoney(service.priceCents)}</p>
                    <p className="text-[10px] text-stone-400">Deposit: {formatMoney(service.depositRequiredCents)}</p>
                  </div>
                </div>

                <h4 className="text-base font-bold text-stone-900">{service.name}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{service.shortDescription}</p>

                <div className="flex items-center gap-4 text-xs text-stone-500 pt-2">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {service.durationMinutes} Minutes
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    {service.deliveryMode === 'ONLINE_VIDEO' ? (
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {service.deliveryMode.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 mt-6">
                <Link
                  href={`/book/${state.tenant.slug}/checkout?serviceId=${service.id}`}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Ethics & Transparency Banner (Section 23.4) */}
        <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-2 mt-8">
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Ethical Service Boundary & Transparency Notice</span>
          </div>
          <p className="leading-relaxed">
            {state.tenant.ethicsDisclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}
