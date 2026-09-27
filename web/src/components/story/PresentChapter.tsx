"use client";

import Image from "next/image";
import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

const CAPTIONS = [
  { id: "scale", start: 0.05, end: 0.18, text: "神话落下，人间升起。" },
  { id: "meet", start: 0.22, end: 0.4, text: "人海之中，很幸运，我们相遇了。" },
  { id: "know", start: 0.44, end: 0.62, text: "一起发呆，一起做很多平凡的小事。" },
  { id: "names", start: 0.66, end: 0.8, text: "晏永鸿 —— 王家祥" },
  { id: "seal", start: 0.84, end: 0.96, text: "祥云聚顶，鸿运当头。" },
] as const;

/**
 * G3 · 今世 — epic → human; warm, close; Quiet Days waits later.
 */
export function PresentChapter() {
  const local = useChapterLocal("present");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;

  const plates = [
    { src: crops.lifeMeet, o: bandOpacity(local, 0.08, 0.45, 0.08) },
    { src: crops.lifeKnow, o: bandOpacity(local, 0.38, 0.7, 0.08) },
    { src: crops.lifeLuck, o: bandOpacity(local, 0.65, 0.98, 0.08) },
  ];

  const seal = bandOpacity(local, 0.86, 0.98, 0.06);

  return (
    <section className="film-act film-act--present" aria-label="今世" data-act="present">
      <div className="film-act__sticky">
        <div className="film-act__plates" aria-hidden>
          {plates.map((p) =>
            p.o > 0.02 ? (
              <div key={p.src} className="film-act__plate" style={{ opacity: p.o }}>
                <Image src={p.src} alt="" fill sizes="100vw" className="film-act__img" />
              </div>
            ) : null,
          )}
          <div className="film-act__veil film-act__veil--warm" />
        </div>

        <div className="film-act__captions" style={{ opacity: inAct ? 1 : 0 }} aria-live="polite">
          {CAPTIONS.map((line) => {
            const o = reduced
              ? local >= line.start && local < line.end
                ? 1
                : 0
              : bandOpacity(local, line.start, line.end);
            if (o < 0.02) return null;
            return (
              <p
                key={line.id}
                className="film-act__line film-act__line--dark"
                style={{
                  opacity: o,
                  transform: reduced ? undefined : `translateY(${(1 - o) * 14}px)`,
                  filter: reduced ? undefined : `blur(${(1 - o) * 6}px)`,
                }}
              >
                {line.text}
              </p>
            );
          })}
        </div>

        {seal > 0.02 ? (
          <p className="film-act__seal" style={{ opacity: seal }}>
            老天安排的最大！
          </p>
        ) : null}
      </div>
    </section>
  );
}
