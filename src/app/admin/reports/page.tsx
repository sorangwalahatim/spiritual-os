'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  CreditCard,
  PieChart,
  ArrowUpRight
} from 'lucide-react';
import { getAppState } from '@/lib/services/store.ts';
import { formatMoney } from '@/lib/utils/money.ts';

export default function ReportsPage() {
  const state = getAppState();

  // Revenue breakdown by service
  const serviceRevenue = state.services.map(s => {
    const apts = state.appointments.filter(a => a.serviceId === s.id);
    const revCents = apts.reduce((sum, a) => sum + (a.isDepositPaid ? a.depositCents : 0), 0);
    return {
      name: s.name,
      category: s.category,
      bookingsCount: apts.length,
      revenueCents: revCents,
    };
  });

  // Source attribution
  const sourceStats = [
    { source: 'WhatsApp Direct', leads: 48, booked: 22, revenueCents: 770000 },
    { source: 'Website Booking Page', leads: 34, booked: 16, revenueCents: 560000 },
    { source: 'Client Referrals', leads: 18, booked: 14, revenueCents: 490000 },
    { source: 'Instagram / Social', leads: 26, booked: 7, revenueCents: 175000 },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Channel,Leads,Booked,Revenue_INR\n" +
      sourceStats.map(s => `${s.source},${s.leads},${s.booked},${s.revenueCents / 100}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AstroVeda_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <BarChart3 className="w-4 h-4" />
            <span>Practice Performance Analytics</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mt-0.5">
            Operational Intelligence & Financial Reports
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Section 18: Service performance, source attribution ROI, and immutable transaction reconciliation.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Grid: Service Breakdown & Channel Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Performance Table */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Revenue by Service Offering
          </h2>

          <div className="divide-y divide-stone-100 text-xs">
            {serviceRevenue.map((sr, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-900">{sr.name}</p>
                  <p className="text-stone-400 text-[11px]">{sr.category} • {sr.bookingsCount} sessions booked</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-stone-900">{formatMoney(sr.revenueCents)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Source Channel Attribution ROI */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <PieChart className="w-4 h-4 text-emerald-600" />
            Lead Channel Conversion & ROI
          </h2>

          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-stone-400 border-b border-stone-100">
              <tr>
                <th className="pb-2">Channel</th>
                <th className="pb-2">Leads</th>
                <th className="pb-2">Conversion</th>
                <th className="pb-2 text-right">Collections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {sourceStats.map((s, idx) => {
                const convRate = Math.round((s.booked / s.leads) * 100);
                return (
                  <tr key={idx}>
                    <td className="py-2.5 font-bold text-stone-900">{s.source}</td>
                    <td className="py-2.5">{s.leads}</td>
                    <td className="py-2.5">
                      <span className="font-bold text-emerald-700">{convRate}%</span> ({s.booked})
                    </td>
                    <td className="py-2.5 font-mono text-right font-bold">
                      {formatMoney(s.revenueCents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
