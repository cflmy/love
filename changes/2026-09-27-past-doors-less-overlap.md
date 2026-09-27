# Past doors: reduce center cross

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Pull 暮云|长风 leaves farther apart so the center seam is readable without losing full-viewport coverage.

## Changed

- `web/src/app/globals.css` — leaf width 62% → 55%; softer corridor.
- `web/src/components/story/PastChapter.tsx` — larger outward `translate3d` (±6% base, open +4%).
- `web/src/components/three/ScrollPanPlate.tsx` — DoorPanel bay width ↓, baseX spread ↑.
- `changes/2026-09-27-past-doors-less-overlap.md` — this record.

## Notes

- Still slight center overlap so black void does not return at the sides.
