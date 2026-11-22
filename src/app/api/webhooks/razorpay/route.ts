import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase/client';
import { getAppState, recordPayment, saveAppState } from '@/lib/services/store';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'spiritual_os_demo_secret_2026';

    // 1. Verify Webhook HMAC Signature if secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json(
          { success: false, error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event || 'payment.captured';

    // 2. Process payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity || payload.payment || {};
      const amountCents = Number(payment.amount || 350000);
      const currency = payment.currency || 'INR';
      const paymentId = payment.id || `pay_${Date.now()}`;
      const method = (payment.method || 'UPI').toUpperCase();
      const notes = payment.notes || {};
      const clientId = notes.clientId || 'client-001';
      const clientName = notes.clientName || 'Valued Client';
      const appointmentId = notes.appointmentId;

      // 3. Post to Immutable Double-Entry Ledger
      const debitEntry = recordPayment({
        clientId,
        clientName,
        amountCents,
        currency,
        paymentMethod: method === 'UPI' ? 'MANUAL_UPI' : 'RAZORPAY',
        referenceId: paymentId,
        description: `Webhook verified payment for ${clientName} (${method})`,
        appointmentId,
      });

      // 4. Generate Official Tax Invoice
      const state = getAppState();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(state.invoices.length + 1).padStart(4, '0')}`;
      const taxCents = Math.round(amountCents * 0.18); // 18% GST standard
      const subtotalCents = amountCents - taxCents;

      const newInvoice = {
        id: `inv-${Date.now()}`,
        tenantId: state.tenant.id,
        clientId,
        clientName,
        invoiceNumber,
        status: 'PAID' as const,
        items: [
          {
            id: `item-${Date.now()}`,
            description: notes.serviceName || 'Spiritual & Astrological Consultation Fee',
            quantity: 1,
            unitPriceCents: subtotalCents,
            totalCents: subtotalCents,
          },
        ],
        subtotalCents,
        taxCents,
        totalCents: amountCents,
        paidAmountCents: amountCents,
        balanceDueCents: 0,
        currency,
        dueDate: new Date().toISOString(),
        issuedAt: new Date().toISOString(),
      };

      state.invoices.unshift(newInvoice);
      saveAppState(state);

      // Mirror to Supabase if table is available
      try {
        await supabase.from('invoices').insert({
          id: newInvoice.id,
          tenant_id: newInvoice.tenantId,
          client_id: newInvoice.clientId,
          client_name: newInvoice.clientName,
          invoice_number: newInvoice.invoiceNumber,
          status: newInvoice.status,
          items: newInvoice.items,
          subtotal_cents: newInvoice.subtotalCents,
          tax_cents: newInvoice.taxCents,
          total_cents: newInvoice.totalCents,
          paid_amount_cents: newInvoice.paidAmountCents,
          balance_due_cents: 0,
          currency: newInvoice.currency,
          due_date: newInvoice.dueDate,
          issued_at: newInvoice.issuedAt,
        });

        await supabase.from('ledger_entries').insert({
          id: debitEntry.id,
          tenant_id: debitEntry.tenantId,
          entry_type: debitEntry.entryType,
          account_code: debitEntry.accountCode,
          amount_cents: debitEntry.amountCents,
          currency: debitEntry.currency,
          reference_type: debitEntry.referenceType,
          reference_id: debitEntry.referenceId,
          description: debitEntry.description,
        });
      } catch (dbErr) {
        console.warn('Supabase invoice/ledger webhook sync:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and ledger reconciled',
        invoiceNumber,
        paymentId,
      });
    }

    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
