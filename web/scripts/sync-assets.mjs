#!/usr/bin/env node
/**
 * Read-only sync: assert/ → web/public/
 * Never mutates docs/ or assert/.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ASSERT = path.join(ROOT, "assert");
const OUT_IMG = path.join(__dirname, "../public/media/image");
const OUT_AUD = path.join(__dirname, "../public/audio");

const MUSIC_MAP = [
  ["PROLOGUE 01.mp4", "prologue-01.m4a"],
  ["ACT I 02｜我们一起祈祷.mp4", "act1-02-prayer.m4a"],
  ["ACT I 03｜时间的回应.mp4", "act1-03-response.m4a"],
  ["ACT II 04｜相逢.mp4", "act2-04-butterfly.m4a"],
  ["ACT II 05｜鹊渡.mp4", "act2-05-bridge.m4a"],
  ["ACT III・前世.mp4", "act3-past.m4a"],
  ["07｜长风.mp4", "act3-07-changfeng.m4a"],
  ["08｜长风恋暮云.mp4", "act3-08-promise.m4a"],
  ["ACT IV・今世.mp4", "act4-present.m4a"],
  ["10｜与君日安.mp4", "act4-10-quiet-days.m4a"],
  ["ACT V・山高路远.mp4", "act5-journey.m4a"],
  ["12｜不必着急.mp4", "act5-12-dont-hurry.m4a"],
  ["13｜翻山越岭.mp4", "act5-13-mountains.m4a"],
  ["14｜双向奔赴.mp4", "act5-14-toward-you.m4a"],
  ["ACT VI 15｜只要你回来.mp4", "act6-15-sun.m4a"],
  ["16｜鹊渡情长.mp4", "act6-16-reprise.m4a"],
  ["17｜More Days Together.mp4", "act6-17-more-days.m4a"],
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log("✓", path.relative(ROOT, dest));
}

ensureDir(OUT_IMG);
ensureDir(OUT_AUD);

const images = fs
  .readdirSync(path.join(ASSERT, "image"))
  .filter((f) => f.endsWith(".png"));
for (const file of images) {
  copyFile(path.join(ASSERT, "image", file), path.join(OUT_IMG, file));
}

for (const [srcName, destName] of MUSIC_MAP) {
  const src = path.join(ASSERT, "music", srcName);
  if (!fs.existsSync(src)) {
    console.warn("⚠ missing music:", srcName);
    continue;
  }
  copyFile(src, path.join(OUT_AUD, destName));
}

console.log("\nAsset sync complete (sources untouched).");
