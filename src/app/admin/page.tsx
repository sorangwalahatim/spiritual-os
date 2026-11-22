'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  CreditCard, 
  AlertCircle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles,
  PhoneCall,
  ChevronRight
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';
import { formatDateTime } from '@/lib/utils/date';

export default function AdminDashboardPage() {
  const state = getAppState();

  // Metrics calculations
  const totalRevenueCents = state.ledger
    .filter(l => l.accountCode === 'BANK_GATEWAY' && l.entryType === 'DEBIT')
    .reduce((sum, l) => sum + l.amountCents, 0);

  const totalOutstandingCents = state.invoices
    .reduce((sum, inv) => sum + inv.balanceDueCents, 0);

  const activeLeadsCount = state.leads.filter(l => l.stage !== 'WON' && l.stage !== 'LOST').length;
  const completedAppointmentsCount = state.appointments.filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED').length;

  // Today's appointments
  const todayApts = state.appointments.slice(0, 3);

  // Leads pipeline counts
  const stageCounts = {
    NEW: state.leads.filter(l => l.stage === 'NEW').length,
    CONTACTED: state.leads.filter(l => l.stage === 'CONTACTED').length,
    QUALIFIED: state.leads.filter(l => l.stage === 'QUALIFIED').length,
    PROPOSAL_SENT: state.leads.filter(l => l.stage === 'PROPOSAL_SENT').length,
    WON: state.leads.filter(l => l.stage === 'WON').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 rounded-2xl shadow-sm border border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Pulse • {state.tenant.name}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif">
            Welcome, Acharya Raghavendra
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            You have <span className="text-amber-400 font-semibold">{todayApts.length} consultations scheduled</span> today. All client charts and intake briefs are ready for review.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/today"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Launch My Day View</span>
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl text-xs font-medium transition-all"
          >
            Review Leads ({activeLeadsCount})
          </Link>
        </div>
      </div>

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Collections (MTD)</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {formatMoney(totalRevenueCents, state.tenant.currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>100% Ledger-reconciled</span>
          </div>
        </div>

        {/* Confirmed / Completed Bookings */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Confirmed Sessions</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {completedAppointmentsCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Across Vedic, Tarot & Pujas
          </div>
        </div>

        {/* Active Pipeline Leads */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Active Inquiries</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {activeLeadsCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            WhatsApp & Website inquiries
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Pending Balances</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900">
            {formatMoney(totalOutstandingCents, state.tenant.currency)}
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            1 ritual post-completion due
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Lead Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments Operations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Today's Appointments & Preparation
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Session brief ready. Click any consultation to launch the live video or preparation notes.
              </p>
            </div>
            <Link
              href="/admin/calendar"
              className="text-xs text-amber-700 font-semibold hover:text-amber-800 flex items-center gap-1"
            >
              Full Calendar <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayApts.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      {new Date(apt.startTimeUtc).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <h3 className="text-xs font-bold text-stone-900">{apt.clientName}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-stone-700">{apt.serviceName}</p>
                  <p className="text-[11px] text-stone-500 italic">
                    "{apt.internalBrief}"
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Link
                    href={`/admin/clients/${apt.clientId}`}
                    className="px-2.5 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50"
                  >
                    View Chart / 360
                  </Link>
                  {apt.meetingLink && (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Lead Funnel & Fast Inbound */}
        <div className="space-y-6">
          {/* Funnel breakdown */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
            <h2 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
              <span>Pipeline Health</span>
              <Link href="/admin/leads" className="text-xs text-amber-600 font-semibold hover:underline">
                View Kanban
              </Link>
            </h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-stone-600">New Inquiries</span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {stageCounts.NEW}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-stone-600">Contacted & Active</span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                  {stageCounts.CONTACTED}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-stone-600">Qualified</span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                  {stageCounts.QUALIFIED}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-100">
                <span className="text-stone-600">Converted (Won)</span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {stageCounts.WON}
                </span>
              </div>
            </div>
          </div>

          {/* AI Copilot & Inbox Notification */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Reply Draft Ready</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed mb-3">
              1 new WhatsApp inquiry from <strong>Siddharth Saxena</strong> for business partnership astrology. AI drafted a grounded polite reply with slot suggestions.
            </p>
            <Link
              href="/admin/inbox"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Review & Approve Draft
            </Link>
          </div>
        </div>
      </div>

      {/* Append-Only Audit Trail Summary */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security & Ledger Audit Stream
          </h2>
          <span className="text-[11px] text-stone-400">Tamper-evident logs</span>
        </div>
        <div className="divide-y divide-stone-100 text-xs">
          {state.auditEvents.slice(0, 4).map((evt) => (
            <div key={evt.id} className="py-2.5 flex items-center justify-between text-stone-600">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                  {evt.action}
                </span>
                <span className="text-stone-800 font-medium">{evt.actorName}</span>
                <span className="text-stone-500 text-[11px]">on {evt.resourceType} ({evt.resourceId})</span>
              </div>
              <span className="text-[11px] text-stone-400">
                {formatDateTime(evt.timestamp, state.tenant.timezone)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
