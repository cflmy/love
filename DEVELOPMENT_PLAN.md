# QDQC · love.qdqc.com 网站开发计划

> 依据 `docs/001`–`006` 与 `assert/` 现有素材制定。  
> **硬约束**：不修改 `docs/`、`assert/` 源文件；不做方案降级；表达效果必须达到「数字爱情画册 / 可滚动电影」水准。

---

## 1. 产品定义

| 项 | 内容 |
| --- | --- |
| 产品名 | **QDQC · 鹊渡情长** |
| 域名 | `love.qdqc.com` |
| 一句话 | NFC 是封面，网站是正文，两个人是主人公 |
| 体验模型 | **一张 NFC 卡打开一个持续存在的 3D 世界**，用户用滚动走进故事 |
| 不是 | 普通情侣纪念站 / 相册 / 模板 Navbar 站点 |

核心文案贯穿始终：

- Que dure, que câlin. / 愿天长地久，愿紧紧相拥。
- Quiet days, quiet cuddles. / 陪伴的日子安宁，坚定的拥抱无声。
- 相逢鹊渡，相守情长，故与君鹊渡情长。
- 只要你回来，太阳永不落山。
- More Days Together · ∞

---

## 2. 技术架构（不可降级）

```
QDQC STORY ENGINE
├── VISUAL   Three.js + R3F + Drei + postprocessing（单例 Canvas）
├── MOTION   GSAP + ScrollTrigger + Lenis
├── AUDIO    MusicEngine（Howler）章节主题 / 环境声 / SFX / 日后 stems
└── DOM      React + Tailwind 文字、导航、信件、回忆
```

### 目录（实现于 `web/`）

```
web/
├── public/
│   ├── media/          # 从 assert 导出的 web 可用图（不改源）
│   └── audio/          # 从 assert/music 复制的 .m4a
├── src/
│   ├── app/            # App Router：/ /card /story /letter …
│   ├── components/
│   │   ├── three/      # World, Moon, Water, Bridge, Butterfly, Magpie…
│   │   ├── story/      # Chapter, StoryScene, Timeline, Memory
│   │   ├── ui/         # ChapterNav, MusicToggle, Letter…
│   │   └── opening/    # NFC 仪式、触碰鹊桥
│   ├── engine/         # StoryEngine, ScrollSync, MusicEngine
│   ├── data/           # chapters, assets, timeline, ost
│   ├── store/          # Zustand：progress, chapter, audioUnlock
│   └── styles/
└── scripts/            # sync-assets.mjs（只读复制 assert → public）
```

### 关键技术决定

1. **Persistent WebGL World**：全站一个 `<Canvas>`，章节只改场景状态，不销毁 Context。  
2. **Scroll → Camera**：滚动进度直接驱动摄像机路径，而不是仅 `translateY` 背景。  
3. **Music = 叙事层**：与 `storyProgress` 同步；禁止整站一首 MP3 循环了事。  
4. **Mobile First**：NFC 入口优先；桌面加宽构图与视差深度。  
5. **动画库唯一**：只用 GSAP；禁止再叠 Framer Motion 等。

---

## 3. 素材盘点与映射

### 3.1 图像 `assert/image/`（只读）

| 文件 | 用途 |
| --- | --- |
| 001–002 | Logo / 品牌变体板 |
| 003–006 | NFC 卡正反面、人物海报（Opening / 人物卡） |
| 007 / 011 | 桌面 Hero / Ending 世界参考 |
| 008 | 蝴蝶姿态 + 飞行序列（相逢 / 跟随 / Loading） |
| 009 | 喜鹊姿态 + 飞行序列 |
| 010 | 鹊桥分层、昼夜雪景、氛围元素 |
| 012–13 / 16–18 | 叙事分镜与章节关键视觉 |
| 14 / 15 | 今世记忆章节板 |
| 19–22 | Desktop / Mobile UI Kit、组件规范 |

实施策略：板式图作 **设计母版**；实现时用脚本裁切/导出图层到 `web/public/media/`，源文件不动。首版可先用整图 + CSS mask / crop 达成高质感，再逐步抽透明层。

### 3.2 音乐 `assert/music/`（实为 AAC/M4A）

| 音轨 | 章节 |
| --- | --- |
| PROLOGUE 01 | NFC 触碰仪式 |
| ACT I 02 / 03 | 祈祷 / 时间的回应 |
| ACT II 04 / 05 | 相逢 / 鹊渡 |
| ACT III・前世 + 07 长风 + 08 长风恋暮云 | 前世 |
| ACT IV・今世 + 10 与君日安 | 今世 / Quiet Days |
| ACT V・山高路远 + 12–14 | 山高路远 / 双向奔赴 |
| ACT VI 15 + 16 + 17 | 只要你回来 / 鹊渡情长 / Ending |

复制为 `web/public/audio/*.m4a` 供 Howler 使用。

---

## 4. 叙事与路由

### 4.1 体验主轴（用户感知）

```
NFC → Opening → 相逢鹊渡 → 前世 → 今世 → 山高路远（双向奔赴）
→ 我们 → Quiet Days → 信件 → 更远的明天 → ∞
```

### 4.2 路由（可深链，默认一体卷轴）

