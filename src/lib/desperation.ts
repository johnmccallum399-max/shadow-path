// Desperation Detector — scores listing language 0-100
export interface DespInput {
  title_text?: string | null;
  description?: string | null;
  listing_age_days?: number | null;
  price_drop_count?: number | null;
}

export function desperationScore(lead: DespInput): number {
  let s = 0;
  const t = `${lead.title_text || ''} ${lead.description || ''}`.toLowerCase();

  // Highest desperation
  if (/need gone|must sell today|first \$.*takes|no reasonable offer refused|priced way below/.test(t)) s += 40;
  if (/moving (next week|soon)|relocating|divorce|estate sale/.test(t)) s += 30;

  // High desperation
  if (/need to sell fast|motivated seller|make.*offer|obo|or best offer/.test(t)) s += 15;
  if ((lead.listing_age_days ?? 0) >= 7) s += 15;

  // Price drops
  const drops = lead.price_drop_count ?? 0;
  if (drops >= 1) s += Math.min(30, 10 * drops);

  // Low desperation deductions
  if ((lead.listing_age_days ?? 99) < 1) s -= 10;
  if (/i know what i have|firm( on price)?|no lowball/.test(t)) s -= 20;

  return Math.max(0, Math.min(100, s));
}

export function desperationLabel(score: number): string {
  if (score >= 70) return 'MAXIMUM';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MODERATE';
  return 'LOW';
}
