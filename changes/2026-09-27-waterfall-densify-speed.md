# Waterfall: densify columns + faster roll

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: Tall marquee stage was empty because columns still had one short tile stack; repeat tiles ×4 per column and speed the upward roll.

## Changed

- `web/src/components/story/MemoriesTimeline.tsx` — `densifyColumn(..., 4)` so dual stacks fill ~92vh.
- `web/src/app/globals.css` — marquee durations 32 / 40 / 36s (was 130 / 160 / 145s).
- `changes/2026-09-27-waterfall-densify-speed.md` — this record.

## Notes

- Seamless loop still uses two identical stacks + `translateY(-50%)`.
- Ids get `__rN` suffixes on repeated copies so React keys stay unique.
