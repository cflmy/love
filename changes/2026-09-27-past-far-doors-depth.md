# Past far double-doors with perspective depth

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: 暮云|长风 as recessed L|R doors far behind animation; keep intrinsic framing (no stretch); soft open for spatial depth.

## Changed

- `web/src/components/story/PastChapter.tsx` — `.past-doors` left/right leaves with perspective yaw; low opacity; front fitGrow plates unchanged.
- `web/src/components/three/World.tsx` — far `DoorPanel` at z≈-14; hero plates closer (~-4.5).
- `web/src/components/three/ScrollPanPlate.tsx` — `DoorPanel` sizes by aspect inside half frustum + rotateY open.
- `web/src/app/globals.css` — perspective corridor doors; plates z-index above.
- `changes/2026-09-27-past-far-doors-depth.md` — this record.

## Notes

- Door opacity ~0.42 so they fill black void without washing out front animation.
- `object-fit: cover` inside framed leaves — no non-uniform stretch.
