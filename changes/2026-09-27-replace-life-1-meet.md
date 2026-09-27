# Replace life-1-meet art with 修改1

- **Date**: 2026-09-27
- **Scope**: Assets
- **Summary**: Swap the committed `life-1-meet` / `14_01` web derivatives for the optimized source `assert/img/修改1.png` (higher-res), without touching `assert/` originals.

## Changed

- `web/public/media/crops/life-1-meet.webp` — re-exported from `assert/img/修改1.png` (1952×1248).
- `web/public/media/slices/14/14_01.webp` — same export so slice alias stays in sync.
- `web/src/data/imageSize.ts` — intrinsic size updated to 1952×1248.
- `changes/2026-09-27-replace-life-1-meet.md` — this record.

## Notes

- App paths unchanged (`crops.lifeMeet` → `/media/crops/life-1-meet.webp`); Present chapter, nav orb, World texture, and scenes pick up the new file automatically.
- `assert/img/14_01.png` and `assert/img/修改1.png` left untouched per immutable-source rule.
