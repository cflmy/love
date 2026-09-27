"use client";

import { useState } from "react";
import { ArtButton } from "@/components/ui/ArtButton";
import { FUTURE_CAPTIONS } from "@/data/codaShots";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

/**
 * 更远的明天 — WebGL returns to the bridge, then pulls back.
 * DOM only timed lines, then the quiet choice. No second climax.
 */
export function EndingChapter() {
  const local = useChapterLocal("future");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const [choice, setChoice] = useState<"none" | "yes" | "ofcourse">("none");
  const inAct = local > 0.01 && local < 0.995;
  const eggOp = reduced ? (local >= 0.84 ? 1 : 0) : bandOpacity(local, 0.84, 0.98, 0.06);

  return (
    <section
      className="film-act film-act--future"
      aria-label="更远的明天"
      data-act="future"
      style={{ minHeight: "var(--chapter-future-vh, 580svh)" }}
    >
      <div className="film-act__sticky">
        <div className="film-act__veil film-act__veil--ending" aria-hidden />

        <div className="film-act__captions ending-captions" style={{ opacity: inAct ? 1 : 0 }} aria-live="polite">
          {FUTURE_CAPTIONS.map((line) => {
            const o = reduced
              ? local >= line.start && local < line.end
                ? 1
                : 0
              : bandOpacity(local, line.start, line.end, line.kind === "final" ? 0.08 : 0.05);
            if (o < 0.02) return null;
            return (
              <p
                key={line.id}
                className={`film-act__line ending-line ending-line--${line.kind}`}
                style={{
                  opacity: o,
                  top: "46%",
                  transform: reduced ? "translateY(-50%)" : `translateY(calc(-50% + ${(1 - o) * 12}px))`,
                  filter: reduced ? undefined : `blur(${(1 - o) * 5}px)`,
                }}
              >
                {line.text}
              </p>
            );
          })}
        </div>

        {eggOp > 0.02 ? (
          choice === "none" ? (
            <div className="qd-modal ending-egg" style={{ opacity: eggOp }}>
              <p className="qd-modal__title">再陪我走一段吧</p>
              <p className="qd-modal__en">Are you ready?</p>
              <div className="ending-egg__actions">
                <ArtButton variant="more" label="好" hint="Yes" width={148} onClick={() => setChoice("yes")} />
                <ArtButton
                  variant="memory"
                  label="当然"
                  hint="Of course"
                  width={168}
                  onClick={() => setChoice("ofcourse")}
                />
              </div>
            </div>
          ) : (
            <div className="ending-egg is-done" style={{ opacity: eggOp }}>
              <p>相逢鹊渡</p>
              <p>相守情长</p>
              <p className="ending-egg__qdqc">QDQC · ∞</p>
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
