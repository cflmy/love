# Remove broken cutouts; Past dual-door 暮云|长风 backdrop

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Drop jagged butterfly/magpie keyed parts from Act 1; fill 前世 black void with 暮云|长风 double-door backdrop that opens and pans on scroll.

## Changed

- `web/src/components/three/World.tsx` — removed broken `SubjectBillboard` floaters; `PastRealm` uses `DoorPanel` dual-door; softer past fog.
- `web/src/components/three/ScrollPanPlate.tsx` — new `DoorPanel` (half-frustum plate + open/pan).
- `web/src/components/story/PastChapter.tsx` — DOM `.past-doors` dual-leaf backdrop from frame 0; hero plates start at 初遇.
- `web/src/app/globals.css` — `.past-doors` split layout + gold seam.
- `web/src/components/ui/AtmosphereField.tsx` — no-op (broken floater pool retired).
- `changes/2026-09-27-cutouts-past-doors.md` — this record.

## Notes

- Parts under `public/media/parts/butterfly-*` / `magpie-*` remain on disk but are unused in the film UI until re-keyed cleanly from `assert/`.
- Dual doors stay through most of 前世; quartet cards still float above mid-act.
