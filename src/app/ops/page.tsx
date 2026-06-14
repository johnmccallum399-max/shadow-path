'use client';
import { useEffect, useState } from 'react';

const ROUTINES = {
  morning: [
    'Check Feedly RSS feeds',
    'Screenshot anything new',
    'Run 60-second kill screen',
    'Send first contact scripts on anything that passes',
  ],
  midday: [
    'Check message responses',
    'Send negotiation scripts',
    'Schedule any viewings',
  ],
  evening: [
    'Check Facebook saved searches',
    'Check OfferUp',
    'Respond to any buyer inquiries on active listings',
    'Update flip tracker',
  ],
};

export default function OpsPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setChecks(c => ({ ...c, [key]: !c[key] }));
  }

  async function enablePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push not supported on this browser'); return;
    }
    const reg = await navigator.serviceWorker.register('/sw.js');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { alert('Permission denied'); return; }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    await fetch('/api/push/subscribe', {
      method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify(sub),
    });
    alert('Push enabled. You will get alerts for new leads.');
  }

  return (
    <div className="space-y-3">
      <button onClick={enablePush} className="w-full btn-hazard py-3 text-xs uppercase rounded">
        Enable Push Notifications
      </button>

      {(['morning','midday','evening'] as const).map(slot => (
        <div key={slot} className="panel p-3 space-y-2">
          <div className="text-xs uppercase tracking-wider text-[#8a8d96]">{slot} Routine</div>
          {ROUTINES[slot].map((task, i) => {
            const key = `${slot}-${i}`;
            return (
              <label key={key} className="flex items-center gap-2 text-sm py-1">
                <input type="checkbox" checked={!!checks[key]} onChange={() => toggle(key)} />
                <span className={checks[key] ? 'line-through text-[#8a8d96]' : ''}>{task}</span>
              </label>
            );
          })}
        </div>
      ))}

      <a href="/ref" className="block w-full btn-iron py-3 text-xs uppercase text-center rounded">
        Quick Reference Card →
      </a>
    </div>
  );
}
