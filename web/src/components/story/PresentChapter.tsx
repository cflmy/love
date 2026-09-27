"use client";

import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { PRESENT_CAPTIONS, PRESENT_FOIL } from "@/data/presentShots";
import { useStoryStore } from "@/store/story";

/**
 * 今世 — WebGL PresentRealm plays sheets 14→15;
 * DOM only foil prayer + soft human-scale captions (Meeting pattern).
 */
export function PresentChapter() {
  const local = useChapterLocal("present");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;
  const foilGate = local < 0.38 ? 1 : Math.max(0, 1 - (local - 0.38) / 0.04);

  return (
    <section
      className="film-act film-act--present"
      aria-label="今世"
      data-act="present"
      style={{ minHeight: "var(--chapter-present-vh, 1400svh)" }}
    >
      <div className="film-act__sticky">
        <div className="film-act__veil film-act__veil--warm film-act__veil--present" aria-hidden />

        <div
          className="present-foil"
          style={{ opacity: inAct ? foilGate : 0 }}
          aria-live="polite"
        >
          {PRESENT_FOIL.map((beat) => {
            const o = reduced
              ? local >= beat.start && local < beat.end
                ? 1
                : 0
              : bandOpacity(local, beat.start, beat.end, 0.06);
            if (o < 0.02) return null;
            const rise = reduced ? 0 : (1 - o) * 22;
            return (
              <div
                key={beat.id}
                className="present-foil__beat"
                style={{
                  opacity: o,
                  transform: `translateY(${rise}px)`,
                  filter: reduced ? undefined : `blur(${(1 - o) * 5}px)`,
                }}
              >
                {beat.parts.map((part) => (
                  <p key={part.text} className={part.className}>
                    {part.text}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        <div
          className="film-act__captions present-captions"
          style={{ opacity: inAct && local > 0.32 ? 1 : 0 }}
          aria-live="polite"
        >
          {PRESENT_CAPTIONS.map((line) => {
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
