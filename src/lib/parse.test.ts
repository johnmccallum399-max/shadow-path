import { describe, expect, it } from 'vitest';
import { extractPrice, extractYearMakeModel, extractMileage } from './parse';

describe('extractPrice', () => {
  it('extracts a simple dollar amount', () => {
    expect(extractPrice('Selling for $500')).toBe(500);
  });

  it('strips thousands separators', () => {
    expect(extractPrice('asking $1,250 obo')).toBe(1250);
  });

  it('returns null when no price is present', () => {
    expect(extractPrice('no price listed here')).toBeNull();
  });

  it('takes the first dollar amount when multiple are present', () => {
    expect(extractPrice('$800 firm, was $1,000')).toBe(800);
  });
});

describe('extractYearMakeModel', () => {
  it('extracts year, make, and model from a typical title', () => {
    expect(extractYearMakeModel('2012 Honda Civic clean title')).toEqual({
      year: 2012,
      make: 'Honda',
      model: 'Civic',
    });
  });

  it('accepts years in the 1980s-2020s range', () => {
    expect(extractYearMakeModel('1985 Toyota Corolla').year).toBe(1985);
    expect(extractYearMakeModel('2029 Ford Focus').year).toBe(2029);
  });

  it('does not match years outside the supported range', () => {
    expect(extractYearMakeModel('1979 Ford Pinto').year).toBeUndefined();
    expect(extractYearMakeModel('2030 Tesla Model 3').year).toBeUndefined();
  });

  it('handles a title with no year', () => {
    const result = extractYearMakeModel('Honda Civic for sale');
    expect(result.year).toBeUndefined();
    expect(result.make).toBe('Honda');
    expect(result.model).toBe('Civic');
  });

  it('handles separators like hyphens and commas after the year', () => {
    const result = extractYearMakeModel('2015 - Subaru, Outback');
    expect(result.year).toBe(2015);
    expect(result.make).toBe('Subaru');
    expect(result.model).toBe('Outback');
  });

  it('handles a title with nothing after the year', () => {
    const result = extractYearMakeModel('2015');
    expect(result.year).toBe(2015);
    expect(result.make).toBeUndefined();
    expect(result.model).toBeUndefined();
  });
});

describe('extractMileage', () => {
  it('extracts plain mileage with "miles"', () => {
    expect(extractMileage('120,000 miles')).toBe(120000);
  });

  it('extracts mileage with "mi"', () => {
    expect(extractMileage('45000 mi')).toBe(45000);
  });

  it('expands "k" shorthand to thousands', () => {
    expect(extractMileage('98k miles')).toBe(98000);
  });

  it('returns null when no mileage is present', () => {
    expect(extractMileage('runs great, clean title')).toBeNull();
  });

  it('is case-insensitive for the unit', () => {
    expect(extractMileage('32K Miles')).toBe(32000);
  });
});
