'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  MessageCircle, 
  Globe, 
  Share2, 
  Camera, 
  Plus, 
  ArrowRight, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  Phone,
  Mail,
  UserPlus,
  X
} from 'lucide-react';
import { getAppState, updateLeadStage, convertLeadToClient, addLead } from '@/lib/services/store';
import { Lead, LeadStage } from '@/lib/types/domain';
import { formatMoney } from '@/lib/utils/money';
import { useLiveData } from '@/lib/data/live-data-context';

const STAGES: { stage: LeadStage; label: string; color: string }[] = [
  { stage: 'NEW', label: 'New Inquiries', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
  { stage: 'CONTACTED', label: 'Contacted', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
  { stage: 'QUALIFIED', label: 'Qualified', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
  { stage: 'PROPOSAL_SENT', label: 'Slot / Quote Sent', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
  { stage: 'WON', label: 'Converted to Client', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
  { stage: 'LOST', label: 'Lost / Closed', color: 'border-stone-400 bg-stone-50/40 text-stone-800' },
];

export default function LeadsPipelinePage() {
  const state = getAppState();
  const { leads, updateLeadStageLive, convertLeadLive, createLeadLive } = useLiveData();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // New lead form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<'WHATSAPP' | 'WEBSITE' | 'REFERRAL' | 'INSTAGRAM'>('WHATSAPP');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [intent, setIntent] = useState('');

  const displayLeads = leads && leads.length > 0 ? leads : state.leads;

  const filteredLeads = displayLeads.filter(l => {
    const matchesQuery = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         l.phone.includes(searchQuery) ||
                         l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'ALL' || l.source === selectedSource;
    return matchesQuery && matchesSource;
  });

  const handleStageMove = (leadId: string, newStage: LeadStage) => {
    updateLeadStageLive(leadId, newStage);
  };

  const handleConvert = async (leadId: string) => {
    await convertLeadLive(leadId);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    await createLeadLive({
      contactId: `contact-${Date.now()}`,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone,
      source,
      stage: 'NEW',
      urgency,
      intentMessage: intent || 'Inquiry captured via leads dashboard',
      estimatedValueCents: 350000,
    });

    setIsAddLeadModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setIntent('');
  };

  const renderSourceIcon = (src: string) => {
    switch (src) {
      case 'WHATSAPP':
        return <span title="WhatsApp Business"><MessageCircle className="w-3.5 h-3.5 text-emerald-600" /></span>;
      case 'WEBSITE':
        return <span title="Website Booking Form"><Globe className="w-3.5 h-3.5 text-blue-600" /></span>;
      case 'INSTAGRAM':
        return <span title="Instagram Lead"><Camera className="w-3.5 h-3.5 text-pink-600" /></span>;
      default:
        return <span title="Referral"><Share2 className="w-3.5 h-3.5 text-amber-600" /></span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <UserCheck className="w-4 h-4" />
            <span>Lead Acquisition & Pipeline</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Prospective Client Pipeline
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track inquiries across WhatsApp, website forms, and referrals with source attribution and stage SLA monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-100 text-xs font-medium">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'}`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'}`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Filter leads by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-stone-800 placeholder-stone-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Source:</span>
          </div>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="border border-stone-200 rounded-lg px-2.5 py-1 bg-stone-50 text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="WEBSITE">Website Form</option>
            <option value="REFERRAL">Referral</option>
            <option value="INSTAGRAM">Instagram</option>
          </select>
        </div>
      </div>

      {/* Kanban Mode */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {STAGES.map(({ stage, label, color }) => {
            const columnLeads = filteredLeads.filter(l => l.stage === stage);
            return (
              <div
                key={stage}
                className="bg-stone-50/80 rounded-xl p-3 border border-stone-200 min-w-[220px] flex flex-col min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-800">{label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${color}`}>
                    {columnLeads.length}
                  </span>
                </div>

                {/* Lead Cards List */}
                <div className="space-y-2.5 flex-1">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3 rounded-lg border border-stone-200/90 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-stone-900 leading-tight">{lead.name}</h4>
                        <div className="p-1 rounded bg-stone-50 border border-stone-100">
                          {renderSourceIcon(lead.source)}
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-500 space-y-0.5">
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{lead.phone}</span>
                        </p>
                      </div>

                      {lead.intentMessage && (
                        <p className="text-[11px] text-stone-600 line-clamp-2 bg-stone-50 p-1.5 rounded border border-stone-100 italic">
                          "{lead.intentMessage}"
                        </p>
                      )}

                      {/* Lead Actions */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                        {stage !== 'WON' ? (
                          <button
                            onClick={() => handleConvert(lead.id)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-semibold flex items-center gap-1"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Convert</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Converted
                          </span>
                        )}

                        {/* Stage Progress selector */}
                        <select
                          value={lead.stage}
                          onChange={(e: any) => handleStageMove(lead.id, e.target.value)}
                          className="text-[10px] bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 text-stone-700"
                        >
                          {STAGES.map(s => (
                            <option key={s.stage} value={s.stage}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-[11px] text-stone-400 border border-dashed border-stone-200 rounded-lg">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Lead Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900">{lead.name}</td>
                  <td className="py-3 px-4">
                    <p>{lead.phone}</p>
                    <p className="text-[11px] text-stone-400">{lead.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 text-[11px] font-medium text-stone-700">
                      {renderSourceIcon(lead.source)}
                      <span>{lead.source}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-stone-100 text-stone-800">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${lead.urgency === 'HIGH' ? 'text-rose-600' : 'text-stone-500'}`}>
                      {lead.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {formatMoney(lead.estimatedValueCents || 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {lead.stage !== 'WON' && (
                      <button
                        onClick={() => handleConvert(lead.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                      >
                        Convert to Client
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                Capture New Inquiry
              </h3>
              <button onClick={() => setIsAddLeadModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Channel Source</label>
                  <select
                    value={source}
                    onChange={(e: any) => setSource(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="WHATSAPP">WhatsApp Business</option>
                    <option value="WEBSITE">Website Form</option>
                    <option value="REFERRAL">Client Referral</option>
                    <option value="INSTAGRAM">Instagram / Social</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="HIGH">High (Within 24h)</option>
                    <option value="MEDIUM">Medium (Within 3 days)</option>
                    <option value="LOW">Low (Exploratory)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Inquiry Context / Question</label>
                <textarea
                  rows={2}
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="Inquiry details..."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
