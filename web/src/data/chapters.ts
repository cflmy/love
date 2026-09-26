import { audio } from "./assets";

export type ChapterId =
  | "opening"
  | "prayer"
  | "response"
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
  scrollSpan: number;
  themeTrack: keyof typeof audio | null;
  color: string;
  copy: string[];
};

/** Global story progress ranges are derived from cumulative scrollSpan. */
export const chapters: Chapter[] = [
  {
    id: "opening",
    index: 0,
    title: "触碰",
    subtitle: "Touch",
    navLabel: "00 触碰",
    scrollSpan: 1.2,
    themeTrack: "prologue",
    color: "#0A1128",
    copy: ["Que dure, que câlin.", "愿天长地久，愿紧紧相拥。"],
  },
  {
    id: "prayer",
    index: 1,
    title: "我们一起祈祷",
    subtitle: "Que dure, que câlin.",
    navLabel: "01 祈祷",
    scrollSpan: 1.4,
    themeTrack: "prayer",
    color: "#172B49",
    copy: [
      "我们一起祈祷：",
      "Que dure, que câlin.",
      "愿天长地久，",
      "愿紧紧相拥。",
    ],
  },
  {
    id: "response",
    index: 2,
    title: "而时间给出的回应是",
    subtitle: "Quiet days, quiet cuddles.",
    navLabel: "02 回应",
    scrollSpan: 1.2,
    themeTrack: "response",
    color: "#6F8FB7",
    copy: [
      "而时间给出的回应是：",
      "Quiet days, quiet cuddles.",
      "陪伴的日子安宁，",
      "坚定的拥抱无声。",
    ],
  },
  {
    id: "meeting",
    index: 3,
    title: "相逢鹊渡",
    subtitle: "The Magpie Bridge",
    navLabel: "03 相逢",
    scrollSpan: 2.2,
    themeTrack: "magpieBridge",
    color: "#4E83B5",
    copy: ["相逢鹊渡", "相守情长", "故与君鹊渡情长。"],
  },
  {
    id: "past",
    index: 4,
    title: "前世",
    subtitle: "长风恋暮云",
    navLabel: "04 前世",
    scrollSpan: 1.8,
    themeTrack: "promise",
    color: "#172B49",
    copy: [
      "林暮云 —— 木长风",
      "长风恋暮云，这是我们曾经的许诺。",
      "君为暮云我为风，生生世世不相离。",
      "君为长风我为云，世世生生不相弃。",
    ],
  },
  {
    id: "present",
    index: 5,
    title: "今世",
    subtitle: "祥云聚顶 · 鸿运当头",
    navLabel: "05 今世",
    scrollSpan: 1.6,
    themeTrack: "present",
    color: "#C7A66A",
    copy: [
      "晏永鸿 —— 王家祥",
      "祥云聚顶，鸿运当头，",
      "所以别管太多，老天安排的最大！",
    ],
  },
  {
    id: "journey",
    index: 6,
    title: "山高路远",
    subtitle: "双向奔赴",
    navLabel: "06 山高路远",
    scrollSpan: 2.4,
    themeTrack: "towardYou",
    color: "#9C493E",
    copy: [
      "你别担心，太阳落山前我一定回来。",
      "不必着急，只要你回来，太阳永不落山。",
    ],
  },
  {
    id: "memories",
    index: 7,
    title: "我们",
    subtitle: "Memories",
    navLabel: "07 我们",
    scrollSpan: 1.5,
    themeTrack: "quietDays",
    color: "#6F8FB7",
    copy: ["鹊桥时间线", "每一盏灯，都是一次记得。"],
  },
  {
    id: "quiet-days",
    index: 8,
    title: "Quiet Days",
    subtitle: "Quiet cuddles.",
    navLabel: "08 Quiet Days",
    scrollSpan: 1.2,
    themeTrack: "quietDays",
    color: "#F7F3E9",
    copy: [
      "Quiet days.",
      "Quiet cuddles.",
      "陪伴的日子安宁，坚定的拥抱无声。",
    ],
  },
  {
    id: "letter",
    index: 9,
    title: "给你的一封信",
    subtitle: "A Letter",
    navLabel: "09 信件",
    scrollSpan: 1.0,
    themeTrack: "sunNeverSets",
    color: "#F7F3E9",
    copy: ["致我最想拥抱的人", "愿天长地久，愿紧紧相拥。", "—— QDQC"],
  },
  {
    id: "future",
    index: 10,
    title: "更远的明天",
    subtitle: "More Days Together",
    navLabel: "10 明天",
    scrollSpan: 1.4,
    themeTrack: "moreDays",
    color: "#0A1128",
    copy: ["与你，共赴更长的明天。", "More Days Together", "∞"],
  },
];

export function chapterProgressBounds() {
  const total = chapters.reduce((sum, c) => sum + c.scrollSpan, 0);
  let cursor = 0;
  return chapters.map((c) => {
    const start = cursor / total;
    cursor += c.scrollSpan;
    const end = cursor / total;
    return { id: c.id, start, end };
  });
}

export const STORY_SCROLL_VH = chapters.reduce((sum, c) => sum + c.scrollSpan, 0) * 100;
