# Present dreamy carousel — kill black void after 缘起

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Darkness after 缘起 came from empty snake plates (no image until measure) + dark plate/WebGL void; add blurred ambient underlay, always-on fallback cover, and a dense life+day dreamy carousel with overlapping windows.

## Changed

- `web/src/components/story/RevealPlate.tsx` — snake always has cover fallback; measure uses window fallback; scan mode dreamy glow layer.
- `web/src/components/story/PresentChapter.tsx` — `present-ambient` mist base; 12-plate carousel (life 1–5 + day 1–6 + story-2); continuous overlapping bands.
- `web/src/app/globals.css` — warm plate/ambient styles; present height 1400svh; softer veil.
- `web/src/data/chapters.ts` — present `scrollSpan` 11.5→13.5.
- `web/src/components/three/World.tsx` — present fog warmer; atmosphere spans whole act.
- `changes/2026-09-27-present-dreamy-carousel-no-void.md` — this record.

## Notes

- Root cause: snake mode rendered `null` while `view.w===0`, exposing near-black plate + WebGL clear color.
- 太阳永不落山 (`story8` / `mythNeverSets`) still excluded from this carousel.
