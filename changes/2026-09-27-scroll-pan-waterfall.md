# Scroll-pan backdrops, cut-out subjects, memory waterfall

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Stop stretching chapter plates in WebGL — cover the frustum at intrinsic aspect and pan on scroll; float keyed subjects with parallax; surface unused stills in a masonry waterfall under 我们.

## Changed

- `web/src/components/three/ScrollPanPlate.tsx` — new `ScrollPanPlate` (cover + pan) and `SubjectBillboard` (intrinsic cut-outs).
- `web/src/components/three/World.tsx` — NightSky / chapter atmospheres / bridge plate / foreground branch use the new primitives; past·present·journey add magpie/butterfly floaters.
- `web/src/data/gallery.ts` — waterfall tile list from underused story / myth / life / day / road / poster crops.
- `web/src/components/story/MemoriesTimeline.tsx` — masonry waterfall replaces the three polaroid strip.
- `web/src/app/globals.css` — `.qd-waterfall` column layout (3 → 2 on small screens).
- `changes/2026-09-27-scroll-pan-waterfall.md` — this record.

## Notes

- Push of prior chrome polish landed as `a4e0d61` before this work.
- People plates without keyed cut-outs still pan as full scenes; subjects prefer `parts.*` silhouettes.
