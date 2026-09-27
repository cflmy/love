# Present dreamy 缘起 + drop mid-act road still

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Rebuild 今世 around dreamy lifeMeet (blur glow + sparkles + typography-first scan); keep 缘起 under later stills; remove lifeRoad (山高路远/落日) from present so journey imagery no longer interrupts.

## Changed

- `web/src/components/story/PresentChapter.tsx` — lifeMeet persists as base; lifeKnow / lifeLuck overlay; lifeRoad removed; captions without road/sun-never-sets mid beat.
- `web/src/components/story/RevealPlate.tsx` — `dreamy` mode: blurred glow underlay, haze/bloom, sparkle motes; optional `scanOpts`.
- `web/src/lib/snakeScan.ts` — longer left-type dwell; `LIFE_STILL_SNAKE` for later plates; mild zoom only.
- `web/src/app/globals.css` — dream haze / bloom / mote animations; reduced-motion guards.
- `web/src/components/three/World.tsx` — present atmosphere holds lifeMeet through most of the act.
- `web/src/data/scenes.ts` — present beats = meet / know / luck (no road).
- `changes/2026-09-27-present-dreamy-origin.md` — this record.

## Notes

- 「太阳永不落山」仍属 山高路远 / journey (`mythNeverSets`)，不再插进今世板序列。
- lifeRoad asset remains in gallery / journey-adjacent uses; only removed from G3 sticky film.
