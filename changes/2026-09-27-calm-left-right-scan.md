# Calm left-then-right lifeMeet scan

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Replace zigzag / extreme-zoom snake with a slow left-column descend → soft cross to the right → settle on faces; mild ken-burns zoom only (~1.32→1.42).

## Changed

- `web/src/lib/snakeScan.ts` — new path + zoom (hold TL → left down → cross → rise → faces).
- `web/src/components/story/PresentChapter.tsx` — lifeMeet window `0.03→0.66`; captions restaggered.
- `web/src/data/chapters.ts` — present `scrollSpan` 9.2→11.5.
- `web/src/app/globals.css` — present sticky min-height 920→1150svh.
- `web/src/components/three/World.tsx` — atmosphere progress aligned to longer window.
- `web/src/components/story/RevealPlate.tsx` / `ScrollPanPlate.tsx` — comment updates.
- `changes/2026-09-27-calm-left-right-scan.md` — this record.

## Notes

- Zoom intentionally mild so the camera reads as a slow pan, not a flying crop.
- If left text still feels tight on desktop, nudge `leftX` / `zoomScan` slightly (stay under ~1.5).
