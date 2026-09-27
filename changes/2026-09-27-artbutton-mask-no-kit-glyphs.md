# ArtButton: hide baked kit labels

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: 结尾「好 / 当然」等按钮不再叠显素材里自带的「了解更多 / 进入回忆」字样；只保留套件外形作遮罩。

## Changed
- `web/src/app/globals.css` — `qd-btn__wash` 用 `--btn-art` 做 mask；`qd-btn__art` 不再绘制像素
- `web/src/components/ui/ArtButton.tsx` — 注释说明标签由我们写、不露出素材字

## Notes
- none
