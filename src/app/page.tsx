'use client';
import { useEffect, useState } from 'react';

interface Lead {
  id: string; title_text: string; price_listed: number; tier: string;
  market: string; first_offer: number; ceiling: number;
  kill_screen_passed: boolean; kill_screen_fails: string[];
  desperation_score: number; source_url: string;
  vehicle_year: number; vehicle_make: string; vehicle_model: string;
  created_at: string; status: string;
}

export default function AlertFeed() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<'all'|'green'|'blue'|'hot'>('all');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter === 'green' || filter === 'blue') params.set('tier', filter);
    if (filter === 'hot') params.set('hot', '1');
    const r = await fetch(`/api/leads?${params}`);
    const d = await r.json();
    setLeads(d.leads || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [filter]);

  async function triggerPoll() {
    await fetch('/api/cron/poll-rss');
    load();
  }
  async function kill(id: string) {
    await fetch('/api/leads', { method: 'PATCH', headers: {'content-type':'application/json'}, body: JSON.stringify({ id, status: 'dead' })});
    load();
  }
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    alert('Copied. Send it.');
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all','green','blue','hot'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full border ${
              filter === f ? 'btn-hazard border-[#f5c518]' : 'panel-hi border-[#2a2c33] text-[#8a8d96]'
            }`}>{f === 'hot' ? '🔥 Hot' : f}</button>
        ))}
        <button onClick={triggerPoll} className="ml-auto px-3 py-1.5 text-xs panel-hi">↻ Poll</button>
      </div>

      {loading && <p className="text-sm text-[#8a8d96]">Loading…</p>}
      {!loading && leads.length === 0 && (
        <div className="panel p-6 text-center">
          <p className="text-[#8a8d96] text-sm">No leads yet. Tap ↻ Poll to fetch from RSS feeds.</p>
        </div>
      )}

      {leads.map(l => {
        const tierTag = l.tier === 'green' ? 'tag-green' : l.tier === 'blue' ? 'tag-blue' : 'tag-dead';
        const isHot = (l.desperation_score || 0) >= 60;
        return (
          <div key={l.id} className="panel p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded ${tierTag} uppercase`}>{l.tier || 'reject'}</span>
                {l.kill_screen_passed
                  ? <span className="text-[10px] px-2 py-0.5 rounded tag-green">✓ PASSED</span>
                  : <span className="text-[10px] px-2 py-0.5 rounded tag-dead">✗ {l.kill_screen_fails?.[0] || 'DEAD'}</span>}
                {isHot && <span className="text-[10px] px-2 py-0.5 rounded tag-hot">🔥 {l.desperation_score}</span>}
              </div>
              <span className="text-xs text-[#8a8d96]">{l.market}</span>
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight line-clamp-2">{l.title_text}</div>
              <div className="text-[11px] text-[#8a8d96]">{l.vehicle_year} {l.vehicle_make} {l.vehicle_model}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">LISTED</div><div className="font-bold">${l.price_listed || '—'}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">FIRST OFFER</div><div className="font-bold hazard">${l.first_offer || '—'}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">CEILING</div><div className="font-bold">${l.ceiling || '—'}</div></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {l.kill_screen_passed ? (
                <button onClick={() => copy(`Hi - is this still available? Clean title in hand? Runs and drives? Cash buyer, can pick up today.`)}
                  className="btn-hazard py-2 text-xs uppercase tracking-wider rounded">Contact</button>
              ) : (
                <button disabled className="btn-iron opacity-50 py-2 text-xs uppercase rounded">Dead</button>
              )}
              <a href={l.source_url} target="_blank" rel="noopener" className="btn-iron py-2 text-xs uppercase tracking-wider rounded text-center">Open</a>
              <button onClick={() => kill(l.id)} className="btn-kill py-2 text-xs uppercase tracking-wider rounded">Kill</button>
            </div>
            <a href={`/lead/${l.id}`} className="block text-center text-[11px] text-[#8a8d96] underline">Negotiation Console →</a>
          </div>
        );
      })}
    </div>
  );
}
