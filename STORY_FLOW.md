# QDQC · Story Flow

> **Executable flow map for development.**  
> Shot intent lives in `docs/008.md` (read-only — do not edit).  
> Cinematic grammar summary: `CINEMATIC_DIRECTION.md`.  
> This file owns **order, ownership, gates, and what ships next**.

---

## 1 · Experience spine

```text
NFC /card
  → Opening ritual（触碰鹊桥 · audio unlock · world awaken）
  → 相逢鹊渡
  → 前世（暮云 → 长风 → 许诺）
  → 今世
  → 山高路远（奔赴 → 金光 → 锁链 → 相拥 → silence）
  → 我们 / Memories
  → Quiet Days
  → Letter
  → Ending（More Days · ∞）
```

One continuous film. Scrolling moves the camera through one persistent WebGL world.  
Chapters transform the world — they do not remount Canvas or swap to a photo album.

---

## 2 · Development gates（ship order）

| Gate | Act | Ship bar | Status |
| --- | --- | --- | --- |
| **G0** | Opening / NFC | Ritual + unlock + portal into world | Done |
| **G1** | 相逢鹊渡 | Scroll = camera; depth layers; butterfly / magpie / bridge / title | Done |
| **G2** | 前世 | Sticky myth rise; 暮云 → 长风 → oath | Done |
| **G3** | 今世 | Sticky human scale; warm light | Done |
| **G4** | 山高路远 | Dual approach → chains → embrace → silence | Done |
| **G5** | 我们 → Quiet Days → Letter → Ending | Drop spectacle; closing lines | Done |

---

## 3 · Layer ownership

| Layer | Owns | Must not own |
| --- | --- | --- |
| `OpeningGate` | Ritual, audio unlock, worldReveal | Scroll story content |
| `WorldCanvas` / `World` | Camera, depth layers, creatures, light, chapter morph | Typography dumps, chapter cards |
| DOM sticky acts | Timed stills + soft lines (`Meeting` / `Past` / `Present` / `Journey`) | Mid-film card deck, film-strip albums |
| Coda DOM | Memories / Quiet Days / Letter / Ending | Second climax |
| `MusicEngine` | Chapter OST crossfade | Autoplay before gesture |
| `StoryChrome` | QDQC mark → chapter list | Classic Navbar / promo chips |

---

## 4 · Act brief

### Opening · ritual only
Scroll span `0`. Audio: prologue → butterfly after enter.

### 相逢鹊渡 · `meeting` · G1
WebGL world first; soft captions; `MeetingTitle` late.

### 前世 · `past` · G2
Sticky plates: 暮云 → 长风 → hold; oath lines late. No hard cut.

### 今世 · `present` · G3
Warm sticky; names + seal; Quiet Days motto reserved for later.

### 山高路远 · `journey` · G4
Self-contained sticky: wait → dual path → chains → embrace → hush.

### 我们 / Quiet Days / Letter / Ending · G5
Memories timeline → quiet tea → letter envelope → More Days · ∞ · 故与君鹊渡情长.

---

## 5 · Code map

| Concern | Path |
| --- | --- |
| Flow (this file) | `STORY_FLOW.md` |
| Chapter spine | `web/src/data/chapters.ts` |
| Meeting shots | `web/src/data/meetingShots.ts` |
| Film assembly | `web/src/components/story/StoryChapters.tsx` |
| Act components | `MeetingChapter` / `PastChapter` / `PresentChapter` / `JourneyChapter` / coda chapters |
| Persistent world | `web/src/components/three/World.tsx` |
| Chapter local hook | `web/src/hooks/useChapterLocal.ts` |

Retired from scroll spine:
- Standalone 祈祷 / 回应 · `ChapterDeck` · Story film-strip · Hero+Beat+Hero dumps · journey lead-in/outro album beats

---

## 6 · G1 checklist · 相逢鹊渡

- [x] World-first after Opening  
- [x] Depth layers + camera scrub  
- [x] Butterfly / magpie / bridge / late title  
- [x] Fast / reverse / mobile / reduced-motion coherent  

---

## 7 · Ongoing polish（optional）

- Deeper R3F morph between past → present (beyond fog + single plate)
- Letter paper micro-physics
- Journey WebGL dual-path (DOM sticky is the shipping cut)
