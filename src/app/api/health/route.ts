import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase.from('tenants').select('id, name, slug').limit(1);

    if (error) {
      return NextResponse.json({
        status: 'pending_schema',
        message: 'Connected to Supabase, but schema tables are not yet created. Please run supabase/schema.sql in your Supabase SQL editor.',
        error: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      }, { status: 200 });
    }

    return NextResponse.json({
      status: 'connected',
      message: 'Supabase PostgreSQL database is fully connected and operational!',
      data,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: err?.message || 'Failed to connect to Supabase',
    }, { status: 500 });
  }
}
