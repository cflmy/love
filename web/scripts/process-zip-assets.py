#!/usr/bin/env python3
"""
Process assert/zip manual slices → web/public/media/slices (+ crops aliases).
Never mutates assert/. Filters spacer tiles, chroma-keys cream sheets,
splits multi-component rows by connectivity (column fallback if trails merge).
"""
from __future__ import annotations

import json
import os
import shutil
import zipfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
ZIP_DIR = ROOT / "assert" / "zip"
OUT_SLICES = ROOT / "web" / "public" / "media" / "slices"
OUT_CROPS = ROOT / "web" / "public" / "media" / "crops"
OUT_PARTS = ROOT / "web" / "public" / "media" / "parts"
TMP = Path("/tmp/qdqc-zip-work")

# Soft cream / parchment backgrounds used on pose & UI sheets
CREAM_REF = np.array([246, 239, 232], dtype=np.float32)
CREAM_THRESH = 38.0  # color distance; higher = more aggressive keying

# Sheets that need bg removal + connectivity / column split into parts/
# mode: "auto" | "columns" | "connect" | "dark-columns"
SPLIT_SHEETS = {
    # butterfly flight strip — trails often merge; prefer columns
    "008/008_08": {
        "prefix": "butterfly-flight",
        "min_area": 500,
        "pad": 4,
        "mode": "columns",
        "expect": 5,
        "key": "cream",
    },
    "008/008_11": {
        "prefix": "butterfly-element",
        "min_area": 350,
        "pad": 6,
        "mode": "connect",
        "key": "cream",
    },
    # magpie pose row (4) + flight strips
    "009/009_02": {
        "prefix": "magpie-pose",
        "min_area": 800,
        "pad": 6,
        "mode": "columns",
        "expect": 4,
        "key": "cream",
        "trim_labels": True,
        "trim_top": 0.14,
    },
    "009/009_04": {
        "prefix": "magpie-flight",
        "min_area": 400,
        "pad": 4,
        "mode": "columns",
        "expect": 6,
        "key": "cream",
    },
    "009/009_05": {
        "prefix": "magpie-flight-b",
        "min_area": 400,
        "pad": 4,
        "mode": "columns",
        "expect": 5,
        "key": "cream",
    },
    "009/009_06": {
        "prefix": "magpie-element",
        "min_area": 350,
        "pad": 6,
        "mode": "connect",
        "key": "cream",
    },
    "009/009_07": {
        "prefix": "magpie-element-b",
        "min_area": 350,
        "pad": 6,
        "mode": "connect",
        "key": "cream",
    },
    "010/010_08": {
        "prefix": "bridge-row",
        "min_area": 400,
        "pad": 4,
        "mode": "columns",
        "expect": 4,
        "key": "cream",
    },
    "010/010_10": {
        "prefix": "bridge-icon",
        "min_area": 200,
        "pad": 2,
        "mode": "connect",
        "key": "cream",
    },
    # UI kits sit on dark navy — column-split non-dark content
    "19/19_03": {
        "prefix": "ui19-nav",
        "min_area": 400,
        "pad": 4,
        "mode": "dark-columns",
        "expect": 0,
        "key": "dark",
    },
    "20/20_01": {
        "prefix": "ui20-btn-row",
        "min_area": 400,
        "pad": 4,
        "mode": "dark-columns",
        "expect": 3,
        "key": "dark",
    },
    "20/20_09": {
        "prefix": "ui20-dialog",
        "min_area": 800,
        "pad": 4,
        "mode": "connect",
        "key": "dark",
    },
    "21/21_01": {
        "prefix": "ui21-btn-row",
        "min_area": 400,
        "pad": 4,
        "mode": "dark-columns",
        "expect": 4,
        "key": "dark",
    },
    "22/22_05": {
        "prefix": "ui22-btn",
        "min_area": 300,
        "pad": 4,
        "mode": "dark-columns",
        "expect": 2,
        "key": "dark",
    },
}

# Single-subject pose tiles: remove cream bg, keep one subject (largest blob)
KEY_SUBJECTS = {
    "008/008_03": "butterfly-front",
    "008/008_05": "butterfly-side",
    "008/008_07": "butterfly-back",
    "010/010_05": "bridge-snow-tile",
    "010/010_06": "bridge-morning-tile",
    "010/010_07": "bridge-dusk-tile",
    "010/010_18": "bridge-variant-a",
    "010/010_19": "bridge-variant-b",
    "010/010_20": "bridge-variant-c",
}

