import { describe, expect, it } from 'vitest';
import { killScreen, classifyTier } from './killScreen';

const base = {
  title_text: '2010 Honda Civic clean title runs and drives',
  description: '',
  tier: 'green' as const,
  price_listed: 500,
  distance_miles: 10,
};

describe('killScreen', () => {
  it('passes a listing that satisfies all 5 checks', () => {
    const result = killScreen(base);
    expect(result.passed).toBe(true);
    expect(result.fails).toEqual([]);
  });

  describe('TITLE check', () => {
    it('fails when no clean-title language is present', () => {
      const result = killScreen({ ...base, title_text: '2010 Honda Civic runs and drives' });
      expect(result.fails).toContain('TITLE');
    });

    it('fails when salvage/rebuilt language is present even alongside clean title language', () => {
      const result = killScreen({ ...base, title_text: 'clean title but salvage history' });
      expect(result.fails).toContain('TITLE');
    });

    it('accepts any of the clean-title phrasings', () => {
      for (const phrase of ['clean title', 'title in hand', 'clear title', 'title clean']) {
        const result = killScreen({ ...base, title_text: `runs and drives, ${phrase}` });
        expect(result.fails).not.toContain('TITLE');
      }
    });
  });

  describe('RUNS check', () => {
    it('fails when no runs/drives/starts language is present', () => {
      const result = killScreen({ ...base, title_text: 'clean title, needs work' });
      expect(result.fails).toContain('RUNS');
    });

    it('is skipped for tier green_parts', () => {
      const result = killScreen({ ...base, title_text: 'clean title', tier: 'green_parts' });
      expect(result.fails).not.toContain('RUNS');
    });
  });

  describe('LOCATION check', () => {
    it('fails beyond 100 miles', () => {
      const result = killScreen({ ...base, distance_miles: 101 });
      expect(result.fails).toContain('LOCATION');
    });

    it('passes at exactly 100 miles', () => {
      const result = killScreen({ ...base, distance_miles: 100 });
      expect(result.fails).not.toContain('LOCATION');
    });

    it('passes when distance is unknown (null)', () => {
      const result = killScreen({ ...base, distance_miles: null });
      expect(result.fails).not.toContain('LOCATION');
    });
  });

  describe('PRICE check', () => {
    it('fails green tier above $650', () => {
      expect(killScreen({ ...base, tier: 'green', price_listed: 651 }).fails).toContain('PRICE');
    });

    it('passes green tier at exactly $650', () => {
      expect(killScreen({ ...base, tier: 'green', price_listed: 650 }).fails).not.toContain('PRICE');
    });

    it('fails blue tier outside $700-$1700', () => {
      expect(killScreen({ ...base, tier: 'blue', price_listed: 699 }).fails).toContain('PRICE');
      expect(killScreen({ ...base, tier: 'blue', price_listed: 1701 }).fails).toContain('PRICE');
    });

    it('passes blue tier at the boundaries', () => {
      expect(killScreen({ ...base, tier: 'blue', price_listed: 700 }).fails).not.toContain('PRICE');
      expect(killScreen({ ...base, tier: 'blue', price_listed: 1700 }).fails).not.toContain('PRICE');
    });

    it('does not apply a price rule for other tiers', () => {
      expect(killScreen({ ...base, tier: 'all', price_listed: 999999 }).fails).not.toContain('PRICE');
    });
  });

  describe('PHOTOS/damage check', () => {
    it('fails on damage indicators', () => {
      for (const phrase of ['frame damage', 'bent frame', 'flood', 'water damage', 'fire damage', 'hail damage']) {
        const result = killScreen({ ...base, description: phrase });
        expect(result.fails).toContain('PHOTOS');
      }
    });
  });

  it('accumulates multiple simultaneous failures', () => {
    const result = killScreen({
      title_text: 'salvage title, needs work',
      description: 'flood damage',
      tier: 'green',
      price_listed: 9999,
      distance_miles: 500,
    });
    expect(result.passed).toBe(false);
    expect(result.fails).toEqual(expect.arrayContaining(['TITLE', 'RUNS', 'LOCATION', 'PRICE', 'PHOTOS']));
  });
});

describe('classifyTier', () => {
  it('classifies green at and below $650', () => {
    expect(classifyTier(0)).toBe('green');
    expect(classifyTier(650)).toBe('green');
  });

  it('classifies blue between $700 and $1700 inclusive', () => {
    expect(classifyTier(700)).toBe('blue');
    expect(classifyTier(1700)).toBe('blue');
  });

  it('rejects the gap between $651 and $699', () => {
    expect(classifyTier(651)).toBe('reject');
    expect(classifyTier(699)).toBe('reject');
  });

  it('rejects above $1700', () => {
    expect(classifyTier(1701)).toBe('reject');
  });

  it('rejects when price is null/undefined', () => {
    expect(classifyTier(null)).toBe('reject');
    expect(classifyTier(undefined)).toBe('reject');
  });
});
