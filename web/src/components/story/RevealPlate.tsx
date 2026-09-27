"use client";

import Image from "next/image";

export type RevealMode = "fitGrow" | "scan";

/**
 * Sticky chapter still that reveals the full artwork while scrolling.
 * - fitGrow: start small/contain (read corner text) → grow into cover + TL→BR scan
 * - scan: cover frame, pan top-left → bottom-right like a slow ken-burns scan
 */
export function RevealPlate({
  src,
  opacity,
  /** 0→1 within this plate's lifetime */
  t,
  mode = "scan",
  priority = false,
}: {
  src: string;
  opacity: number;
  t: number;
  mode?: RevealMode;
  priority?: boolean;
}) {
  const eased = t * t * (3 - 2 * t);

  let objectFit: "contain" | "cover" = "cover";
  let objectPosition = "50% 40%";
  let scale = 1.06;

  if (mode === "fitGrow") {
    // 0→0.42: full frame visible (contain), scale up
    // 0.42→1: cover + scan so every corner is visited
    const grow = Math.min(1, eased / 0.42);
    const scan = Math.max(0, (eased - 0.42) / 0.58);
    objectFit = scan < 0.12 ? "contain" : "cover";
    scale = 0.7 + grow * 0.32 + scan * 0.1;
    const ox = 6 + scan * 88;
    const oy = 8 + scan * 78;
    objectPosition = `${ox}% ${oy}%`;
  } else {
    // Slow scan: top-left → bottom-right, slight zoom so edges stay readable
    scale = 1.12;
    const ox = eased * 100;
    const oy = eased * 100;
    objectPosition = `${ox}% ${oy}%`;
  }

  return (
    <div
      className={`film-act__plate film-act__plate--reveal film-act__plate--${mode}`}
      style={{ opacity }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="film-act__img film-act__img--reveal"
        style={{
          objectFit,
          objectPosition,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}

/** Normalize local progress into 0→1 inside [start, end]. */
export function plateT(local: number, start: number, end: number) {
  const span = Math.max(0.0001, end - start);
  return Math.min(1, Math.max(0, (local - start) / span));
}
