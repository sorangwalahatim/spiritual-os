'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  FileText, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock,
  Download,
  X
} from 'lucide-react';
import { getAppState, recordPayment } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';
import { formatDateTime } from '@/lib/utils/date';
import { useAuth } from '@/lib/auth/auth-context';
import { Lock, UserCheck2 } from 'lucide-react';

export default function FinanceLedgerPage() {
  const state = getAppState();
  const { canAccessFinances, user, loginAsDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'ledger' | 'invoices'>('ledger');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // RBAC Access Guard
  if (!canAccessFinances()) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 md:p-12 text-center max-w-xl mx-auto shadow-sm space-y-5 my-12">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/60 px-2.5 py-0.5 rounded-full">
            RBAC Access Restricted
          </span>
          <h2 className="text-xl font-bold font-serif text-stone-900">
            Financial Ledger & Revenue Restricted
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
            You are currently authenticated as <strong>{user?.name}</strong> with the role of <span className="font-mono font-bold text-stone-700 uppercase">{user?.role}</span>. Double-entry accounting ledgers and balance sheets are restricted to <strong>Owner</strong> and <strong>Finance</strong> roles.
          </p>
        </div>

        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          <button
            onClick={() => loginAsDemoUser('user-001')}
            className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck2 className="w-4 h-4" />
            <span>Switch to Owner (Acharya Raghavendra)</span>
          </button>
        </div>
      </div>
    );
  }

  // Manual payment state
  const [clientId, setClientId] = useState(state.clients[0]?.id || '');
  const [amount, setAmount] = useState('3500');
  const [method, setMethod] = useState<'MANUAL_UPI' | 'CASH'>('MANUAL_UPI');
  const [refId, setRefId] = useState('');
  const [desc, setDesc] = useState('');

  // Financial calculations
  const totalCollectionsCents = state.ledger
    .filter(l => l.accountCode === 'BANK_GATEWAY' && l.entryType === 'DEBIT')
    .reduce((sum, l) => sum + l.amountCents, 0);

  const totalRevenueRecognizedCents = state.ledger
    .filter(l => l.accountCode === 'REVENUE' && l.entryType === 'CREDIT')
    .reduce((sum, l) => sum + l.amountCents, 0);

  const depositsHeldCents = state.ledger
    .filter(l => l.accountCode === 'CLIENT_DEPOSIT' && l.entryType === 'CREDIT')
    .reduce((sum, l) => sum + l.amountCents, 0);

  const handlePostPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return;

    recordPayment({
      clientId: client.id,
      clientName: client.name,
      amountCents: Math.round(parseFloat(amount) * 100),
      currency: state.tenant.currency,
      paymentMethod: method,
      referenceId: refId || `REF-${Date.now()}`,
      description: desc || `Payment received from ${client.name}`,
    });

    setIsRecordModalOpen(false);
    setRefId('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <CreditCard className="w-4 h-4" />
            <span>Financial Controls & Audit</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Immutable Financial Ledger & Invoicing
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Double-entry ledger with integer minor-unit math. Zero mutable balance updates. Fully reconciled against gateway events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Cash / UPI Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Bank / Gateway Collections</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            {formatMoney(totalCollectionsCents, state.tenant.currency)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Debit entries posted to BANK_GATEWAY
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Recognized Consultation Revenue</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            {formatMoney(totalRevenueRecognizedCents, state.tenant.currency)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Credit entries allocated to completed services
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Client Deposits Held in Escrow</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {formatMoney(depositsHeldCents, state.tenant.currency)}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">
            Advance bookings awaiting completion
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-3.5 py-2 rounded-lg transition-all ${
            activeTab === 'ledger'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Immutable Double-Entry Ledger ({state.ledger.length} entries)
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3.5 py-2 rounded-lg transition-all ${
            activeTab === 'invoices'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Invoices & Tax Receipts ({state.invoices.length})
        </button>
      </div>

      {/* Tab 1: Ledger Table */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-700">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              General Journal Stream (Append-Only)
            </span>
            <span className="text-stone-400 text-[11px]">Strict minor-unit precision</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {state.ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-amber-50/20 font-mono text-[11px]">
                  <td className="py-3 px-4 text-stone-500">
                    {formatDateTime(entry.createdAt, state.tenant.timezone)}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900">
                    {entry.accountCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      entry.entryType === 'DEBIT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {entry.entryType}
                    </span>
                  </td>
                  <td className={`py-3 px-4 font-bold ${entry.entryType === 'DEBIT' ? 'text-blue-700' : 'text-purple-700'}`}>
                    {formatMoney(entry.amountCents, entry.currency)}
                  </td>
                  <td className="py-3 px-4 text-stone-500">
                    {entry.referenceType}: {entry.referenceId}
                  </td>
                  <td className="py-3 px-4 font-sans text-stone-800">
                    {entry.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Invoices Table */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {state.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-amber-50/20">
                  <td className="py-3.5 px-4 font-bold text-stone-900 font-mono">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-medium">{inv.clientName}</td>
                  <td className="py-3.5 px-4 text-stone-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 font-mono font-bold">{formatMoney(inv.totalCents, inv.currency)}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">{formatMoney(inv.paidAmountCents, inv.currency)}</td>
                  <td className="py-3.5 px-4 font-mono text-rose-600 font-bold">{formatMoney(inv.balanceDueCents, inv.currency)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Record Manual Cash / UPI Payment
              </h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePostPayment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Select Client *</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  {state.clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Payment Method *</label>
                  <select
                    value={method}
                    onChange={(e: any) => setMethod(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="MANUAL_UPI">UPI (GPay / PhonePe / QR)</option>
                    <option value="CASH">Cash in Hand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Transaction Ref / UTR *</label>
                <input
                  type="text"
                  required
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="e.g. UTR-491029384"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Advance paid for Navagraha Shanti Puja"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Commit to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
