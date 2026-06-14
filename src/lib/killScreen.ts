// The 5-Point Kill Screen
export interface KillInput {
  title_text?: string | null;
  description?: string | null;
  tier?: string | null;
  price_listed?: number | null;
  distance_miles?: number | null;
}

export interface KillResult {
  passed: boolean;
  fails: string[];
}

export function killScreen(lead: KillInput): KillResult {
  const fails: string[] = [];
  const text = `${lead.title_text || ''} ${lead.description || ''}`.toLowerCase();

  // 1. TITLE
  const titleOk = /clean title|title in hand|clear title|title clean/.test(text);
  const titleBad = /salvage|rebuilt|no title|lost title|bonded title|parts only/.test(text);
  if (!titleOk || titleBad) fails.push('TITLE');

  // 2. RUNS
  const runsOk = /runs|drives|starts/.test(text);
  if (!runsOk && lead.tier !== 'green_parts') fails.push('RUNS');

  // 3. LOCATION (within 100 miles)
  if (lead.distance_miles != null && lead.distance_miles > 100) fails.push('LOCATION');

  // 4. PRICE
  const price = lead.price_listed ?? 0;
  if (lead.tier === 'green' && price > 650) fails.push('PRICE');
  if (lead.tier === 'blue' && (price < 700 || price > 1700)) fails.push('PRICE');

  // 5. DAMAGE indicators
  if (/frame damage|bent frame|flood|water damage|fire damage|hail damage/.test(text)) {
    fails.push('PHOTOS');
  }

  return { passed: fails.length === 0, fails };
}

export function classifyTier(price?: number | null): 'green' | 'blue' | 'reject' {
  if (price == null) return 'reject';
  if (price <= 650) return 'green';
  if (price >= 700 && price <= 1700) return 'blue';
  return 'reject';
}
