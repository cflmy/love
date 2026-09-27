"use client";

import { useState } from "react";
import { FrameImage } from "@/components/ui/FrameImage";
import { crops } from "@/data/assets";
import { LETTER_LINES } from "@/data/codaShots";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

/**
 * 给你的一封信 — envelope still + one line at a time.
 * No cream wash, no write-a-letter desk.
 */
export function LetterChapter() {
  const local = useChapterLocal("letter");
  const entered = useStoryStore((s) => s.entered);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const [open, setOpen] = useState(false);

  const pageMode = !entered;
  const unfolded = open || (!pageMode && local > 0.32);
  const inAct = pageMode || (local > 0.02 && local < 0.995);

  return (
    <section
      className={pageMode ? "letter-chapter letter-chapter--page" : "film-act film-act--letter"}
      aria-label="给你的一封信"
      data-act="letter"
      style={pageMode ? undefined : { minHeight: "var(--chapter-letter-vh, 400svh)" }}
    >
      <div className={pageMode ? "letter-chapter__frame" : "film-act__sticky film-act__sticky--letter"}>
        <div className="letter-haze" aria-hidden />

        <div className={`letter-desk ${unfolded ? "is-open" : ""}`}>
          <button
            type="button"
            className="letter-seal"
            onClick={() => setOpen(true)}
            aria-expanded={unfolded}
          >
            <FrameImage src={crops.storyLetter} alt="" sizes="(max-width: 768px) 88vw, 560px" />
            {unfolded ? null : <span className="letter-seal__hint">打开这封信</span>}
          </button>

          <div className="letter-paper__lines" style={{ opacity: inAct ? 1 : 0 }} aria-live="polite">
            {LETTER_LINES.map((line) => {
              const o = pageMode
                ? unfolded
                  ? 1
                  : 0
                : reduced
                  ? local >= line.start && local < line.end
                    ? 1
                    : 0
                  : bandOpacity(local, line.start, line.end, 0.045);
              if (o < 0.02) return null;
              return (
                <p
                  key={line.id}
                  className={`letter-paper__line letter-paper__line--${line.kind}`}
                  style={{
                    opacity: o,
                    transform: reduced || pageMode ? undefined : `translateY(${(1 - o) * 12}px)`,
                    filter: reduced || pageMode ? undefined : `blur(${(1 - o) * 5}px)`,
                  }}
                >
                  {line.text}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
