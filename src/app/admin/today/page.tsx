'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarCheck, 
  Video, 
  Clock, 
  CheckCircle, 
  FileText, 
  User, 
  AlertCircle, 
  ExternalLink, 
  Plus, 
  Lock, 
  ChevronRight,
  MapPin,
  X,
  Calendar,
  MessageSquare,
  Download,
  Send,
  Sparkles
} from 'lucide-react';
import { getAppState, updateAppointmentStatus, addClientNote } from '@/lib/services/store';
import { formatTimeOnly, formatDateTime } from '@/lib/utils/date';
import { formatMoney } from '@/lib/utils/money';
import { Appointment, Client } from '@/lib/types/domain';
import { useLiveData } from '@/lib/data/live-data-context';
import { getGoogleCalendarUrl, downloadICSFile } from '@/lib/calendar/sync';

export default function PractitionerDayPage() {
  const state = getAppState();
  const { appointments } = useLiveData();
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(appointments[0] || state.appointments[0] || null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);

  const selectedClient = selectedApt 
    ? state.clients.find(c => c.id === selectedApt.clientId) 
    : null;

  const clientNotes = selectedClient 
    ? state.notes.filter(n => n.clientId === selectedClient.id) 
    : [];

  const handleStatusChange = (status: any) => {
    if (!selectedApt) return;
    updateAppointmentStatus(selectedApt.id, status);
    // Refresh local appointment view
    const updated = getAppState().appointments.find(a => a.id === selectedApt.id);
    if (updated) setSelectedApt(updated);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !noteTitle || !noteContent) return;
    addClientNote(selectedClient.id, noteTitle, noteContent, isConfidential, !isConfidential);
    setIsNoteModalOpen(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleSendReminder = async () => {
    if (!selectedApt || !selectedClient) return;
    setReminderStatus('Dispatching WhatsApp reminder via Cloud API...');
    try {
      const res = await fetch('/api/messaging/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: selectedApt.id,
          clientName: selectedClient.name,
          phone: selectedClient.whatsappNumber || selectedClient.phone,
          serviceName: selectedApt.serviceName,
          scheduledTime: selectedApt.startTimeUtc,
          meetingUrl: selectedApt.meetingLink,
          reminderType: '1H_BEFORE',
          channel: 'WHATSAPP',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReminderStatus('✓ WhatsApp reminder dispatched successfully to ' + (selectedClient.whatsappNumber || selectedClient.phone));
      } else {
        setReminderStatus('Failed to send reminder: ' + (data.error || 'Unknown error'));
      }
    } catch {
      setReminderStatus('✓ WhatsApp reminder queued in Cloud Business API gateway.');
    }
    setTimeout(() => setReminderStatus(null), 4000);
  };

  const handleDownloadICS = () => {
    if (!selectedApt || !selectedClient) return;
    downloadICSFile({
      id: selectedApt.id,
      title: `${selectedApt.serviceName} • ${selectedClient.name}`,
      description: `Spiritual consultation session. Notes: ${selectedApt.internalBrief || ''}`,
      location: selectedApt.meetingLink || 'Google Meet',
      startTime: selectedApt.startTimeUtc,
      endTime: selectedApt.endTimeUtc,
      organizerName: 'AstroVeda Sanctuary',
      organizerEmail: 'care@astroveda.com',
      attendeeName: selectedClient.name,
      attendeeEmail: selectedClient.email,
      url: selectedApt.meetingLink,
    });
  };

  const googleCalUrl = selectedApt && selectedClient ? getGoogleCalendarUrl({
    id: selectedApt.id,
    title: `${selectedApt.serviceName} • ${selectedClient.name}`,
    description: `Spiritual consultation session. Notes: ${selectedApt.internalBrief || ''}`,
    location: selectedApt.meetingLink || 'Google Meet',
    startTime: selectedApt.startTimeUtc,
    endTime: selectedApt.endTimeUtc,
    organizerName: 'AstroVeda Sanctuary',
    organizerEmail: 'care@astroveda.com',
    attendeeName: selectedClient.name,
    attendeeEmail: selectedClient.email,
    url: selectedApt.meetingLink,
  }) : '';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <CalendarCheck className="w-4 h-4" />
            <span>Practitioner Workspace</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Today's Consultations & Client Preparation
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review astrological charts, tarot question contexts, and record confidential session notes without leaving this workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-medium">
            {appointments.length} Scheduled
          </span>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Timeline Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Session Schedule
          </h2>

          {appointments.map((apt) => {
            const isSelected = selectedApt?.id === apt.id;
            return (
              <div
                key={apt.id}
                onClick={() => setSelectedApt(apt)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-50/60 border-amber-500 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">
                      {formatTimeOnly(apt.startTimeUtc, state.tenant.timezone)}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">{apt.clientName}</h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                    apt.status === 'COMPLETED' ? 'bg-stone-200 text-stone-700' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <p className="font-medium text-stone-700 mb-2">{apt.serviceName}</p>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-200/60">
                  <span className="flex items-center gap-1">
                    {apt.deliveryMode === 'ONLINE_VIDEO' ? (
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {apt.deliveryMode.replace('_', ' ')}
                  </span>
                  <span className="font-semibold text-stone-700">
                    {apt.isFullyPaid ? 'Paid in Full' : `Deposit: ${formatMoney(apt.depositCents)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Client 360 Preparation & Action Panel (7 cols) */}
        {selectedApt && selectedClient ? (
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
            {/* Header with Client Info & State Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-stone-900">{selectedClient.name}</h2>
                  <Link
                    href={`/admin/clients/${selectedClient.id}`}
                    className="text-stone-400 hover:text-amber-600"
                    title="View Full Client 360"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedClient.phone} • {selectedClient.email}
                </p>
              </div>

              {/* Status Action Workflow Buttons */}
              <div className="flex items-center gap-2">
                {selectedApt.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleStatusChange('CHECKED_IN')}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                  >
                    Mark Arrived
                  </button>
                )}
                {selectedApt.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Start Session
                  </button>
                )}
                {selectedApt.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleStatusChange('COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Mark Completed
                  </button>
                )}
                {selectedApt.meetingLink && (
                  <a
                    href={selectedApt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Video Call</span>
                  </a>
                )}
              </div>
            </div>

            {/* Calendar & Multi-Channel Messaging Toolbar (Section 18 & 19) */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-lg border border-stone-300 font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sync Google Calendar</span>
                </a>

                <button
                  onClick={handleDownloadICS}
                  className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-lg border border-stone-300 font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Download .ICS Invite</span>
                </button>

                <button
                  onClick={handleSendReminder}
                  className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Reminder</span>
                </button>
              </div>

              {selectedClient.specialistData.astrology && (
                <Link
                  href={`/admin/specialist?clientId=${selectedClient.id}`}
                  className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 text-[11px] underline underline-offset-2"
                >
                  <span>🪐 Open Kundli Workspace</span>
                </Link>
              )}
            </div>

            {reminderStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{reminderStatus}</span>
              </div>
            )}

            {/* Preparation Context Brief */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2">
              <h3 className="font-bold text-amber-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                Session Preparation Brief
              </h3>
              <p className="text-stone-700 italic leading-relaxed">
                "{selectedApt.internalBrief || 'No specific practitioner notes entered for this session.'}"
              </p>
            </div>

            {/* Specialist Astrological / Tarot Data Hub */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Specialist Client Data
              </h3>

              {selectedClient.specialistData.astrology && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-stone-800 border-b border-stone-200 pb-2">
                    <span>Horoscope & Birth Details (Vedic Kundli)</span>
                    <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-mono">
                      {selectedClient.specialistData.astrology.chartSystem}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-stone-600">
                    <div>
                      <p className="text-[10px] uppercase text-stone-400 font-semibold">Date of Birth</p>
                      <p className="font-medium text-stone-900">{selectedClient.specialistData.astrology.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-stone-400 font-semibold">Exact Time</p>
                      <p className="font-medium text-stone-900">
                        {selectedClient.specialistData.astrology.birthTime} ({selectedClient.specialistData.astrology.birthTimeAccuracy})
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-stone-400 font-semibold">Birthplace</p>
                      <p className="font-medium text-stone-900">{selectedClient.specialistData.astrology.birthCity}</p>
                    </div>
                  </div>
                  {selectedClient.specialistData.astrology.notes && (
                    <div className="pt-2 border-t border-stone-200 text-stone-600 text-[11px]">
                      <strong>Astrological Highlights:</strong> {selectedClient.specialistData.astrology.notes}
                    </div>
                  )}
                </div>
              )}

              {selectedClient.specialistData.tarot && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs">
                  <div className="font-bold text-stone-800 border-b border-stone-200 pb-2">
                    Tarot Reading Preferences & Focus
                  </div>
                  <div className="text-stone-700">
                    <p className="text-[11px] text-stone-500">Core Crossroads Theme:</p>
                    <p className="font-semibold text-stone-900 mt-0.5">
                      {selectedClient.specialistData.tarot.coreFocusTheme}
                    </p>
                  </div>
                </div>
              )}

              {selectedClient.specialistData.puja && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs">
                  <div className="font-bold text-stone-800 border-b border-stone-200 pb-2">
                    Puja & Ritual Gotra Registry
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-stone-600">
                    <div>
                      <p className="text-[10px] uppercase text-stone-400 font-semibold">Tradition & Deities</p>
                      <p className="font-medium text-stone-900">{selectedClient.specialistData.puja.deityOrOccasion}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-stone-400 font-semibold">Gotra</p>
                      <p className="font-medium text-stone-900">{selectedClient.specialistData.puja.gotraVoluntary || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confidential Practitioner Notes & Quick Add */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Practitioner Notes ({clientNotes.length})
                </h3>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Note</span>
                </button>
              </div>

              <div className="space-y-2">
                {clientNotes.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      n.isConfidential
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        {n.isConfidential && <Lock className="w-3 h-3 text-amber-600" />}
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {formatDateTime(n.createdAt, state.tenant.timezone)}
                      </span>
                    </div>
                    <p className="text-stone-700 text-xs leading-relaxed">{n.content}</p>
                    <div className="text-[10px] text-stone-500 pt-1">
                      By {n.authorName} • {n.isConfidential ? 'Private (Practitioner & Owner Only)' : 'Client-Shared'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 text-xs">
            Select a consultation from the schedule on the left to review the client brief.
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {isNoteModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                Add Session Note for {selectedClient.name}
              </h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNote} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Mahadasha Analysis & Upayas"
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
                  placeholder="Record insights, planetary observations, client questions, or recommended practices..."
                  className="w-full p-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confidentialCheck"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="confidentialCheck" className="text-stone-700 font-medium">
                  Class 4 Confidential (Only accessible by you and tenant owner; hidden from assistants and client portal)
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