# Semantic aliases: name → relative path under slices/ (sheet_id/file)
# Overwrites web/public/media/crops/{name}.webp so existing imports keep working.
CROP_ALIASES = {
    # butterfly / magpie heroes & poses
    "butterfly-hero": "008/008_01.webp",
    "butterfly-front": "parts/butterfly-front.webp",
    "butterfly-side": "parts/butterfly-side.webp",
    "butterfly-back": "parts/butterfly-back.webp",
    "magpie-hero": "009/009_01.webp",
    "magpie-spread": "parts/magpie-pose-01.webp",
    "magpie-flight": "parts/magpie-flight-01.webp",
    "magpie-side": "parts/magpie-pose-02.webp",
    "magpie-perch": "parts/magpie-pose-03.webp",
    "magpie-back": "parts/magpie-pose-04.webp",
    # bridge
    "bridge-full": "010/010_01.webp",
    "bridge-night": "010/010_01.webp",
    "bridge-snow": "parts/bridge-snow-tile.webp",
    "bridge-morning": "parts/bridge-morning-tile.webp",
    "bridge-dusk": "parts/bridge-dusk-tile.webp",
    # meeting
    "meet-1-she": "012/012_01.webp",
    "meet-2-he": "012/012_02.webp",
    "meet-3-bridge": "012/012_03.webp",
    # past (13)
    "past-muyun": "13/13_01.webp",
    "past-changfeng": "13/13_02.webp",
    "past-meet": "13/13_04.webp",
    "past-travel": "13/13_06.webp",
    "past-hold": "13/13_07.webp",
    "past-seas": "13/13_08.webp",
    # present (14)
    "life-1-meet": "14/14_01.webp",
    "life-2-know": "14/14_02.webp",
    "life-3-road": "14/14_03.webp",
    "life-4-luck": "14/14_04.webp",
    "life-5-future": "14/14_05.webp",
    # quiet days boards (15) — skip spacer 02/07
    "day-1-sight": "15/15_01.webp",
    "day-2-daily": "15/15_03.webp",
    "day-3-travel": "15/15_04.webp",
    "day-4-special": "15/15_05.webp",
    "day-5-tea": "15/15_06.webp",
    "day-6-tomorrow": "15/15_08.webp",
    # journey (16) — 8 panels in zip
    "road-1-wait": "16/16_01.webp",
    "road-2-depart": "16/16_02.webp",
    "road-3-climb": "16/16_03.webp",
    "road-4-run-her": "16/16_04.webp",
    "road-5-train": "16/16_05.webp",
    "road-6-before-sunset": "16/16_06.webp",
    "road-7-sun-holds": "16/16_07.webp",
    "road-8-embrace": "16/16_08.webp",
    "road-9-more-days": "16/16_08.webp",  # nearest available
    # myth (17) — skip spacer 06
    "myth-1-parting": "17/17_01.webp",
    "myth-2-waiting": "17/17_02.webp",
    "myth-3-road": "17/17_03.webp",
    "myth-4-phoenix": "17/17_04.webp",
    "myth-5-chains": "17/17_05.webp",
    "myth-6-run": "17/17_07.webp",
    "myth-7-embrace": "17/17_08.webp",
    "myth-8-never-sets": "17/17_09.webp",
    # storyboard (18)
    "story-banner": "18/18_01.webp",
    "story-1": "18/18_06.webp",
    "story-2": "18/18_07.webp",
    "story-3": "18/18_09.webp",
    "story-4": "18/18_10.webp",
    "story-5": "18/18_11.webp",
    "story-6": "18/18_12.webp",
    "story-7": "18/18_03.webp",
    "story-8": "18/18_05.webp",
    "story-quiet-tea": "18/18_29.webp",
    "story-letter": "18/18_30.webp",
    "story-coda": "18/18_33.webp",
}


def is_spacer(im: Image.Image) -> bool:
    w, h = im.size
    if w <= 3 or h <= 3:
        return True
    if w * h < 80:
        return True
    return False


def soft_edge_cleanup(rgba: np.ndarray, erode: int = 0) -> np.ndarray:
    """Trim tiny fringe pixels left by manual cuts; soften hard alpha edges."""
    alpha = rgba[:, :, 3]
    if erode > 0:
        mask = alpha > 8
        mask = ndimage.binary_erosion(mask, iterations=erode)
        rgba = rgba.copy()
        rgba[~mask, 3] = 0
        alpha = rgba[:, :, 3]
    # feather 1px
    soft = ndimage.gaussian_filter(alpha.astype(np.float32), sigma=0.6)
    rgba = rgba.copy()
    rgba[:, :, 3] = np.clip(soft, 0, 255).astype(np.uint8)
    return rgba


