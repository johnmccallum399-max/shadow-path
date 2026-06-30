import { describe, expect, it } from 'vitest';
import { fillScript, ALL_SCRIPTS, type ScriptKey } from './scripts';

describe('fillScript', () => {
  it('returns a defined string for every key listed in ALL_SCRIPTS', () => {
    for (const { key } of ALL_SCRIPTS) {
      expect(typeof fillScript(key)).toBe('string');
    }
  });

  it('defaults offer/counter to 0 when omitted', () => {
    expect(fillScript('green_counter')).toContain('$0');
    expect(fillScript('green_walk')).toContain('$0');
  });

  it('interpolates the offer amount', () => {
    expect(fillScript('green_counter', { offer: 450 })).toContain('$450');
    expect(fillScript('blue_counter', { offer: 900 })).toContain('$900');
    expect(fillScript('estate', { offer: 600 })).toContain('$600');
  });

  it('interpolates the counter amount', () => {
    expect(fillScript('green_walk', { counter: 425 })).toContain('$425');
    expect(fillScript('blue_walk', { counter: 1200 })).toContain('$1200');
  });

  it('scripts without a templated amount ignore offer/counter', () => {
    expect(fillScript('green_first')).not.toMatch(/\$\d/);
    expect(fillScript('blue_first')).not.toMatch(/\$\d/);
  });
});

describe('ALL_SCRIPTS', () => {
  it('has a unique key per entry', () => {
    const keys = ALL_SCRIPTS.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every key is a valid ScriptKey understood by fillScript', () => {
    const validKeys: ScriptKey[] = [
      'green_first', 'green_counter', 'green_walk',
      'blue_first', 'blue_counter', 'blue_walk',
      'estate', 'divorce_moving', 'long_listed', 'price_dropped',
    ];
    for (const { key } of ALL_SCRIPTS) {
      expect(validKeys).toContain(key);
    }
  });
});
