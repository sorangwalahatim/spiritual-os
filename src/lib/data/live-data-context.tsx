'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getAppState, saveAppState, addLead, updateLeadStage, convertLeadToClient, bookAppointment, recordPayment } from '@/lib/services/store';
import type { Lead, Appointment, Client, LedgerEntry } from '@/lib/types/domain';
import { Bell, CheckCircle2, Sparkles, X } from 'lucide-react';

export interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'lead' | 'payment' | 'message';
  timestamp: string;
}

export interface LiveDataContextType {
  leads: Lead[];
  appointments: Appointment[];
  clients: Client[];
  ledger: LedgerEntry[];
  isConnected: boolean;
  isRealtimeActive: boolean;
  notifications: LiveNotification[];
  dismissNotification: (id: string) => void;
  refreshData: () => Promise<void>;
  createLeadLive: (data: Partial<Lead>) => Promise<Lead>;
  updateLeadStageLive: (leadId: string, stage: Lead['stage']) => Promise<void>;
  convertLeadLive: (leadId: string) => Promise<Client | null>;
  bookAppointmentLive: (data: any) => Promise<Appointment>;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined);

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  const addNotification = useCallback((notification: Omit<LiveNotification, 'id' | 'timestamp'>) => {
    const newNotif: LiveNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...notification,
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]); // Keep max 5

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 6000);
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Sync initial state from local state machine and background Supabase
  const refreshData = useCallback(async () => {
    const local = getAppState();
    setLeads(local.leads);
    setAppointments(local.appointments);
    setClients(local.clients);
    setLedger(local.ledger);

    // Try hydrating from server APIs
    try {
      const [leadsRes, apptsRes] = await Promise.all([
        fetch('/api/leads').then(r => r.ok ? r.json() : null),
        fetch('/api/appointments').then(r => r.ok ? r.json() : null),
      ]);

      if (leadsRes?.data && leadsRes.data.length > 0) {
        setLeads(leadsRes.data);
      }
      if (apptsRes?.data && apptsRes.data.length > 0) {
        setAppointments(apptsRes.data);
      }
    } catch (e) {
      // Seamlessly continues using local store
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Listen to local state updates across components
    const handleLocalUpdate = () => {
      const state = getAppState();
      setLeads(state.leads);
      setAppointments(state.appointments);
      setClients(state.clients);
      setLedger(state.ledger);
    };
    window.addEventListener('app_state_updated', handleLocalUpdate);

    // Cross-tab / cross-window BroadcastChannel for instant multi-device demo sync
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('spiritual_practice_os_realtime');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        refreshData();
        if (type === 'NEW_BOOKING') {
          addNotification({
            title: 'New Appointment Booked',
            message: `${payload.clientName} booked ${payload.serviceName}`,
            type: 'booking',
          });
        } else if (type === 'NEW_LEAD') {
          addNotification({
            title: 'New Lead Captured',
            message: `${payload.name} via ${payload.source}`,
            type: 'lead',
          });
        }
      };
    } catch (e) {
      // Fallback for older browsers
    }

    // Connect to Supabase Realtime WebSockets if configured
    let supabaseChannel: any = null;
    try {
      supabaseChannel = supabase
        .channel('public:realtime:all')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
          refreshData();
          if (payload.eventType === 'INSERT') {
            addNotification({
              title: 'Live Realtime Booking',
              message: `New booking: ${(payload.new as any).client_name || 'Client'}`,
              type: 'booking',
            });
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
          refreshData();
          if (payload.eventType === 'INSERT') {
            addNotification({
              title: 'Live Realtime Lead',
              message: `Inquiry from: ${(payload.new as any).name || 'Prospect'}`,
              type: 'lead',
            });
          }
        })
        .subscribe((status) => {
          setIsRealtimeActive(status === 'SUBSCRIBED');
        });
    } catch (e) {
      console.warn('Supabase realtime subscription note:', e);
    }

    return () => {
      window.removeEventListener('app_state_updated', handleLocalUpdate);
      if (channel) channel.close();
      if (supabaseChannel) supabase.removeChannel(supabaseChannel);
    };
  }, [refreshData, addNotification]);

  // Unified Live Mutators
  const createLeadLive = async (data: Partial<Lead>): Promise<Lead> => {
    const newLead = addLead({
      contactId: data.contactId || `contact-${Date.now()}`,
      name: data.name || 'Anonymous Lead',
      email: data.email || '',
      phone: data.phone || '',
      source: data.source || 'WEBSITE',
      stage: 'NEW',
      urgency: data.urgency || 'MEDIUM',
      intentMessage: data.intentMessage || '',
      estimatedValueCents: data.estimatedValueCents || 350000,
    });

    // Notify other tabs/windows
    try {
      const bc = new BroadcastChannel('spiritual_practice_os_realtime');
      bc.postMessage({ type: 'NEW_LEAD', payload: newLead });
      bc.close();
    } catch (e) {}

    // Post to server API
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    }).catch(() => {});

    refreshData();
    return newLead;
  };

  const updateLeadStageLive = async (leadId: string, stage: Lead['stage']) => {
    updateLeadStage(leadId, stage);
    refreshData();
  };

  const convertLeadLive = async (leadId: string): Promise<Client | null> => {
    const client = convertLeadToClient(leadId);
    refreshData();
    return client;
  };

  const bookAppointmentLive = async (data: any): Promise<Appointment> => {
    const apt = bookAppointment(data);

    // Notify other tabs/windows
    try {
      const bc = new BroadcastChannel('spiritual_practice_os_realtime');
      bc.postMessage({ type: 'NEW_BOOKING', payload: apt });
      bc.close();
    } catch (e) {}

    // Post to server API
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt),
    }).catch(() => {});

    refreshData();
    return apt;
  };

  return (
    <LiveDataContext.Provider
      value={{
        leads,
        appointments,
        clients,
        ledger,
        isConnected,
        isRealtimeActive,
        notifications,
        dismissNotification,
        refreshData,
        createLeadLive,
        updateLeadStageLive,
        convertLeadLive,
        bookAppointmentLive,
      }}
    >
      {children}

      {/* Floating Realtime Live Toast Stack */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="pointer-events-auto p-4 bg-stone-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-amber-500/40 flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-amber-300">{notif.title}</p>
                  <span className="text-[10px] text-stone-400 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-stone-200 leading-snug">{notif.message}</p>
              </div>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-stone-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </LiveDataContext.Provider>
  );
}

export function useLiveData(): LiveDataContextType {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
}
