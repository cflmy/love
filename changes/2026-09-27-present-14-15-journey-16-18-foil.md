# Separate 今世 14/15, 山高路远 16/17/18, foil copy on 缘起

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: 今世 plays sheets 14+15 fullscreen with blue-gold foil prayer text over 缘起; 山高路远 becomes a 16/17/18 still carousel; 我们 stays the memory timeline (not 今世).

## Changed

- `web/src/components/story/PresentChapter.tsx` — 14 life + 15 day plates; foil beats early on lifeMeet; `present-foil` layer.
- `web/src/components/story/JourneyChapter.tsx` — rebuilt as film-act carousel from road(16)/myth(17)/story(18).
- `web/src/data/chapters.ts` — present 12 / journey 12 scrollSpan.
- `web/src/app/globals.css` — blue-gold foil type; journey film-act height; foil sheen.
- `changes/2026-09-27-present-14-15-journey-16-18-foil.md` — this record.

## Notes

- Screenshot “缘起/日常/旅途…” UI is 我们 (MemoriesTimeline) — correct act; day tiles may echo sheet 15 but cinematic 14/15 live only in Present.
- Foil copy window is `0.05→0.40` while 缘起 plate holds `0.02→0.42`.
