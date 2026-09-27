# Journey 16/17/18 WebGL + chapter underlay swap

- **Date**: 2026-09-27
- **Scope**: UI | Engine | Assets
- **Summary**: Stop reusing 今世缘起 after present; 山高路远 bases on「太阳落山前」and plays sheets 16→17→18 in WebGL; coda chapters use Add1 ambient.

## Changed

- `web/public/media/crops/add-1.webp` — exported from `assert/img/Add1.png` (1536×1024); `assert/` untouched.
- `web/src/data/assets.ts` — `crops.add1`; bump `MEDIA_REV` to `20260927m`.
- `web/src/data/imageSize.ts` — intrinsic size for `add-1.webp`.
- `web/src/data/journeyShots.ts` — declarative 16→17→18 stills + captions.
- `web/src/components/three/World.tsx` — `ChapterUnderlays` (present=`lifeMeet`, journey=`roadBeforeSunset`, coda=`add1`); `JourneyRealm` carousel; remove lingering OriginUnderlay / JourneyAtmosphere.
- `web/src/components/story/JourneyChapter.tsx` — captions-only (WebGL owns stills).
- `web/src/app/globals.css` — journey sticky transparent for WebGL plates.
- `changes/2026-09-27-journey-16-18-add1-underlays.md` — this record.

## Notes

- Journey base still is `crops.roadBeforeSunset` (sheet 16_06 —「你别担心，太阳落山前我一定回来」).
- Coda underlay covers memories / quiet-days / letter / future.
- Sheet 18 uses committed `story1`–`story8` crops (aliases of `assert/img/18_*`).
