/**
 * Calm typography-first scan for 今世缘起 (lifeMeet).
 * Hold TL text → drift down LEFT copy → soft cross to faces.
 * Mild scale only — readable type, dreamy ken-burns (not a flying crop).
 */

export type SnakeFocus = {
  x: number;
  y: number;
  scale: number;
};

export type SnakeScanOpts = {
  hold?: number;
  leftEnd?: number;
  crossEnd?: number;
  settleAt?: number;
  leftX?: number;
  face?: { x: number; y: number };
  zoomScan?: number;
  zoomFace?: number;
};

/** lifeMeet — linger on left type, then ease to the couple. */
export const LIFE_MEET_SNAKE: Required<
  Pick<
    SnakeScanOpts,
    "hold" | "leftEnd" | "crossEnd" | "settleAt" | "leftX" | "face" | "zoomScan" | "zoomFace"
  >
> = {
  hold: 0.12,
  leftEnd: 0.55,
  crossEnd: 0.72,
  settleAt: 0.86,
  leftX: 0.08,
  face: { x: 0.62, y: 0.28 },
  /** Enough to read left type; not extreme */
  zoomScan: 1.36,
  zoomFace: 1.48,
};

/** Later 今世 stills — shorter left→faces path. */
export const LIFE_STILL_SNAKE: SnakeScanOpts = {
  hold: 0.1,
  leftEnd: 0.5,
  crossEnd: 0.7,
  settleAt: 0.85,
  leftX: 0.1,
  face: { x: 0.58, y: 0.32 },
  zoomScan: 1.3,
  zoomFace: 1.4,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function segment(u: number, a: number, b: number) {
  return smoothstep((u - a) / Math.max(0.0001, b - a));
}

export function snakeScan(t: number, opts: SnakeScanOpts = {}): SnakeFocus {
  const hold = opts.hold ?? LIFE_MEET_SNAKE.hold;
  const leftEnd = opts.leftEnd ?? LIFE_MEET_SNAKE.leftEnd;
  const crossEnd = opts.crossEnd ?? LIFE_MEET_SNAKE.crossEnd;
  const settleAt = opts.settleAt ?? LIFE_MEET_SNAKE.settleAt;
  const leftX = opts.leftX ?? LIFE_MEET_SNAKE.leftX;
  const face = opts.face ?? LIFE_MEET_SNAKE.face;
  const zoomScan = opts.zoomScan ?? LIFE_MEET_SNAKE.zoomScan;
  const zoomFace = opts.zoomFace ?? LIFE_MEET_SNAKE.zoomFace;

  const u = Math.min(1, Math.max(0, t));

  if (u <= hold) {
    return { x: leftX * 0.35, y: 0.03, scale: zoomScan };
  }

  if (u < leftEnd) {
    const s = segment(u, hold, leftEnd);
    return {
      x: leftX,
      y: lerp(0.03, 0.78, s),
      scale: zoomScan,
    };
  }

  if (u < crossEnd) {
    const s = segment(u, leftEnd, crossEnd);
    return {
      x: lerp(leftX, face.x, s),
      y: lerp(0.78, face.y + 0.12, s),
      scale: lerp(zoomScan, zoomFace - 0.04, s),
    };
  }

  if (u < settleAt) {
    const s = segment(u, crossEnd, settleAt);
    return {
      x: face.x,
      y: lerp(face.y + 0.12, face.y + 0.04, s),
      scale: lerp(zoomFace - 0.04, zoomFace - 0.02, s),
    };
  }

  const s = segment(u, settleAt, 1);
  return {
    x: face.x,
    y: lerp(face.y + 0.04, face.y, s),
    scale: lerp(zoomFace - 0.02, zoomFace, s),
  };
}

export function snakePanLayout(
  viewW: number,
  viewH: number,
  aspect: number,
  focus: SnakeFocus,
): { imgW: number; imgH: number; tx: number; ty: number } {
  const s = Math.max(1.05, focus.scale);
  let imgH = viewH * s;
  let imgW = imgH * aspect;
  if (imgW < viewW * s) {
    imgW = viewW * s;
    imgH = imgW / aspect;
  }
  const tx = -focus.x * Math.max(0, imgW - viewW);
  const ty = -focus.y * Math.max(0, imgH - viewH);
  return { imgW, imgH, tx, ty };
}
