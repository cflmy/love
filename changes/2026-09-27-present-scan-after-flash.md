# Present lifeMeet scan starts after era flash

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Fix 今世缘起 (`lifeMeet`) opening mid-scan under the past→present cream flash so the still holds top-left, then completes a full TL→BR pan.

## Changed

- `web/src/components/story/EraFlash.tsx` — shorten hard-cut flash (past peak 0.96→1; present clear by ~0.045) so it no longer covers the first ~12% of 今世.
- `web/src/components/story/PresentChapter.tsx` — delay / lengthen `lifeMeet` plate (0.05→0.4); restagger later plates + captions to match.
- `web/src/components/story/RevealPlate.tsx` — scan mode holds TL for first 14% of plate `t`, then pans with slightly stronger zoom.
- `web/src/components/three/ScrollPanPlate.tsx` — matching scan hold; snap to TL during hold (no damp from center→corner).
- `web/src/components/three/World.tsx` — present atmosphere opacity/progress aligned to lifeMeet window; past realm hands off sooner so the cut is not followed by a void.
- `changes/2026-09-27-present-scan-after-flash.md` — this record.

## Notes

- Root cause: EraFlash stayed opaque through present `local < 0.12` while `lifeMeet` already scanned from `0.04`, so the visible first frame was already ~¼ through the pan.
- Intentional hard cut kept; only the wash duration was reduced.
