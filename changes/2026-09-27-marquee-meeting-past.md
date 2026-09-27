# Continuous marquee waterfall + cinematic Meeting / Past

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Replace append-and-jump waterfall with seamless upward marquee; Meeting uses spatial Three.js enter/exit; Past surfaces the full 暮云→山海 art cycle in WebGL + DOM.

## Changed

- `web/src/components/story/MemoriesTimeline.tsx` — 3-column dual-stack marquee (`translateY(-50%)` loop); pause on hover/focus; reduced-motion shows static column.
- `web/src/app/globals.css` — `.qd-marquee` animation, mask edges, `.past-quartet` floating cards; past sticky height ↑.
- `web/src/components/three/ScrollPanPlate.tsx` — new `CinematicPanel` (from → home → away poses).
- `web/src/components/three/World.tsx` — Meeting: she left-fly / he right-dive / bridge rise + creature billboards; new `PastRealm` with all six past stills + camera orbit; cinnabar myth light.
- `web/src/components/story/PastChapter.tsx` — six DOM plates + quartet overlay; captions for 初遇/同游/相守/山海.
- `web/src/data/scenes.ts` / `gallery.ts` / `chapters.ts` — past beat list & gallery past tiles; past `scrollSpan` 5.4→6.8.
- `changes/2026-09-27-marquee-meeting-past.md` — this record.

## Notes

- Marquee seam relies on two identical stacks per column; speeds differ per column for parallax feel.
- `pastTravel` file art is「初遇」, `pastMeet` is「同游」— order in Past follows titles, not English alias names.
