import { NextResponse } from 'next/server';
import { getAppState } from '@/lib/services/store';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return NextResponse.json({ success: true, invoice: data });
    }
  } catch (err) {
    console.warn('Supabase invoice lookup fallback:', err);
  }

  // Fallback to local store
  const state = getAppState();
  const invoice = state.invoices.find(i => i.id === id || i.invoiceNumber === id) || state.invoices[0];

  if (!invoice) {
    return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, invoice });
}
