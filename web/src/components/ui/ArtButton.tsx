"use client";

import { useRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent } from "react";
import { BlossomMark, StoryIcon, type StoryIconName } from "./icons";

/** Same names as the kit so call sites stay stable. */
export type ArtButtonVariant =
  | "start"
  | "next"
  | "prev"
  | "more"
  | "music"
  | "pause"
  | "memory"
  | "primaryMobile"
  | "secondaryMobile";

type Tone = "primary" | "secondary" | "next" | "prev" | "memory" | "music" | "pause";

const TONE: Record<ArtButtonVariant, Tone> = {
  start: "primary",
  primaryMobile: "primary",
  more: "secondary",
  secondaryMobile: "secondary",
  next: "next",
  prev: "prev",
  memory: "memory",
  music: "music",
  pause: "pause",
};

const LEADING: Partial<Record<Tone, StoryIconName>> = {
  music: "music",
  pause: "pause",
};

type Props = {
  variant?: ArtButtonVariant;
  label: string;
  /** Small Latin line under the Chinese label */
  hint?: string;
  className?: string;
  /** Minimum width in CSS px */
  width?: number;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

/**
 * Story CTA — glass pill + blossom mark.
 * Kit bitmaps bake in 「了解更多」etc.; we never paint them under custom labels.
 */
export function ArtButton({
  variant = "start",
  label,
  hint,
  className = "",
  width = 240,
  disabled,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const tone = TONE[variant];
  const leading = LEADING[tone];

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--shift-x", `${((px - 0.5) * 5).toFixed(1)}px`);
    el.style.setProperty("--shift-y", `${((py - 0.5) * 3.5).toFixed(1)}px`);
    el.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--shift-x", "0px");
    el.style.setProperty("--shift-y", "0px");
    el.style.setProperty("--glow-x", "28%");
    el.style.setProperty("--glow-y", "18%");
  };

  const style = {
    "--btn-w": `${width}px`,
  } as CSSProperties;

  return (
    <button
      ref={ref}
      type="button"
      className={`qd-btn qd-btn--${tone} ${className}`.trim()}
      style={style}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
      {...rest}
    >
      <span className="qd-btn__wash" aria-hidden />
      <span className="qd-btn__sheen" aria-hidden />
      <span className="qd-btn__rim" aria-hidden />
      {tone === "primary" || tone === "memory" || tone === "prev" ? (
        <BlossomMark className="qd-btn__bloom" />
      ) : null}
      {leading ? <StoryIcon name={leading} className="qd-btn__lead" /> : null}
      {tone === "secondary" ? <BlossomMark className="qd-btn__bloom qd-btn__bloom--mini" /> : null}
      {tone === "prev" ? <StoryIcon name="chevron" className="qd-btn__chev qd-btn__chev--back" /> : null}
      <span className="qd-btn__copy">
        <span className="qd-btn__zh">{label}</span>
        {hint ? <span className="qd-btn__en">{hint}</span> : null}
      </span>
      {tone === "primary" || tone === "memory" || tone === "next" ? (
        <StoryIcon name="chevron" className="qd-btn__chev" />
      ) : null}
    </button>
  );
}
