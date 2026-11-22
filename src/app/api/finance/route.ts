import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getAppState, recordPayment } from '@/lib/services/store';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ledger_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({
        success: true,
        count: data.length,
        data: data.map((d: any) => ({
          id: d.id,
          tenantId: d.tenant_id,
          entryType: d.entry_type,
          accountCode: d.account_code,
          amountCents: Number(d.amount_cents || 0),
          currency: d.currency,
          referenceType: d.reference_type,
          referenceId: d.reference_id,
          description: d.description,
          createdAt: d.created_at,
        })),
      });
    }
  } catch (err) {
    console.warn('Supabase ledger fetch fallback:', err);
  }

  const localLedger = getAppState().ledger;
  return NextResponse.json({ success: true, count: localLedger.length, data: localLedger });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = recordPayment({
      clientId: body.clientId,
      clientName: body.clientName,
      amountCents: body.amountCents,
      currency: body.currency || 'INR',
      paymentMethod: body.paymentMethod || 'MANUAL_UPI',
      referenceId: body.referenceId || `PAY-${Date.now()}`,
      description: body.description || 'Consultation fee collected',
      appointmentId: body.appointmentId,
      invoiceId: body.invoiceId,
    });

    // Mirror to Supabase if accessible
    try {
      await supabase.from('ledger_entries').insert({
        id: entry.id,
        tenant_id: entry.tenantId,
        entry_type: entry.entryType,
        account_code: entry.accountCode,
        amount_cents: entry.amountCents,
        currency: entry.currency,
        reference_type: entry.referenceType,
        reference_id: entry.referenceId,
        description: entry.description,
      });
    } catch (dbErr) {
      console.warn('Database ledger insert fallback:', dbErr);
    }

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
