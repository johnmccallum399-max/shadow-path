import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const db = supabaseAdmin();
  const { data } = await db.from('scouts').select('*').order('leads_provided', { ascending: false });
  return NextResponse.json({ scouts: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = supabaseAdmin();
  const { data, error } = await db.from('scouts').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scout: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const db = supabaseAdmin();
  const { data, error } = await db.from('scouts').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scout: data });
}
