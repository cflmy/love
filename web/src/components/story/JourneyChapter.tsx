"use client";

import Image from "next/image";
import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

function beatActive(local: number, start: number, end: number) {
  return local >= start && local < end;
}

function pickBg(local: number) {
  if (local < 0.14) return crops.roadWait;
  if (local < 0.26) return crops.roadDepart;
  if (local < 0.38) return crops.roadClimb;
  if (local < 0.5) return crops.roadRunHer;
  if (local < 0.62) return crops.mythChains;
  if (local < 0.74) return crops.mythRun;
  if (local < 0.88) return crops.roadEmbrace;
  return crops.mythNeverSets;
}

const SOFT = [
  { id: "wait", start: 0.04, end: 0.14, text: "你别担心。" },
  { id: "go", start: 0.16, end: 0.26, text: "太阳落山前我一定回来。" },
  { id: "answer", start: 0.3, end: 0.42, text: "不必着急。只要你回来，太阳永不落山。" },
] as const;

/**
 * G4 · 山高路远 — dual approach → chains → embrace → silence.
 * Self-contained sticky film (no lead-in/outro album dumps).
 */
export function JourneyChapter() {
  const local = useChapterLocal("journey");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const split = bandOpacity(local, 0.12, 0.5, 0.06);
  const chain = bandOpacity(local, 0.52, 0.7, 0.06);
  const broken = local >= 0.66;
  const converge = bandOpacity(local, 0.7, 0.84, 0.05);
  const embrace = bandOpacity(local, 0.82, 0.94, 0.05);
  const hush = local >= 0.92;
  const bg = pickBg(local);
  const softGate = local < 0.45 ? 1 : Math.max(0, 1 - (local - 0.45) / 0.06);

  return (
    <section
      className={`journey-chapter ${hush ? "is-hush" : ""}`}
      aria-label="山高路远"
      data-act="journey"
    >
      <div className="journey-chapter__sticky">
        <div className="journey-chapter__photo" aria-hidden>
          <Image src={bg} alt="" fill priority sizes="100vw" className="journey-chapter__img" />
        </div>
        <div className="journey-chapter__sky" style={{ opacity: Math.min(1, local * 1.15) }} />

        <div className="film-act__captions journey-soft" style={{ opacity: softGate }} aria-live="polite">
          {SOFT.map((line) => {
            const o = reduced
              ? local >= line.start && local < line.end
                ? 1
                : 0
              : bandOpacity(local, line.start, line.end);
            if (o < 0.02) return null;
            return (
              <p key={line.id} className="film-act__line" style={{ opacity: o }}>
                {line.text}
              </p>
            );
          })}
        </div>

        <div className="journey-split" style={{ opacity: split }}>
          <div
            className={`journey-pane journey-pane--him ${beatActive(local, 0.14, 0.36) ? "is-focus" : ""}`}
          >
            <div className="journey-pane__photo">
              <Image src={crops.roadDepart} alt="" fill sizes="50vw" className="journey-pane__img" />
            </div>
            <p className="journey-pane__role">他</p>
            <p className="journey-pane__line">你别担心</p>
            <p className="journey-pane__line strong">太阳落山前我一定回来</p>
            <div className="journey-path him" style={{ transform: `translateX(${local * 42}%)` }} />
          </div>
          <div
            className={`journey-pane journey-pane--her ${beatActive(local, 0.28, 0.5) ? "is-focus" : ""}`}
          >
            <div className="journey-pane__photo">
              <Image src={crops.roadRunHer} alt="" fill sizes="50vw" className="journey-pane__img" />
            </div>
            <p className="journey-pane__role">她</p>
            <p className="journey-pane__line">不必着急</p>
            <p className="journey-pane__line strong">只要你回来，太阳永不落山</p>
            <div className="journey-path her" style={{ transform: `translateX(${-local * 42}%)` }} />
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

        <div className="journey-sun" style={{ opacity: Math.min(1, 0.15 + local * 0.85) }} aria-hidden>
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
