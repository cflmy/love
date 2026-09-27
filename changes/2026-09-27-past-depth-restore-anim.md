# Restore Past hero animation; depth backdrop (not L|R doors)

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Bring back 暮云/长风 fitGrow animation plates; use a second copy of each as far/near depth backdrop for 纵深 (not left-right double doors).

## Changed

- `web/src/components/story/PastChapter.tsx` — restored fitGrow 暮云→长风→初遇…; `.past-depth` far/near layers with parallax.
- `web/src/components/three/World.tsx` — depth ScrollPanPlates at z=-9.2 / -7.4 + restored fitGrow heroes; removed DoorPanel usage.
- `web/src/components/three/ScrollPanPlate.tsx` — removed unused `DoorPanel`.
- `web/src/app/globals.css` — replace `.past-doors` with `.past-depth` stacked layers + mist.
- `changes/2026-09-27-past-depth-restore-anim.md` — this record.

## Notes

- Each of 暮云 / 长风 appears twice: soft depth bed + animated reveal on top.
- Near layer uses a soft radial mask so it reads closer than the far plate.
