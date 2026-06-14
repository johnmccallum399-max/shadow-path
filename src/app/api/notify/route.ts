import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:gypsy.here2help@gmail.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }
  const { title, body, url, sms_to } = await req.json();
  const db = supabaseAdmin();
  const { data: subs } = await db.from('push_subscriptions').select('*');
  const payload = JSON.stringify({ title, body, url });

  const results: any[] = [];
  for (const s of subs || []) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload,
      );
      results.push({ endpoint: s.endpoint, ok: true });
    } catch (e: any) {
      results.push({ endpoint: s.endpoint, ok: false, error: e.message });
    }
  }

  // Optional SMS via Twilio
  if (sms_to && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) {
    try {
      const twilio = (await import('twilio')).default(
        process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN
      );
      await twilio.messages.create({
        from: process.env.TWILIO_FROM,
        to: sms_to,
        body: `${title}\n${body}\n${url || ''}`.trim(),
      });
      results.push({ sms: true });
    } catch (e: any) {
      results.push({ sms: false, error: e.message });
    }
  }

  return NextResponse.json({ results });
}
