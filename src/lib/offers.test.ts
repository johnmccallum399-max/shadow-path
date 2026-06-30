import { describe, expect, it } from 'vitest';
import { offers } from './offers';

describe('offers', () => {
  it('computes green-tier first offer and ceiling at 55%/70%', () => {
    expect(offers(1000, 'green')).toEqual({ first: 550, ceiling: 700 });
  });

  it('computes blue-tier first offer and ceiling at 60%/75%', () => {
    expect(offers(1000, 'blue')).toEqual({ first: 600, ceiling: 750 });
  });

  it('rounds to the nearest dollar', () => {
    // 650 * 0.55 = 357.5 -> rounds to 358
    expect(offers(650, 'green').first).toBe(358);
    // 650 * 0.70 = 455
    expect(offers(650, 'green').ceiling).toBe(455);
  });

  it('handles a zero listed price', () => {
    expect(offers(0, 'green')).toEqual({ first: 0, ceiling: 0 });
    expect(offers(0, 'blue')).toEqual({ first: 0, ceiling: 0 });
  });
});
