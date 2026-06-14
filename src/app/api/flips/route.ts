import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { pricing } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from('flips').select('*, repairs(*), lead:leads(*)').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ flips: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { lead_id, purchase_price, tier } = body;
  if (!purchase_price || !tier) {
    return NextResponse.json({ error: 'purchase_price and tier required' }, { status: 400 });
  }
  const p = pricing(purchase_price, tier);
  const db = supabaseAdmin();
  const { data, error } = await db.from('flips').insert({
    lead_id, purchase_price, tier,
    list_price: p.list, min_accept: p.min, floor_price: p.floor,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (lead_id) await db.from('leads').update({ status: 'bought' }).eq('id', lead_id);
  return NextResponse.json({ flip: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const db = supabaseAdmin();

  // Recompute pricing if repair_total or purchase_price changed
  if (updates.repair_total != null || updates.purchase_price != null) {
    const { data: current } = await db.from('flips').select('*').eq('id', id).single();
    if (current) {
      const totalIn = (updates.purchase_price ?? current.purchase_price) + (updates.repair_total ?? current.repair_total ?? 0);
      const p = pricing(totalIn, current.tier as 'green' | 'blue');
      updates.list_price = p.list;
      updates.min_accept = p.min;
      updates.floor_price = p.floor;
    }
  }

  // Compute ROI if sold
  if (updates.sold_price && updates.status === 'sold') {
    const { data: current } = await db.from('flips').select('*').eq('id', id).single();
    if (current) {
      const totalIn = current.purchase_price + (current.repair_total || 0);
      updates.net_profit = updates.sold_price - totalIn;
      updates.roi_pct = totalIn > 0 ? Math.round((updates.net_profit / totalIn) * 100) : 0;
      updates.sold_at = new Date().toISOString();
    }
  }

  const { data, error } = await db.from('flips').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ flip: data });
}
