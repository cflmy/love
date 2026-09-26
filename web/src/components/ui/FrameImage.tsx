"use client";

import Image from "next/image";
import { sizeOf } from "@/data/imageSize";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Max width clamp, e.g. "min(100%, 1100px)" via CSS class preferred */
};

/**
 * Show art at its intrinsic aspect ratio — no fill/cover boxes, no letterbox bars.
 */
export function FrameImage({ src, alt = "", className = "", sizes = "100vw", priority = false }: Props) {
  const { w, h } = sizeOf(src);
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      className={`frame-img ${className}`.trim()}
    />
  );
}
