import { NextResponse } from 'next/server';
import { getLeads, insertLead } from '@/lib/services/supabase-service';

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({ success: true, count: leads.length, data: leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await insertLead(body);
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
