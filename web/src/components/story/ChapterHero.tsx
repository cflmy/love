"use client";

import Image from "next/image";

/**
 * Cinematic chapter opener — full-bleed art first, title later (docs: 标题后置).
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
  /** Optional transparent sprite layered over the hero */
  overlay?: string;
}) {
  return (
    <section className={`chapter-hero chapter-hero--${tone}`} aria-label={title}>
      <div className="chapter-hero__art" aria-hidden>
        <Image src={image} alt="" fill priority={false} sizes="100vw" className="chapter-hero__img" />
        <div className="chapter-hero__veil" />
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
    </section>
  );
}
