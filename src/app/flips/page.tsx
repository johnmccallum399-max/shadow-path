'use client';
import { useEffect, useState } from 'react';
import { approveRepair, APPROVED_REPAIRS } from '@/lib/repairs';

export default function FlipsPage() {
  const [flips, setFlips] = useState<any[]>([]);

  async function load() {
    const r = await fetch('/api/flips');
    const d = await r.json();
    setFlips(d.flips || []);
  }
  useEffect(() => { load(); }, []);

  async function addRepair(flipId: string) {
    const type = prompt(`Repair type? (${Object.keys(APPROVED_REPAIRS).join(', ')})`) || '';
    const cost = parseInt(prompt('Cost?') || '0', 10);
    const valueAdd = parseInt(prompt('Estimated value add?') || '0', 10);
    const approved = approveRepair(cost, valueAdd);
    if (!approved) {
      if (!confirm(`$3 Rule FAILED. Cost ${cost} or value ${valueAdd} doesn't qualify. Override?`)) return;
    }
    await fetch('/api/repairs', {
      method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify({ flip_id: flipId, type, cost, value_add_est: valueAdd }),
    });
    load();
  }

  async function markSold(flipId: string) {
    const sold = parseInt(prompt('Sold price?') || '0', 10);
    if (!sold) return;
    await fetch('/api/flips', {
      method: 'PATCH', headers: {'content-type':'application/json'},
      body: JSON.stringify({ id: flipId, sold_price: sold, status: 'sold' }),
    });
    load();
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm uppercase tracking-wider text-[#8a8d96]">Active Flips</h2>
      {flips.length === 0 && <div className="panel p-4 text-[#8a8d96] text-sm">No flips yet. Convert a lead to start.</div>}
      {flips.map((f) => {
        const aboveFloor = (f.list_price || 0) >= (f.floor_price || 0);
        return (
          <div key={f.id} className="panel p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">
                {f.lead?.vehicle_year} {f.lead?.vehicle_make} {f.lead?.vehicle_model}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded ${f.tier === 'green' ? 'tag-green' : 'tag-blue'} uppercase`}>{f.tier}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">PURCHASED</div><div className="font-bold">${f.purchase_price}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">REPAIRS</div><div className="font-bold">${f.repair_total || 0}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">TOTAL IN</div><div className="font-bold">${f.total_invested}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">FLOOR</div><div className={`font-bold ${aboveFloor ? 'text-[#4ade80]' : 'text-[#ef4444]'}`}>${f.floor_price}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">LIST PRICE</div><div className="font-bold hazard">${f.list_price}</div></div>
              <div className="panel-hi p-2"><div className="text-[10px] text-[#8a8d96]">MIN ACCEPT</div><div className="font-bold">${f.min_accept}</div></div>
            </div>
            {f.status === 'sold' && (
              <div className="tag-green p-2 text-xs text-center rounded">
                SOLD ${f.sold_price} • Profit ${f.net_profit} • ROI {f.roi_pct}%
              </div>
            )}
            {f.repairs && f.repairs.length > 0 && (
              <div className="panel-hi p-2 space-y-1 text-[11px]">
                {f.repairs.map((r: any) => (
                  <div key={r.id} className="flex justify-between">
                    <span>{r.type} {r.approved ? '✓' : '⚠'}</span>
                    <span>${r.cost} → +${r.value_add_est}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addRepair(f.id)} className="btn-iron py-2 text-xs uppercase rounded">+ Repair</button>
              {f.status !== 'sold'
                ? <button onClick={() => markSold(f.id)} className="btn-hazard py-2 text-xs uppercase rounded">Mark Sold</button>
                : <span className="text-center py-2 text-xs tag-green rounded">✓ DONE</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
