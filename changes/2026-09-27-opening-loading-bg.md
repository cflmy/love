# Opening & loading night plate backgrounds

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: Replace muddy solid/gradient slabs on「连接鹊桥」loading and the opening ritual with the supplied `bridge-night` illustration plus soft readable washes.

## Changed
- `web/src/components/LoadingGate.tsx` — full-bleed `crops.bridgeNight` behind progress UI
- `web/src/components/opening/OpeningGate.tsx` — same night plate under the ritual; veil becomes translucent overlay only
- `web/src/app/globals.css` — loading shade / slow drift; opening veil phases retuned for image legibility; reduced-motion stops drift

## Notes
- Used existing `media/crops/bridge-night.webp` (already in registry); no assert/ edits.
- Follow-up: none unless a dedicated opening crop without title text is preferred.
