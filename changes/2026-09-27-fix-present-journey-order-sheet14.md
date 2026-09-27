# Fix present/journey order + sheet-14 carousel + center copy

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Sync chapter DOM heights to `scrollSpan` so 山高路远 no longer desyncs after an oversized 今世; 今世 plays only sheet-14 marks 1→5 fullscreen with centered floating prayer/reply/seal copy.

## Changed

- `web/src/components/story/StoryChapters.tsx` — CSS vars `--chapter-*-vh` from each chapter `scrollSpan`.
- `web/src/app/globals.css` — meeting/past/present/journey min-heights use those vars; `.present-center` typography.
- `web/src/data/chapters.ts` — present `scrollSpan` 13.5→10 (five 14_* stills + copy).
- `web/src/components/story/PresentChapter.tsx` — only `lifeMeet…lifeFuture` (14_01…14_05); center beats for prayer / quiet days / 鹊渡情长.
- `web/src/components/three/World.tsx` — present atmosphere tuned to new span.
- `changes/2026-09-27-fix-present-journey-order-sheet14.md` — this record.

## Notes

- Root cause of “山高路远跑到最后”: present sticky was 1400svh while progress used scrollSpan ratios, so chapterId and on-screen section drifted.
- Day/story fillers removed from 今世; they stay in 我们 / Quiet Days.
