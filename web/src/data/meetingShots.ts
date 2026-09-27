/**
 * Act 03 · 相逢鹊渡 shot timeline (local progress 0→1).
 * Shared by World camera, MeetingChapter captions, MeetingTitle.
 * Source intent: docs/008 §03 · STORY_FLOW G1.
 */
export const MEETING_SHOTS = {
  establish: { start: 0.0, end: 0.15 },
  butterfly: { start: 0.15, end: 0.3 },
  crossing: { start: 0.3, end: 0.45 },
  magpieHint: { start: 0.45, end: 0.6 },
  magpieReveal: { start: 0.6, end: 0.75 },
  bridge: { start: 0.75, end: 0.88 },
  meeting: { start: 0.88, end: 0.94 },
  title: { start: 0.9, end: 1.0 },
} as const;

/** Soft DOM whispers — end before title silence. */
export const MEETING_CAPTIONS = [
  { id: "establish", start: 0.05, end: 0.14, text: "月下，河雾未散。" },
  {
    id: "butterfly",
    start: 0.16,
    end: 0.28,
    role: "她",
    text: "河雾里，有人朝桥走来。",
  },
  { id: "cross", start: 0.32, end: 0.42, text: "渡河。" },
  {
    id: "hint",
    start: 0.46,
    end: 0.56,
    role: "他",
    text: "远方，一点灯火。",
  },
  { id: "paths", start: 0.6, end: 0.7, text: "各从一端，走向同一座桥。" },
  { id: "bridge", start: 0.74, end: 0.84, text: "桥灯一盏盏亮起。" },
] as const;

/** Title blur→focus — only after meeting settle. */
export const MEETING_TITLE = {
  gate: { start: 0.88, end: 0.94 },
  lineA: { start: 0.9, end: 0.95 },
  lineB: { start: 0.93, end: 0.97 },
  lineC: { start: 0.96, end: 1.0 },
} as const;

export function smoothstep(v: number, a: number, b: number) {
  if (b <= a) return v >= b ? 1 : 0;
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function bandOpacity(local: number, start: number, end: number, fade = 0.05) {
  if (local < start) return 0;
  if (local > end) return Math.max(0, 1 - (local - end) / fade);
  return smoothstep(local, start, start + fade);
}
