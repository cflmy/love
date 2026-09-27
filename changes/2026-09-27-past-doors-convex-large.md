# Past doors: 外突内凹 + larger coverage

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Flip door yaw to outer-forward / seam-recessed; enlarge leaves to cover viewport black; keep animation plates in front.

## Changed

- `web/src/components/story/PastChapter.tsx` — hinge at center seam; `rotateY` reversed; door opacity ↑; larger leaves.
- `web/src/app/globals.css` — full-height 62% width overlapping doors; softer corridor; cover scale.
- `web/src/components/three/ScrollPanPlate.tsx` — `DoorPanel` oversized half-fill + 外突内凹 yaw.
- `web/src/components/three/World.tsx` — door opacity/z tuned for coverage behind heroes.
- `changes/2026-09-27-past-doors-convex-large.md` — this record.

## Notes

- Left hinge = right edge, right hinge = left edge → outer edges toward viewer.
