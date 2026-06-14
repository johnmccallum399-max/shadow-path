// Script templates — auto-fill master scripts
export type ScriptKey =
  | 'green_first' | 'green_counter' | 'green_walk'
  | 'blue_first'  | 'blue_counter'  | 'blue_walk'
  | 'estate'      | 'divorce_moving' | 'long_listed' | 'price_dropped';

export interface ScriptVars {
  offer?: number;
  counter?: number;
}

export function fillScript(key: ScriptKey, v: ScriptVars = {}): string {
  const o = v.offer ?? 0;
  const c = v.counter ?? 0;
  switch (key) {
    case 'green_first':
      return `Hi - is this still available? Clean title in hand? Runs and drives? Cash buyer, can pick up today.`;
    case 'green_counter':
      return `Great - would you take $${o}? I can be there within the hour with cash.`;
    case 'green_walk':
      return `Best I can do is $${c} cash today, title transfers same day, done in 20 minutes.`;
    case 'blue_first':
      return `Hi - serious buyer here. Is the title clean and in your name? Confirm it runs and drives? Cash ready, can come today.`;
    case 'blue_counter':
      return `Great - I've looked at a few similar ones this week. Would you take $${o} cash today? Can be there within the hour.`;
    case 'blue_walk':
      return `Best I can do is $${c}. Cash in hand, same day title, done and gone in 20 minutes.`;
    case 'estate':
      return `Hi - saw this is an estate sale. I can make this very easy - cash in hand, same day pickup, handle all paperwork myself. Would $${o} work to get this resolved today?`;
    case 'divorce_moving':
      return `Hi - cash buyer here. Understand you need this handled quickly. I can be there today, cash in hand, title done same day. Would $${o} work?`;
    case 'long_listed':
      return `Hi - still interested in this? I can offer $${o} cash today. Understand it's been a while - happy to just get it handled for you if price works.`;
    case 'price_dropped':
      return `Hi - noticed the price adjustment. Cash buyer here - would you take $${o} to just get it sold today? Can come immediately.`;
  }
}

export const ALL_SCRIPTS: { key: ScriptKey; label: string; situation?: string }[] = [
  { key: 'green_first',   label: 'Green — First Message' },
  { key: 'green_counter', label: 'Green — Counter Offer' },
  { key: 'green_walk',    label: 'Green — Walk-Away Counter' },
  { key: 'blue_first',    label: 'Blue — First Message' },
  { key: 'blue_counter',  label: 'Blue — Counter Offer' },
  { key: 'blue_walk',     label: 'Blue — Walk-Away Counter' },
  { key: 'estate',        label: 'Estate Sale', situation: 'estate' },
  { key: 'divorce_moving',label: 'Divorce / Moving', situation: 'divorce_moving' },
  { key: 'long_listed',   label: 'Long-Listed 7+ days', situation: 'long_listed' },
  { key: 'price_dropped', label: 'Price Dropped', situation: 'price_dropped' },
];
