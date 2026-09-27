# Fix snake scan origin + travel range

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Snake scan was starting bottom-left (Y inverted in WebGL / weak cover+scale pan) and barely moving horizontally; rebuild on full-art layout with strong zoom so L↔R passes reach side content and start at top-left.

## Changed

- `web/src/lib/snakeScan.ts` — `snakePanLayout()` sizes full artwork ≥ scale×viewport on both axes; bump zoom to ~2.55 / face 3.1.
- `web/src/components/story/RevealPlate.tsx` — snake mode no longer uses `object-fit: cover` + scale; measures plate and translates the full still in px (TL = 0,0).
- `web/src/components/three/ScrollPanPlate.tsx` — invert Y (top = −offset); snake uses same full-art sizing as DOM.
- `web/src/app/globals.css` — snake plate overflow + img styles.
- `changes/2026-09-27-fix-snake-origin-range.md` — this record.

## Notes

- Root cause for missing L/R: cover cropped the landscape still first, so scale only zoomed the already-cropped frame.
- Root cause for bottom-left start: Three.js +Y is up; previous lerp treated +offset as “top”.
