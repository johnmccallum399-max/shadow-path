// The $3 Rule + Approved Repair List

export const APPROVED_REPAIRS = {
  detail:     { label: 'Full detail/deep clean',   costRange: [50, 150],  valueAdd: [300, 800] },
  battery:    { label: 'Battery replacement',      costRange: [100, 150], valueAdd: [300, 500] },
  oil:        { label: 'Oil change + clean dipstick', costRange: [30, 50], valueAdd: [200, 300] },
  windshield: { label: 'Windshield chip repair',   costRange: [0, 50],    valueAdd: [200, 400] },
  headlight:  { label: 'Headlight restore',        costRange: [20, 80],   valueAdd: [200, 400] },
  ecu:        { label: 'ECU reprogram',            costRange: [75, 150],  valueAdd: [800, 1500] },
  tires:      { label: 'New tires (if visibly bad)', costRange: [200, 400], valueAdd: [800, 1200] },
} as const;

export const FORBIDDEN_REPAIRS = [
  'transmission', 'engine', 'head gasket', 'turbo', 'ac', 'body', 'paint',
  'suspension', 'catalytic', 'timing chain', 'timing belt', 'interior',
];

export function approveRepair(cost: number, valueAdd: number): boolean {
  return cost < 500 && valueAdd >= 1500;
}

export function isApprovedType(type: string): boolean {
  return type in APPROVED_REPAIRS;
}

export function isForbidden(description: string): boolean {
  const d = description.toLowerCase();
  return FORBIDDEN_REPAIRS.some((f) => d.includes(f));
}