def chroma_key_cream(im: Image.Image, thresh: float = CREAM_THRESH) -> Image.Image:
    """Make near-cream / near-white parchment transparent; keep subject."""
    rgba = np.array(im.convert("RGBA"), dtype=np.float32)
    rgb = rgba[:, :, :3]
    # distance to cream ref + near-white
    d_cream = np.linalg.norm(rgb - CREAM_REF, axis=2)
    white = np.array([252, 250, 246], dtype=np.float32)
    d_white = np.linalg.norm(rgb - white, axis=2)
    dist = np.minimum(d_cream, d_white)
    # also treat existing low alpha as transparent
    existing_a = rgba[:, :, 3]
    alpha = np.where(dist < thresh, 0.0, existing_a)
    # soft falloff near threshold
    band = (dist >= thresh) & (dist < thresh + 18)
    alpha = np.where(
        band,
        existing_a * np.clip((dist - thresh) / 18.0, 0, 1),
        alpha,
    )
    # protect saturated / dark content (birds, blues) even if near cream fringe
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    luma = rgb.mean(axis=2)
    protect = (sat > 28) | (luma < 200)
    alpha = np.where(protect & (dist < thresh + 8), np.maximum(alpha, existing_a * 0.85), alpha)
    out = rgba.copy()
    out[:, :, 3] = np.clip(alpha, 0, 255)
    out = soft_edge_cleanup(out.astype(np.uint8), erode=0)
    return Image.fromarray(out, "RGBA")


