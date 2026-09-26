#!/usr/bin/env python3
"""
Extract individual UI kit buttons from desktop/mobile slices into media/parts/.
Survives sync:sync runs this after process-zip-assets.py.
Never mutates assert/.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SLICES = ROOT / "web" / "public" / "media" / "slices"
OUT = ROOT / "web" / "public" / "media" / "parts"

# Fractional crops tuned to kit sheets (19_05 desktop buttons, 22_05 mobile).
DESKTOP = {
    "ui-btn-start": (0.02, 0.18, 0.52, 0.48),
    "ui-btn-next": (0.02, 0.48, 0.52, 0.72),
    "ui-btn-prev": (0.02, 0.72, 0.52, 0.98),
    "ui-btn-more": (0.52, 0.16, 0.98, 0.36),
    "ui-btn-music": (0.52, 0.36, 0.98, 0.54),
    "ui-btn-pause": (0.52, 0.54, 0.98, 0.72),
    "ui-btn-memory": (0.52, 0.72, 0.98, 0.98),
}

MOBILE = {
    "ui-btn-primary-mobile": (0.01, 0.10, 0.385, 0.40),
    "ui-btn-secondary-mobile": (0.385, 0.10, 0.70, 0.40),
}


def crop_frac(im: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = im.size
    x0, y0, x1, y1 = box
    return im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    desk = SLICES / "19" / "19_05.webp"
    mob = SLICES / "22" / "22_05.webp"
    if not desk.exists():
        print(f"⚠ missing {desk}")
        return
    src = Image.open(desk).convert("RGBA")
    for name, frac in DESKTOP.items():
        crop = crop_frac(src, frac)
        dest = OUT / f"{name}.webp"
        crop.save(dest, "WEBP", quality=90, method=4)
        print(f"✓ {dest.name}  {crop.size[0]}x{crop.size[1]}")

    if mob.exists():
        src2 = Image.open(mob).convert("RGBA")
        for name, frac in MOBILE.items():
            crop = crop_frac(src2, frac)
            dest = OUT / f"{name}.webp"
            crop.save(dest, "WEBP", quality=90, method=4)
            print(f"✓ {dest.name}  {crop.size[0]}x{crop.size[1]}")
    print(f"UI buttons → {OUT}")


if __name__ == "__main__":
    main()
