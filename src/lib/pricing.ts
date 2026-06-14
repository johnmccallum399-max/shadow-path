// Sale Price + Floor Engine
export interface PricingSet {
  list: number;
  min: number;
  floor: number;
}

export function pricing(totalIn: number, tier: 'green' | 'blue'): PricingSet {
  const mult = tier === 'green'
    ? { list: 2.5, min: 2.0 }
    : { list: 2.2, min: 1.8 };
  return {
    list: Math.round(totalIn * mult.list),
    min: Math.round(totalIn * mult.min),
    floor: Math.round(totalIn * 1.8),
  };
}

// Platform arbitrage pricing
export function platformPricing(list: number) {
  return {
    craigslist: list,
    facebook: Math.round(list * 0.95),
    offerup: Math.round(list * 0.90),
  };
}
