"use client";

import { useMemo } from "react";
import { chapterProgressBounds } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function smooth(v: number, a: number, b: number) {
  if (b <= a) return v >= b ? 1 : 0;
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/**
 * Fixed overlay during 相逢鹊渡 — blur → focus late in the chapter (docs: 标题后置).
 */
export function MeetingTitle() {
  const progress = useStoryStore((s) => s.progress);
  const chapterId = useStoryStore((s) => s.chapterId);
  const reduced = useStoryStore((s) => s.reducedMotion);

  const local = useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === "meeting");
    if (!b) return 0;
    return clamp01((progress - b.start) / Math.max(0.0001, b.end - b.start));
  }, [progress]);

  if (chapterId !== "meeting") return null;

  const gate = smooth(local, 0.72, 0.84);
  const lineA = smooth(local, 0.78, 0.88);
  const lineB = smooth(local, 0.86, 0.94);
  const lineC = smooth(local, 0.92, 0.99);

  if (gate < 0.02) return null;

  const blur = (t: number) => (reduced ? 0 : (1 - t) * 14);
  const y = (t: number) => (1 - t) * 18;

  return (
    <div className="meeting-title" aria-live="polite" style={{ opacity: gate }}>
      <p
        className="meeting-title__line a"
        style={{
          opacity: 0.15 + lineA * 0.85,
          filter: `blur(${blur(lineA)}px)`,
          transform: `translateY(${y(lineA)}px)`,
        }}
      >
        相逢鹊渡
      </p>
      <p
        className="meeting-title__line b"
        style={{
          opacity: lineB * 0.92,
          filter: `blur(${blur(lineB)}px)`,
          transform: `translateY(${y(lineB)}px)`,
        }}
      >
        相守情长
      </p>
      <p
        className="meeting-title__line c"
        style={{
          opacity: lineC * 0.88,
          filter: `blur(${blur(lineC) * 0.7}px)`,
          transform: `translateY(${y(lineC) * 0.6}px)`,
        }}
      >
        故与君鹊渡情长
      </p>
    </div>
  );
}
