'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function playDingDing(ctx: AudioContext) {
  const playTone = (startTime: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
    osc.start(startTime);
    osc.stop(startTime + 0.35);
  };
  const now = ctx.currentTime;
  playTone(now);
  playTone(now + 0.45);
}

function playBleep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 1320;
  osc.type = 'sine';
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.start(now);
  osc.stop(now + 0.14);
}

function announceTime(hour: number, minute: number) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'A M' : 'P M';
  const text = minute === 0
    ? `The time is ${h} o'clock ${ampm}`
    : `The time is ${h} thirty ${ampm}`;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.88;
  utt.pitch = 1.0;
  window.speechSynthesis.speak(utt);
}

function formatClock(date: Date) {
  const h = date.getHours() % 12 || 12;
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  const ampm = date.getHours() < 12 ? 'AM' : 'PM';
  return `${h}:${m}:${s} ${ampm}`;
}

export default function TimeCaller() {
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastFiredRef = useRef('');

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Announcement ticker — only when enabled
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      // Only act in first 8 seconds of a minute
      if (s >= 8) return;

      const key = `${h}:${m}`;
      if (lastFiredRef.current === key) return;
      lastFiredRef.current = key;

      if (m === 0 || m === 30) {
        announceTime(h, m);
      } else if (m % 10 === 0) {
        playDingDing(getCtx());
      } else if (m % 5 === 0) {
        playBleep(getCtx());
      }
    };

    tick();
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, [enabled, getCtx]);

  const toggle = () => {
    if (!enabled) {
      getCtx(); // unlock AudioContext on user gesture
      lastFiredRef.current = ''; // allow immediate fire if on a mark
    }
    setEnabled(e => !e);
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? `Time Caller ON (${formatClock(new Date())}) — click to silence` : `Time Caller OFF — click to activate`}
      className={`text-lg px-2 py-1 transition-opacity ${
        enabled ? 'opacity-100' : 'opacity-40'
      }`}
    >
      {enabled ? '🔔' : '🔕'}
    </button>
  );
}