def connected_crops(
    im: Image.Image,
    min_area: int = 500,
    pad: int = 4,
    max_parts: int = 24,
) -> list[Image.Image]:
    """Split transparent image into connected components (sorted L→R then T→B)."""
    arr = np.array(im.convert("RGBA"))
    mask = arr[:, :, 3] > 24
    if not mask.any():
        return []
    labeled, n = ndimage.label(mask)
    parts: list[tuple[int, int, Image.Image]] = []
    h, w = mask.shape
    for i in range(1, n + 1):
        ys, xs = np.where(labeled == i)
        area = ys.size
        if area < min_area:
            continue
        y0, y1 = int(ys.min()), int(ys.max()) + 1
        x0, x1 = int(xs.min()), int(xs.max()) + 1
        y0 = max(0, y0 - pad)
        x0 = max(0, x0 - pad)
        y1 = min(h, y1 + pad)
        x1 = min(w, x1 + pad)
        crop = arr[y0:y1, x0:x1].copy()
        # zero out other labels inside bbox
        local = labeled[y0:y1, x0:x1]
        crop[local != i, 3] = 0
        parts.append((x0, y0, Image.fromarray(crop, "RGBA")))
    parts.sort(key=lambda t: (t[1] // max(h // 4, 1), t[0]))
    return [p[2] for p in parts[:max_parts]]


def column_split_fallback(
    im: Image.Image,
    min_gap: int = 8,
    min_w: int = 40,
    expect: int = 0,
) -> list[Image.Image]:
    """Split by vertical gutters; if expect>0 and gutters fail, equal-width buckets."""
    arr = np.array(im.convert("RGBA"))
    # prefer alpha; fall back to non-cream / non-dark luminance mask
    alpha = arr[:, :, 3] > 24
    if alpha.mean() > 0.92:
        rgb = arr[:, :, :3].astype(np.float32)
        luma = rgb.mean(axis=2)
        # content = not near cream AND not near pure black page margin
        d_cream = np.linalg.norm(rgb - CREAM_REF, axis=2)
        content = (d_cream > CREAM_THRESH) & (luma > 18)
        col = content.any(axis=0)
    else:
        col = alpha.any(axis=0)

    parts: list[Image.Image] = []
    h, w = arr.shape[:2]
    i = 0
    while i < w:
        while i < w and not col[i]:
            i += 1
        if i >= w:
            break
        start = i
        while i < w and col[i]:
            i += 1
        while i < w and not col[i]:
            gap = 0
            j = i
            while j < w and not col[j]:
                gap += 1
                j += 1
            if gap <= min_gap and j < w and col[j]:
                i = j
                continue
            break
        end = i
        if end - start >= min_w:
            crop = arr[:, start:end].copy()
            parts.append(Image.fromarray(crop, "RGBA"))

    if expect > 0 and (len(parts) < expect * 0.6 or len(parts) > expect * 1.6):
        # equal-width split across content bbox
        xs = np.where(col)[0]
        if xs.size == 0:
            return parts
        x0, x1 = int(xs.min()), int(xs.max()) + 1
        width = x1 - x0
        step = width / expect
        parts = []
        for k in range(expect):
            a = x0 + int(round(k * step))
            b = x0 + int(round((k + 1) * step))
            parts.append(Image.fromarray(arr[:, a:b], "RGBA"))
    return parts


def chroma_key_dark(im: Image.Image, thresh: float = 28.0) -> Image.Image:
    """Key out near-black / navy UI kit backgrounds."""
    rgba = np.array(im.convert("RGBA"), dtype=np.float32)
    rgb = rgba[:, :, :3]
    # sample edge median as bg
    edge = np.concatenate(
        [rgb[0, :, :], rgb[-1, :, :], rgb[:, 0, :], rgb[:, -1, :]],
        axis=0,
    )
    bg = np.median(edge, axis=0)
    dist = np.linalg.norm(rgb - bg, axis=2)
    existing_a = rgba[:, :, 3]
    alpha = np.where(dist < thresh, 0.0, existing_a)
    band = (dist >= thresh) & (dist < thresh + 16)
    alpha = np.where(band, existing_a * ((dist - thresh) / 16.0), alpha)
    out = rgba.copy()
    out[:, :, 3] = np.clip(alpha, 0, 255)
    return Image.fromarray(soft_edge_cleanup(out.astype(np.uint8)), "RGBA")


def trim_bottom_label(im: Image.Image, frac: float = 0.18) -> Image.Image:
    """Drop pose-sheet Chinese labels under subjects."""
    w, h = im.size
    cut = int(h * (1 - frac))
    return im.crop((0, 0, w, cut))


def trim_top_band(im: Image.Image, frac: float = 0.12) -> Image.Image:
    w, h = im.size
    return im.crop((0, int(h * frac), w, h))


def save_webp(im: Image.Image, dest: Path, quality: int = 88) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=4)


def extract_zips() -> None:
    if TMP.exists():
        shutil.rmtree(TMP)
    TMP.mkdir(parents=True)
    for zpath in sorted(ZIP_DIR.glob("*.zip")):
        name = zpath.stem
        dest = TMP / name
        dest.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zpath, "r") as zf:
            zf.extractall(dest)
        print(f"✓ extracted {zpath.name}")


def export_slices() -> dict:
    """Copy usable tiles → slices/{id}/; return inventory."""
    if OUT_SLICES.exists():
        shutil.rmtree(OUT_SLICES)
    OUT_SLICES.mkdir(parents=True)
    inventory: dict[str, list[str]] = {}
    for sheet in sorted(p for p in TMP.iterdir() if p.is_dir()):
        img_dir = sheet / "images"
        if not img_dir.exists():
            # sometimes flat
            img_dir = sheet
        kept: list[str] = []
        for src in sorted(img_dir.glob("*.png")):
            im = Image.open(src)
            if is_spacer(im):
                continue
            # gentle edge soften for all RGB slices (manual cut fringe)
            rgba = im.convert("RGBA")
            arr = soft_edge_cleanup(np.array(rgba), erode=0)
            # only feather where image already had transparency; for opaque
            # scene panels keep solid alpha
            if im.mode != "RGBA" and "A" not in im.getbands():
                arr[:, :, 3] = 255
            out = Image.fromarray(arr, "RGBA")
            rel = f"{sheet.name}/{src.stem}.webp"
            save_webp(out, OUT_SLICES / rel)
            kept.append(src.stem)
        inventory[sheet.name] = kept
        print(f"✓ slices {sheet.name}: {len(kept)} tiles")
    return inventory


