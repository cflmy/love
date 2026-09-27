# ArtButton: clean pill, drop kit mask

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: 素材 mask 会裁出箭头/内框缺口；改回不透明玻璃胶囊，只显示我们的文案与梅花标。

## Changed
- `web/src/components/ui/ArtButton.tsx` — 不再挂载套件位图
- `web/src/app/globals.css` — 去掉 mask；洗色不透明，外形用 `border-radius: 999px`

## Notes
- 套件图自带「了解更多」等字，叠自定义标签时无法干净复用。
