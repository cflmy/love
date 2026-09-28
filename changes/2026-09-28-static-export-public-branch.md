# Static export → origin/public

- **Date**: 2026-09-28
- **Scope**: Config | Docs
- **Summary**: Enable Next.js static export and publish `web/out` as an orphan `public` branch for Pages hosting.

## Changed
- `web/next.config.ts` — `output: "export"`, `trailingSlash: true`, `images.unoptimized` for static hosts
- `web/package.json` — add `deploy:public` script
- `web/scripts/deploy-public.mjs` — build (optional `--skip-build`) and force-push orphan `origin/public` with `.nojekyll`

## Notes
- Local static output: `web/out/` (~143MB). Re-publish: `cd web && npm run deploy:public`
- Gitee Pages: set source branch to `public` (root) in repo Pages settings
- `next build` may linger after export; deploy script uses `timeout 180` (exit 124 allowed if `out/` is complete)
- `--skip-build` reuses an existing `web/out/`
