import { crops } from "./assets";
import type { PresentStill } from "./presentShots";
import { presentPlateOpacity, presentPlateT } from "./presentShots";

/**
 * Act 17 · 更远的明天
 * Return to the bridge → two figures → wide distance.
 * WebGL FutureRealm consumes this; DOM only carries quiet lines.
 */
export const FUTURE_STILLS: readonly PresentStill[] = [
  {
    id: "return-bridge",
    url: crops.meetBridge,
    start: 0.02,
    end: 0.4,
    reveal: "scan",
    z: -6.3,
    y: 0.04,
    cover: 1.14,
    damp: 2.5,
  },
  {
    id: "two-figures",
    url: crops.roadEmbrace,
    start: 0.32,
    end: 0.64,
    reveal: "scan",
    z: -5.75,
    y: 0.02,
    cover: 1.12,
    damp: 2.35,
  },
  {
    id: "distance",
    url: crops.heroEnding,
    start: 0.54,
    end: 0.995,
    reveal: "scan",
    z: -7.4,
    y: 0.1,
    cover: 1.2,
    damp: 2.05,
  },
];

/** One line at a time — silence between beats. Last line holds. */
export const FUTURE_CAPTIONS = [
  { id: "tomorrow", start: 0.14, end: 0.28, text: "与你，共赴更长的明天。", kind: "cn" },
  { id: "more", start: 0.36, end: 0.5, text: "More Days Together", kind: "en" },
  { id: "inf", start: 0.48, end: 0.58, text: "∞", kind: "mark" },
  { id: "oath", start: 0.58, end: 0.74, text: "相逢鹊渡，相守情长。", kind: "cn" },
  { id: "final", start: 0.72, end: 0.94, text: "故与君鹊渡情长。", kind: "final" },
] as const;

/**
 * Act 16 · 给你的一封信
 * Envelope first; lines arrive after the seal opens (scroll or tap).
 */
export const LETTER_LINES = [
  { id: "to", start: 0.34, end: 0.46, text: "致我最想拥抱的人", kind: "to" },
  { id: "meet", start: 0.48, end: 0.58, text: "相逢鹊渡，相守情长。", kind: "body" },
  { id: "road", start: 0.6, end: 0.7, text: "山高路远，我会一直相向而行。", kind: "body" },
  { id: "hold", start: 0.72, end: 0.82, text: "愿天长地久，愿紧紧相拥。", kind: "body" },
  { id: "love", start: 0.84, end: 0.94, text: "最后我想告诉你，我爱你。", kind: "love" },
  { id: "sign", start: 0.92, end: 0.995, text: "—— QDQC", kind: "sign" },
] as const;

export const futurePlateOpacity = presentPlateOpacity;
export const futurePlateT = presentPlateT;
