import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { supabaseAdmin } from '@/lib/supabase';
import { killScreen, classifyTier } from '@/lib/killScreen';
import { desperationScore } from '@/lib/desperation';
import { offers } from '@/lib/offers';
import { extractPrice, extractYearMakeModel } from '@/lib/parse';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const parser = new Parser({ timeout: 15000 });

export async function GET(request: Request) {
  // Vercel cron auth
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { data: searches, error } = await db
    .from('saved_searches')
    .select('*')
    .eq('active', true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = { polled: 0, new_leads: 0, hot: 0, errors: [] as string[] };

  for (const s of searches || []) {
    results.polled++;
    try {
      const feed = await parser.parseURL(s.feed_url);
      const seen = new Set<string>(s.last_seen_ids || []);
      const newIds: string[] = [];

      for (const item of feed.items.slice(0, 25)) {
        const externalId = item.guid || item.link || '';
        if (!externalId || seen.has(externalId)) continue;
        newIds.push(externalId);

        const title = item.title || '';
        const desc = (item.contentSnippet || item.content || '') as string;
        const price = extractPrice(title) ?? extractPrice(desc);
        const ymm = extractYearMakeModel(title);
        const tierGuess = s.tier === 'all' ? classifyTier(price) : s.tier;

        const kill = killScreen({
          title_text: title,
          description: desc,
          tier: tierGuess,
          price_listed: price,
          distance_miles: null,
        });

        const desp = desperationScore({
          title_text: title,
          description: desc,
          listing_age_days: 0,
          price_drop_count: 0,
        });

        const off = (tierGuess === 'green' || tierGuess === 'blue') && price
          ? offers(price, tierGuess as 'green' | 'blue')
          : { first: 0, ceiling: 0 };

        const { error: insErr } = await db.from('leads').insert({
          source: 'craigslist',
          source_url: item.link,
          source_external_id: externalId,
          market: s.market,
          tier: tierGuess === 'reject' ? null : tierGuess,
          title_text: title,
          description: desc,
          price_listed: price,
          vehicle_year: ymm.year,
          vehicle_make: ymm.make,
          vehicle_model: ymm.model,
          kill_screen_passed: kill.passed,
          kill_screen_fails: kill.fails,
          desperation_score: desp,
          first_offer: off.first || null,
          ceiling: off.ceiling || null,
          status: kill.passed ? 'new' : 'dead',
        });

        if (!insErr) {
          results.new_leads++;
          if (kill.passed) results.hot++;
        }
      }

      // Update last_seen_ids (keep last 200)
      const merged = [...newIds, ...(s.last_seen_ids || [])].slice(0, 200);
      await db.from('saved_searches')
        .update({ last_seen_ids: merged, last_polled_at: new Date().toISOString() })
        .eq('id', s.id);

    } catch (e: any) {
      results.errors.push(`${s.label}: ${e.message}`);
    }
  }

  return NextResponse.json(results);
}
