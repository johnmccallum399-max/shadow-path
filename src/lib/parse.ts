// Parse Craigslist listing text → structured fields
export function extractPrice(text: string): number | null {
  const m = text.match(/\$([\d,]+)/);
  if (!m) return null;
  return parseInt(m[1].replace(/,/g, ''), 10);
}

export function extractYearMakeModel(title: string): {
  year?: number; make?: string; model?: string;
} {
  const yearMatch = title.match(/\b(19[8-9]\d|20[0-2]\d)\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : undefined;
  const after = yearMatch ? title.slice((yearMatch.index ?? 0) + 4).trim() : title;
  const parts = after.split(/[\s\-,]+/).filter(Boolean);
  return { year, make: parts[0], model: parts[1] };
}

export function extractMileage(text: string): number | null {
  const m = text.match(/([\d,]+)\s*(k|miles|mi)\b/i);
  if (!m) return null;
  let n = parseInt(m[1].replace(/,/g, ''), 10);
  if (/^k$/i.test(m[2])) n *= 1000;
  return n;
}
