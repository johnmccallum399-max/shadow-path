'use client';
import { useEffect, useState } from 'react';

export default function ScoutsPage() {
  const [scouts, setScouts] = useState<any[]>([]);

  async function load() {
    const r = await fetch('/api/scouts');
    const d = await r.json();
    setScouts(d.scouts || []);
  }
  useEffect(() => { load(); }, []);

  async function addScout() {
    const name = prompt('Name?') || '';
    const type = prompt('Type? (mechanic, tow, detail)') || 'mechanic';
    const phone = prompt('Phone?') || '';
    const city = prompt('City?') || '';
    if (!name) return;
    await fetch('/api/scouts', {
      method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify({ name, type, phone, city }),
    });
    load();
  }

  async function payFee(scout: any) {
    if (!confirm(`Log $100 finder fee for ${scout.name}?`)) return;
    await fetch('/api/scouts', {
      method: 'PATCH', headers: {'content-type':'application/json'},
      body: JSON.stringify({ id: scout.id, fee_paid: (scout.fee_paid || 0) + 100, leads_provided: (scout.leads_provided || 0) + 1 }),
    });
    load();
    if (scout.phone) {
      window.location.href = `sms:${scout.phone}?body=Sent $100 finder fee. Thanks for the lead.`;
    }
  }

  return (
    <div className="space-y-3">
      <button onClick={addScout} className="w-full btn-hazard py-3 text-xs uppercase rounded">+ Add Scout</button>
      <div className="panel p-3 text-xs text-[#8a8d96]">
        $100 finder fee for any clean-title car under $1,700 that runs. Mechanics, tow drivers, detail shops.
      </div>
      {scouts.map(s => (
        <div key={s.id} className="panel p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-[#8a8d96]">{s.type} • {s.city}</div>
            </div>
            <div className="text-right text-xs">
              <div>{s.leads_provided || 0} leads</div>
              <div className="hazard font-bold">${s.fee_paid || 0} paid</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {s.phone && <a href={`tel:${s.phone}`} className="btn-iron py-2 text-xs uppercase rounded text-center">Call</a>}
            <button onClick={() => payFee(s)} className="btn-hazard py-2 text-xs uppercase rounded">Pay $100</button>
          </div>
        </div>
      ))}
    </div>
  );
}
