# Add1 curtain handoff + BR→TL scan

- **Date**: 2026-09-27
- **Scope**: Engine | UI
- **Summary**: Journey→我们 uses Add1 as a full-art 幕布; afterwards camera pans bottom-right → top-left and settles on the desk/More Days corner.

## Changed

- `web/src/components/three/ScrollPanPlate.tsx` — new `reveal="curtain"` (contain full show → cover → focus pan).
- `web/src/components/three/World.tsx` — `Add1Curtain` owns handoff + coda underlay; journey plates/underlay fade before seam; focus `0.92,0.9` → `0.03,0.04`.
- `changes/2026-09-27-add1-curtain-br-to-tl.md` — this record.

## Notes

- Curtain opacity peaks across late 山高路远 → early 我们 so the whole Add1 frame is readable before the TL settle.
- Previous soft underlay started mid-frame; this path explicitly shows full art first.
