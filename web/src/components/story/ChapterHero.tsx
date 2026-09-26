"use client";

import Image from "next/image";
import { FrameImage } from "@/components/ui/FrameImage";
import { sizeOf } from "@/data/imageSize";

/**
 * Chapter opener sized by the art's own aspect ratio — no full-viewport letterboxing.
 */
export function ChapterHero({
  image,
  title,
  subtitle,
  lines,
  tone = "dark",
  seal,
  overlay,
}: {
  image: string;
  title: string;
  subtitle: string;
  lines: string[];
  tone?: "dark" | "light";
  seal?: string;
  overlay?: string;
}) {
  const { w, h } = sizeOf(image);
  return (
    <section className={`chapter-hero chapter-hero--${tone}`} aria-label={title}>
      <div className="chapter-hero__stage">
        <div className="chapter-hero__art" aria-hidden>
          <Image
            src={image}
            alt=""
            width={w}
            height={h}
            sizes="(max-width: 900px) 100vw, 1100px"
            className="chapter-hero__img frame-img"
            priority={false}
          />
          {overlay ? (
            <div className="chapter-hero__sprite">
              <Image src={overlay} alt="" width={220} height={160} className="chapter-hero__sprite-img" />
            </div>
          ) : null}
        </div>
        <div className="chapter-hero__copy">
          <p className="chapter-hero__eyebrow">{subtitle}</p>
          <h2 className="chapter-hero__title">{title}</h2>
          <div className="chapter-hero__lines">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {seal ? <p className="chapter-seal">{seal}</p> : null}
        </div>
      </div>
    </section>
  );
}
