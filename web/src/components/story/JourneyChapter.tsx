"use client";

import { useMemo } from "react";
import { chapterProgressBounds } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

function useJourneyLocal() {
  const progress = useStoryStore((s) => s.progress);
  return useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === "journey");
    if (!b) return 0;
    const span = Math.max(0.0001, b.end - b.start);
    return Math.min(1, Math.max(0, (progress - b.start) / span));
  }, [progress]);
}

function beatActive(local: number, start: number, end: number) {
  return local >= start && local < end;
}

function opacityIn(local: number, start: number, end: number) {
  if (local < start) return 0;
  if (local > end) return Math.max(0, 1 - (local - end) / 0.08);
  return Math.min(1, (local - start) / 0.06);
}

/** Full-screen journey climax: split paths → chain break → embrace → hush. */
export function JourneyChapter() {
  const local = useJourneyLocal();
  const split = opacityIn(local, 0.08, 0.55);
  const chain = opacityIn(local, 0.58, 0.74);
  const broken = local >= 0.72;
  const converge = opacityIn(local, 0.76, 0.9);
  const embrace = opacityIn(local, 0.88, 0.98);
  const hush = local >= 0.93;
  const visible = local > 0.02 && local < 0.995;

  return (
    <section
      className={`journey-chapter ${hush ? "is-hush" : ""}`}
      aria-label="山高路远"
      style={{ opacity: visible ? 1 : 0.35 }}
    >
      <div className="journey-chapter__sticky">
        <div className="journey-chapter__sky" style={{ opacity: Math.min(1, local * 1.2) }} />

        <div className="journey-split" style={{ opacity: split }}>
          <div
            className={`journey-pane journey-pane--him ${beatActive(local, 0.12, 0.4) ? "is-focus" : ""}`}
          >
            <p className="journey-pane__role">他</p>
            <p className="journey-pane__line">你别担心</p>
            <p className="journey-pane__line strong">太阳落山前我一定回来</p>
            <div className="journey-path him" style={{ transform: `translateX(${local * 42}%)` }} />
          </div>
          <div
            className={`journey-pane journey-pane--her ${beatActive(local, 0.28, 0.55) ? "is-focus" : ""}`}
          >
            <p className="journey-pane__role">她</p>
            <p className="journey-pane__line">不必着急</p>
            <p className="journey-pane__line strong">只要你回来，太阳永不落山</p>
            <div
              className="journey-path her"
              style={{ transform: `translateX(${-local * 42}%)` }}
            />
          </div>
        </div>

        <div className={`journey-chain ${broken ? "is-broken" : ""}`} style={{ opacity: chain }}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <p>{broken ? "叮" : "枷锁"}</p>
        </div>

        <div className="journey-converge" style={{ opacity: converge }}>
          <p>穿过山海</p>
          <p>越过人间</p>
          <p className="accent">我们终会相遇</p>
        </div>

        <div className="journey-embrace" style={{ opacity: embrace }}>
          <p className="gold">只要你回来</p>
          <p className="gold late">太阳永不落山</p>
        </div>

        <div className="journey-sun" style={{ opacity: Math.min(1, 0.2 + local * 0.9) }} aria-hidden>
          <div
            className="journey-sun__disk"
            style={{
              transform: `translateY(${hush ? 18 : 8 + local * 28}px) scale(${1 + (hush ? 0.08 : local * 0.12)})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
