'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Users, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Lock, 
  FileText, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';
import { getAppState, addClientNote, bookAppointment, recordPayment } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';
import { formatDateTime } from '@/lib/utils/date';
import { useAuth } from '@/lib/auth/auth-context';
import { EyeOff } from 'lucide-react';

export default function Client360Page() {
  const params = useParams();
  const rawId = params?.id;
  const clientId = Array.isArray(rawId) ? rawId[0] : rawId;
  const state = getAppState();
  const { canViewConfidentialNotes, user } = useAuth();

  const client = (state.clients.find(c => c.id === clientId) || state.clients[0]) as (typeof state.clients)[0];
  const notes = client ? state.notes.filter(n => n.clientId === client.id) : [];
  const appointments = client ? state.appointments.filter(a => a.clientId === client.id) : [];
  const invoices = client ? state.invoices.filter(i => i.clientId === client.id) : [];
  const consents = client ? state.consents.filter(c => c.clientId === client.id) : [];

  const [activeTab, setActiveTab] = useState<'specialist' | 'timeline' | 'notes' | 'invoices' | 'consent'>('specialist');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;
    addClientNote(client.id, noteTitle, noteContent, isConfidential, !isConfidential);
    setIsNoteModalOpen(false);
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/admin/clients" className="hover:text-stone-900 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Clients Directory
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-semibold">{client.name}</span>
      </div>

      {/* Client Overview Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xl font-serif">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold font-serif text-stone-900">{client.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {client.status}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {client.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {client.email}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Preferred: {client.preferredChannel}
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {client.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md border border-stone-200 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-stone-50 p-3.5 rounded-xl border border-stone-200/70 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Lifetime Consultations</p>
              <p className="text-base font-bold text-stone-900 font-mono mt-0.5">
                {formatMoney(client.lifetimeValueCents)}
              </p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">Balance Due</p>
              <p className="text-base font-bold font-mono mt-0.5 text-rose-600">
                {formatMoney(client.outstandingBalanceCents)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('specialist')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'specialist'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Specialist Data & Charts
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'notes'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Practitioner Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Consultation History ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'invoices'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Invoices & Billing ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'consent'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Privacy & Consent Ledger
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {/* 1. Specialist Data Panel */}
      {activeTab === 'specialist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vedic Astrology Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Vedic Astrology & Birth Chart Data
              </h3>
              <span className="text-[11px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                {client.specialistData.astrology?.chartSystem || 'NORTH_INDIAN'}
              </span>
            </div>

            {client.specialistData.astrology ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Birth Date</span>
                    <p className="font-medium text-stone-900">{client.specialistData.astrology.birthDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Exact Birth Time</span>
                    <p className="font-medium text-stone-900">
                      {client.specialistData.astrology.birthTime} ({client.specialistData.astrology.birthTimeAccuracy})
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Birth City & Country</span>
                    <p className="font-medium text-stone-900">
                      {client.specialistData.astrology.birthCity}, {client.specialistData.astrology.birthCountry}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Ayanamsa Calculation</span>
                    <p className="font-medium text-stone-900">{client.specialistData.astrology.ayanamsa || 'Lahiri'}</p>
                  </div>
                </div>

                {client.specialistData.astrology.notes && (
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                    <p className="font-semibold text-stone-900 mb-0.5">Astrological Planetary Overview:</p>
                    <p className="text-xs leading-relaxed">{client.specialistData.astrology.notes}</p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/admin/specialist?clientId=${client.id}`}
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <span>🪐 Open Interactive Kundli & Dossier</span>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No birth chart details recorded yet.</p>
            )}
          </div>

          {/* Tarot & Rituals Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Tarot & Ritual Context
              </h3>
            </div>

            {client.specialistData.tarot ? (
              <div className="space-y-3 text-xs text-stone-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Reading Focus Question / Theme</span>
                  <p className="font-medium text-stone-900 mt-0.5">{client.specialistData.tarot.coreFocusTheme}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Preferred Decks</span>
                  <div className="flex gap-1.5 mt-1">
                    {client.specialistData.tarot.preferredDecks?.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[11px] border border-purple-200">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {client.specialistData.puja ? (
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400">Voluntary Gotra & Puja Details</span>
                <p><strong>Gotra:</strong> {client.specialistData.puja.gotraVoluntary}</p>
                <p><strong>Tradition:</strong> {client.specialistData.puja.tradition}</p>
                <p><strong>Occasion:</strong> {client.specialistData.puja.deityOrOccasion}</p>
              </div>
            ) : null}

            {!client.specialistData.tarot && !client.specialistData.puja && (
              <p className="text-xs text-stone-400 italic">No tarot or puja records on file.</p>
            )}
          </div>
        </div>
      )}

      {/* 2. Practitioner Notes Panel */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                Session Notes & Spiritual Briefs
              </h3>
              <p className="text-xs text-stone-500">
                Class 4 Confidential notes are strictly restricted to assigned practitioner and owner.
              </p>
            </div>
            {canViewConfidentialNotes() ? (
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-500 rounded-lg text-[11px] font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Read-Only (Assistant)</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            {notes.map(note => {
              const isMasked = note.isConfidential && !canViewConfidentialNotes();
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    note.isConfidential ? 'bg-amber-50/30 border-amber-200' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      {note.isConfidential && <Lock className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{note.title}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      {formatDateTime(note.createdAt, state.tenant.timezone)}
                    </span>
                  </div>

                  {isMasked ? (
                    <div className="p-3 bg-stone-100/80 border border-dashed border-stone-300 rounded-lg text-center space-y-1 my-1">
                      <div className="flex items-center justify-center gap-1.5 text-stone-600 font-semibold text-xs">
                        <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                        <span>Class 4 Confidential Content Redacted</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        This note contains confidential spiritual intake details restricted to the assigned practitioner and practice owner.
                      </p>
                    </div>
                  ) : (
                    <p className="text-stone-700 leading-relaxed text-xs">{note.content}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 text-[11px] text-stone-500">
                    <span>Author: {note.authorName}</span>
                    <span className={`font-semibold ${note.isConfidential ? 'text-amber-800' : 'text-emerald-700'}`}>
                      {note.isConfidential ? 'Class 4: Private Practitioner Only' : 'Client Visible Summary'}
                    </span>
                  </div>
                </div>
              );
            })}
            {notes.length === 0 && (
              <p className="text-xs text-stone-400 italic py-6 text-center">No practitioner notes recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* 3. Consultation History Panel */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            Consultation Bookings
          </h3>
          <div className="divide-y divide-stone-100 text-xs">
            {appointments.map(apt => (
              <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{apt.serviceName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-stone-500">
                    With {apt.practitionerName} • {formatDateTime(apt.startTimeUtc, state.tenant.timezone)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-900">
                    {formatMoney(apt.totalPriceCents)}
                  </span>
                  {apt.meetingLink && (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-semibold"
                    >
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-xs text-stone-400 italic py-6 text-center">No appointments booked yet.</p>
            )}
          </div>
        </div>
      )}

      {/* 4. Invoices & Billing Panel */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Invoices & Payment Records
          </h3>
          <div className="divide-y divide-stone-100 text-xs">
            {invoices.map(inv => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-900">{inv.invoiceNumber}</p>
                  <p className="text-stone-500 text-[11px]">Due: {inv.dueDate} • Issued: {formatDateTime(inv.issuedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{formatMoney(inv.totalCents, inv.currency)}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Privacy & Consent Ledger */}
      {activeTab === 'consent' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 text-sm font-bold pb-2 border-b border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Personal Data Protection & Consent Ledger</span>
          </div>
          <p className="text-xs text-stone-500">
            Audit-backed consent records tracking explicit client permissions for service delivery, WhatsApp messaging, and data retention.
          </p>
          <div className="divide-y divide-stone-100 text-xs">
            {consents.map(c => (
              <div key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-900">{c.purpose.replace('_', ' ')}</p>
                  <p className="text-[11px] text-stone-400">Notice Version: {c.noticeVersion} • Source: {c.source}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {c.status}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {formatDateTime(c.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                Add Practitioner Note
              </h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Planetary Upayas & Gemstone Advice"
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block font-medium text-stone-700 mb-1">Note Content *</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter detailed observations, client feedback, or remedial steps..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confidentialModalCheck"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="confidentialModalCheck" className="text-stone-700 font-medium">
                  Class 4 Confidential (Only accessible by you and owner; hidden from client portal)
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
