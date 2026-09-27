# Waterfall fill tall stage + moderate speed

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: Stop empty gutters in the tall marquee — each column now carries the full gallery (rotated) with measured repeats until stack ≥ stage; slow roll back to ~58–70s.

## Changed

- `web/src/components/story/MemoriesTimeline.tsx` — `buildColumns` full-set per column; ResizeObserver bumps copies (max 8) until stack fills stage.
- `web/src/app/globals.css` — marquee durations 58 / 70 / 64s; column `height: 100%`.
- `changes/2026-09-27-waterfall-fill-stage.md` — this record.

## Notes

- Prior densify still split tiles across 3 columns (~⅓ each), so stacks stayed shorter than the 92vh stage.
- Loop remains dual-stack + `translateY(-50%)`.
