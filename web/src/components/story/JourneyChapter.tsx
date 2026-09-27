"use client";

import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { JOURNEY_CAPTIONS } from "@/data/journeyShots";
import { useStoryStore } from "@/store/story";

/**
 * 山高路远 — WebGL JourneyRealm plays sheets 16→17→18;
 * DOM only captions (Present pattern). Base underlay is roadBeforeSunset.
 */
export function JourneyChapter() {
  const local = useChapterLocal("journey");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;

  return (
    <section
      className="film-act film-act--journey"
      aria-label="山高路远"
      data-act="journey"
      style={{ minHeight: "var(--chapter-journey-vh, 1200svh)" }}
    >
      <div className="film-act__sticky">
        <div className="film-act__veil film-act__veil--myth" aria-hidden />

        <div className="film-act__captions" style={{ opacity: inAct ? 1 : 0 }} aria-live="polite">
          {JOURNEY_CAPTIONS.map((line) => {
            const o = reduced
              ? local >= line.start && local < line.end
                ? 1
                : 0
              : bandOpacity(local, line.start, line.end);
            if (o < 0.02) return null;
            return (
              <p
                key={line.id}
                className="film-act__line"
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
      </div>
    </section>
  );
}
