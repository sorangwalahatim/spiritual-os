'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Send, 
  Sliders, 
  CheckCircle2, 
  Lock,
  Layers,
  FileText
} from 'lucide-react';
import { getAppState } from '@/lib/services/store.ts';

export default function AiStudioPage() {
  const state = getAppState();

  const [promptInput, setPromptInput] = useState('A client asks what is the difference between Vedic Kundli consultation and Tarot reading for career decisions?');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Grounded knowledge docs
  const knowledgeDocs = [
    { title: 'AstroVeda Code of Ethical Guidance (Section 23.4)', type: 'Policy', tokens: '1,240', status: 'Active' },
    { title: 'Vedic Kundli Consultation Methodology & Upayas', type: 'Service Guide', tokens: '3,800', status: 'Active' },
    { title: 'Puja Rituals & Samagri Procurement Guidelines', type: 'Fulfillment', tokens: '2,150', status: 'Active' },
    { title: 'Pricing, Deposit Holds & Cancellation Rules', type: 'Finance', tokens: '980', status: 'Active' },
  ];

  const handleTestGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setAiOutput(null);

    setTimeout(() => {
      setAiOutput(
        `Namaste. In our practice at AstroVeda:\n\n1. Vedic Kundli Consultation uses your exact birth date, time, and city to analyze planetary periods (Dasha) and transits (Gochara). It is ideal for long-term timing windows (e.g., when is favorable to switch jobs or relocate).\n\n2. Tarot Reading is intuitive and examines your current crossroads, emotional dynamics, and subconscious blocks over a 3 to 6-month horizon.\n\nWould you prefer a 60-minute Vedic analysis or a 45-minute Tarot deep dive? We have availability this week.`
      );
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Bot className="w-4 h-4" />
            <span>AI Gateway & Knowledge Layer</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            AI Studio & Grounded Knowledge Base
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Section 13: Assistive intelligence orchestration with retrieval-augmented grounding, strict ethical constraints, and human-in-the-loop approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Ethical Safeguards Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Knowledge Documents & Governance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Grounding Knowledge Documents */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Approved Tenant Knowledge Sources
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              The AI Gateway only synthesizes answers grounded in these tenant-approved documents. Client confidential notes are never used for model training.
            </p>

            <div className="space-y-2 text-xs">
              {knowledgeDocs.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-stone-900">{doc.title}</p>
                    <p className="text-[10px] text-stone-500">{doc.type} • {doc.tokens} tokens</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ethical Guardrails Checklist (Section 13.4 & 23.4) */}
          <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-amber-400 flex items-center gap-2 text-sm border-b border-stone-800 pb-2">
              <Lock className="w-4 h-4 text-amber-400" />
              Non-Negotiable Ethical Guardrails
            </h3>
            <ul className="space-y-2 text-stone-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero medical, legal, or guaranteed spiritual prophecies.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>No fear-based or curse-based upselling permitted.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>All client communications require practitioner sign-off before dispatch.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>AI cannot issue refunds or mutate financial ledger entries.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: AI Assistant Playground & Output Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[10px] uppercase font-bold text-amber-700">Copilot Simulator</span>
            <h2 className="text-base font-bold text-stone-900">Grounded Inquiry & Reply Playground</h2>
          </div>

          <form onSubmit={handleTestGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Simulated Client Inbound Inquiry (WhatsApp / Web)
              </label>
              <textarea
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-stone-400">
                Model: Gemini 3.8 Flash (Assistive Draft Mode)
              </span>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing with Grounding...' : 'Generate Grounded Draft'}</span>
              </button>
            </div>
          </form>

          {/* Synthesized Output Display */}
          {aiOutput && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900 border-b border-amber-200/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-amber-700" />
                  Synthesized Grounded Reply (Ready for Human Approval)
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-mono">
                  DRAFT STATE
                </span>
              </div>
              <p className="whitespace-pre-line text-stone-800 leading-relaxed font-sans">
                {aiOutput}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-amber-200/60">
                <span>Citations: Service Guide + Ethics Policy</span>
                <span className="font-semibold text-amber-800">Ready to copy to WhatsApp</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
