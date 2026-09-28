#!/usr/bin/env node
/**
 * Build static export (`out/`) and force-push it to origin/public
 * (orphan branch — site root only, for Pages hosting).
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repoRoot = resolve(webRoot, "..");
const outDir = join(webRoot, "out");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    encoding: "utf8",
    ...opts,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
  return r;
}

function runCapture(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    ...opts,
  });
  if (r.status !== 0) {
    const err = (r.stderr || r.stdout || "").trim();
    throw new Error(err || `${cmd} ${args.join(" ")} failed`);
  }
  return (r.stdout || "").trim();
}

const skipBuild = process.argv.includes("--skip-build");
if (skipBuild) {
  console.log("→ skip build (using existing web/out)");
} else {
  // `next build` occasionally hangs after a successful export; bound it.
  console.log("→ next build (static export, timeout 180s)");
  const build = spawnSync("timeout", ["180", "npm", "run", "build"], {
    cwd: webRoot,
    stdio: "inherit",
    shell: true,
  });
  // 124 = timeout killed after success path; only fail on real build errors.
  if (build.status !== 0 && build.status !== 124) {
    process.exit(build.status ?? 1);
  }
}

if (!existsSync(join(outDir, "index.html"))) {
  console.error("Missing web/out/index.html — run npm run build first");
  process.exit(1);
}

// Pages hosts that still run Jekyll ignore `_next/` unless this exists.
writeFileSync(join(outDir, ".nojekyll"), "");

const remote = runCapture("git", ["remote", "get-url", "origin"], {
  cwd: repoRoot,
});
const sha = runCapture("git", ["rev-parse", "--short", "HEAD"], {
  cwd: repoRoot,
});
const stamp = new Date().toISOString();

const stage = mkdtempSync(join(tmpdir(), "qdqc-public-"));
try {
  cpSync(outDir, stage, { recursive: true });

  run("git", ["init", "-b", "public"], { cwd: stage });
  run("git", ["add", "-A"], { cwd: stage });
  // Identity only for this throwaway repo (does not touch user git config).
  run(
    "git",
    [
      "-c",
      "user.name=QDQC Deploy",
      "-c",
      "user.email=deploy@qdqc.local",
      "commit",
      "-m",
      `Deploy static site from ${sha} (${stamp})`,
    ],
    { cwd: stage },
  );
  run("git", ["remote", "add", "origin", remote], { cwd: stage });
  console.log("→ git push -f origin public");
  run("git", ["push", "-f", "origin", "public"], { cwd: stage });
  console.log("✓ published origin/public");
} finally {
  rmSync(stage, { recursive: true, force: true });
}
