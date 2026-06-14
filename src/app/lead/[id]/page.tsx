'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fillScript } from '@/lib/scripts';

export default function LeadConsole() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<any>(null);
  const [counter, setCounter] = useState(0);

  async function load() {
    const r = await fetch(`/api/leads?status=all`);
    const d = await r.json();
    const found = (d.leads || []).find((x: any) => x.id === id);
    setLead(found);
    if (found) setCounter(found.first_offer || 0);
  }
  useEffect(() => { load(); }, [id]);

  if (!lead) return <p className="text-sm text-[#8a8d96]">Loading…</p>;

  const tier = lead.tier as 'green' | 'blue';
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    alert('Copied.');
  }

  async function convertToFlip() {
    const purchase = parseInt(prompt(`Purchase price?`) || '0', 10);
    if (!purchase) return;
    await fetch('/api/flips', {
      method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify({ lead_id: lead.id, purchase_price: purchase, tier }),
    });
    alert('Flip created. View in Flips tab.');
    window.location.href = '/flips';
  }

  return (
    <div className="space-y-3">
      <div className="panel p-3">
        <div className="text-xs text-[#8a8d96] uppercase">Lead</div>
        <div className="font-semibold text-sm">{lead.title_text}</div>
        <div className="text-xs text-[#8a8d96]">{lead.market}</div>
      </div>

      <div className="panel p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-[#8a8d96]">Walk-Away Number — Write on your hand</div>
        <div className="text-5xl font-extrabold hazard text-center py-2">${lead.ceiling}</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">LISTED</div><div className="font-bold">${lead.price_listed}</div></div>
          <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">FIRST</div><div className="font-bold">${lead.first_offer}</div></div>
          <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">CEILING</div><div className="font-bold">${lead.ceiling}</div></div>
        </div>
      </div>

      <div className="panel p-3 space-y-2">
        <div className="text-xs uppercase text-[#8a8d96]">Counter Offer</div>
        <div className="flex items-center justify-between">
          <button onClick={() => setCounter(c => Math.max(0, c - 25))} className="btn-iron px-4 py-2 rounded">−$25</button>
          <div className="text-3xl font-bold">${counter}</div>
          <button onClick={() => setCounter(c => c + 25)} className="btn-iron px-4 py-2 rounded">+$25</button>
        </div>
        {counter > lead.ceiling && (
          <div className="tag-dead text-[10px] px-2 py-1 rounded text-center">⚠ ABOVE CEILING — WALK AWAY</div>
        )}
      </div>

      <div className="panel p-3 space-y-2">
        <div className="text-xs uppercase text-[#8a8d96]">Scripts (tap to copy)</div>
        <button onClick={() => copy(fillScript(`${tier}_first` as any))}
          className="w-full btn-hazard py-3 text-xs uppercase rounded">First Message</button>
        <button onClick={() => copy(fillScript(`${tier}_counter` as any, { offer: lead.first_offer }))}
          className="w-full btn-iron py-3 text-xs uppercase rounded">Counter — ${lead.first_offer}</button>
        <button onClick={() => copy(fillScript(`${tier}_walk` as any, { counter }))}
          className="w-full btn-iron py-3 text-xs uppercase rounded">Walk-Away — ${counter}</button>
        <div className="border-t border-[#2a2c33] my-2" />
        <div className="text-[10px] text-[#8a8d96] uppercase">Situation</div>
        <button onClick={() => copy(fillScript('estate', { offer: counter }))}
          className="w-full btn-iron py-2 text-xs rounded">Estate Sale</button>
        <button onClick={() => copy(fillScript('divorce_moving', { offer: counter }))}
          className="w-full btn-iron py-2 text-xs rounded">Divorce / Moving</button>
        <button onClick={() => copy(fillScript('long_listed', { offer: counter }))}
          className="w-full btn-iron py-2 text-xs rounded">Long-Listed</button>
        <button onClick={() => copy(fillScript('price_dropped', { offer: counter }))}
          className="w-full btn-iron py-2 text-xs rounded">Price Dropped</button>
      </div>

      <button onClick={convertToFlip} className="w-full btn-hazard py-4 text-sm uppercase tracking-wider rounded font-bold">
        Bought It → Convert to Flip
      </button>
    </div>
  );
}
