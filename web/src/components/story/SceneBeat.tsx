"use client";

import Image from "next/image";
import type { SceneBeat } from "@/data/scenes";
import { parts } from "@/data/assets";

export function SceneBeatView({
  beat,
  tone = "dark",
}: {
  beat: SceneBeat;
  tone?: "dark" | "light";
}) {
  const imgs = beat.images?.length ? beat.images : [beat.image];
  const layout = beat.layout ?? "full";
  const showSprite =
    layout === "full" && (beat.id.includes("meet") || beat.id.includes("past") || beat.id.includes("road"));

  return (
    <section className={`scene-beat scene-beat--${layout} scene-beat--${tone}`}>
      <div className="scene-beat__frame">
        {imgs.map((src, i) => (
          <div key={`${beat.id}-${i}`} className="scene-beat__shot">
            <Image
              src={src}
              alt=""
              fill
              sizes={
                layout === "full"
                  ? "(max-width: 768px) 100vw, 1100px"
                  : layout === "triptych"
                    ? "(max-width: 768px) 33vw, 300px"
                    : "(max-width: 768px) 50vw, 440px"
              }
              className="scene-beat__img"
            />
          </div>
        ))}
        {showSprite && layout === "full" ? (
          <div className="scene-beat__ornament" aria-hidden>
            <Image
              src={beat.id.includes("he") || beat.id.includes("road") ? parts.magpieSide : parts.butterflySide}
              alt=""
              width={160}
              height={120}
              className="scene-beat__ornament-img"
            />
          </div>
        ) : null}
      </div>
      <div className="scene-beat__copy">
        <p className="scene-beat__caption">{beat.caption}</p>
        {beat.line ? <p className="scene-beat__line">{beat.line}</p> : null}
      </div>
    </section>
  );
}

export function StoryFilmStrip({ images, label }: { images: string[]; label: string }) {
  return (
    <section className="story-strip" aria-label={label}>
      <p className="story-strip__label">{label}</p>
      <div className="story-strip__rail">
        {images.map((src, i) => (
          <div key={src} className="story-strip__cell">
            <Image src={src} alt="" fill sizes="140px" className="scene-beat__img" />
            <span>{String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Meeting triptych — watch-first narrative (docs: 先看后标题). */
export function MeetingTriptych({
  images,
  captions,
}: {
  images: [string, string, string];
  captions: [string, string, string];
}) {
  return (
    <section className="meeting-triptych" aria-label="相逢三境">
      {images.map((src, i) => (
        <figure key={src} className="meeting-triptych__panel">
          <div className="meeting-triptych__shot">
            <Image src={src} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" className="meeting-triptych__img" />
          </div>
          <figcaption>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <em>{captions[i]}</em>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
