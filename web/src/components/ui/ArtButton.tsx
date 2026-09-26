"use client";

import { useRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";
import { uiButtons } from "@/data/assets";

export type ArtButtonVariant = keyof typeof uiButtons;

type Props = {
  variant?: ArtButtonVariant;
  label: string;
  className?: string;
  width?: number;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

/**
 * Illustrated CTA from UI kit sheets — physical hover/press, not CSS pills.
 */
export function ArtButton({
  variant = "start",
  label,
  className = "",
  width = 280,
  disabled,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const src = uiButtons[variant];

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(px * 5).toFixed(2)}deg`);
    el.style.setProperty("--shift-x", `${(px * 6).toFixed(1)}px`);
    el.style.setProperty("--shift-y", `${(py * 4).toFixed(1)}px`);
  };

  const resetTilt = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--shift-x", "0px");
    el.style.setProperty("--shift-y", "0px");
  };

  const style = {
    "--btn-w": `${width}px`,
  } as CSSProperties;

  return (
    <button
      ref={ref}
      type="button"
      className={`art-button ${className}`.trim()}
      style={style}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={resetTilt}
      onBlur={resetTilt}
      {...rest}
    >
      <span className="art-button__glow" aria-hidden />
      <Image
        src={src}
        alt=""
        width={width}
        height={Math.round(width * 0.32)}
        className="art-button__img"
        draggable={false}
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}
