'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Calendar, 
  Video, 
  CreditCard, 
  FileText, 
  Download, 
  ArrowRight, 
  MessageSquare, 
  Sparkles,
  Lock
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';
import { formatDateTime } from '@/lib/utils/date';

export default function ClientPortalPage() {
  const state = getAppState();
  // Using client 101 (Priyanka Sen) as the logged-in self-service client
  const client = state.clients[0];
  const upcomingApts = state.appointments.filter(a => a.clientId === client.id);
  const approvedNotes = state.notes.filter(n => n.clientId === client.id && n.isSharedWithClient);
  const clientInvoices = state.invoices.filter(i => i.clientId === client.id);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-16">
      {/* Portal Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-serif font-bold text-lg">
              ॐ
            </div>
            <div>
              <h1 className="font-bold text-stone-900 text-sm tracking-tight">{state.tenant.name}</h1>
              <p className="text-[10px] text-stone-500">Client Self-Service Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Signed in as <strong>{client.name}</strong></span>
            </div>
            <Link
              href="/admin"
              className="text-stone-500 hover:text-stone-900 underline"
            >
              Switch to Practitioner Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              Client Sanctuary
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-serif mt-0.5">
              Welcome back, {client.name}
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Access your upcoming video consultations, downloaded horoscope reports, and payment receipts.
            </p>
          </div>
          <Link
            href={`/book/${state.tenant.slug}`}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <span>Book New Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Upcoming & Past Appointments (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Your Consultations
              </h3>

              <div className="space-y-3">
                {upcomingApts.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">{apt.serviceName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-stone-600">
                      With <strong>{apt.practitionerName}</strong> on {formatDateTime(apt.startTimeUtc, state.tenant.timezone)}
                    </p>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="font-mono font-semibold text-stone-800">
                        {apt.isFullyPaid ? 'Paid in Full' : `Deposit: ${formatMoney(apt.depositCents)}`}
                      </span>

                      {apt.meetingLink && (
                        <a
                          href={apt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Session</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practitioner Shared Summaries */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Approved Consultation Summaries & Upayas
              </h3>
              <p className="text-xs text-stone-500">
                Remedies, planetary timing windows, and reflections prepared for you by your practitioner.
              </p>

              <div className="space-y-3">
                {approvedNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>{note.title}</span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        {formatDateTime(note.createdAt, state.tenant.timezone)}
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed text-xs">{note.content}</p>
                    <p className="text-[10px] text-stone-400 pt-1">Prepared by {note.authorName}</p>
                  </div>
                ))}
                {approvedNotes.length === 0 && (
                  <p className="text-xs text-stone-400 italic py-4 text-center">No reports shared yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Invoices & Receipts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Invoices & Receipts
              </h3>

              <div className="divide-y divide-stone-100 text-xs">
                {clientInvoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-stone-900 font-mono">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-stone-400">Paid: {formatDateTime(inv.issuedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-stone-900">{formatMoney(inv.totalCents, inv.currency)}</p>
                      <span className="text-[10px] font-bold text-emerald-700">Receipt Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Data Rights Card */}
            <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your Data Privacy</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Your birth details and personal notes are private and encrypted. Under the Digital Personal Data Protection Act, you may request an export or deletion of your records at any time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
