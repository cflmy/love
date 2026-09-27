"use client";

import Image from "next/image";
import { crops } from "@/data/assets";
import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

const CAPTIONS = [
  { id: "rise", start: 0.04, end: 0.16, text: "桥灯未灭，云层却抬起了头。" },
  { id: "muyun", start: 0.2, end: 0.38, role: "暮云", text: "君为暮云我为风，生生世世不相离。" },
  { id: "changfeng", start: 0.42, end: 0.6, role: "长风", text: "君为长风我为云，世世生生不相弃。" },
  { id: "promise", start: 0.64, end: 0.78, text: "长风恋暮云。" },
  { id: "oath", start: 0.82, end: 0.94, text: "这是我们曾经的许诺。" },
] as const;

function plateOpacity(local: number, start: number, end: number) {
  return bandOpacity(local, start, end, 0.08);
}

/**
 * G2 · 前世 — rise into myth; one still at a time; oath late.
 */
export function PastChapter() {
  const local = useChapterLocal("past");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;

  const plates = [
    { src: crops.pastMuyun, o: plateOpacity(local, 0.12, 0.48) },
    { src: crops.pastChangfeng, o: plateOpacity(local, 0.4, 0.72) },
    { src: crops.pastHold, o: plateOpacity(local, 0.68, 0.96) },
  ];

  return (
    <section className="film-act film-act--past" aria-label="前世" data-act="past">
      <div className="film-act__sticky">
        <div className="film-act__plates" aria-hidden>
          {plates.map((p) =>
            p.o > 0.02 ? (
              <div key={p.src} className="film-act__plate" style={{ opacity: p.o }}>
                <Image src={p.src} alt="" fill sizes="100vw" className="film-act__img" priority={false} />
              </div>
            ) : null,
          )}
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
