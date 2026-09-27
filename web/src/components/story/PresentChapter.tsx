"use client";

import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";
import { RevealPlate, plateT } from "./RevealPlate";

const CAPTIONS = [
  { id: "scale", start: 0.04, end: 0.14, text: "神话落下，人间升起。" },
  { id: "meet", start: 0.16, end: 0.3, text: "人海之中，很幸运，我们相遇了。" },
  { id: "know", start: 0.32, end: 0.46, text: "一起发呆，一起做很多平凡的小事。" },
  { id: "road", start: 0.48, end: 0.62, text: "山高路远，也要一起走。" },
  { id: "names", start: 0.64, end: 0.78, text: "晏永鸿 —— 王家祥" },
  { id: "seal", start: 0.8, end: 0.96, text: "祥云聚顶，鸿运当头。" },
] as const;

/**
 * G3 · 今世 — each still scans TL→BR so corner titles stay readable.
 */
export function PresentChapter() {
  const local = useChapterLocal("present");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;

  // Corner numbers: 1 相遇 → 2 相知 → 3 山高路远 → 4 祥云聚顶
  const plates = [
    { src: crops.lifeMeet, start: 0.04, end: 0.34 },
    { src: crops.lifeKnow, start: 0.28, end: 0.54 },
    { src: crops.lifeRoad, start: 0.48, end: 0.74 },
    { src: crops.lifeLuck, start: 0.68, end: 0.99 },
  ];

  const seal = bandOpacity(local, 0.86, 0.98, 0.06);

  return (
    <section className="film-act film-act--present" aria-label="今世" data-act="present">
      <div className="film-act__sticky">
        <div className="film-act__plates" aria-hidden>
          {plates.map((p, i) => {
            const o = bandOpacity(local, p.start, p.end, 0.07);
            if (o < 0.02) return null;
            return (
              <RevealPlate
                key={p.src}
                src={p.src}
                opacity={o}
                t={plateT(local, p.start, p.end)}
                mode="scan"
                priority={i === 0}
              />
            );
          })}
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
