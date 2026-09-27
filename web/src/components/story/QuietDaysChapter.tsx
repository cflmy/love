"use client";

import { FrameImage } from "@/components/ui/FrameImage";
import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

const LINES = [
  { id: "a", start: 0.18, end: 0.42, text: "Quiet days.", className: "a" },
  { id: "b", start: 0.36, end: 0.62, text: "Quiet cuddles.", className: "b" },
  { id: "c", start: 0.56, end: 0.88, text: "陪伴的日子安宁，坚定的拥抱无声。", className: "c" },
] as const;

/**
 * After climax — one teacup still, soft breath, one line at a time.
 * No cream page wash; WebGL Add1 stays behind.
 */
export function QuietDaysChapter() {
  const local = useChapterLocal("quiet-days");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.02 && local < 0.995;

  return (
    <section
      className="film-act film-act--quiet"
      aria-label="Quiet Days"
      data-act="quiet-days"
      style={{ minHeight: "var(--chapter-quiet-vh, 240svh)" }}
    >
      <div className="film-act__sticky film-act__sticky--quiet">
        <div className="quiet-days__haze" aria-hidden />

        <figure className={`quiet-days__cup ${reduced ? "is-still" : ""}`}>
          <FrameImage src={crops.dayTea} sizes="(max-width: 768px) 78vw, 420px" priority />
          <span className="quiet-days__steam" aria-hidden />
          <span className="quiet-days__steam quiet-days__steam--b" aria-hidden />
        </figure>

        <div className="quiet-days__copy" style={{ opacity: inAct ? 1 : 0 }} aria-live="polite">
          {LINES.map((line) => {
            const o = reduced
              ? local >= line.start && local < line.end
                ? 1
                : 0
              : bandOpacity(local, line.start, line.end, 0.06);
            if (o < 0.02) return null;
            return (
              <p
                key={line.id}
                className={`quiet-days__line ${line.className}`}
                style={{
                  opacity: o,
                  transform: reduced ? undefined : `translateY(${(1 - o) * 14}px)`,
                  filter: reduced ? undefined : `blur(${(1 - o) * 5}px)`,
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
