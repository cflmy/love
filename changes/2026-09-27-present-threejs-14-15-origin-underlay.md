# 今世 Three.js 14/15 序列 + 缘起底图

- **Date**: 2026-09-27
- **Scope**: Engine | UI
- **Summary**: 今世改由 WebGL 按 14→15 逻辑顺序唯美播放多张静帧；今世缘起作为后续黑色章节的柔光底图，避免黑虚空。

## Changed

- `web/src/data/presentShots.ts` — 声明式 14_01–05 + 15_01/03–06/08 时间轴、foil、captions
- `web/src/components/three/World.tsx` — `PresentRealm` 全序列 ScrollPanPlate；`OriginUnderlay` 贯穿 journey/memories/quiet-days；今世镜头轻推近
- `web/src/components/story/PresentChapter.tsx` — DOM 只保留 foil + 低位文案（WebGL 扛影像）
- `web/src/components/story/JourneyChapter.tsx` — ambient 底图改为 `lifeMeet`（今世缘起）
- `web/src/data/chapters.ts` — present `scrollSpan` 12→14
- `web/src/app/globals.css` — present captions 定位

## Notes

- 素材走已提交 `crops`（对应 `assert/img` 14/15 切片），不改 `assert/**`
- 前世末段预载今世纹理，避免进章 Suspense 闪黑
