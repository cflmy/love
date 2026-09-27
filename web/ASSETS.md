# 网站素材永久保存策略

## 原则

| 路径 | 角色 | 策略 |
|------|------|------|
| `assert/` | 原始设计稿 / 手动切图 zip / 音乐 | **只读**，永不改写 |
| `web/public/media/image/` | 整板 PNG（从 assert 同步） | 可提交；仅在源文件更新时同步 |
| `web/public/media/slices/` | zip 手动切图精修结果 | **永久提交**，按张打磨 |
| `web/public/media/parts/` | 透明主体 / 飞行帧 / UI 按钮 | **永久提交**，联通域抠图 |
| `web/public/media/crops/` | 场景别名 + NFC/海报 | **永久提交** |
| `web/public/audio/` | 章节音乐 | **永久提交** |

`web/.gitignore` **不再忽略** `public/media/` 与 `public/audio/`。

## 精修要求（改图时遵守）

1. **白边**：手动切图留下的奶油色 / 近白边缘必须清掉（defringe），不要整板脚本一刀切。
2. **成组按钮**：先扣深色背景，再用**联通域**取出完整按钮（含花瓣装饰），禁止简单矩形切。
3. **奶油底素材**（蝴蝶 / 喜鹊 / 桥瓦）：角点 flood-key + 联通域保留主体，去掉标题文字条。
4. **场景板**：只做细边修整，不要 chroma-key 穿洞。
5. **禁止**再引入 `process-zip-assets.py` / `crop-assets.mjs` / `extract-ui-buttons.py` 一类批量脚本覆盖 `parts/`、`slices/`、`crops/`。

## 日常命令

```bash
cd web
npm run sync:assets   # 仅同步 assert 的整板图 + 音乐；不动精修结果
npm run dev
```

新增或替换某张精修图时：直接编辑 / 覆盖对应 `public/media/**` 文件，并更新 `src/data/assets.ts` 与 `src/data/imageSize.ts`。
