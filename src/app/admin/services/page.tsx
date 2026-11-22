'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Video, 
  MapPin, 
  CreditCard, 
  FileText, 
  Plus,
  CheckCircle,
  X
} from 'lucide-react';
import { getAppState } from '@/lib/services/store';
import { formatMoney } from '@/lib/utils/money';

export default function ServicesPage() {
  const state = getAppState();
  const [selectedService, setSelectedService] = useState(state.services[0]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Sparkles className="w-4 h-4" />
            <span>Offerings & Packages</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Service Catalogue & Intake Form Config
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure consultation modalities, durations, buffer times, and service-specific intake questionnaire schemas.
          </p>
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-medium">
            {state.services.length} Active Services
          </span>
        </div>
      </div>

      {/* Grid: Services List and Schema Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {state.services.map((srv) => {
            const isSelected = selectedService.id === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className={`p-5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-50/50 border-amber-500 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1">{srv.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-base font-bold text-stone-900">{formatMoney(srv.priceCents)}</p>
                    <p className="text-[10px] text-stone-400">Deposit: {formatMoney(srv.depositRequiredCents)}</p>
                  </div>
                </div>

                <p className="text-stone-600 mb-3 leading-relaxed">{srv.shortDescription}</p>

                <div className="flex flex-wrap items-center gap-4 text-stone-500 pt-3 border-t border-stone-100">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {srv.durationMinutes} mins (+{srv.bufferBeforeMinutes}/{srv.bufferAfterMinutes}m buffer)
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    {srv.deliveryMode === 'ONLINE_VIDEO' ? (
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {srv.deliveryMode.replace('_', ' ')}
                  </span>
                  {srv.requiresIntake && (
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      Intake Form Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Intake Schema Viewer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-5">
          <div className="pb-3 border-b border-stone-100">
            <span className="text-[10px] uppercase font-bold text-amber-700">Service Schema Inspector</span>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">{selectedService.name}</h2>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-stone-600 leading-relaxed">{selectedService.fullDescription}</p>

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Duration:</span>
                <span className="font-semibold text-stone-900">{selectedService.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Buffer Time (Before / After):</span>
                <span className="font-semibold text-stone-900">
                  {selectedService.bufferBeforeMinutes}m / {selectedService.bufferAfterMinutes}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Standard Price:</span>
                <span className="font-mono font-bold text-stone-900">{formatMoney(selectedService.priceCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Required Booking Deposit:</span>
                <span className="font-mono font-bold text-amber-700">{formatMoney(selectedService.depositRequiredCents)}</span>
              </div>
            </div>

            {/* Intake Schema Fields */}
            {selectedService.intakeSchema && (
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Intake Questionnaire Fields
                </h4>
                <div className="space-y-2">
                  {selectedService.intakeSchema.fields.map(field => (
                    <div key={field.id} className="p-2.5 bg-stone-50 rounded border border-stone-200/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800">{field.label}</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                          field.required ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {field.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-stone-500 font-mono text-[10px]">Type: {field.type}</p>
                      {field.options && (
                        <p className="text-stone-400 text-[10px]">Options: {field.options.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
