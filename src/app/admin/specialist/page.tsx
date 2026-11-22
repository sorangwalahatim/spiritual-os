'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Flame, 
  Sparkles, 
  Compass, 
  MapPin, 
  Calendar,
  Clock,
  Printer,
  RefreshCw,
  User,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { calculateVedicChart, type KundliCalculationResult } from '@/lib/astrology/engine';
import { KundliChart } from '@/components/astrology/KundliChart';

function SpecialistContent() {
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId');
  
  const state = getAppState();
  const [activeTab, setActiveTab] = useState<'astrology' | 'tarot' | 'puja' | 'vastu'>('astrology');

  // Client selection & custom input state
  const [selectedClientId, setSelectedClientId] = useState<string>(preselectedClientId || 'client-101');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  
  // Custom birth details form
  const [customName, setCustomName] = useState('Priyanka Sen');
  const [customDate, setCustomDate] = useState('1992-08-14');
  const [customTime, setCustomTime] = useState('06:45');
  const [customCity, setCustomCity] = useState('Kolkata, West Bengal');

  // Interactive Tarot Draw State
  const [drawnCards, setDrawnCards] = useState([
    { position: 'Past Influences', card: 'The High Priestess', meaning: 'Deep intuitive knowing, hidden wisdom, spiritual initiation.', orientation: 'Upright' },
    { position: 'Present Crucible', card: 'The Wheel of Fortune', meaning: 'Karmic cycle shift, unexpected turning point, destiny aligning.', orientation: 'Upright' },
    { position: 'Emerging Horizon', card: 'The Star', meaning: 'Renewed hope, divine inspiration, alignment with higher purpose.', orientation: 'Upright' },
  ]);

  // Interactive Puja Samagri Checklist State
  const [samagriItems, setSamagriItems] = useState([
    { id: 1, item: 'Pure Cow Ghee & Camphor (Kapoor)', qty: '1 kg', done: true },
    { id: 2, item: 'Navadhanya (Nine Sacred Grains)', qty: '1 set', done: true },
    { id: 3, item: 'Sandalwood Paste & Kumkum', qty: '100g', done: true },
    { id: 4, item: 'Havan Samagri Herbs & Mango Wood', qty: '5 kg', done: false },
    { id: 5, item: 'Coconuts with Water & Betel Leaves', qty: '5 pcs', done: false },
    { id: 6, item: 'Yajnopavita (Sacred Janeu threads)', qty: '2 pairs', done: true },
  ]);

  // Sync client selection when preselectedClientId changes
  useEffect(() => {
    if (preselectedClientId) {
      setSelectedClientId(preselectedClientId);
      setIsCustomMode(false);
    }
  }, [preselectedClientId]);

  // Calculate Kundli chart deterministically
  const calculatedKundli: KundliCalculationResult = useMemo(() => {
    if (isCustomMode) {
      return calculateVedicChart({
        clientName: customName || 'Consultation Client',
        birthDate: customDate || '1990-01-01',
        birthTime: customTime || '12:00',
        birthCity: customCity || 'New Delhi, India',
      });
    }

    const client = state.clients.find(c => c.id === selectedClientId);
    if (client && client.specialistData.astrology) {
      const astro = client.specialistData.astrology;
      return calculateVedicChart({
        clientName: client.name,
        birthDate: astro.birthDate || client.dob || '1992-08-14',
        birthTime: astro.birthTime || '06:45',
        birthCity: astro.birthCity ? `${astro.birthCity}, ${astro.birthCountry || 'India'}` : 'Kolkata, West Bengal',
      });
    }

    // Default fallback to first client or Priyanka Sen
    return calculateVedicChart({
      clientName: client?.name || 'Priyanka Sen',
      birthDate: client?.dob || '1992-08-14',
      birthTime: '06:45',
      birthCity: 'Kolkata, West Bengal',
    });
  }, [selectedClientId, isCustomMode, customName, customDate, customTime, customCity, state.clients]);

  const toggleSamagri = (id: number) => {
    setSamagriItems(items => items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const handleShuffleTarot = () => {
    const deck = [
      { card: 'The Magician', meaning: 'Mastery over elements, focused willpower, manifesting vision.' },
      { card: 'The Empress', meaning: 'Abundance, creative fertility, nurturing growth.' },
      { card: 'The Hierophant', meaning: 'Spiritual lineage, sacred knowledge, traditional wisdom.' },
      { card: 'The Hermit', meaning: 'Introspection, solitary illumination, inner truth.' },
      { card: 'The Sun', meaning: 'Clarity, vitality, triumph of truth and joy.' },
      { card: 'The World', meaning: 'Cycle completion, holistic integration, ascension.' },
    ];
    const shuffled = [...deck].sort(() => 0.5 - Math.random()).slice(0, 3);
    setDrawnCards([
      { position: 'Past Influences', card: shuffled[0].card, meaning: shuffled[0].meaning, orientation: 'Upright' },
      { position: 'Present Crucible', card: shuffled[1].card, meaning: shuffled[1].meaning, orientation: 'Upright' },
      { position: 'Emerging Horizon', card: shuffled[2].card, meaning: shuffled[2].meaning, orientation: 'Upright' },
    ]);
  };

  const handlePrintDossier = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Printable Kundli Dossier Header (Visible only when printing) */}
      <div className="hidden print:block pb-6 border-b border-stone-800 text-stone-900">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-serif">AstroVeda Practice OS</h1>
            <p className="text-xs text-stone-600">Deterministic Sidereal Ephemeris • Chitra Paksha (Lahiri Ayanamsa)</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">{calculatedKundli.birthDetails.clientName}</p>
            <p>{calculatedKundli.birthDetails.date} at {calculatedKundli.birthDetails.time}</p>
            <p>{calculatedKundli.birthDetails.city}</p>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Flame className="w-4 h-4" />
            <span>Specialist Practice Workspaces</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Deterministic Ephemeris & Ritual Tools
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Section 16: Mathematical Vedic Kundlis, Tarot spreads, Puja samagri fulfillment, and Vastu directional maps.
          </p>
        </div>

        {/* Tab Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('astrology')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'astrology' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🪐 Vedic Kundli
          </button>
          <button
            onClick={() => setActiveTab('tarot')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'tarot' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎴 Tarot Studio
          </button>
          <button
            onClick={() => setActiveTab('puja')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'puja' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🪔 Puja Samagri
          </button>
          <button
            onClick={() => setActiveTab('vastu')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'vastu' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🧭 Vastu 16-Zone
          </button>
        </div>
      </div>

      {/* 1. VEDIC ASTROLOGY WORKSPACE */}
      {activeTab === 'astrology' && (
        <div className="space-y-6">
          {/* Client Selector & Parameters Toolbar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-semibold text-stone-700">Client Profile:</span>
              </div>
              
              {!isCustomMode ? (
                <div className="relative">
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 pr-8 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                  >
                    {state.clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.specialistData.astrology?.birthDate ? `(${c.specialistData.astrology.birthDate})` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Name"
                    className="text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg w-28"
                  />
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="City"
                    className="text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg w-32"
                  />
                </div>
              )}

              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2 ml-1"
              >
                {isCustomMode ? '← Pick from Directory' : '+ Enter Custom Coordinates'}
              </button>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handlePrintDossier}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export Kundli Dossier (Print / PDF)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Traditional North Indian Diamond Kundli Chart Display (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-700">Rasi Kundli (D1)</span>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      Sidereal Lahiri ({calculatedKundli.birthDetails.ayanamsaValue}°)
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-stone-900 mt-0.5">
                    {calculatedKundli.birthDetails.clientName}
                  </h2>
                  <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>Lagna: <strong>{calculatedKundli.ascendant.sign}</strong> ({calculatedKundli.ascendant.degree}° {calculatedKundli.ascendant.minutes}')</span>
                    <span>•</span>
                    <span>{calculatedKundli.ascendant.nakshatra}</span>
                  </p>
                </div>
                <div className="text-right text-xs text-stone-500">
                  <p className="flex items-center justify-end gap-1"><Calendar className="w-3 h-3 text-stone-400" /> {calculatedKundli.birthDetails.date}</p>
                  <p className="flex items-center justify-end gap-1"><Clock className="w-3 h-3 text-stone-400" /> {calculatedKundli.birthDetails.time}</p>
                  <p className="flex items-center justify-end gap-1"><MapPin className="w-3 h-3 text-stone-400" /> {calculatedKundli.birthDetails.city}</p>
                </div>
              </div>

              {/* Dynamic North Indian Diamond Chart SVG Component */}
              <KundliChart kundli={calculatedKundli} size={420} />

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
                <span><strong>Moon (Chandra):</strong> {calculatedKundli.moonDetails.sign} • {calculatedKundli.moonDetails.nakshatra} (Pada {calculatedKundli.moonDetails.pada})</span>
                <span className="font-mono text-amber-800 font-medium">Balance: {calculatedKundli.moonDetails.balanceDashaLord} ~{calculatedKundli.moonDetails.balanceDashaYears}y</span>
              </div>
            </div>

            {/* Right: Planetary Degrees & Vimshottari Dasha (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Planetary Longitudes Table */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h3 className="font-bold text-stone-900">
                    Planetary Longitudes & Dignities
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400 uppercase">9 Grahas</span>
                </div>
                <div className="divide-y divide-stone-100 max-h-[290px] overflow-y-auto pr-1">
                  {calculatedKundli.planets.map((p) => {
                    const isExalted = p.dignity === 'EXALTED';
                    const isDebilitated = p.dignity === 'DEBILITATED';
                    const isOwn = p.dignity === 'OWN_SIGN';

                    return (
                      <div key={p.planet} className="py-2 flex items-center justify-between font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="font-bold text-stone-900">{p.symbol}</span>
                          <span className="font-medium text-stone-700">{p.sanskritName}</span>
                          {p.isRetrograde && (
                            <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1 rounded font-mono">
                              [R]
                            </span>
                          )}
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-stone-800">
                            {p.sign.split(' ')[0]} {p.degreeInSign}° {String(p.minutesInSign).padStart(2, '0')}&apos;
                          </span>
                          <span className="text-[10px] text-stone-500 font-sans hidden sm:inline">
                            ({p.nakshatra.slice(0, 5)})
                          </span>
                          {isExalted && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans">
                              Exalted
                            </span>
                          )}
                          {isDebilitated && (
                            <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-sans">
                              Debil.
                            </span>
                          )}
                          {isOwn && (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans">
                              Own
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vimshottari Mahadasha Timeline */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 text-xs">
                <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center justify-between">
                  <span>Vimshottari Dasha Periods</span>
                  <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Active Dasha
                  </span>
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-amber-950 font-serif">
                        {calculatedKundli.currentDasha.mahadasha} Mahadasha
                      </p>
                      <p className="text-[10px] text-amber-800 mt-0.5">
                        Antardasha: <strong>{calculatedKundli.currentDasha.antardasha}</strong>
                      </p>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                        {calculatedKundli.currentDasha.startDate} &rarr; {calculatedKundli.currentDasha.endDate}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-1 rounded-lg">
                      Crucible Window
                    </span>
                  </div>
                </div>
              </div>

              {/* Vedic Remedial Prescription */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 text-xs">
                <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Vedic Remedies & Upayas</span>
                </h3>
                <div className="space-y-2 text-stone-700">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">Recommended Gemstone (Ratna)</span>
                    <p className="font-medium text-stone-900 mt-0.5">{calculatedKundli.remedies.gemstone}</p>
                    <p className="text-[10px] text-stone-500">Metal: {calculatedKundli.remedies.metal}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">Prescribed Mantra & Vrata</span>
                    <p className="font-mono text-stone-900 font-medium text-[11px] mt-0.5">{calculatedKundli.remedies.mantra}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Fasting / Observance: {calculatedKundli.remedies.fastingDay}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">Charity & Dana</span>
                    <p className="text-stone-800 mt-0.5">{calculatedKundli.remedies.charity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAROT STUDIO WORKSPACE */}
      {activeTab === 'tarot' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700">Intuitive Tarot Workspace</span>
              <h2 className="text-base font-bold text-stone-900">Three-Card Crossroads Reading Generator</h2>
              <p className="text-xs text-stone-500">Draw cards live during a video consultation and attach approved reflection notes to the client profile.</p>
            </div>
            <button
              onClick={handleShuffleTarot}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shuffle & Draw New Spread</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drawnCards.map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-b from-stone-50 to-purple-50/30 border-2 border-purple-200 shadow-xs flex flex-col justify-between text-center space-y-4"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider bg-purple-100 px-2.5 py-0.5 rounded-full">
                    {card.position}
                  </span>
                  <div className="w-24 h-36 mx-auto mt-4 rounded-xl bg-purple-900 border-2 border-amber-400/50 flex flex-col items-center justify-center text-amber-200 shadow-md">
                    <span className="text-2xl">🎴</span>
                    <span className="text-[10px] font-serif font-bold mt-1 px-1">{card.card}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-stone-900 mt-3">{card.card}</h3>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">{card.orientation}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic bg-white p-3 rounded-xl border border-purple-100">
                  &quot;{card.meaning}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PUJA SAMAGRI & RITUAL WORKSPACE */}
      {activeTab === 'puja' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700">Ritual Fulfillment Desk</span>
              <h2 className="text-base font-bold text-stone-900">Navagraha Shanti & Havan Samagri Protocol</h2>
              <p className="text-xs text-stone-500">
                Client: <strong>Vikramaditya Roy</strong> • Venue: Shri Lakshmi Narayana Temple • Muhurat: Morning Brahma Muhurat
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
              Assigned Pandit: Pandit Shambhu Shastri
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Samagri Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Samagri Checklist ({samagriItems.filter(i => i.done).length} / {samagriItems.length} Packed)
              </h3>
              <div className="space-y-2">
                {samagriItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleSamagri(item.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      item.done ? 'bg-emerald-50/60 border-emerald-300' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={item.done}
                        readOnly
                        className="rounded text-emerald-600 focus:ring-0"
                      />
                      <span className={`font-medium ${item.done ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {item.item}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500">{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sankalp Registry Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs">
              <h3 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                Yajman Sankalp Registry
              </h3>
              <div className="space-y-2 text-stone-700">
                <p><strong>Primary Yajman:</strong> Vikramaditya Roy</p>
                <p><strong>Gotra:</strong> Kashyapa</p>
                <p><strong>Family Participants:</strong> Sunita Roy (Spouse), Aarav Roy (Son)</p>
                <p><strong>Specific Sankalp Intent:</strong> Business expansion, peace of ancestors, Navagraha harmony.</p>
                <div className="pt-3 border-t border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Financial Reconciliation</span>
                  <div className="flex justify-between font-mono">
                    <span>Total Dakshina & Samagri:</span>
                    <span className="font-bold">₹11,000.00</span>
                  </div>
                  <div className="flex justify-between font-mono text-emerald-600">
                    <span>Advance Received (Ledger):</span>
                    <span className="font-bold">₹5,000.00</span>
                  </div>
                  <div className="flex justify-between font-mono text-rose-600 font-bold">
                    <span>Balance Due Post-Puja:</span>
                    <span>₹6,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VASTU 16-ZONE WORKSPACE */}
      {activeTab === 'vastu' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[10px] uppercase font-bold text-amber-700">Vastu Shastra Analyzer</span>
            <h2 className="text-base font-bold text-stone-900">16-Zone Energy Alignment & Non-Demolition Remedies</h2>
            <p className="text-xs text-stone-500">Directional balancing based on Pancha Tattva (Five Sacred Elements).</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <span className="text-[10px] font-bold text-blue-800">North (Jala - Water)</span>
              <p className="font-bold text-stone-900">Wealth & Opportunity</p>
              <p className="text-[11px] text-stone-600">Keep uncluttered; place blue decor or money plant.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800">North-East (Ishanya)</span>
              <p className="font-bold text-stone-900">Divine Clarity & Mind</p>
              <p className="text-[11px] text-stone-600">Ideal for puja altar and meditation. Zero heavy storage.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold text-rose-800">South-East (Agneya)</span>
              <p className="font-bold text-stone-900">Agni - Fire & Cash Flow</p>
              <p className="text-[11px] text-stone-600">Ideal for kitchen burner. Remedy with red jasper tape.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-800">South-West (Nairutya)</span>
              <p className="font-bold text-stone-900">Prithvi - Earth & Stability</p>
              <p className="text-[11px] text-stone-600">Master bedroom location. Heavy brass or yellow stone remedy.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SpecialistPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading specialist workspaces...</div>}>
      <SpecialistContent />
    </Suspense>
  );
}
