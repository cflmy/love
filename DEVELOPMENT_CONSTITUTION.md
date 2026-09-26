# QDQC Development Constitution

> Extracted from `docs/007.md` (Cinematic Web Experience Skill).  
> Immutable sources (`docs/`, `assert/`) stay read-only. This file is the AI/dev working constitution.

---

## Mission

Build **QDQC · 鹊渡情长** as an interactive cinematic love story:

- interactive Oriental love movie
- living digital painting
- scroll-controlled cinematic experience
- illustrated love book with depth
- 2.5D / 3D spatial world

**Must not** feel like: PowerPoint, SaaS landing, fade-in sections, card gallery, template site, or “Three.js wallpaper + DOM”.

User-supplied assets are the primary art direction. Do not replace them with generic CSS shapes, gradients, emoji, stock art, or invented visuals.

---

## 1. Core principle

**Scrolling is camera movement through a world — not page navigation.**

Bad: scroll → section change → fade in/out.  
Good: scroll → camera moves → layered parallax → depth / light / particles / typography / sound respond → scene transforms.

Every important scroll section is a **film shot**.

---

## 2. Experience model

Think: WORLD · SHOT · CAMERA · SUBJECT · DEPTH · LIGHT · MOTION · TEXT · SOUND · TRANSITION  

Not: PAGE · SECTION · CARD · BUTTON (as layout primitives).

A chapter = sequence of cinematic shots driven by local progress `0→1`.

---

## 3. Stack

| Layer | Tool |
| --- | --- |
| App | Next.js + React + TypeScript |
| World | Three.js + R3F + Drei (+ postprocessing, restrained) |
| Motion | **GSAP + ScrollTrigger only** |
| Scroll transport | Lenis (synced to GSAP ticker) |
| State | Zustand |
| Audio | Howler behind MusicEngine |

Lenis ≠ animation. Smooth scroll ≠ cinema.

---

## 4. Absolute rule: no “smooth scroll website”

Insufficient: only `translateY` / `opacity` / CSS `transition` on scroll.

Required: **3–5+ independent motion systems** (layers + camera + subjects).

Example parallax factors (tune visually):

| Layer | factor |
| --- | --- |
| sky | 0.03 |
| moon | 0.06 |
| far mountain | 0.12 |
| near mountain | 0.22 |
| mist | 0.35 |
| water | 0.50 |
| bridge | 0.65 |
| butterfly | 0.85 |
| foreground | 1.20 |

Each layer defines: depth, position, rotation, scale, scrollMultiplier, opacity, blur, damping.

---

## 5. Persistent world

ONE WebGL canvas for the whole story. Prefer continuous transform between chapters (camera / color / dissolve / emerge), not cut → load → appear.

---

## 6. Camera is primary animation

Never leave camera at a fixed `[0,0,10]` for the whole site.

Each shot defines: from/to position, target, rotation, FOV, curve.

Shot types: establishing · slow dolly · reveal · orbit (sparingly) · tracking · focus pull · vertical reveal.

---

## 7. Depth layers (typical scene)

1 Atmosphere (mist / particles / clouds)  
2 Far background (moon / sky / mountains)  
3 Middle ground  
4 Story objects (bridge / creatures / characters)  
5 Foreground  
6 DOM text / UI in composition  

---

## 8. Temporal lag (inertia)

Layers must not arrive at the same time when the user scrolls fast. Different damping per object (moon slow, butterfly faster).

---

## 9. Subjects

- **Butterfly**: Bezier / Catmull-Rom path; flap; tangent rotation; bob; variable speed — never linear `x += c`.
- **Magpie**: distance silhouette → approach → land — never fade-in alone.
- **Bridge**: light sweep L→C→R + water response — never opacity 0→1 alone.

---

## 10. Buttons & UI

If button art exists in the kit: **use it**. Treat as illustrated world objects (normal / hover / press / focus). Placement belongs to composition, not always bottom-center. Desktop: subtle pointer tilt ≤3–5°. Mobile: press/release, hit area ≥44px. No hover-only UX.

---

## 11. Typography

Not “fade up from bottom”. Prefer mask / blur→focus / stagger / depth. Important lines appear in beats with silence. Do not rewrite canonical copy unless asked (see docs/007 §22).

---

## 12. Audio

Music is a narrative layer synced to progress. User gesture unlock first. Chapter themes crossfade. Ambience ≠ main theme.

---

## 13. Asset-first

Before a scene: inspect assets → classify → register in `web/src/data/assets.ts` with metadata. No silent placeholder language. Missing asset → TODO, keep visual language.

### Image framing (hard)

- Do **not** over-crop supplied art.
- Ban decorative photo `scale(1.02+)` that chops more of the image.
- Prefer `object-fit: contain` for narrative stills and banners.
- `cover` only for intentional full-bleed; no extra scale; protect subject with `object-position`.
- Never force ultra-wide banners into tall portrait frames via cover.

---

## 14. Quality gate (scene complete only if)

Depth (≥4 layers) · Camera perceptible · Parallax variance · Temporal lag · Subject motion · Living environment · Spatial transition · Cinematic type · Kit buttons · Physical UI feedback · Appropriate audio.

---

## 15. Anti-patterns (never unless asked)

1. Every section = `min-height: 100vh` fade  
2. Every heading = `translateY(50px)`  
3. Every image = opacity 0→1  
4. One static Three.js background  
5. One camera for entire site  
6. CSS rounded rect buttons instead of kit  
7. Every transition = crossfade  
8. Same easing everywhere  
9. Same particles every scene  
10. Static characters  
11. Smooth scroll treated as animation  
12. Random decorative particles everywhere  
13. Excessive bloom / blur  
14. Generic gradients / glass / cards  
15. Excessive text blocks / over-animation  

---

## 16. Emotional rhythm

Alternate: movement → quiet → movement → revelation → quiet → climax → silence. The site must breathe.

---

## 17. Development order

Vertical slice first: NFC → moon/water → butterfly → magpie → bridge → title → button.  
Gate: **相逢鹊渡** must feel cinematic before expanding other chapters.

---

## 18. Final principle

> QDQC is not a website containing a love story.  
> **QDQC IS the love story.**

Design **shots**, not pages.
