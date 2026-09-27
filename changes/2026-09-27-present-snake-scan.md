# Present lifeMeet serpentine scan

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Replace diagonal ken-burns on 今世缘起 with a slow 5-row L↔R serpentine scan that settles on the couple's faces; lengthen 今世 scroll so the path is readable.

## Changed

- `web/src/lib/snakeScan.ts` — shared snake path + `LIFE_MEET_SNAKE` face settle target.
- `web/src/components/story/RevealPlate.tsx` — new `mode="snake"`.
- `web/src/components/story/PresentChapter.tsx` — `lifeMeet` uses snake over `0.04→0.58`; later plates compressed; captions restaggered.
- `web/src/components/three/ScrollPanPlate.tsx` — WebGL `reveal="snake"`.
- `web/src/components/three/World.tsx` — present atmosphere follows snake window.
- `web/src/data/chapters.ts` — present `scrollSpan` 5.2→9.2.
- `web/src/app/globals.css` — present sticky min-height 520→920svh; snake plate filter.
- `changes/2026-09-27-present-snake-scan.md` — this record.

## Notes

- Path: hold TL → 5 horizontal passes (odd L→R, even R→L) → ease onto faces (~66%×30%) with a slight zoom-in.
- If faces feel off-center on a given viewport, tweak `LIFE_MEET_SNAKE.face` only.
