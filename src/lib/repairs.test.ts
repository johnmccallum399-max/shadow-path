import { describe, expect, it } from 'vitest';
import { approveRepair, isApprovedType, isForbidden, APPROVED_REPAIRS } from './repairs';

describe('approveRepair', () => {
  it('approves when cost is under $500 and value-add is at least $1500', () => {
    expect(approveRepair(499, 1500)).toBe(true);
    expect(approveRepair(100, 2000)).toBe(true);
  });

  it('rejects when cost is $500 or more', () => {
    expect(approveRepair(500, 2000)).toBe(false);
  });

  it('rejects when value-add is under $1500', () => {
    expect(approveRepair(100, 1499)).toBe(false);
  });

  it('rejects when both conditions fail', () => {
    expect(approveRepair(1000, 500)).toBe(false);
  });
});

describe('isApprovedType', () => {
  it('recognizes every key in APPROVED_REPAIRS', () => {
    for (const key of Object.keys(APPROVED_REPAIRS)) {
      expect(isApprovedType(key)).toBe(true);
    }
  });

  it('rejects an unknown repair type', () => {
    expect(isApprovedType('transmission_rebuild')).toBe(false);
  });
});

describe('isForbidden', () => {
  it('flags descriptions mentioning forbidden repairs', () => {
    expect(isForbidden('needs a new transmission')).toBe(true);
    expect(isForbidden('engine replacement required')).toBe(true);
    expect(isForbidden('AC compressor is shot')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isForbidden('Needs TIMING BELT replacement')).toBe(true);
  });

  it('does not flag approved repair descriptions', () => {
    expect(isForbidden('needs a full detail and an oil change')).toBe(false);
  });
});
