"use client";

import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

const CAPTIONS = [
  { id: "rise", start: 0.04, end: 0.12, text: "桥灯未灭，云层却抬起了头。" },
  { id: "muyun", start: 0.14, end: 0.3, role: "暮云", text: "君为暮云我为风，生生世世不相离。" },
  { id: "changfeng", start: 0.34, end: 0.48, role: "长风", text: "君为长风我为云，世世生生不相弃。" },
  { id: "first", start: 0.52, end: 0.62, text: "云起于东，风来于西，一眼万年。" },
  { id: "travel", start: 0.64, end: 0.74, text: "凤舞九天，鹏游四海，与你并肩。" },
  { id: "hold", start: 0.76, end: 0.86, text: "此心不改，山海可证。" },
  { id: "seas", start: 0.86, end: 0.93, text: "长风恋暮云。" },
  { id: "oath", start: 0.94, end: 0.99, text: "这是我们曾经的许诺。" },
] as const;

/**
 * G2 · 前世
 * WebGL PastRealm carries doors + heroes + myth cards.
 * DOM only soft timed lines — no duplicate curtain / plates (kills the messy overlap).
 */
export function PastChapter() {
  const local = useChapterLocal("past");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;

  return (
    <section className="film-act film-act--past" aria-label="前世" data-act="past">
      <div className="film-act__sticky">
        <div className="film-act__veil film-act__veil--myth" aria-hidden />

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
