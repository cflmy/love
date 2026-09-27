# Title coda dwell + fitGrow / scan plate reveals

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Hold 相逢鹊渡 title lines longer on scroll; reveal 暮云/长风 from small→full then scan; 今世 (and WebGL backdrops) pan TL→BR so corner text is readable.

## Changed

- `web/src/data/meetingShots.ts` — earlier title window + `holdAfter` (no mid-coda fade); carry into early 前世; compress pre-title shots.
- `web/src/components/story/MeetingTitle.tsx` — hold semantics; persist briefly into past (`pastCarry`).
- `web/src/data/chapters.ts` — meeting `scrollSpan` 6.4→8.2; present 3.8→5.2.
- `web/src/components/story/RevealPlate.tsx` — new DOM `fitGrow` / `scan` stills.
- `web/src/components/story/PastChapter.tsx` / `PresentChapter.tsx` — use RevealPlate; longer 暮云/长风 bands.
- `web/src/components/three/ScrollPanPlate.tsx` — `reveal: cover | fitGrow | scan`.
- `web/src/components/three/World.tsx` — past heroes fitGrow; present/journey scan.
- `web/src/components/story/MeetingChapter.tsx` — captions clear before title coda (~0.76).
- `web/src/app/globals.css` — reveal plate styles; present sticky height ↑.
- `changes/2026-09-27-title-dwell-reveal-scan.md` — this record.

## Notes

- Title stays fully opaque after each line peaks until meeting ends / early past fade.
- `fitGrow` starts `object-fit: contain` so corner copy is visible, then grows into cover + scan.
