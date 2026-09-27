import { crops } from "./assets";

export type PresentReveal = "snake" | "scan" | "fitGrow";

export type PresentStill = {
  id: string;
  url: string;
  /** Local chapter progress window */
  start: number;
  end: number;
  reveal: PresentReveal;
  /** World Z — nearer plates sit in front during crossfade */
  z: number;
  /** Slight vertical bias for depth layering */
  y?: number;
  cover?: number;
  damp?: number;
};

/**
 * Act 09 · 今世 — sheet 14 (life) then sheet 15 (day).
 * Order mirrors assert/img 14_01→05 + 15_01/03/04/05/06/08.
 * WebGL PresentRealm consumes this; DOM only carries foil copy.
 */
export const PRESENT_STILLS: readonly PresentStill[] = [
  // —— 14 · 今世缘起 holds for foil prayer ——
  {
    id: "14-1-meet",
    url: crops.lifeMeet,
    start: 0.02,
    end: 0.34,
    reveal: "snake",
    z: -6.4,
    y: 0,
    cover: 1.2,
    damp: 2.6,
  },
  {
    id: "14-2-know",
    url: crops.lifeKnow,
    start: 0.3,
    end: 0.42,
    reveal: "scan",
    z: -6.1,
    y: 0.02,
    cover: 1.18,
    damp: 2.4,
  },
  {
    id: "14-3-road",
    url: crops.lifeRoad,
    start: 0.38,
    end: 0.5,
    reveal: "scan",
    z: -5.9,
    y: -0.02,
    cover: 1.16,
    damp: 2.3,
  },
  {
    id: "14-4-luck",
    url: crops.lifeLuck,
    start: 0.46,
    end: 0.58,
    reveal: "scan",
    z: -5.7,
    y: 0.04,
    cover: 1.16,
    damp: 2.2,
  },
  {
    id: "14-5-future",
    url: crops.lifeFuture,
    start: 0.54,
    end: 0.66,
    reveal: "scan",
    z: -5.5,
    y: 0,
    cover: 1.15,
    damp: 2.2,
  },
  // —— 15 · quiet days stills ——
  {
    id: "15-1-sight",
    url: crops.daySight,
    start: 0.62,
    end: 0.72,
    reveal: "scan",
    z: -5.4,
    y: 0.02,
    cover: 1.14,
    damp: 2.1,
  },
  {
    id: "15-3-daily",
    url: crops.dayDaily,
    start: 0.68,
    end: 0.77,
    reveal: "scan",
    z: -5.3,
    y: -0.01,
    cover: 1.14,
    damp: 2.1,
  },
  {
    id: "15-4-travel",
    url: crops.dayTravel,
    start: 0.74,
    end: 0.82,
    reveal: "scan",
    z: -5.2,
    y: 0.03,
    cover: 1.14,
    damp: 2.0,
  },
  {
    id: "15-5-special",
    url: crops.daySpecial,
    start: 0.79,
    end: 0.87,
    reveal: "scan",
    z: -5.1,
    y: 0,
    cover: 1.13,
    damp: 2.0,
  },
  {
    id: "15-6-tea",
    url: crops.dayTea,
    start: 0.84,
    end: 0.92,
    reveal: "scan",
    z: -5.0,
    y: 0.02,
    cover: 1.13,
    damp: 1.9,
  },
  {
    id: "15-8-tomorrow",
    url: crops.dayTomorrow,
    start: 0.89,
    end: 0.985,
    reveal: "scan",
    z: -4.9,
    y: 0,
    cover: 1.12,
    damp: 1.9,
  },
] as const;

/** Soft captions after foil — human-scale whispers. */
export const PRESENT_CAPTIONS = [
  { id: "know", start: 0.34, end: 0.42, text: "一起发呆，把日子过成喜欢的样子。" },
  { id: "road", start: 0.44, end: 0.52, text: "山高路远，也要一起走。" },
  { id: "luck", start: 0.52, end: 0.6, text: "祥云聚顶，鸿运当头。" },
  { id: "future", start: 0.6, end: 0.68, text: "与你，共赴更长的明天。" },
  { id: "days", start: 0.7, end: 0.78, text: "Quiet days, quiet cuddles." },
  { id: "tea", start: 0.84, end: 0.92, text: "两杯茶，一盏灯，便是人间。" },
  { id: "tomorrow", start: 0.92, end: 0.98, text: "更远的明天，仍与你同行。" },
] as const;

/** Blue-gold foil over 缘起 only. */
export const PRESENT_FOIL = [
  {
    id: "pray",
    start: 0.05,
    end: 0.15,
    parts: [
      { className: "present-foil__lead", text: "我们一起祈祷：" },
      { className: "present-foil__quote", text: "Que dure, que câlin." },
      { className: "present-foil__trans", text: "——愿天长地久，愿紧紧相拥。" },
    ],
  },
  {
    id: "reply",
    start: 0.16,
    end: 0.26,
    parts: [
      { className: "present-foil__lead", text: "而时间给出的回应是：" },
      { className: "present-foil__quote", text: "Quiet days, quiet cuddles." },
      { className: "present-foil__trans", text: "——陪伴的日子安宁，坚定的拥抱无声。" },
    ],
  },
  {
    id: "seal",
    start: 0.27,
    end: 0.36,
    parts: [
      { className: "present-foil__final", text: "相逢鹊渡，相守情长，" },
      { className: "present-foil__final present-foil__final--late", text: "故与君鹊渡情长。" },
    ],
  },
] as const;

export function presentPlateOpacity(local: number, start: number, end: number, fade = 0.045) {
  if (local < start) return 0;
  if (local > end) return Math.max(0, 1 - (local - end) / Math.max(0.01, fade));
  const t = Math.min(1, (local - start) / fade);
  return t * t * (3 - 2 * t);
}

export function presentPlateT(local: number, start: number, end: number) {
  const span = Math.max(0.0001, end - start);
  return Math.min(1, Math.max(0, (local - start) / span));
}
