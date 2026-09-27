# Meeting→Past：消纯色空档 + 理顺幕布

- **Date**: 2026-09-27
- **Scope**: Engine | UI
- **Summary**: 修相逢→前世纯色空洞；闭合双开门先铺满再缓开；去掉 DOM 幕布/板与 WebGL 叠层乱象。

## Changed

- `web/src/data/meetingShots.ts` — `MEETING_PAST_HANDOFF`；标题退出与关门暖入重叠
- `web/src/components/three/World.tsx` — 夜景/桥面持守至门满；前世晚段预载 + Suspense；关门→开门→暮云英雄；桥退出改为柔退不飞升
- `web/src/components/story/PastChapter.tsx` — 只留文案（WebGL 扛影像）
- `web/src/app/globals.css` — past sticky 透明，无 DOM 实色幕

## Notes

- 根因：标题 coda 清空 Meeting 后 PastRealm 挂载 Suspense 闪黑，且 DOM `past-doors`（`#0a1224`）与 WebGL 双开门叠层。
- 前世卡牌入场略推迟，避免与关门争戏。
