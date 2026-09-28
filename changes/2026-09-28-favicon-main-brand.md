# Favicon uses 主标设计

- **Date**: 2026-09-28
- **Scope**: Assets | Config
- **Summary**: Replace the 16-logo sheet favicon with the cleaned `002_01` main brand mark (「01 主标设计」 label removed).

## Changed
- `assert/img/002_01.png` — source only (read-only); cropped bottom label out before export
- `web/public/icons/brand-mark.png` — cleaned main mark (336×338, no design-label text)
- `web/public/icons/icon-192.png` / `icon-512.png` / `apple-touch-icon.png` — square cream-padded icons from cleaned mark
- `web/src/app/favicon.ico` / `web/public/favicon.ico` — multi-size ICO (16/32/48/64)
- `web/public/media/slices/002/002_01.webp` — same crop so `brand.hero` no longer shows 「01 主标设计」
- `web/src/app/layout.tsx` — metadata icons point at favicon + 192/512 PNGs

## Notes
- Original under `assert/` untouched.
- At tiny favicon sizes the portrait + wordmark remain readable as a silhouette; PWA icons keep the full mark.
