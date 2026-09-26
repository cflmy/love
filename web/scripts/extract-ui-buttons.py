#!/usr/bin/env python3
"""
Extract UI kit buttons with background removal + connected components.

Method (NOT straight-edge button cuts):
1. Load original PNGs from assert/zip (read-only).
2. Use generous search ROIs only as search windows (do not define the button shape).
3. Key out navy/black page background.
4. Keep the largest connected component inside the ROI (true silhouette + petals).
5. Flood-clear leftover bg from corners; dehalo dark fringe — never re-key dark interiors.

Never mutates assert/.
"""
from __future__ import annotations

import io
import zipfile
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "web" / "public" / "media" / "parts"
ZIP19 = ROOT / "assert" / "zip" / "19.zip"
ZIP22 = ROOT / "assert" / "zip" / "22.zip"

# Search windows only — final silhouette comes from connectivity.
DESKTOP_ROIS = {
    "start": (0.00, 0.14, 0.54, 0.44),
    "next": (0.00, 0.42, 0.54, 0.70),
    "prev": (0.00, 0.68, 0.54, 0.99),
    "more": (0.50, 0.14, 1.00, 0.36),
    "music": (0.50, 0.34, 1.00, 0.52),
    "pause": (0.50, 0.50, 1.00, 0.70),
    "memory": (0.50, 0.68, 1.00, 0.99),
}

MOBILE_ROIS = {
    "primary-mobile": (0.00, 0.10, 0.385, 0.35),
    "secondary-mobile": (0.40, 0.09, 0.78, 0.36),
}


def load_zip_png(zip_path: Path, inner: str) -> Image.Image:
    with zipfile.ZipFile(zip_path) as zf:
        return Image.open(io.BytesIO(zf.read(inner))).convert("RGBA")


def soft_alpha(rgba: np.ndarray, sigma: float = 0.28) -> np.ndarray:
    a = rgba[:, :, 3].astype(np.float32)
    s = ndimage.gaussian_filter(a, sigma)
    s = np.where(a > 230, np.maximum(s, a), s)
    out = rgba.copy()
    out[:, :, 3] = np.clip(s, 0, 255).astype(np.uint8)
    return out


def key_navy(im: Image.Image, thresh: float = 18.0, soft_w: float = 8.0) -> Image.Image:
    """Key page navy/black. Protect saturated / mid-bright button paint."""
    rgba = np.array(im.convert("RGBA"), dtype=np.float32)
    rgb = rgba[:, :, :3]
    edge = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]], 0)
    bg = np.median(edge, 0)
    refs = [
        bg,
        np.array([10.0, 18, 36]),
        np.array([5.0, 8, 16]),
        np.array([13.0, 22, 40]),
        np.array([8.0, 14, 28]),
    ]
    dist = np.min([np.linalg.norm(rgb - r, axis=2) for r in refs], axis=0)
    luma = rgb.mean(2)
    sat = rgb.max(2) - rgb.min(2)
    existing = rgba[:, :, 3]
    alpha = existing.copy()
    alpha = np.where((dist < thresh) | (luma < 16), 0.0, alpha)
    band = (dist >= thresh) & (dist < thresh + soft_w) & (luma < 45)
    alpha = np.where(band, existing * ((dist - thresh) / soft_w), alpha)
    protect = ((sat > 16) & (luma > 34)) | (luma > 58) | (sat > 36)
    alpha = np.where(protect, np.maximum(alpha, existing * 0.95), alpha)
    out = rgba.copy()
    out[:, :, 3] = np.clip(alpha, 0, 255)
    return Image.fromarray(soft_alpha(out.astype(np.uint8)), "RGBA")


