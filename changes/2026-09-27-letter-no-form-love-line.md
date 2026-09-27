# Letter: no cream, no form, love line

- **Date**: 2026-09-27
- **Scope**: UI
- **Summary**: 信件去掉白底与写信表单；正文末尾加上「最后我想告诉你，我爱你。」

## Changed
- `web/src/components/story/LetterChapter.tsx` — 只留信封与分行字幕
- `web/src/components/story/LetterForm.tsx` — 删除
- `web/src/data/codaShots.ts` — 新增爱你一句
- `web/src/data/chapters.ts` — 信件滚动略收
- `web/src/app/globals.css` — 信件/路由去奶油底，字幕用月白

## Notes
- none
