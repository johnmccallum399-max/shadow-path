import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const sub = await req.json();
  const db = supabaseAdmin();
  await db.from('push_subscriptions').upsert({
    endpoint: sub.endpoint,
    p256dh: sub.keys?.p256dh,
    auth: sub.keys?.auth,
  }, { onConflict: 'endpoint' });
  return NextResponse.json({ ok: true });
}