def flood_clear_corners(im: Image.Image, luma_max: float = 45.0, dist_bg: float = 26.0) -> Image.Image:
    """Only clear background reachable from corners — never punch holes in dark interiors."""
    arr = np.array(im.convert("RGBA"))
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.float32)
    luma = rgb.mean(2)
    edge = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]], 0)
    bg = np.median(edge, 0)
    dist = np.linalg.norm(rgb - bg, axis=2)
    walkable = (arr[:, :, 3] < 35) | ((luma < luma_max) & (dist < dist_bg) & ((rgb.max(2) - rgb.min(2)) < 28))
    vis = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    seeds = [
        (0, 0),
        (0, w - 1),
        (h - 1, 0),
        (h - 1, w - 1),
        (0, w // 2),
        (h - 1, w // 2),
        (h // 2, 0),
        (h // 2, w - 1),
    ]
    for y, x in seeds:
        if walkable[y, x]:
            vis[y, x] = True
            q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not vis[ny, nx] and walkable[ny, nx]:
                vis[ny, nx] = True
                q.append((ny, nx))
    out = arr.copy()
    out[vis, 3] = 0
    return Image.fromarray(out, "RGBA")


def dehalo(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA")).astype(np.float32)
    a = arr[:, :, 3]
    rgb = arr[:, :, :3]
    near = ndimage.binary_dilation(a < 12, iterations=2) & (a > 6)
    luma = rgb.mean(2)
    sat = rgb.max(2) - rgb.min(2)
    kill = near & (luma < 55) & (sat < 26)
    arr[kill, 3] = 0
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


def tight(im: Image.Image, pad: int = 2) -> Image.Image:
    arr = np.array(im)
    m = arr[:, :, 3] > 16
    if not m.any():
        return im
    ys, xs = np.where(m)
    y0, y1 = max(0, ys.min() - pad), min(arr.shape[0], ys.max() + 1 + pad)
    x0, x1 = max(0, xs.min() - pad), min(arr.shape[1], xs.max() + 1 + pad)
    return Image.fromarray(arr[y0:y1, x0:x1].copy(), "RGBA")


def extract_in_roi(sheet: Image.Image, roi_frac: tuple[float, float, float, float], min_area: int = 350) -> Image.Image | None:
    w, h = sheet.size
    x0, y0, x1, y1 = roi_frac
    box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
    roi = sheet.crop(box)
    keyed = key_navy(roi)
    arr = np.array(keyed)
    mask = arr[:, :, 3] > 35
    if not mask.any():
        return None
    labeled, n = ndimage.label(mask)
    best_i, best_a = 0, 0
    for i in range(1, n + 1):
        area = int((labeled == i).sum())
        if area > best_a:
            best_a = area
            best_i = i
    if best_a < min_area:
        return None
    ys, xs = np.where(labeled == best_i)
    pad = 5
    hh, ww = mask.shape
    yy0, yy1 = max(0, int(ys.min()) - pad), min(hh, int(ys.max()) + 1 + pad)
    xx0, xx1 = max(0, int(xs.min()) - pad), min(ww, int(xs.max()) + 1 + pad)
    crop = arr[yy0:yy1, xx0:xx1].copy()
    local = labeled[yy0:yy1, xx0:xx1]
    crop[local != best_i, 3] = 0
    im = Image.fromarray(crop, "RGBA")
    # Clear leftover page bg only from outside; preserve dark button fills.
    im = flood_clear_corners(im)
    im = dehalo(im)
    return tight(im, pad=2)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if not ZIP19.exists():
        print(f"⚠ missing {ZIP19}")
        return

    desk = load_zip_png(ZIP19, "images/19_05.png")
    results: dict[str, Image.Image] = {}
    for name, roi in DESKTOP_ROIS.items():
        im = extract_in_roi(desk, roi, min_area=320)
        if im is None:
            print(f"⚠ failed desktop {name}")
            continue
        results[name] = im
        a0 = float((np.array(im)[:, :, 3] == 0).mean())
        print(f"✓ {name:16} {im.size[0]:3}x{im.size[1]:3}  transparent={a0:.0%}")

    if ZIP22.exists():
        mob = load_zip_png(ZIP22, "images/22_05.png")
        for name, roi in MOBILE_ROIS.items():
            im = extract_in_roi(mob, roi, min_area=180)
            if im is None:
                print(f"⚠ failed mobile {name}")
                continue
            results[name] = im
            a0 = float((np.array(im)[:, :, 3] == 0).mean())
            print(f"✓ {name:16} {im.size[0]:3}x{im.size[1]:3}  transparent={a0:.0%}")

    for old in OUT.glob("ui-btn-*.webp"):
        old.unlink()

    for name, im in results.items():
        dest = OUT / f"ui-btn-{name}.webp"
        im.save(dest, "WEBP", quality=92, method=4)
        print(f"  saved {dest.name}")

    print(f"UI buttons (connectivity) → {OUT}")


if __name__ == "__main__":
    main()
