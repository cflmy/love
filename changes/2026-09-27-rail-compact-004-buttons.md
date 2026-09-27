# Compact left rail, 004 washes, kit button polish

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: Fit the chapter rail without a scrollbar, replace flat opening/chrome fills with 004-style layered parchment↔mist↔navy washes, and rebuild story CTAs from kit button art plus glass/shimmer motion.

## Changed

- `web/src/app/globals.css` — compact `.story-rail` (no overflow scroll); `--wash-parchment` / `--wash-night` for body + opening veil; glass gradient chrome on bar/player; full `.qd-btn` stack (wash / art / sheen / rim) matching `assert/img/组件` + 004; short-viewport rail tighten; mobile drawer orbs as 4-col grid.
- `web/src/components/ui/ArtButton.tsx` — wires `uiButtons` paths into `--btn-art`; cursor-linked glow; sheen layers.
- `web/src/components/ui/StoryBar.tsx` — rail no longer uses scroll class.
- `web/src/components/ui/StoryModal.tsx` / `web/src/components/story/LetterForm.tsx` — bare `qd-btn` nodes get wash/sheen/rim layers.
- `changes/2026-09-27-rail-compact-004-buttons.md` — this record.

## Notes

- Kit webps keep baked glyphs; dynamic labels stay in HTML over a soft-light art underlay so i18n is preserved.
- If a very short laptop still clips the rail, labels shrink further under `max-height: 780px` rather than scrolling.