def process_keyed_and_splits() -> None:
    if OUT_PARTS.exists():
        shutil.rmtree(OUT_PARTS)
    OUT_PARTS.mkdir(parents=True)

    # subject keying
    for key, out_name in KEY_SUBJECTS.items():
        sheet, stem = key.split("/")
        src = TMP / sheet / "images" / f"{stem}.png"
        if not src.exists():
            print(f"⚠ missing {src}")
            continue
        keyed = chroma_key_cream(Image.open(src))
        # keep largest component only (drop labels)
        parts = connected_crops(keyed, min_area=600, pad=6)
        subject = max(parts, key=lambda p: p.size[0] * p.size[1]) if parts else keyed
        save_webp(subject, OUT_PARTS / f"{out_name}.webp")
        print(f"✓ subject {out_name}  {subject.size}")

    # multi-part splits
    for key, cfg in SPLIT_SHEETS.items():
        sheet, stem = key.split("/")
        src = TMP / sheet / "images" / f"{stem}.png"
        if not src.exists():
            print(f"⚠ missing {src}")
            continue
        raw = Image.open(src)
        if cfg.get("trim_top"):
            raw = trim_top_band(raw, float(cfg["trim_top"]))
        if cfg.get("trim_labels"):
            raw = trim_bottom_label(raw, 0.16)
        key_mode = cfg.get("key", "cream")
        keyed = chroma_key_dark(raw) if key_mode == "dark" else chroma_key_cream(raw)
        mode = cfg.get("mode", "auto")
        expect = int(cfg.get("expect") or 0)
        parts: list[Image.Image] = []
        if mode in ("columns", "dark-columns"):
            parts = column_split_fallback(
                keyed, min_gap=6 if mode == "columns" else 12, min_w=28, expect=expect
            )
            parts = [
                (chroma_key_dark(p) if key_mode == "dark" else chroma_key_cream(p, thresh=CREAM_THRESH - 4))
                for p in parts
            ]
        elif mode == "connect":
            parts = connected_crops(keyed, min_area=cfg["min_area"], pad=cfg["pad"])
            if len(parts) <= 1:
                parts = column_split_fallback(keyed, expect=expect)
        else:  # auto
            parts = connected_crops(keyed, min_area=cfg["min_area"], pad=cfg["pad"])
            if len(parts) <= 1:
                parts = column_split_fallback(keyed, expect=expect)
                parts = [chroma_key_cream(p, thresh=CREAM_THRESH - 4) for p in parts]

        parts = [p for p in parts if p.size[0] * p.size[1] >= cfg["min_area"]]
        # crop each part to opaque content bbox
        tight: list[Image.Image] = []
        for p in parts:
            a = np.array(p.convert("RGBA"))
            m = a[:, :, 3] > 20
            if not m.any():
                continue
            ys, xs = np.where(m)
            pad = cfg["pad"]
            y0, y1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + 1 + pad)
            x0, x1 = max(0, xs.min() - pad), min(a.shape[1], xs.max() + 1 + pad)
            tight.append(Image.fromarray(a[y0:y1, x0:x1], "RGBA"))
        parts = tight

        prefix = cfg["prefix"]
        for i, part in enumerate(parts, 1):
            name = f"{prefix}-{i:02d}.webp"
            save_webp(part, OUT_PARTS / name)
        print(f"✓ split {key} → {len(parts)} parts ({prefix})")


def write_crop_aliases() -> None:
    """Refresh crops/ aliases used by the app (keep NFC/poster crops if no zip)."""
    OUT_CROPS.mkdir(parents=True, exist_ok=True)
    written = 0
    for name, rel in CROP_ALIASES.items():
        # parts live under media/parts; slices under media/slices
        if rel.startswith("parts/"):
            src = OUT_PARTS / rel.split("/", 1)[1]
        else:
            src = OUT_SLICES / rel
        if not src.exists():
            print(f"⚠ alias miss {name} ← {rel}")
            continue
        dest = OUT_CROPS / f"{name}.webp"
        shutil.copy2(src, dest)
        written += 1
    print(f"✓ crop aliases updated: {written}")


def write_manifest(inventory: dict) -> None:
    parts = sorted(p.name for p in OUT_PARTS.glob("*.webp")) if OUT_PARTS.exists() else []
    manifest = {
        "slices": inventory,
        "parts": parts,
        "cropAliases": CROP_ALIASES,
    }
    path = OUT_SLICES / "manifest.json"
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ manifest → {path.relative_to(ROOT)}")


def main() -> None:
    if not ZIP_DIR.exists():
        raise SystemExit(f"missing {ZIP_DIR}")
    print("== process-zip-assets ==")
    extract_zips()
    inventory = export_slices()
    process_keyed_and_splits()
    write_crop_aliases()
    write_manifest(inventory)
    print("done (assert/ untouched)")


if __name__ == "__main__":
    main()
