# Chrome polish: left rail, center music modal, custom sliders

- **Date**: 2026-09-27
- **Scope**: UI | Rules
- **Summary**: Move chapter orb rail to a vertical left dock, present the music player as a centered modal, restyle range inputs and panel scrollbars, and require a written change record for every edit.

## Changed

- `web/src/components/ui/StoryBar.tsx` — story-rail uses `qd-scroll`; volume range exposes `--seek` for the gold fill.
- `web/src/components/ui/ChapterNav.tsx` — drawer orbs / lists use soft gold scrollbars; orbs stack vertically.
- `web/src/components/ui/MusicPlayer.tsx` — player opens as a centered dialog with veil, body scroll lock, Escape / backdrop dismiss; seek uses `--seek`; playlist uses `qd-scroll`.
- `web/src/app/globals.css` — vertical left `.story-rail`; `.qd-player-layer` modal centering; custom range thumb/track; `.qd-scroll` scrollbar theme.
- `.cursor/rules/qdqc-changelog.mdc` — always-on rule: every change ships a `changes/*.md` record.
- `changes/2026-09-27-chrome-rail-player-polish.md` — this record.

## Notes

- On viewports ≤760px the left rail stays hidden; mobile still uses the chapter drawer menu.
- None further.
