# Restore present stills + defer 永不落山

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Restore 今世 plates (缘起/相知/山高路远落日/祥云/未来) with sequential non-overlapping windows; keep 太阳永不落山 but only fade it in after journey embrace so it no longer covers mid beats.

## Changed

- `web/src/components/story/PresentChapter.tsx` — full 5-plate sequence restored; short crossfades only (no persistent underlay stack).
- `web/src/data/scenes.ts` — present beats restored incl. lifeRoad + lifeFuture.
- `web/src/components/story/JourneyChapter.tsx` — `mythNeverSets` delayed to hush (≥0.94) as opacity overlay on embrace still.
- `web/src/app/globals.css` — never-sets overlay style.
- `web/src/components/three/World.tsx` — present WebGL atmosphere aligned to 缘起 window only.
- `changes/2026-09-27-restore-present-stills-defer-neversets.md` — this record.

## Notes

- Previous mistake was deleting lifeRoad instead of re-timing 永不落山.
- Plates hand off ~0.02 overlap so playback does not stack-fight.
