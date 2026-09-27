import { audio } from "./assets";

/**
 * Film spine · STORY_FLOW.md (sourced from docs/008.md; docs untouched).
 * Opening is ritual-only. Scroll: meeting → past → present → journey → memories → quiet-days → letter → future.
 */
export type ChapterId =
  | "opening"
  | "meeting"
  | "past"
  | "present"
  | "journey"
  | "memories"
  | "quiet-days"
  | "letter"
  | "future";

export type Chapter = {
  id: ChapterId;
  index: number;
  title: string;
  subtitle: string;
  navLabel: string;
  /** Relative scroll length. `0` = ritual-only (no scroll section). */
  scrollSpan: number;
  themeTrack: keyof typeof audio | null;
  color: string;
  /** Sparse lines for ActTitle — never dump all at once in the DOM. */
  copy: string[];
};

export const chapters: Chapter[] = [
  {
    id: "opening",
    index: 0,
    title: "触碰",
    subtitle: "Touch",
    navLabel: "00 触碰",
    scrollSpan: 0,
    themeTrack: "prologue",
    color: "#0A1128",
    copy: ["Que dure, que câlin.", "愿天长地久，愿紧紧相拥。"],
  },
  {
    id: "meeting",
    index: 1,
    title: "相逢鹊渡",
    subtitle: "The Magpie Bridge",
    navLabel: "01 相逢",
    /** Title coda dwells inside this span; must not steal 前世 time */
    scrollSpan: 7.4,
    themeTrack: "butterfly",
    color: "#4E83B5",
    copy: [
      "她从河的这一岸来。",
      "他从远方的灯火中来。",
      "桥灯一盏盏亮起。",
      "相逢鹊渡，相守情长。",
    ],
  },
  {
    id: "past",
    index: 2,
    title: "前世",
    subtitle: "长风恋暮云",
    navLabel: "02 前世",
    scrollSpan: 7.4,
    themeTrack: "past",
    color: "#172B49",
    copy: [
      "长风恋暮云，这是我们曾经的许诺。",
      "君为暮云我为风，生生世世不相离。",
      "君为长风我为云，世世生生不相弃。",
    ],
  },
  {
    id: "present",
    index: 3,
    title: "今世",
    subtitle: "祥云聚顶 · 鸿运当头",
    navLabel: "03 今世",
    /** Sheets 14+15 in WebGL + foil on 缘起 — long dwell for romantic pace */
    scrollSpan: 14,
    themeTrack: "present",
    color: "#C7A66A",
    copy: [
      "Que dure, que câlin.",
      "Quiet days, quiet cuddles.",
      "相逢鹊渡，相守情长，故与君鹊渡情长。",
    ],
  },
  {
    id: "journey",
    index: 4,
    title: "山高路远",
    subtitle: "双向奔赴",
    navLabel: "04 山高路远",
    scrollSpan: 12,
    themeTrack: "journey",
    color: "#9C493E",
    copy: [
      "你别担心，太阳落山前我一定回来。",
      "不必着急，只要你回来，太阳永不落山。",
      "山高路远，祝君日安。",
    ],
  },
  {
    id: "memories",
    index: 5,
    title: "我们",
    subtitle: "Memories",
    navLabel: "05 我们",
    scrollSpan: 3.2,
    themeTrack: "quietDays",
    color: "#6F8FB7",
    copy: ["每一盏灯，都是一次记得。", "这些平凡的瞬间，拼成我们。"],
  },
  {
    id: "quiet-days",
    index: 6,
    title: "Quiet Days",
    subtitle: "Quiet cuddles.",
    navLabel: "06 Quiet Days",
    scrollSpan: 2.4,
    themeTrack: "quietDays",
    color: "#F7F3E9",
    copy: ["Quiet days.", "Quiet cuddles.", "陪伴的日子安宁，坚定的拥抱无声。"],
  },
  {
    id: "letter",
    index: 7,
    title: "给你的一封信",
    subtitle: "A Letter",
    navLabel: "07 信件",
    scrollSpan: 2.0,
    themeTrack: "reprise",
    color: "#F7F3E9",
    copy: ["致我最想拥抱的人", "愿天长地久，愿紧紧相拥。"],
  },
  {
    id: "future",
    index: 8,
    title: "更远的明天",
    subtitle: "More Days Together",
    navLabel: "08 明天",
    scrollSpan: 2.6,
    themeTrack: "moreDays",
    color: "#0A1128",
    copy: ["与你，共赴更长的明天。", "More Days Together", "相逢鹊渡，相守情长。"],
  },
];

/** Chapters that own scroll height (opening is ritual-only). */
export const scrollChapters = chapters.filter((c) => c.scrollSpan > 0);

export function chapterProgressBounds() {
  const total = scrollChapters.reduce((sum, c) => sum + c.scrollSpan, 0);
  let cursor = 0;
  return scrollChapters.map((c) => {
    const start = cursor / total;
    cursor += c.scrollSpan;
    const end = cursor / total;
    return { id: c.id, start, end };
  });
}

export const STORY_SCROLL_VH = scrollChapters.reduce((sum, c) => sum + c.scrollSpan, 0) * 100;

export function getChapter(id: ChapterId) {
  return chapters.find((c) => c.id === id)!;
}
