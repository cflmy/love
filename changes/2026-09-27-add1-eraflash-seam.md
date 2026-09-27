# Add1 幕布 at journey→我们 seam (EraFlash pattern)

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Move Add1 curtain to the chapter seam like past→present cream flash; stop it from peaking after 我们 ends.

## Changed

- `web/src/components/story/EraFlash.tsx` — Add1 full-bleed cover flash: journey local > 0.96 → memories local < 0.055.
- `web/src/app/globals.css` — `.era-flash--add1` + cover image (object-position left-top bias).
- `web/src/components/three/World.tsx` — WebGL only soft `Add1Backdrop` after flash clears; journey plates hold until 0.95.
- `changes/2026-09-27-add1-eraflash-seam.md` — this record.

## Notes

- Same opacity envelope as cream EraFlash; DOM owns the 幕布 beat so timing cannot drift into quiet-days.
- Backdrop scan still BR→TL across memories scroll; coda keeps a whisper only.
