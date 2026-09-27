"use client";

import Image from "next/image";
import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";
import { RevealPlate, plateT } from "./RevealPlate";

/**
 * 山高路远 = sheets 16 (road) + 17 (myth) + 18 (story boards).
 * Full-bleed dreamy carousel after 今世 — not the day/memory timeline.
 */
const PLATES = [
  // —— 16 · road ——
  { src: crops.roadWait, id: "16-1", start: 0.02, end: 0.12 },
  { src: crops.roadDepart, id: "16-2", start: 0.1, end: 0.2 },
  { src: crops.roadClimb, id: "16-3", start: 0.18, end: 0.28 },
  { src: crops.roadRunHer, id: "16-4", start: 0.26, end: 0.36 },
  { src: crops.roadTrain, id: "16-5", start: 0.34, end: 0.42 },
  { src: crops.roadBeforeSunset, id: "16-6", start: 0.4, end: 0.48 },
  { src: crops.roadSunHolds, id: "16-7", start: 0.46, end: 0.54 },
  { src: crops.roadEmbrace, id: "16-8", start: 0.52, end: 0.6 },
  // —— 17 · myth ——
  { src: crops.mythParting, id: "17-1", start: 0.58, end: 0.66 },
  { src: crops.mythWaiting, id: "17-2", start: 0.64, end: 0.7 },
  { src: crops.mythRoad, id: "17-3", start: 0.68, end: 0.74 },
  { src: crops.mythPhoenix, id: "17-4", start: 0.72, end: 0.78 },
  { src: crops.mythChains, id: "17-5", start: 0.76, end: 0.82 },
  { src: crops.mythRun, id: "17-6", start: 0.8, end: 0.86 },
  { src: crops.mythEmbrace, id: "17-7", start: 0.84, end: 0.9 },
  { src: crops.mythNeverSets, id: "17-8", start: 0.88, end: 0.96 },
  // —— 18 · story accents ——
  { src: crops.story3, id: "18-3", start: 0.3, end: 0.38 },
  { src: crops.story4, id: "18-4", start: 0.5, end: 0.58 },
  { src: crops.story8, id: "18-8", start: 0.92, end: 0.995 },
] as const;

const CAPTIONS = [
  { id: "wait", start: 0.04, end: 0.12, text: "你别担心。" },
  { id: "go", start: 0.14, end: 0.22, text: "太阳落山前我一定回来。" },
  { id: "answer", start: 0.48, end: 0.56, text: "不必着急。只要你回来，太阳永不落山。" },
  { id: "meet", start: 0.78, end: 0.86, text: "穿过山海，越过人间，我们终会相遇。" },
  { id: "seal", start: 0.9, end: 0.98, text: "从此，无论多远，我们都不会再分开。" },
] as const;

export function JourneyChapter() {
  const local = useChapterLocal("journey");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;
  const ambientOp = inAct
    ? Math.min(1, local < 0.04 ? local / 0.04 : local > 0.94 ? (1 - local) / 0.06 : 1) * 0.35
    : 0;

  return (
    <section
      className="film-act film-act--journey"
      aria-label="山高路远"
      data-act="journey"
      style={{ minHeight: "var(--chapter-journey-vh, 1200svh)" }}
    >
      <div className="film-act__sticky">
        <div className="film-act__plates" aria-hidden>
          {ambientOp > 0.02 ? (
            <div className="present-ambient present-ambient--journey" style={{ opacity: ambientOp }}>
              {/* 今世缘起 as soft base under dark journey plates */}
              <Image
                src={crops.lifeMeet}
                alt=""
                fill
                sizes="100vw"
                priority
                className="present-ambient__img"
              />
              <div className="present-ambient__mist" />
            </div>
          ) : null}

          {PLATES.map((p, i) => {
            const o = bandOpacity(local, p.start, p.end, 0.05);
            if (o < 0.02) return null;
            return (
              <RevealPlate
                key={p.id}
                src={p.src}
                opacity={o}
                t={plateT(local, p.start, p.end)}
                mode="scan"
                dreamy={!reduced}
                priority={i < 2}
              />
            );
          })}
          <div className="film-act__veil film-act__veil--myth" />
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
