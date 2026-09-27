# QDQC · love.qdqc.com

交互式数字爱情画册。源文档与素材只读；本目录为网站实现。

## 开发

```bash
cd web
npm run sync:assets   # 仅同步 assert 整板图+音乐；不覆盖精修素材
npm run dev           # http://localhost:3456
```

精修后的 `public/media/{slices,parts,crops}` 与 `public/audio` 为**永久提交资产**，见 `ASSETS.md`。

## 硬约束

- 禁止修改 `../docs`、`../assert`
- 禁止用批量脚本覆盖已精修的 `public/media/parts|slices|crops`
- 禁止方案降级（见仓库根目录 `DEVELOPMENT_PLAN.md` 与 `.cursor/rules`）

## 技术栈

Next.js · R3F · GSAP ScrollTrigger · Lenis · Howler · Zustand · Tailwind
