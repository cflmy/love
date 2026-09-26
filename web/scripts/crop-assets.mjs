#!/usr/bin/env node
/**
 * Crop multi-asset sheets from assert/image → web/public/media/crops
 * Never mutates assert/. Idempotent overwrite of crops only.
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

/** Relative crops: [name, file, x0, y0, x1, y1] in 0–1 fractions */
const CROPS = [
  // NFC cards
  ["nfc-front", "003.png", 0.02, 0.04, 0.48, 0.96],
  ["nfc-back", "003.png", 0.52, 0.04, 0.98, 0.96],
  ["portrait-her-card", "004.png", 0.06, 0.08, 0.44, 0.55],
  ["portrait-him-card", "004.png", 0.56, 0.08, 0.94, 0.55],
  ["nfc-alt-front", "004.png", 0.02, 0.02, 0.48, 0.98],
  ["nfc-alt-back", "004.png", 0.52, 0.02, 0.98, 0.98],

  // Full posters
  ["poster-him", "005.png", 0.0, 0.0, 1.0, 1.0],
  ["poster-her", "006.png", 0.0, 0.0, 1.0, 1.0],
  ["hero-desktop", "007.png", 0.0, 0.0, 1.0, 1.0],
  ["hero-ending", "011.png", 0.0, 0.0, 1.0, 1.0],

  // Butterfly sheet — main + poses (approx regions on 008)
  ["butterfly-hero", "008.png", 0.02, 0.08, 0.48, 0.92],
  ["butterfly-front", "008.png", 0.52, 0.08, 0.68, 0.32],
  ["butterfly-side", "008.png", 0.7, 0.08, 0.84, 0.32],
  ["butterfly-back", "008.png", 0.86, 0.08, 0.98, 0.32],

  // Magpie sheet
  ["magpie-hero", "009.png", 0.02, 0.08, 0.48, 0.92],
  ["magpie-spread", "009.png", 0.52, 0.08, 0.72, 0.36],
  ["magpie-flight", "009.png", 0.74, 0.08, 0.92, 0.36],

  // Bridge times of day (010) — 4 scene tiles roughly in left/main area
  ["bridge-night", "010.png", 0.02, 0.12, 0.36, 0.48],
  ["bridge-morning", "010.png", 0.38, 0.12, 0.62, 0.48],
  ["bridge-dusk", "010.png", 0.02, 0.52, 0.36, 0.88],
  ["bridge-snow", "010.png", 0.38, 0.52, 0.62, 0.88],
  ["bridge-full", "010.png", 0.02, 0.1, 0.55, 0.9],

  // 012 meeting triptych
  ["meet-1-she", "012.png", 0.01, 0.04, 0.33, 0.96],
  ["meet-2-he", "012.png", 0.34, 0.04, 0.66, 0.96],
  ["meet-3-bridge", "012.png", 0.67, 0.04, 0.99, 0.96],

  // 13 past life: 2 top + 4 bottom
  ["past-muyun", "13.png", 0.01, 0.02, 0.495, 0.52],
  ["past-changfeng", "13.png", 0.505, 0.02, 0.99, 0.52],
  ["past-meet", "13.png", 0.01, 0.54, 0.25, 0.98],
  ["past-travel", "13.png", 0.255, 0.54, 0.495, 0.98],
  ["past-hold", "13.png", 0.505, 0.54, 0.745, 0.98],
  ["past-seas", "13.png", 0.75, 0.54, 0.99, 0.98],

  // 14 present five: 2 top + 3 bottom — real-couple scenes
  ["life-1-meet", "14.png", 0.01, 0.02, 0.495, 0.48],
  ["life-2-know", "14.png", 0.505, 0.02, 0.99, 0.48],
  ["life-3-road", "14.png", 0.01, 0.5, 0.34, 0.98],
  ["life-4-luck", "14.png", 0.34, 0.5, 0.66, 0.98],
  ["life-5-future", "14.png", 0.66, 0.5, 0.99, 0.98],

  // 15 six panels 2x3
  ["day-1-sight", "15.png", 0.01, 0.02, 0.495, 0.34],
  ["day-2-daily", "15.png", 0.505, 0.02, 0.99, 0.34],
  ["day-3-travel", "15.png", 0.01, 0.34, 0.495, 0.66],
  ["day-4-special", "15.png", 0.505, 0.34, 0.99, 0.66],
  ["day-5-tea", "15.png", 0.01, 0.66, 0.495, 0.98],
  ["day-6-tomorrow", "15.png", 0.505, 0.66, 0.99, 0.98],

  // 16 nine modern journey 3x3
  ["road-1-wait", "16.png", 0.01, 0.02, 0.34, 0.34],
  ["road-2-depart", "16.png", 0.34, 0.02, 0.66, 0.34],
  ["road-3-climb", "16.png", 0.66, 0.02, 0.99, 0.34],
  ["road-4-run-her", "16.png", 0.01, 0.34, 0.34, 0.66],
  ["road-5-train", "16.png", 0.34, 0.34, 0.66, 0.66],
  ["road-6-before-sunset", "16.png", 0.66, 0.34, 0.99, 0.66],
  ["road-7-sun-holds", "16.png", 0.01, 0.66, 0.34, 0.98],
  ["road-8-embrace", "16.png", 0.34, 0.66, 0.66, 0.98],
  ["road-9-more-days", "16.png", 0.66, 0.66, 0.99, 0.98],

  // 17 eight xianxia 4x2
  ["myth-1-parting", "17.png", 0.01, 0.02, 0.25, 0.5],
  ["myth-2-waiting", "17.png", 0.25, 0.02, 0.5, 0.5],
  ["myth-3-road", "17.png", 0.5, 0.02, 0.75, 0.5],
  ["myth-4-phoenix", "17.png", 0.75, 0.02, 0.99, 0.5],
  ["myth-5-chains", "17.png", 0.01, 0.5, 0.25, 0.98],
  ["myth-6-run", "17.png", 0.25, 0.5, 0.5, 0.98],
  ["myth-7-embrace", "17.png", 0.5, 0.5, 0.75, 0.98],
  ["myth-8-never-sets", "17.png", 0.75, 0.5, 0.99, 0.98],

  // 18 storyboard mid row 8 panels (approx)
  ["story-1", "18.png", 0.01, 0.28, 0.135, 0.62],
  ["story-2", "18.png", 0.135, 0.28, 0.255, 0.62],
  ["story-3", "18.png", 0.255, 0.28, 0.375, 0.62],
  ["story-4", "18.png", 0.375, 0.28, 0.495, 0.62],
  ["story-5", "18.png", 0.505, 0.28, 0.625, 0.62],
  ["story-6", "18.png", 0.625, 0.28, 0.745, 0.62],
  ["story-7", "18.png", 0.745, 0.28, 0.865, 0.62],
  ["story-8", "18.png", 0.865, 0.28, 0.99, 0.62],
  ["story-banner", "18.png", 0.01, 0.02, 0.99, 0.26],
  ["story-quiet-tea", "18.png", 0.01, 0.64, 0.34, 0.98],
  ["story-letter", "18.png", 0.34, 0.64, 0.66, 0.98],
  ["story-coda", "18.png", 0.66, 0.64, 0.99, 0.98],
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
console.log(`\nCropped ${CROPS.length} assets → public/media/crops/`);
