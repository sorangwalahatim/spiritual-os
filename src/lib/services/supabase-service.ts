import { supabase } from '../supabase/client';
import { getAppState, saveAppState } from './store';
import type { Lead, Client, Appointment, Service, LedgerEntry } from '../types/domain';

/**
 * Supabase Data Access Layer with Zero-Friction Fallback
 * Seamlessly interfaces with Supabase PostgreSQL tables,
 * falling back gracefully to local store if tables are pending migration.
 */

// LEADS
export async function getLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        tenantId: item.tenant_id,
        contactId: item.contact_id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        source: item.source,
        serviceInterestId: item.service_interest_id,
        stage: item.stage,
        urgency: item.urgency,
        intentMessage: item.intent_message,
        assignedUserId: item.assigned_user_id,
        estimatedValueCents: Number(item.estimated_value_cents || 0),
        lostReason: item.lost_reason,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }
  } catch (err) {
    console.warn('Supabase query failed, using local store:', err);
  }
  return getAppState().leads;
}

export async function insertLead(lead: Partial<Lead>): Promise<Lead> {
  const newLead: Lead = {
    id: lead.id || `lead-${Date.now()}`,
    tenantId: lead.tenantId || 'tenant-001',
    contactId: lead.contactId || `contact-${Date.now()}`,
    name: lead.name || 'Anonymous Lead',
    email: lead.email || '',
    phone: lead.phone || '',
    source: lead.source || 'WEBSITE',
    serviceInterestId: lead.serviceInterestId,
    stage: lead.stage || 'NEW',
    urgency: lead.urgency || 'MEDIUM',
    intentMessage: lead.intentMessage || '',
    estimatedValueCents: lead.estimatedValueCents || 350000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from('leads').insert({
      id: newLead.id,
      tenant_id: newLead.tenantId,
      contact_id: newLead.contactId,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      source: newLead.source,
      service_interest_id: newLead.serviceInterestId,
      stage: newLead.stage,
      urgency: newLead.urgency,
      intent_message: newLead.intentMessage,
      estimated_value_cents: newLead.estimatedValueCents,
    }).select().single();

    if (!error && data) {
      // Also sync to local store
      const state = getAppState();
      saveAppState({ ...state, leads: [newLead, ...state.leads] });
      return newLead;
    }
  } catch (err) {
    console.warn('Supabase insert failed, persisting to local store:', err);
  }

  // Fallback to local store
  const state = getAppState();
  saveAppState({ ...state, leads: [newLead, ...state.leads] });
  return newLead;
}

// APPOINTMENTS
export async function getAppointments(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('start_time_utc', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        tenantId: item.tenant_id,
        clientId: item.client_id,
        clientName: item.client_name,
        clientEmail: item.client_email,
        clientPhone: item.client_phone,
        practitionerId: item.practitioner_id,
        practitionerName: item.practitioner_name,
        serviceId: item.service_id,
        serviceName: item.service_name,
        startTimeUtc: item.start_time_utc,
        endTimeUtc: item.end_time_utc,
        status: item.status,
        deliveryMode: item.delivery_mode,
        meetingLink: item.meeting_link,
        locationAddress: item.location_address,
        intakeResponses: item.intake_responses,
        internalBrief: item.internal_brief,
        totalPriceCents: Number(item.total_price_cents || 0),
        depositCents: Number(item.deposit_cents || 0),
        isDepositPaid: Boolean(item.is_deposit_paid),
        isFullyPaid: Boolean(item.is_fully_paid),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }
  } catch (err) {
    console.warn('Supabase appointments query failed, using local store:', err);
  }
  return getAppState().appointments;
}

export async function insertAppointment(appt: Partial<Appointment>): Promise<Appointment> {
  const newAppt: Appointment = {
    id: appt.id || `appt-${Date.now()}`,
    tenantId: appt.tenantId || 'tenant-001',
    clientId: appt.clientId || `client-${Date.now()}`,
    clientName: appt.clientName || 'Valued Client',
    clientEmail: appt.clientEmail || '',
    clientPhone: appt.clientPhone || '',
    practitionerId: appt.practitionerId || 'user-001',
    practitionerName: appt.practitionerName || 'Acharya Raghavendra Sharma',
    serviceId: appt.serviceId || 'srv-001',
    serviceName: appt.serviceName || 'Vedic Kundli & Dasha Consultation',
    startTimeUtc: appt.startTimeUtc || new Date().toISOString(),
    endTimeUtc: appt.endTimeUtc || new Date(Date.now() + 3600000).toISOString(),
    status: appt.status || 'CONFIRMED',
    deliveryMode: appt.deliveryMode || 'ONLINE_VIDEO',
    meetingLink: appt.meetingLink || 'https://meet.google.com/xyz-veda-demo',
    totalPriceCents: appt.totalPriceCents || 350000,
    depositCents: appt.depositCents || 100000,
    isDepositPaid: true,
    isFullyPaid: appt.isFullyPaid || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from('appointments').insert({
      id: newAppt.id,
      tenant_id: newAppt.tenantId,
      client_id: newAppt.clientId,
      client_name: newAppt.clientName,
      client_email: newAppt.clientEmail,
      client_phone: newAppt.clientPhone,
      practitioner_id: newAppt.practitionerId,
      practitioner_name: newAppt.practitionerName,
      service_id: newAppt.serviceId,
      service_name: newAppt.serviceName,
      start_time_utc: newAppt.startTimeUtc,
      end_time_utc: newAppt.endTimeUtc,
      status: newAppt.status,
      delivery_mode: newAppt.deliveryMode,
      meeting_link: newAppt.meetingLink,
      total_price_cents: newAppt.totalPriceCents,
      deposit_cents: newAppt.depositCents,
      is_deposit_paid: newAppt.isDepositPaid,
      is_fully_paid: newAppt.isFullyPaid,
    }).select().single();

    if (!error && data) {
      const state = getAppState();
      saveAppState({ ...state, appointments: [newAppt, ...state.appointments] });
      return newAppt;
    }
  } catch (err) {
    console.warn('Supabase appt insert failed, falling back:', err);
  }

  const state = getAppState();
  saveAppState({ ...state, appointments: [newAppt, ...state.appointments] });
  return newAppt;
}

// CLIENTS
export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        tenantId: item.tenant_id,
        contactId: item.contact_id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        status: item.status,
        preferredLanguage: item.preferred_language,
        preferredChannel: item.preferred_channel,
        tags: item.tags || [],
        specialistData: item.specialist_data || {},
        lifetimeValueCents: Number(item.lifetime_value_cents || 0),
        outstandingBalanceCents: Number(item.outstanding_balance_cents || 0),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }
  } catch (err) {
    console.warn('Supabase clients query fallback:', err);
  }
  return getAppState().clients;
}
