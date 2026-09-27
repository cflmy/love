# Add1 dual full-bleed + memories waterfall ×2.8

- **Date**: 2026-09-27
- **Scope**: Engine | UI | Config
- **Summary**: Use Add1 twice (幕布 + 背景) as full-bleed cover — no contain letterbox black; stretch 我们 scroll + marquee ~2.5–3× so BR→TL scan can finish.

## Changed

- `web/src/components/three/World.tsx` — two Add1 plates: curtain (wide cover handoff) + backdrop (BR→TL scan); drop single contain-curtain path.
- `web/src/data/chapters.ts` — memories `scrollSpan` 3.2 → 9.
- `web/src/app/globals.css` — marquee durations ~2.5× (130/160/145s); taller stage.
- `changes/2026-09-27-add1-dual-bleed-waterfall-x3.md` — this record.

## Notes

- Contain/letterbox was the black bars in the handoff screenshot; both plates now `reveal="scan"` + cover ≥ 1.08.
- Backdrop scan progress tracks memories local so the longer chapter owns the pan.
