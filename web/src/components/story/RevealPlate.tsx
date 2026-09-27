"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { imageSize } from "@/data/imageSize";
import { LIFE_MEET_SNAKE, snakePanLayout, snakeScan, type SnakeScanOpts } from "@/lib/snakeScan";

export type RevealMode = "fitGrow" | "scan" | "snake";

function mediaPath(url: string) {
  return url.split("?")[0] ?? url;
}

function intrinsicAspect(src: string) {
  const known = imageSize[mediaPath(src)];
  if (known?.w && known?.h) return known.w / known.h;
  return 16 / 9;
}

function fallbackView() {
  if (typeof window === "undefined") return { w: 390, h: 844 };
  return {
    w: Math.max(1, window.innerWidth),
    h: Math.max(1, window.innerHeight),
  };
}

/** Soft floating light motes — sparkle without covering type. */
function SparkleField({ seed = 1 }: { seed?: number }) {
  const dots = useMemo(() => {
    const out: { left: string; top: string; delay: string; dur: string; size: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const n = (Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453) % 1;
      const m = (Math.sin(seed * 4.11 + i * 19.19) * 23421.63) % 1;
      const a = Math.abs(n);
      const b = Math.abs(m);
      out.push({
        left: `${8 + a * 84}%`,
        top: `${6 + b * 78}%`,
        delay: `${(a * 4).toFixed(2)}s`,
        dur: `${2.8 + b * 3.2}s`,
        size: 2 + Math.floor(a * 4),
      });
    }
    return out;
  }, [seed]);

  return (
    <div className="dream-plate__sparkles" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          className="dream-plate__mote"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: d.dur,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Sticky chapter still.
 * - fitGrow / scan: classic reveal
 * - snake: typography column → faces (dreamy blur + sparkle)
 */
export function RevealPlate({
  src,
  opacity,
  t,
  mode = "scan",
  priority = false,
  dreamy = false,
  scanOpts,
}: {
  src: string;
  opacity: number;
  t: number;
  mode?: RevealMode;
  priority?: boolean;
  dreamy?: boolean;
  scanOpts?: SnakeScanOpts;
}) {
  const plateRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(fallbackView);

  useLayoutEffect(() => {
    if (mode !== "snake") return;
    const el = plateRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 1 && r.height > 1) {
        setView({ w: r.width, h: r.height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  if (mode === "snake") {
    const focus = snakeScan(t, scanOpts ?? LIFE_MEET_SNAKE);
    const aspect = intrinsicAspect(src);
    const layout = snakePanLayout(view.w, view.h, aspect, focus);
    const known = imageSize[mediaPath(src)];
    const hazeBreath = 1.06 + Math.sin(t * Math.PI * 2) * 0.02;

    return (
      <div
        ref={plateRef}
        className={`film-act__plate film-act__plate--reveal film-act__plate--snake${dreamy ? " is-dreamy" : ""}`}
        style={{ opacity }}
      >
        {/* Fallback cover so we never flash an empty dark plate before layout */}
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          className="film-act__img film-act__img--snake-fallback"
          style={{ objectFit: "cover", objectPosition: `${focus.x * 100}% ${focus.y * 100}%` }}
        />
        {dreamy ? (
          <Image
            src={src}
            alt=""
            width={known?.w ?? 1952}
            height={known?.h ?? 1248}
            sizes="250vw"
            priority={priority}
            aria-hidden
            className="film-act__img film-act__img--snake-glow"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: layout.imgW * hazeBreath,
              height: layout.imgH * hazeBreath,
              maxWidth: "none",
              objectFit: "fill",
              transform: `translate3d(${layout.tx - layout.imgW * 0.03}px, ${layout.ty - layout.imgH * 0.02}px, 0)`,
            }}
          />
        ) : null}
        <Image
          src={src}
          alt=""
          width={known?.w ?? 1952}
          height={known?.h ?? 1248}
          sizes="250vw"
          priority={priority}
          className="film-act__img film-act__img--snake"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: layout.imgW,
            height: layout.imgH,
            maxWidth: "none",
            objectFit: "fill",
            transform: `translate3d(${layout.tx}px, ${layout.ty}px, 0)`,
          }}
        />
        {dreamy ? (
          <>
            <div className="dream-plate__haze" aria-hidden />
            <div className="dream-plate__bloom" aria-hidden />
            <SparkleField seed={priority ? 3 : 7} />
          </>
        ) : null}
      </div>
    );
  }

  const eased = t * t * (3 - 2 * t);

  let objectFit: "contain" | "cover" = "cover";
  let objectPosition = "50% 40%";
  let scale = 1.06;

  if (mode === "fitGrow") {
    const grow = Math.min(1, eased / 0.42);
    const scan = Math.max(0, (eased - 0.42) / 0.58);
    objectFit = scan < 0.12 ? "contain" : "cover";
    scale = 0.7 + grow * 0.32 + scan * 0.1;
    const ox = 6 + scan * 88;
    const oy = 8 + scan * 78;
    objectPosition = `${ox}% ${oy}%`;
  } else {
    // Soft dreamy ken-burns — gentle, never empty
    const hold = 0.08;
    const scan = Math.max(0, (eased - hold) / (1 - hold));
    scale = dreamy ? 1.12 + scan * 0.06 : 1.18;
    const ox = 12 + scan * 76;
    const oy = 18 + scan * 55;
    objectPosition = `${ox}% ${oy}%`;
  }

  return (
    <div
      className={`film-act__plate film-act__plate--reveal film-act__plate--${mode}${dreamy ? " is-dreamy" : ""}`}
      style={{ opacity }}
    >
      {dreamy ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          aria-hidden
          className="film-act__img film-act__img--reveal-glow"
          style={{
            objectFit: "cover",
            objectPosition,
            transform: `scale(${scale * 1.08})`,
          }}
        />
      ) : null}
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
      {dreamy ? (
        <>
          <div className="dream-plate__haze" aria-hidden />
          <SparkleField seed={5} />
        </>
      ) : null}
    </div>
  );
}

/** Normalize local progress into 0→1 inside [start, end]. */
export function plateT(local: number, start: number, end: number) {
  const span = Math.max(0.0001, end - start);
  return Math.min(1, Math.max(0, (local - start) / span));
}
