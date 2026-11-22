'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  X
} from 'lucide-react';
import { getAppState, bookAppointment, updateAppointmentStatus } from '@/lib/services/store';
import { formatTimeOnly, formatDateTime, formatDateOnly } from '@/lib/utils/date';
import { formatMoney } from '@/lib/utils/money';

export default function CalendarPage() {
  const state = getAppState();
  const [selectedPractitioner, setSelectedPractitioner] = useState('ALL');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New appointment form states
  const [clientId, setClientId] = useState(state.clients[0]?.id || '');
  const [serviceId, setServiceId] = useState(state.services[0]?.id || '');
  const [practitionerId, setPractitionerId] = useState(state.users[0]?.id || '');
  const [date, setDate] = useState('2026-11-19');
  const [time, setTime] = useState('15:00');

  const filteredAppointments = state.appointments.filter(a => {
    return selectedPractitioner === 'ALL' || a.practitionerId === selectedPractitioner;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const client = state.clients.find(c => c.id === clientId);
    const service = state.services.find(s => s.id === serviceId);
    const practitioner = state.users.find(u => u.id === practitionerId);
    if (!client || !service || !practitioner) return;

    const startUtc = new Date(`${date}T${time}:00Z`).toISOString();
    const endUtc = new Date(new Date(startUtc).getTime() + service.durationMinutes * 60000).toISOString();

    bookAppointment({
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      practitionerId: practitioner.id,
      practitionerName: practitioner.name,
      serviceId: service.id,
      serviceName: service.name,
      startTimeUtc: startUtc,
      endTimeUtc: endUtc,
      deliveryMode: service.deliveryMode,
      totalPriceCents: service.priceCents,
      depositCents: service.depositRequiredCents,
      isDepositPaid: true, // Mark confirmed in admin booking
    });

    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <CalendarIcon className="w-4 h-4" />
            <span>Scheduling & Resource Engine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Appointment Calendar
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Timezone-aware scheduling with automated buffer time protection and video room provisioning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPractitioner}
            onChange={(e) => setSelectedPractitioner(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-700 text-xs focus:outline-none"
          >
            <option value="ALL">All Practitioners</option>
            {state.users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointment Cards Stream */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-700">
          <span>Scheduled Consultations ({filteredAppointments.length})</span>
          <span className="text-stone-500 text-[11px]">Timezone: {state.tenant.timezone} (IST)</span>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="p-5 hover:bg-stone-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="text-center px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 min-w-[70px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {new Date(apt.startTimeUtc).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short' })}
                  </p>
                  <p className="text-lg font-bold">
                    {new Date(apt.startTimeUtc).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] font-semibold text-stone-500">
                    {formatTimeOnly(apt.startTimeUtc, state.tenant.timezone)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-sm">{apt.serviceName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                      apt.status === 'COMPLETED' ? 'bg-stone-200 text-stone-700' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Client: <strong className="text-stone-800">{apt.clientName}</strong> ({apt.clientPhone})
                  </p>
                  <p className="text-xs text-stone-500">
                    Practitioner: <strong>{apt.practitionerName}</strong> • Mode: {apt.deliveryMode.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="text-right text-xs">
                  <p className="font-mono font-bold text-stone-900">{formatMoney(apt.totalPriceCents)}</p>
                  <p className="text-[11px] text-emerald-600 font-medium">
                    {apt.isFullyPaid ? 'Paid in Full' : 'Deposit Paid'}
                  </p>
                </div>

                {apt.meetingLink && (
                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join</span>
                  </a>
                )}

                <Link
                  href={`/admin/clients/${apt.clientId}`}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium"
                >
                  360
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-600" />
                Schedule Consultation
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleBook} className="space-y-4 mt-4 text-xs">
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

              <div>
                <label className="block font-medium text-stone-700 mb-1">Select Service *</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  {state.services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes}m - {formatMoney(s.priceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Assigned Practitioner *</label>
                <select
                  value={practitionerId}
                  onChange={(e) => setPractitionerId(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  {state.users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.title || u.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Time (IST) *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
