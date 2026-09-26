"use client";

import Image from "next/image";
import type { SceneBeat } from "@/data/scenes";

export function SceneBeatView({
  beat,
  tone = "dark",
}: {
  beat: SceneBeat;
  tone?: "dark" | "light";
}) {
  const imgs = beat.images?.length ? beat.images : [beat.image];
  const layout = beat.layout ?? "full";

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
                  ? "(max-width: 768px) 100vw, 920px"
                  : layout === "triptych"
                    ? "(max-width: 768px) 33vw, 300px"
                    : "(max-width: 768px) 50vw, 440px"
              }
              className="scene-beat__img"
            />
          </div>
        ))}
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
