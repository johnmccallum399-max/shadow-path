'use client';
import { useEffect, useState } from 'react';
import { platformPricing } from '@/lib/pricing';

const PHOTO_CHECKLIST = [
  'Front 3/4 angle (morning light)',
  'Rear 3/4 angle',
  'Driver side straight',
  'Passenger side straight',
  'Engine bay (cleaned)',
  'Odometer reading',
  'Driver interior',
  'Rear seats',
  'Any known issues',
  'Clean title photo',
];

export default function ListingBuilder() {
  const [flips, setFlips] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [checks, setChecks] = useState<boolean[]>(Array(10).fill(false));
  const [reason, setReason] = useState('');
  const [recentWork, setRecentWork] = useState('');
  const [knownIssues, setKnownIssues] = useState('');
  const [city, setCity] = useState('Brooklyn Center');

  useEffect(() => {
    fetch('/api/flips').then(r => r.json()).then(d => setFlips((d.flips || []).filter((f: any) => f.status !== 'sold')));
  }, []);

  if (!selected) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-[#8a8d96]">Select Flip to List</h2>
        {flips.map(f => (
          <button key={f.id} onClick={() => setSelected(f)} className="w-full panel p-3 text-left">
            <div className="font-semibold text-sm">{f.lead?.vehicle_year} {f.lead?.vehicle_make} {f.lead?.vehicle_model}</div>
            <div className="text-xs text-[#8a8d96]">List ${f.list_price} • Floor ${f.floor_price}</div>
          </button>
        ))}
        {flips.length === 0 && <div className="panel p-4 text-sm text-[#8a8d96]">No active flips to list.</div>}
      </div>
    );
  }

  const f = selected;
  const prices = platformPricing(f.list_price || 0);
  const v = f.lead || {};
  const template = (price: number) =>
`${v.vehicle_year || ''} ${v.vehicle_make || ''} ${v.vehicle_model || ''} — $${price}
Clean Title | Runs and Drives${f.tier === 'blue' ? ' | Runs Strong' : ''}

SELLING BECAUSE: ${reason || '[reason]'}

WHAT YOU GET:
✓ Clean title in hand
✓ Runs and drives
${recentWork.split('\n').map(l => l.trim() ? `✓ ${l.trim()}` : '').filter(Boolean).join('\n')}

KNOWN ISSUES:
${knownIssues.split('\n').map(l => l.trim() ? `→ ${l.trim()}` : '').filter(Boolean).join('\n') || '→ Listed honestly to build trust'}

Priced to sell. Cash only. Local pickup.
Title transfers same day.

${city}, MN`;

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    alert('Copied.');
  }

  return (
    <div className="space-y-3">
      <button onClick={() => setSelected(null)} className="text-xs text-[#8a8d96] underline">← back</button>
      <div className="panel p-3">
        <div className="font-semibold">{v.vehicle_year} {v.vehicle_make} {v.vehicle_model}</div>
      </div>

      <div className="panel p-3 space-y-1">
        <div className="text-xs uppercase tracking-wider text-[#8a8d96]">Photo Checklist (10 shots)</div>
        {PHOTO_CHECKLIST.map((p, i) => (
          <label key={i} className="flex items-center gap-2 text-xs py-1">
            <input type="checkbox" checked={checks[i]} onChange={e => {
              const next = [...checks]; next[i] = e.target.checked; setChecks(next);
            }} />
            {p}
          </label>
        ))}
      </div>

      <div className="panel p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-[#8a8d96]">Listing Details</div>
        <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Selling because..."
          className="w-full panel-hi p-2 text-sm" />
        <textarea value={recentWork} onChange={e => setRecentWork(e.target.value)} placeholder="Recent work done (one per line)"
          className="w-full panel-hi p-2 text-sm" rows={3} />
        <textarea value={knownIssues} onChange={e => setKnownIssues(e.target.value)} placeholder="Known issues (one per line)"
          className="w-full panel-hi p-2 text-sm" rows={2} />
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="City"
          className="w-full panel-hi p-2 text-sm" />
      </div>

      <div className="panel p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-[#8a8d96]">Platform Pricing (Arbitrage)</div>
        <button onClick={() => copy(template(prices.craigslist))} className="w-full btn-hazard py-3 text-xs uppercase rounded">
          Copy Craigslist — ${prices.craigslist}
        </button>
        <button onClick={() => copy(template(prices.facebook))} className="w-full btn-iron py-3 text-xs uppercase rounded">
          Copy Facebook — ${prices.facebook}
        </button>
        <button onClick={() => copy(template(prices.offerup))} className="w-full btn-iron py-3 text-xs uppercase rounded">
          Copy OfferUp — ${prices.offerup}
        </button>
      </div>
    </div>
  );
}
