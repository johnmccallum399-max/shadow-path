export default function RefCard() {
  return (
    <div className="panel p-4 font-mono text-xs leading-relaxed">
      <div className="text-center hazard font-bold uppercase tracking-widest mb-3">Flip System Quick Ref</div>
      <pre className="whitespace-pre-wrap text-[#e6e7ea] text-xs">{`
TIERS
─────────────────────────────
GREEN  Under $650
BLUE   $700 – $1,700

FIRST OFFER FORMULA
─────────────────────────────
Green: Listed × 0.55
Blue:  Listed × 0.60

CEILING FORMULA
─────────────────────────────
Green: Listed × 0.70
Blue:  Listed × 0.75

LIST PRICE FORMULA
─────────────────────────────
Green: Total in × 2.5
Blue:  Total in × 2.2

FLOOR FORMULA
─────────────────────────────
Both:  Total in × 1.8

$3 REPAIR RULE
─────────────────────────────
Under $500 cost?
Adds $1,500+ value?
YES BOTH = Fix it
NO EITHER = Skip it

INSTANT KILLS
─────────────────────────────
✗ No clean title
✗ Won't run/drive
✗ Over 100 miles
✗ Frame/flood damage

SCOUT NETWORK
─────────────────────────────
Fee:     $100 per lead
Targets: Mechanics
         Tow drivers
         Detail shops

BEST LIST TIMES
─────────────────────────────
Thursday 6-8pm
Sunday   4-6pm
Feb tax refund season
Mar-Apr spring buyers
Sept back-to-school

`}</pre>
    </div>
  );
}
