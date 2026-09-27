# Meeting→Past handoff: title dwell without stealing 暮云

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Keep 相逢 title coda inside Act 1 with soft exit; shrink past residue; clear bridge/night before 暮云; rebalance scroll spans so 前世 owns its time.

## Changed

- `web/src/data/meetingShots.ts` — `holdThenExit`; title exit 0.93→0.995; `pastCarry` 0.1→0.035.
- `web/src/components/story/MeetingTitle.tsx` — exit + lift away from center; past only faint residue.
- `web/src/data/chapters.ts` — meeting 8.2→7.4, past 6.8→7.4 (equal share).
- `web/src/components/three/World.tsx` — meeting plates leave during coda / past 0–0.07; bridge flies out; 暮云 enters at past ~0.01.
- `web/src/components/story/PastChapter.tsx` — 暮云 plate band starts at 0.02.
- `web/src/app/globals.css` — title slightly higher so center clears for 暮云.
- `changes/2026-09-27-meeting-past-handoff.md` — this record.

## Notes

- Overlap is a short crossfade breath, not a second title beat on 前世 scroll.
