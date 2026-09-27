/**
 * Act 03 · 相逢鹊渡 shot timeline (local progress 0→1).
 * Shared by World camera, MeetingChapter captions, MeetingTitle.
 * Source intent: docs/008 §03 · STORY_FLOW G1.
 *
 * Title coda dwells *inside* meeting, then soft-exits before 前世 —
 * do not borrow past scroll time for the coda.
 */
export const MEETING_SHOTS = {
  establish: { start: 0.0, end: 0.12 },
  butterfly: { start: 0.12, end: 0.26 },
  crossing: { start: 0.26, end: 0.4 },
  magpieHint: { start: 0.4, end: 0.54 },
  magpieReveal: { start: 0.54, end: 0.66 },
  bridge: { start: 0.66, end: 0.76 },
  meeting: { start: 0.76, end: 0.82 },
  /** Title dwell — ends with soft exit so past owns its own time */
  title: { start: 0.72, end: 0.96 },
} as const;

/** Soft DOM whispers — clear before title coda. */
export const MEETING_CAPTIONS = [
  { id: "establish", start: 0.04, end: 0.12, text: "月下，河雾未散。" },
  {
    id: "butterfly",
    start: 0.14,
    end: 0.24,
    role: "她",
    text: "河雾里，有人朝桥走来。",
  },
  { id: "cross", start: 0.28, end: 0.38, text: "渡河。" },
  {
    id: "hint",
    start: 0.42,
    end: 0.52,
    role: "他",
    text: "远方，一点灯火。",
  },
  { id: "paths", start: 0.54, end: 0.64, text: "各从一端，走向同一座桥。" },
  { id: "bridge", start: 0.66, end: 0.76, text: "桥灯一盏盏亮起。" },
] as const;

/**
 * Title: rise → hold → exit inside meeting.
 * Tiny past residue only for soft crossfade (must not cover 暮云).
 */
export const MEETING_TITLE = {
  gate: { start: 0.72, peak: 0.78 },
  lineA: { start: 0.74, peak: 0.8 },
  lineB: { start: 0.78, peak: 0.84 },
  lineC: { start: 0.82, peak: 0.88 },
  /** Soft exit before chapter boundary — frees 前世 */
  exitStart: 0.93,
  exitEnd: 0.995,
  /** Minimal residue into past (just a breath, not a second coda) */
  pastCarry: 0.035,
} as const;

export function smoothstep(v: number, a: number, b: number) {
  if (b <= a) return v >= b ? 1 : 0;
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Rise to 1 by `peak`, hold until `exitStart`, then fade out by `exitEnd`. */
export function holdThenExit(
  v: number,
  start: number,
  peak: number,
  exitStart: number,
  exitEnd: number,
) {
  if (v < start) return 0;
  if (v < peak) return smoothstep(v, start, peak);
  if (v < exitStart) return 1;
  return 1 - smoothstep(v, exitStart, exitEnd);
}

export function holdAfter(v: number, start: number, peak: number) {
  if (v < start) return 0;
  if (v >= peak) return 1;
  return smoothstep(v, start, peak);
}

export function bandOpacity(local: number, start: number, end: number, fade = 0.05) {
  if (local < start) return 0;
  if (local > end) return Math.max(0, 1 - (local - end) / fade);
  return smoothstep(local, start, start + fade);
}
