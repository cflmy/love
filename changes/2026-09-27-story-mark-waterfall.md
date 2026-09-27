# Fix story-mark image order + infinite waterfall

- **Date**: 2026-09-27
- **Scope**: UI | Engine | Assets
- **Summary**: Honor corner marks printed on stills (1→n); stop Act 1 from opening on mark-3「相逢鹊渡」; rebuild 我们 waterfall as mark-ordered infinite masonry.

## Changed

- `web/src/components/three/World.tsx` — MeetingPlate sequences `meetShe` → `meetHe` → `meetBridge` on scroll (marks 1→2→3).
- `web/src/components/story/PresentChapter.tsx` — 今世 plates 1→2→3→4 (`lifeMeet`/`lifeKnow`/`lifeRoad`/`lifeLuck`); captions aligned.
- `web/src/data/assets.ts` — `crops.story6` / `story7` aliases swap to match corner marks on files `story-7.webp` (6) and `story-6.webp` (7).
- `web/src/data/gallery.ts` — waterfall tiles regrouped by mark, then series; captions match art titles.
- `web/src/components/story/MemoriesTimeline.tsx` — infinite waterfall via IntersectionObserver loop append.
- `web/src/app/globals.css` — mark badge styles + sentinel for infinite load.
- `web/src/data/chrome.ts` — meeting nav orb uses mark-1 `meetShe`.
- `web/src/components/LoadingGate.tsx` — preload `meetShe` ahead of `meetBridge`.
- `web/src/data/scenes.ts` — present beat list follows mark order.
- `changes/2026-09-27-story-mark-waterfall.md` — this record.

## Notes

- Physical crop filenames under `public/media/crops/story-6.webp` / `story-7.webp` are left as-is; only registry aliases point to the correct mark.
- Infinite stream caps at 48 loops to bound DOM growth.
