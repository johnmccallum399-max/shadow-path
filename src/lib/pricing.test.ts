import { describe, expect, it } from 'vitest';
import { pricing, platformPricing } from './pricing';

describe('pricing', () => {
  it('computes green-tier list/min/floor multipliers', () => {
    expect(pricing(200, 'green')).toEqual({ list: 500, min: 400, floor: 360 });
  });

  it('computes blue-tier list/min/floor multipliers', () => {
    expect(pricing(500, 'blue')).toEqual({ list: 1100, min: 900, floor: 900 });
  });

  it('floor is always 1.8x total-in regardless of tier', () => {
    expect(pricing(300, 'green').floor).toBe(Math.round(300 * 1.8));
    expect(pricing(300, 'blue').floor).toBe(Math.round(300 * 1.8));
  });

  it('rounds non-integer results', () => {
    // 333 * 2.5 = 832.5 -> rounds to 833
    expect(pricing(333, 'green').list).toBe(833);
  });
});

describe('platformPricing', () => {
  it('applies platform-specific discounts off the list price', () => {
    expect(platformPricing(1000)).toEqual({
      craigslist: 1000,
      facebook: 950,
      offerup: 900,
    });
  });

  it('rounds discounted prices', () => {
    // 999 * 0.95 = 949.05 -> 949
    expect(platformPricing(999).facebook).toBe(949);
    // 999 * 0.90 = 899.1 -> 899
    expect(platformPricing(999).offerup).toBe(899);
  });
});
