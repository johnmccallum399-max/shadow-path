import { describe, expect, it } from 'vitest';
import { desperationScore, desperationLabel } from './desperation';

describe('desperationScore', () => {
  it('returns 0 for empty/neutral input', () => {
    expect(desperationScore({})).toBe(0);
  });

  it('scores highest-desperation phrases', () => {
    expect(desperationScore({ title_text: 'need gone' })).toBe(40);
    expect(desperationScore({ description: 'first $500 takes it' })).toBe(40);
    expect(desperationScore({ title_text: 'no reasonable offer refused' })).toBe(40);
  });

  it('scores moving/estate/divorce phrases', () => {
    expect(desperationScore({ description: 'moving next week' })).toBe(30);
    expect(desperationScore({ description: 'estate sale' })).toBe(30);
    expect(desperationScore({ description: 'going through a divorce' })).toBe(30);
  });

  it('stacks independent regex categories additively', () => {
    // "need gone" (40) + "moving soon" (30) = 70
    expect(desperationScore({ title_text: 'need gone, moving soon' })).toBe(70);
  });

  it('scores motivated-seller language', () => {
    expect(desperationScore({ title_text: 'motivated seller' })).toBe(15);
    expect(desperationScore({ title_text: 'OBO' })).toBe(15);
    expect(desperationScore({ title_text: 'or best offer' })).toBe(15);
  });

  it('adds points for listings aged 7+ days', () => {
    expect(desperationScore({ listing_age_days: 7 })).toBe(15);
    expect(desperationScore({ listing_age_days: 6 })).toBe(0);
    expect(desperationScore({ listing_age_days: 30 })).toBe(15);
  });

  it('scales price-drop bonus at 10/drop capped at 30', () => {
    expect(desperationScore({ price_drop_count: 0 })).toBe(0);
    expect(desperationScore({ price_drop_count: 1 })).toBe(10);
    expect(desperationScore({ price_drop_count: 2 })).toBe(20);
    expect(desperationScore({ price_drop_count: 3 })).toBe(30);
    expect(desperationScore({ price_drop_count: 10 })).toBe(30);
  });

  it('deducts for brand-new listings (<1 day old)', () => {
    expect(desperationScore({ listing_age_days: 0 })).toBe(0); // -10 clamped to 0
    expect(desperationScore({ listing_age_days: 0, price_drop_count: 2 })).toBe(10); // 20 - 10
  });

  it('does not apply the new-listing deduction when listing_age_days is omitted', () => {
    // default for the deduction check is 99, which is not < 1
    expect(desperationScore({ price_drop_count: 1 })).toBe(10);
  });

  it('deducts for firm-on-price language', () => {
    expect(desperationScore({ title_text: 'firm on price', price_drop_count: 2 })).toBe(0); // 20 - 20 clamped
    expect(desperationScore({ description: 'no lowball offers' })).toBe(0);
    expect(desperationScore({ description: 'i know what i have' })).toBe(0);
  });

  it('clamps the final score to [0, 100]', () => {
    const maxed = desperationScore({
      title_text: 'need gone must sell today first $100 takes it no reasonable offer refused priced way below moving next week relocating divorce estate sale need to sell fast motivated seller make an offer obo',
      listing_age_days: 30,
      price_drop_count: 10,
    });
    expect(maxed).toBeLessThanOrEqual(100);

    const minned = desperationScore({
      title_text: 'firm on price no lowball i know what i have',
      listing_age_days: 0,
    });
    expect(minned).toBe(0);
  });

  it('handles null/undefined fields gracefully', () => {
    expect(() =>
      desperationScore({ title_text: null, description: null, listing_age_days: null, price_drop_count: null })
    ).not.toThrow();
  });
});

describe('desperationLabel', () => {
  it('maps score ranges to labels', () => {
    expect(desperationLabel(0)).toBe('LOW');
    expect(desperationLabel(24)).toBe('LOW');
    expect(desperationLabel(25)).toBe('MODERATE');
    expect(desperationLabel(49)).toBe('MODERATE');
    expect(desperationLabel(50)).toBe('HIGH');
    expect(desperationLabel(69)).toBe('HIGH');
    expect(desperationLabel(70)).toBe('MAXIMUM');
    expect(desperationLabel(100)).toBe('MAXIMUM');
  });
});
