// Offer Calculator
export interface OfferSet {
  first: number;
  ceiling: number;
}

export function offers(listed: number, tier: 'green' | 'blue'): OfferSet {
  if (tier === 'green') {
    return {
      first: Math.round(listed * 0.55),
      ceiling: Math.round(listed * 0.70),
    };
  }
  return {
    first: Math.round(listed * 0.60),
    ceiling: Math.round(listed * 0.75),
  };
}
