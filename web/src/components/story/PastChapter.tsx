"use client";

import Image from "next/image";
import { FrameImage } from "@/components/ui/FrameImage";
import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";
import { RevealPlate, plateT } from "./RevealPlate";

const CAPTIONS = [
  { id: "rise", start: 0.02, end: 0.08, text: "桥灯未灭，云层却抬起了头。" },
  { id: "muyun", start: 0.08, end: 0.26, role: "暮云", text: "君为暮云我为风，生生世世不相离。" },
  { id: "changfeng", start: 0.32, end: 0.46, role: "长风", text: "君为长风我为云，世世生生不相弃。" },
  { id: "first", start: 0.5, end: 0.6, text: "云起于东，风来于西，一眼万年。" },
  { id: "travel", start: 0.62, end: 0.72, text: "凤舞九天，鹏游四海，与你并肩。" },
  { id: "hold", start: 0.74, end: 0.84, text: "此心不改，山海可证。" },
  { id: "seas", start: 0.86, end: 0.93, text: "长风恋暮云。" },
  { id: "oath", start: 0.94, end: 0.99, text: "这是我们曾经的许诺。" },
] as const;

function plateOpacity(local: number, start: number, end: number) {
  return bandOpacity(local, start, end, 0.06);
}

/**
 * G2 · 前世
 * - Far 双开门: 暮云左 | 长风右 — recessed perspective, no stretch, behind animation
 * - Front plates: fitGrow 暮云/长风 animation + later myth stills
 */
export function PastChapter() {
  const local = useChapterLocal("past");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;

  const doorOp =
    Math.min(1, local / 0.04) *
    (local < 0.95 ? 1 : Math.max(0, 1 - (local - 0.95) / 0.05)) *
    0.78;
  const open = Math.min(1, Math.max(0, (local - 0.04) / 0.65));
  const openEase = open * open * (3 - 2 * open);

  const plates = [
    { src: crops.pastMuyun, start: 0.02, end: 0.34, mode: "fitGrow" as const },
    { src: crops.pastChangfeng, start: 0.28, end: 0.52, mode: "fitGrow" as const },
    { src: crops.pastTravel, start: 0.48, end: 0.66, mode: "scan" as const },
    { src: crops.pastMeet, start: 0.6, end: 0.76, mode: "scan" as const },
    { src: crops.pastHold, start: 0.72, end: 0.88, mode: "scan" as const },
    { src: crops.pastSeas, start: 0.84, end: 0.99, mode: "scan" as const },
  ];

  const quartet = bandOpacity(local, 0.58, 0.93, 0.08);

  return (
    <section className="film-act film-act--past" aria-label="前世" data-act="past">
      <div className="film-act__sticky">
        {/* Far 双开门 — L|R, perspective depth, never covers front plates */}
        <div
          className="past-doors"
          aria-hidden
          style={{ opacity: doorOp * (inAct ? 1 : 0) }}
        >
          <div
            className="past-doors__leaf past-doors__leaf--left"
            style={{
              transform: reduced
                ? undefined
                : `translate3d(${-6 - openEase * 4}%, 0, 0) rotateY(${-18 - openEase * 12}deg)`,
            }}
          >
            <div className="past-doors__frame">
              <Image
                src={crops.pastMuyun}
                alt=""
                fill
                sizes="70vw"
                className="past-doors__img"
                priority
              />
            </div>
          </div>
          <div
            className="past-doors__leaf past-doors__leaf--right"
            style={{
              transform: reduced
                ? undefined
                : `translate3d(${6 + openEase * 4}%, 0, 0) rotateY(${18 + openEase * 12}deg)`,
            }}
          >
            <div className="past-doors__frame">
              <Image
                src={crops.pastChangfeng}
                alt=""
                fill
                sizes="70vw"
                className="past-doors__img"
              />
            </div>
          </div>
          <div className="past-doors__corridor" />
        </div>

        <div className="film-act__plates" aria-hidden>
          {plates.map((p) => {
            const o = plateOpacity(local, p.start, p.end);
            if (o < 0.02) return null;
            return (
              <RevealPlate
                key={`anim-${p.src}`}
                src={p.src}
                opacity={o}
                t={plateT(local, p.start, p.end)}
                mode={reduced && p.mode === "fitGrow" ? "scan" : p.mode}
              />
            );
          })}
          <div className="film-act__veil film-act__veil--myth" />
        </div>

        {quartet > 0.05 ? (
          <div className="past-quartet" style={{ opacity: quartet }} aria-hidden>
            {[crops.pastTravel, crops.pastMeet, crops.pastHold, crops.pastSeas].map((src, i) => (
              <figure
                key={src}
                className={`past-quartet__card past-quartet__card--${i + 1}`}
                style={{
                  transform: reduced
                    ? undefined
                    : `translateY(${(1 - quartet) * (18 + i * 6)}px) rotate(${[-3, 2.5, -2, 3][i]}deg)`,
                }}
              >
                <FrameImage src={src} sizes="160px" />
              </figure>
            ))}
          </div>
        ) : null}

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
                  transform: reduced ? undefined : `translateY(${(1 - o) * 16}px)`,
                  filter: reduced ? undefined : `blur(${(1 - o) * 8}px)`,
                }}
              >
                {"role" in line && line.role ? <span className="film-act__role">{line.role}</span> : null}
                {line.text}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
