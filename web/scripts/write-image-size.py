#!/usr/bin/env python3
"""Write web/src/data/imageSize.ts from public/media intrinsic sizes."""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MEDIA = ROOT / "web" / "public" / "media"
OUT = ROOT / "web" / "src" / "data" / "imageSize.ts"


def main() -> None:
    meta: dict[str, tuple[int, int]] = {}
    for folder in ("crops", "parts"):
        d = MEDIA / folder
        if not d.exists():
            continue
        for p in sorted(d.glob("*.webp")):
            im = Image.open(p)
            meta[f"/media/{folder}/{p.name}"] = im.size

    lines = [
        "/** Intrinsic pixel sizes for public media (regenerate after sync:assets). */\n",
        "export const imageSize: Record<string, { w: number; h: number }> = {\n",
    ]
    for src, (w, h) in sorted(meta.items()):
        lines.append(f'  "{src}": {{ w: {w}, h: {h} }},\n')
    lines += [
        "} as const;\n\n",
        "export function sizeOf(src: string): { w: number; h: number } {\n",
        "  return imageSize[src] ?? { w: 1200, h: 800 };\n",
        "}\n",
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("".join(lines), encoding="utf-8")
    print(f"✓ imageSize.ts ({len(meta)} entries)")


if __name__ == "__main__":
    main()
