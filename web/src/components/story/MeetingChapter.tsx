"use client";

import { useMemo } from "react";
import { chapterProgressBounds } from "@/data/chapters";
import { MEETING_CAPTIONS, bandOpacity } from "@/data/meetingShots";
import { useStoryStore } from "@/store/story";

function useMeetingLocal() {
  const progress = useStoryStore((s) => s.progress);
  return useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === "meeting");
    if (!b) return 0;
    const span = Math.max(0.0001, b.end - b.start);
    return Math.min(1, Math.max(0, (progress - b.start) / span));
  }, [progress]);
}

/**
 * Act 03 · 相逢鹊渡 — sticky viewport for camera scrub.
 * WebGL carries the film; DOM only soft timed lines (STORY_FLOW G1).
 */
export function MeetingChapter() {
  const local = useMeetingLocal();
  const reduced = useStoryStore((s) => s.reducedMotion);
  const inAct = local > 0.01 && local < 0.995;
  // Silence before title — captions clear by ~0.86
  const captionGate = local < 0.86 ? 1 : Math.max(0, 1 - (local - 0.86) / 0.04);
  const hintOpacity = reduced
    ? local < 0.12
      ? 0.5
      : 0
    : Math.max(0, 0.55 * (1 - bandOpacity(local, 0.04, 0.18)));

  return (
    <section className="meeting-chapter" aria-label="相逢鹊渡" data-act="meeting">
      <div className="meeting-chapter__sticky">
        <div className="meeting-chapter__veil" aria-hidden />
        <div
          className="meeting-chapter__captions"
          style={{ opacity: inAct ? captionGate : 0 }}
          aria-live="polite"
        >
          {MEETING_CAPTIONS.map((line) => {
            const o = reduced
              ? local >= line.start && local < line.end
                ? 1
                : 0
              : bandOpacity(local, line.start, line.end);
            if (o < 0.02) return null;
            return (
              <p
                key={line.id}
                className="meeting-chapter__line"
                style={{
                  opacity: o,
                  transform: reduced ? undefined : `translateY(${(1 - o) * 14}px)`,
                  filter: reduced ? undefined : `blur(${(1 - o) * 6}px)`,
                }}
              >
                {"role" in line && line.role ? (
                  <span className="meeting-chapter__role">{line.role}</span>
                ) : null}
                {line.text}
              </p>
            );
          })}
        </div>
        <p className="meeting-chapter__hint" aria-hidden style={{ opacity: hintOpacity }}>
          Scroll
        </p>
      </div>
    </section>
  );
}
