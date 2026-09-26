# QDQC · love.qdqc.com

交互式数字爱情画册。源文档与素材只读；本目录为网站实现。

## 开发

```bash
cd web
npm run sync:assets   # 只读复制 assert → public
npm run dev           # http://localhost:3456
```

## 硬约束

- 禁止修改 `../docs`、`../assert`
- 禁止方案降级（见仓库根目录 `DEVELOPMENT_PLAN.md` 与 `.cursor/rules`）

## 技术栈

Next.js · R3F · GSAP ScrollTrigger · Lenis · Howler · Zustand · Tailwind