| Path | 内容 |
| --- | --- |
| `/` | Opening + 完整 Story 卷轴 |
| `/card` `/card/front` `/card/back` | NFC 专属开卡仪式 |
| `/story/[chapter]` | 深链章节（仍复用同一 World） |
| `/memories` | 鹊桥时间线 |
| `/letter` | 给你的一封信（可脱离 WebGL） |
| `/us` | Only Us / 彩蛋入口 |

导航：点击角落 **QDQC** 展开章节目录，不做传统顶部导航。

---

## 5. 分阶段交付

### Phase 0 — Foundation（当前）

- [x] Next.js + TS + Tailwind + R3F + GSAP + Lenis + Zustand + Howler
- [x] `sync-assets` 脚本
- [x] Design tokens（色板、字体、间距）
- [x] `StoryEngine` + `ScrollSync` 骨架
- [x] `MusicEngine` 骨架 + 用户手势解锁
- [x] Cursor Rules（已完成）

### Phase 1 — QDQC World

- [x] 持久 Canvas：Moon / Mountains / Water / Clouds / Bridge
- [x] Butterfly / Magpie 精灵或纹理平面 + 简单翼振
- [x] 五层视差与基础 bloom（克制）
- [x] 性能档位：desktop / mobile / reduced-motion

### Phase 2 — Opening 垂直切片（质量闸门）

必须达到「惊艳」后再铺开其他章：

1. [x] 米白/黑场 → 小 QDQC → 「触碰鹊桥」解锁音频  
2. [x] PROLOGUE 铃/水 → NFC 卡出现并翻转（003）  
3. [x] 卡 → 蝴蝶飞入门户  
4. [x] Camera 推入月夜鹊桥世界（007/010/011）  
5. [x] 文案节拍：Que dure… → 愿天长地久…  

### Phase 3 — 相逢鹊渡

- [x] 蝶渡河 → 鹊出现 → 双轨迹靠近 → 桥灯逐亮  
- [x] ACT II 04→05 crossfade；章节内进度切换主题  
- [x] 后置标题：相逢鹊渡 / 相守情长 / 故与君鹊渡情长（先 WatchBeat）

### Phase 4 — 前世

- [ ] 色调蓝→紫金；暮云 / 长风；风云线条汇 ∞  
- [ ] 音轨 前世 / 07 / 08；结尾硬切留白进今世  

### Phase 5 — 今世

- [ ] 白闪断层；人间烟火；14/15 记忆板叙事  
- [ ] ACT IV + 与君日安；UI 轻松一档（印章「老天安排的最大！」）  

### Phase 6 — 山高路远（全站高潮）

- [ ] 分屏双向奔赴；日落停驻；锁链轻断；拥抱后骤静  
- [ ] ACT V 曲目链 + intensity scrub；金句字幕  

### Phase 7 — 我们 / Memories

- [ ] 鹊桥时间线（灯笼节点）；漂浮记忆，非 Grid 相册  
- [ ] 真实照片槽位可后续填充  

### Phase 8 — Quiet Days + Letter

- [ ] 极简留白；两杯茶；音乐几乎不随滚动躁动  
- [ ] `/letter` 信纸展开；可打印/PDF（后置）  

### Phase 9 — Ending + 彩蛋

- [ ] 背影走向远方；More Days Together；QDQC ∞  
- [ ] 「如果你已经看到这里…」双按钮殊途同归  

### Phase 10 — Mobile / NFC / Polish

- [ ] 专属 `/card` 流程（对照 22）  
- [ ] PWA / favicon / SEO / 加载门 / 二次访问彩蛋  

---

## 6. 质量标准（验收）

| 维度 | 标准 |
| --- | --- |
| 开场 | NFC/触碰仪式有声画一体感，非普通 Loading |
| 世界 | 滚动时世界在「进入」，不是换背景图 |
| 相逢章 | 蝶/鹊/桥三者叙事可读，标题后置 |
| 音乐 | 章节切换 crossfade；未解锁前无声 |
| 高潮 | 双向奔赴有情绪弧线；拥抱后必须留白 |
| Quiet Days | 明显降噪，形成呼吸 |
| 移动端 | 30–60fps 可玩；低端机降粒子/bloom，不丢故事 |
| 品牌 | 月白黛青蝶蓝淡金；无粉红爱心模板感 |

---

## 7. 当前执行顺序

1. ~~撰写 `.cursor/rules`~~  
2. ~~撰写本开发计划~~  
3. **脚手架 `web/` + 资源同步 + Design tokens**  
4. **实现 Phase 0–2 垂直切片（Opening → 相逢鹊渡）**  
5. 验收切片观感后，按 Phase 3→10 填充  

---

## 8. 风险与对策

| 风险 | 对策 |
| --- | --- |
| 素材多为「整板」非透明层 | 先整图叙事 + CSS/WebGL 平面；再逐步抠层 |
| 音乐为 M4A 伪装扩展名 | 复制为 `.m4a`；Safari/Chrome 均测 Howler |
| 手机 WebGL 性能 | DPR 上限、章节按需显隐、降后处理 |
| 自动播放策略 | 「触碰鹊桥」叙事化解锁 |
| 真实回忆照片尚未齐全 | Memories 先用 14/15 艺术帧占位，数据结构预留 |

---

*本计划与 Cursor Rules 绑定执行；任何「改成普通情侣站」的建议视为违规降级。*
