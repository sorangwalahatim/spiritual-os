'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Play, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Users, 
  MessageCircle,
  Mail,
  Zap,
  RotateCw
} from 'lucide-react';
import { getAppState } from '@/lib/services/store.ts';

export default function MarketingPage() {
  const state = getAppState();

  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      name: 'New WhatsApp Inquiry Auto-Triage',
      trigger: 'New Inbound Lead on WhatsApp',
      action: 'Run AI Copilot Reply Draft & Alert Responsible Astrologer',
      status: 'ACTIVE',
      runsCount: 42,
    },
    {
      id: 'wf-2',
      name: 'Post-Consultation Remedial Follow-Up',
      trigger: 'Appointment Marked COMPLETED',
      action: 'Send Approved Upayas & Request Session Review',
      status: 'ACTIVE',
      runsCount: 19,
    },
    {
      id: 'wf-3',
      name: 'Navagraha Puja Yajman Balance Alert',
      trigger: 'Puja Ritual Executed',
      action: 'Generate Balance Tax Invoice & WhatsApp Link',
      status: 'ACTIVE',
      runsCount: 8,
    },
    {
      id: 'wf-4',
      name: 'Annual Solar Return / Birthday Blessing',
      trigger: 'Client DOB Approaching (7 Days Prior)',
      action: 'Send Personalized Varshaphala Invitation with Consent Check',
      status: 'PAUSED',
      runsCount: 14,
    }
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows(wfs => wfs.map(w => w.id === id ? { ...w, status: w.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : w));
  };

  const campaigns = [
    {
      id: 'cmp-1',
      title: 'Guru Gochar (Jupiter Transit) Vedic Briefing',
      channel: 'WHATSAPP',
      audience: 'Active Kundli Clients (86 recipients)',
      status: 'SCHEDULED',
      sendDate: '2026-11-25',
    },
    {
      id: 'cmp-2',
      title: 'New Moon Intention & Celtic Cross Workshop',
      channel: 'EMAIL',
      audience: 'Tarot Patrons (142 recipients)',
      status: 'SENT',
      sendDate: '2026-11-01',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Megaphone className="w-4 h-4" />
            <span>Audience Growth & Automation</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Marketing Campaigns & Workflow Recipes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Section 12: Trigger-condition-action automations, consent-safe audience segments, and broadcast campaigns.
          </p>
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-medium">
            4 Configured Automations
          </span>
        </div>
      </div>

      {/* Trigger-Condition-Action Workflows */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Active Practice Automation Recipes
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Automates administrative tasks while requiring human approval for all sensitive external communications.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-sm">{wf.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    wf.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {wf.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-stone-600 text-[11px] pt-1">
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    WHEN: {wf.trigger}
                  </span>
                  <span>&rarr;</span>
                  <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                    DO: {wf.action}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-stone-400 font-mono">
                  {wf.runsCount} executions
                </span>
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    wf.status === 'ACTIVE'
                      ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {wf.status === 'ACTIVE' ? 'Pause Recipe' : 'Enable Recipe'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns & Broadcasts */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          Consent-Aware Broadcast Campaigns
        </h2>

        <div className="divide-y divide-stone-100 text-xs">
          {campaigns.map((cmp) => (
            <div key={cmp.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{cmp.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {cmp.status}
                  </span>
                </div>
                <p className="text-stone-500">
                  Channel: {cmp.channel} • Audience: {cmp.audience}
                </p>
              </div>

              <span className="text-stone-500 font-mono text-[11px]">
                Date: {cmp.sendDate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
