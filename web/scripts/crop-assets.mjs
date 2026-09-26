#!/usr/bin/env node
/**
 * Crop ONLY sheets that have no assert/zip counterpart (NFC / posters / heroes).
 * Multi-panel sheets are handled by process-zip-assets.py from manual slices.
 * Never mutates assert/.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "assert/image");
const OUT = path.join(__dirname, "../public/media/crops");

fs.mkdirSync(OUT, { recursive: true });

/** Only assets without zip slices — keep these fractional crops. */
const CROPS = [
  ["nfc-front", "003.png", 0.02, 0.04, 0.48, 0.96],
  ["nfc-back", "003.png", 0.52, 0.04, 0.98, 0.96],
  ["portrait-her-card", "004.png", 0.06, 0.08, 0.44, 0.55],
  ["portrait-him-card", "004.png", 0.56, 0.08, 0.94, 0.55],
  ["nfc-alt-front", "004.png", 0.02, 0.02, 0.48, 0.98],
  ["nfc-alt-back", "004.png", 0.52, 0.02, 0.98, 0.98],
  ["poster-him", "005.png", 0.0, 0.0, 1.0, 1.0],
  ["poster-her", "006.png", 0.0, 0.0, 1.0, 1.0],
  ["hero-desktop", "007.png", 0.0, 0.0, 1.0, 1.0],
  ["hero-ending", "011.png", 0.0, 0.0, 1.0, 1.0],
];

const py = `
from PIL import Image
from pathlib import Path
import json, sys
crops = json.loads(sys.stdin.read())
src_root = Path(${JSON.stringify(SRC)})
out_root = Path(${JSON.stringify(OUT)})
out_root.mkdir(parents=True, exist_ok=True)
cache = {}
for name, file, x0, y0, x1, y1 in crops:
    if file not in cache:
        cache[file] = Image.open(src_root / file).convert('RGBA')
    im = cache[file]
    w, h = im.size
    box = (int(x0*w), int(y0*h), int(x1*w), int(y1*h))
    crop = im.crop(box)
    dest = out_root / f'{name}.webp'
    crop.save(dest, 'WEBP', quality=86, method=4)
    print(f'✓ {dest.name}  {crop.size[0]}x{crop.size[1]}')
`;

const result = spawnSync("python3", ["-c", py], {
  input: JSON.stringify(CROPS),
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status || 1);
console.log(`\nCropped ${CROPS.length} NFC/poster/hero assets → public/media/crops/`);
