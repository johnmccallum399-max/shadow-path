# 🌑 Shadow Path — Iron Core Operations

Autonomous flip system. RSS-driven lead capture, kill-screen filtering, scripted negotiation, $3-rule repair engine, platform-arbitrage listing.

## Stack
- Next.js 14 (App Router) + TailwindCSS
- Supabase (Postgres + Auth)
- Vercel (hosting + cron)
- Twilio (SMS notifications)
- Web Push API

## Setup
1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in
3. `npm run dev`

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
CRON_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
NEXT_PUBLIC_APP_URL=
```

## Cron
Vercel runs `/api/cron/poll-rss` every 10 minutes.

## Forged by The Architect.
