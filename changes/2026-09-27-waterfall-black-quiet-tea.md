# Waterfall black gaps + Quiet Days teacup

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: 瀑布流补满各列并垫柔和底色，避免露大片黑；Quiet Days 去掉奶油白底，改成茶杯静帧加轻呼吸与蒸汽。

## Changed
- `web/src/components/story/MemoriesTimeline.tsx` — 每列测高、图片加载后加密，填充比提到 1.45×
- `web/src/data/gallery.ts` — 去掉奶油底海报海报片，避免瀑布流闪白
- `web/src/components/story/QuietDaysChapter.tsx` — 茶杯粘性镜头 + 分行字幕
- `web/src/components/story/StoryChapters.tsx` — Quiet Days 自撑高度
- `web/src/data/chapters.ts` — Quiet Days 滚动加长
- `web/src/app/globals.css` — 瀑布流柔底；Quiet Days 茶杯动画样式

## Notes
- none
