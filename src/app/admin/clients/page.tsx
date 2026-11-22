'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Sparkles,
  Tag
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';
import { formatDateTime } from '@/lib/utils/date';

export default function ClientsDirectoryPage() {
  const state = getAppState();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredClients = state.clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Users className="w-4 h-4" />
            <span>Client Intelligence Hub</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Client Directory & Relationship Records
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Central repository for astrological birth details, session histories, consent ledgers, and lifetime consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-medium">
            {state.clients.length} Total Clients
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by client name, phone, tags, or birth city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-stone-800 placeholder-stone-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-500 text-xs">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-stone-200 rounded-lg px-2.5 py-1 bg-stone-50 text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Clients</option>
            <option value="ACTIVE">Active</option>
            <option value="REPEAT">Repeat Patron</option>
            <option value="PROSPECT">Prospect</option>
          </select>
        </div>
      </div>

      {/* Client Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Client Name & Tags</th>
              <th className="py-3 px-4">Contact & Channel</th>
              <th className="py-3 px-4">Specialist Attributes</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Lifetime Value</th>
              <th className="py-3 px-4">Balance</th>
              <th className="py-3 px-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filteredClients.map((client) => {
              const hasAstrology = !!client.specialistData.astrology;
              const hasTarot = !!client.specialistData.tarot;
              const hasPuja = !!client.specialistData.puja;

              return (
                <tr key={client.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-bold text-stone-900 hover:text-amber-700 text-sm block"
                    >
                      {client.name}
                    </Link>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 border border-stone-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <p className="flex items-center gap-1 font-medium">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {client.phone}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Mail className="w-3 h-3 text-stone-400" />
                      {client.email}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {hasAstrology && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                          Vedic Kundli
                        </span>
                      )}
                      {hasTarot && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold">
                          Tarot Focus
                        </span>
                      )}
                      {hasPuja && (
                        <span className="px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 text-[10px] font-semibold">
                          Puja Gotra
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      client.status === 'REPEAT' ? 'bg-amber-100 text-amber-800' :
                      client.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                    {formatMoney(client.lifetimeValueCents)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    {client.outstandingBalanceCents > 0 ? (
                      <span className="text-rose-600 font-bold">
                        {formatMoney(client.outstandingBalanceCents)}
                      </span>
                    ) : (
                      <span className="text-stone-400">₹0.00</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-50 hover:bg-amber-600 hover:text-white border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-all"
                    >
                      <span>360 View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
