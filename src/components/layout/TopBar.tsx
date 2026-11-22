'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Clock, 
  CreditCard, 
  Calendar, 
  UserPlus, 
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';
import { getAppState, addLead, bookAppointment, recordPayment } from '@/lib/services/store';
import { useAuth } from '@/lib/auth/auth-context';
import { useLiveData } from '@/lib/data/live-data-context';
import { Activity } from 'lucide-react';

export function TopBar() {
  const state = getAppState();
  const { user, canAccessFinances } = useAuth();
  const { isConnected, isRealtimeActive } = useLiveData();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [modalType, setModalType] = useState<'lead' | 'booking' | 'payment' | null>(null);

  // Quick Action form states
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSource, setLeadSource] = useState<'WHATSAPP' | 'WEBSITE' | 'REFERRAL'>('WHATSAPP');
  const [leadMsg, setLeadMsg] = useState('');

  const [payClient, setPayClient] = useState(state.clients[0]?.id || '');
  const [payAmount, setPayAmount] = useState('3500');
  const [payMethod, setPayMethod] = useState<'MANUAL_UPI' | 'CASH'>('MANUAL_UPI');
  const [payRef, setPayRef] = useState('');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    addLead({
      contactId: `contact-${Date.now()}`,
      name: leadName,
      email: `${leadName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: leadPhone,
      source: leadSource,
      stage: 'NEW',
      urgency: 'HIGH',
      intentMessage: leadMsg || 'Quick lead added via top action bar',
    });
    setModalType(null);
    setLeadName('');
    setLeadPhone('');
    setLeadMsg('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find(c => c.id === payClient);
    if (!client) return;
    const amountCents = Math.round(parseFloat(payAmount) * 100);
    recordPayment({
      clientId: client.id,
      clientName: client.name,
      amountCents,
      currency: state.tenant.currency,
      paymentMethod: payMethod,
      referenceId: payRef || `PAY-${Date.now()}`,
      description: `Manual ${payMethod} payment recorded for ${client.name}`,
    });
    setModalType(null);
    setPayRef('');
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Global Search */}
        <div className="flex items-center gap-3 w-96">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients, leads, Kundlis, invoices..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Live Realtime Sync Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] font-semibold text-emerald-800 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Activity className="w-3 h-3 text-emerald-600" />
            <span>Realtime Sync Live</span>
          </div>

          {/* Active Role Indicator */}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-[11px] font-semibold text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/60 font-mono font-bold uppercase text-amber-900">
                {user.role}
              </span>
            </div>
          )}

          {/* Timezone Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-[11px] font-medium text-stone-600 border border-stone-200/60">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{state.tenant.timezone} (IST)</span>
          </div>

          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Action</span>
            </button>

            {isQuickActionOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-30 text-xs"
                onClick={() => setIsQuickActionOpen(false)}
              >
                <button
                  onClick={() => setModalType('lead')}
                  className="w-full px-3 py-2 text-left text-stone-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="font-semibold">Add New Lead</p>
                    <p className="text-[10px] text-stone-500">Capture inquiry from WhatsApp/Phone</p>
                  </div>
                </button>
                {canAccessFinances() ? (
                  <button
                    onClick={() => setModalType('payment')}
                    className="w-full px-3 py-2 text-left text-stone-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Record Payment</p>
                      <p className="text-[10px] text-stone-500">Post Cash / UPI to Ledger</p>
                    </div>
                  </button>
                ) : (
                  <div className="px-3 py-2 text-stone-400 flex items-center gap-2 cursor-not-allowed bg-stone-50/50">
                    <CreditCard className="w-4 h-4 text-stone-300" />
                    <div>
                      <p className="font-semibold text-stone-400">Record Payment (Locked)</p>
                      <p className="text-[10px] text-stone-400">Owner/Finance role required</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Add Lead Modal */}
      {modalType === 'lead' && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-600" />
                Capture New Inquiry / Lead
              </h3>
              <button onClick={() => setModalType(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Lead Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Sumanth Nambiar"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="text"
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Inquiry Source</label>
                <select
                  value={leadSource}
                  onChange={(e: any) => setLeadSource(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="WHATSAPP">WhatsApp Direct</option>
                  <option value="WEBSITE">Website Form</option>
                  <option value="REFERRAL">Personal Referral</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Service Interest / Client Note</label>
                <textarea
                  rows={2}
                  value={leadMsg}
                  onChange={(e) => setLeadMsg(e.target.value)}
                  placeholder="e.g. Inquired about marriage kundli matching and muhurat"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {modalType === 'payment' && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Record Payment (Ledger Posting)
              </h3>
              <button onClick={() => setModalType(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Client *</label>
                <select
                  value={payClient}
                  onChange={(e) => setPayClient(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  {state.clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Method *</label>
                  <select
                    value={payMethod}
                    onChange={(e: any) => setPayMethod(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="MANUAL_UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="CASH">Cash in Hand</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">UPI Transaction Ref / Note</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UPI-98421092837"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>
              <p className="text-[11px] text-stone-500 italic">
                * An immutable debit will be recorded to Bank/Gateway and credit to Revenue/Client Deposit in the financial ledger.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
