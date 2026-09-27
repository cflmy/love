# Letter and tomorrow as sticky shots

- **Date**: 2026-09-27
- **Scope**: UI | Engine
- **Summary**: Quiet Days 之后的信与明天改成和今世、山高路远一样的黏性镜头：画面在 WebGL 里换，字一句一句出现，结尾镜头慢慢拉远。

## Changed
- `web/src/data/codaShots.ts` — 信件分行节拍；明天：回桥 → 两人 → 远景
- `web/src/data/chapters.ts` — 信件 / 明天加长滚动，给静默留拍
- `web/src/components/story/LetterChapter.tsx` — 信封停留，展开后逐行；书桌表单靠后
- `web/src/components/story/EndingChapter.tsx` — 只留定时字幕和末尾的选择
- `web/src/components/story/StoryChapters.tsx` — 两幕自己撑高度，不再套不透明尾声页
- `web/src/components/three/World.tsx` — FutureRealm 暖色回桥；信时背景退下；镜头在信里靠近、在明天拉远
- `web/src/components/Experience.tsx` — 主区域改为 `overflow-x-clip`，黏性镜头才能停在视口里
- `web/src/app/globals.css` — 信的纸面黏性镜、明天字幕与末尾选择的位置

## Notes
- `/letter` 在未进入正片时仍可点开信封，一次看见全文。
- Quiet Days 本身未改。
