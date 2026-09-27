# Memories 烫金 + Add1 left-top focus

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Memories act title uses hot-stamped gold foil; Add1 coda underlay stays on the left/top visual core instead of drifting right.

## Changed

- `web/src/components/story/ActTitle.tsx` — `tone="foil"` for 烫金 type.
- `web/src/components/story/StoryChapters.tsx` — memories uses `tone="foil"`.
- `web/src/app/globals.css` — `.act-title.is-foil` leaf-gold gradient + sheen + rim shadow.
- `web/src/components/three/ScrollPanPlate.tsx` — optional `focus` / `focusEnd` for scan framing.
- `web/src/components/three/World.tsx` — Add1 underlay focus ≈ left desk / top script (`0.18,0.16` → `0.36,0.34`).
- `changes/2026-09-27-memories-foil-add1-focus.md` — this record.

## Notes

- Foil is warm leaf gold (not the present blue-gold) so it reads on Add1’s bright desk.
- Scan no longer starts mid-right (`0.35+`); progress is chapter-local with clamped left-top focus.
