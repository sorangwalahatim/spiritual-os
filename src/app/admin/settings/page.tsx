'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Palette
} from 'lucide-react';
import { getAppState, updateConfigurationProfile, resetAppState, saveAppState } from '@/lib/services/store';
import { ConfigurationProfile } from '@/lib/types/domain';
import { useAuth } from '@/lib/auth/auth-context';
import { Lock } from 'lucide-react';

const PROFILES: { id: ConfigurationProfile; name: string; desc: string; icon: string }[] = [
  { id: 'astrology', name: 'Vedic Astrology Practice', desc: 'Preconfigures Kundli chart systems, birth time accuracy, Dasha timing, and horoscope consultation services.', icon: '🪐' },
  { id: 'tarot_card', name: 'Tarot & Card Reader Studio', desc: 'Preconfigures Celtic Cross spreads, deck catalogues, client question intakes, and follow-up reflection delivery.', icon: '🎴' },
  { id: 'pandit_ritual', name: 'Pandit & Ritual Sanctuary', desc: 'Preconfigures puja ceremonies, sankalp details, voluntary gotra registries, samagri checklists, and venue logistics.', icon: '🪔' },
  { id: 'spiritual_coaching', name: 'Spiritual Coaching & Mentorship', desc: 'Preconfigures goal milestones, structured homework, transformation journeys, and recurring session bundles.', icon: '🕊️' },
  { id: 'vastu', name: 'Vastu Shastra Consultancy', desc: 'Preconfigures property zones, directional assessments, floor plans, and non-demolition energy harmonization.', icon: '🧭' },
  { id: 'creator', name: 'Spiritual Creator & Community', desc: 'Preconfigures audience cohorts, live webinars, digital audio/video course downloads, and broadcasts.', icon: '✨' },
];

export default function SettingsPage() {
  const state = getAppState();
  const { canManageSettings, user } = useAuth();
  const [profile, setProfile] = useState<ConfigurationProfile>(state.tenant.configProfile);
  const [practiceName, setPracticeName] = useState(state.tenant.name);
  const [currency, setCurrency] = useState(state.tenant.currency);
  const [timezone, setTimezone] = useState(state.tenant.timezone);
  const [disclaimer, setDisclaimer] = useState(state.tenant.ethicsDisclaimer);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigurationProfile(profile);
    const updatedState = getAppState();
    updatedState.tenant.name = practiceName;
    updatedState.tenant.currency = currency;
    updatedState.tenant.timezone = timezone;
    updatedState.tenant.ethicsDisclaimer = disclaimer;
    saveAppState(updatedState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset practice state back to default seed data?')) {
      resetAppState();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Settings className="w-4 h-4" />
            <span>Platform Customization</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Practice Settings & Vertical Profiles
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Tailor the operating system configuration to your spiritual tradition without maintaining separate codebases.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={!canManageSettings()}
          className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {!canManageSettings() && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            You are viewing settings as <strong>{user?.name}</strong> (<span className="font-mono uppercase font-bold">{user?.role}</span>). Modifying practice configuration is restricted to the Practice Owner.
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Vertical Configuration Profile Selection */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900">Spiritual Practice Vertical Template</h2>
          </div>
          <p className="text-xs text-stone-500">
            Select your primary operational profile. Switching updates specialist forms, terminology, and intake flows while preserving existing client relationships.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {PROFILES.map((p) => {
              const isSelected = profile === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-600 shadow-xs ring-1 ring-amber-600'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{p.icon}</span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-amber-600 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">{p.name}</h3>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practice Identity & Localization */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Globe className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900">Brand & Regional Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Practice Public Name</label>
              <input
                type="text"
                required
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg bg-white text-xs"
              >
                <option value="INR">INR (₹) - Indian Rupee (UPI / Razorpay)</option>
                <option value="USD">USD ($) - US Dollar (Stripe)</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="AUD">AUD (A$) - Australian Dollar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Canonical Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg bg-white text-xs"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                <option value="America/New_York">America/New_York (EST / EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST / PDT)</option>
                <option value="Europe/London">Europe/London (GMT / BST)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Public Ethics Disclaimer (Section 23.4)</label>
              <textarea
                rows={2}
                value={disclaimer}
                onChange={(e) => setDisclaimer(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Practitioner Availability & Calendar Sync (Section 18 & 19) */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h2 className="text-sm font-bold text-stone-900">Practitioner Working Hours & Calendar Sync</h2>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Two-Way Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Weekly Days Schedule */}
            <div className="space-y-2 md:col-span-2">
              <label className="block font-semibold text-stone-800">Weekly Consultation Availability</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { day: 'Monday', active: true },
                  { day: 'Tuesday', active: true },
                  { day: 'Wednesday', active: true },
                  { day: 'Thursday', active: true },
                  { day: 'Friday', active: true },
                  { day: 'Saturday', active: true },
                  { day: 'Sunday', active: false },
                ].map((item) => (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      item.active ? 'bg-amber-50/50 border-amber-200 text-stone-900' : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <span className="font-medium">{item.day}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.active ? 'bg-amber-200/80 text-amber-900' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {item.active ? 'Active' : 'Off'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Daily Start Window</label>
                  <input
                    type="time"
                    defaultValue="09:30"
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Daily End Window</label>
                  <input
                    type="time"
                    defaultValue="18:30"
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">Buffer Between Sessions</label>
                  <select defaultValue="15" className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50 text-xs">
                    <option value="0">0 Minutes (Back to back)</option>
                    <option value="10">10 Minutes (Water & notes)</option>
                    <option value="15">15 Minutes (Recommended)</option>
                    <option value="30">30 Minutes (Deep meditation)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sync Integrations Box */}
            <div className="space-y-3 bg-stone-50/70 p-4 rounded-xl border border-stone-200">
              <span className="text-[11px] font-bold text-stone-900 block">Connected Calendar Hubs</span>
              
              <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Google Calendar</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                </div>
                <p className="text-[10px] text-stone-500">care@astroveda.com</p>
                <p className="text-[10px] text-emerald-700 font-medium">✓ Auto-generates Google Meet links</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">WhatsApp Reminder Bot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                </div>
                <p className="text-[10px] text-stone-500">24h &amp; 1h automated dispatch</p>
                <p className="text-[10px] text-emerald-700 font-medium">✓ Active via Gupshup API</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
          <span className="text-xs text-stone-500">
            {isSaved ? 'Settings saved successfully!' : 'Remember to save any configuration changes.'}
          </span>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
          >
            Save Practice Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
