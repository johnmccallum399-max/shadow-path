import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get('tier');
  const hot = searchParams.get('hot') === '1';
  const status = searchParams.get('status') || 'new';

  const db = supabaseAdmin();
  let q = db.from('leads').select('*').order('created_at', { ascending: false }).limit(100);
  if (status !== 'all') q = q.eq('status', status);
  if (tier && tier !== 'all') q = q.eq('tier', tier);
  if (hot) q = q.gte('desperation_score', 60);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ leads: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = supabaseAdmin();
  const { data, error } = await db.from('leads').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lead: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const db = supabaseAdmin();
  const { data, error } = await db.from('leads').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lead: data });
}
