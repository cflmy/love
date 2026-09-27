# Clean WebGL world — plates over primitives

- **Date**: 2026-09-27
- **Scope**: Engine | UI
- **Summary**: Remove low-quality procedural Three.js meshes and broken butterfly/magpie cut-out sprites so the scroll world stays clean and photo-led.

## Changed
- `web/src/components/three/World.tsx` — keep camera / fog / lights + `ScrollPanPlate` / meeting bridge billboard; delete cone mountains, water plane, torus bridge, lamps, moon discs, sun, ∞ rings, butterfly/magpie flight meshes, floater subjects
- `web/src/components/three/WorldCanvas.tsx` — lower bloom so plates stay sharp
- `web/src/components/Experience.tsx` — remove DOM `AtmosphereField` floater layer
- `web/src/components/opening/OpeningGate.tsx` — replace broken flight sprites with soft light mote
- `web/src/components/LoadingGate.tsx` — preload night/bridge plates instead of flight frames
- `web/src/components/story/SceneBeat.tsx` — drop cut-out ornaments on stills
- `web/src/components/story/EndingChapter.tsx` / `QuietDaysChapter.tsx` — remove decorative butterfly/magpie overlays
- `web/src/app/globals.css` — `opening-mote` styles replace `opening-butterfly`

## Notes
- Free pixel/game butterfly packs from itch/OpenGameArt do not match QDQC oriental poetic tone; chose clean plates over mismatched replacements.
- `AtmosphereField.tsx` left unused for possible future soft CSS atmosphere without cut-outs.
- Follow-up: if clean transparent butterfly/magpie art is supplied under `assert/`, reintroduce as billboards only.
