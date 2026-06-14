import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { approveRepair } from '@/lib/repairs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json();
  const { flip_id, type, cost, value_add_est } = body;
  const approved = approveRepair(cost || 0, value_add_est || 0);
  const db = supabaseAdmin();
  const { data, error } = await db.from('repairs').insert({
    flip_id, type, cost, value_add_est, approved,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Recompute flip repair_total
  const { data: allRepairs } = await db.from('repairs').select('cost,completed').eq('flip_id', flip_id);
  const total = (allRepairs || []).filter(r => r.completed).reduce((sum, r) => sum + (r.cost || 0), 0);
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/flips`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: flip_id, repair_total: total }),
  }).catch(() => {});

  return NextResponse.json({ repair: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const db = supabaseAdmin();
  const { data, error } = await db.from('repairs').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ repair: data });
}
