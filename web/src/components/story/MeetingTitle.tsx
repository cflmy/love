"use client";

import { useMemo } from "react";
import { chapterProgressBounds } from "@/data/chapters";
import { MEETING_TITLE, smoothstep } from "@/data/meetingShots";
import { useStoryStore } from "@/store/story";

/**
 * Fixed overlay during 相逢鹊渡 — blur → focus only after meeting (STORY_FLOW G1).
 */
export function MeetingTitle() {
  const progress = useStoryStore((s) => s.progress);
  const chapterId = useStoryStore((s) => s.chapterId);
  const reduced = useStoryStore((s) => s.reducedMotion);

  const local = useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === "meeting");
    if (!b) return 0;
    return Math.min(1, Math.max(0, (progress - b.start) / Math.max(0.0001, b.end - b.start)));
  }, [progress]);

  if (chapterId !== "meeting") return null;

  const gate = smoothstep(local, MEETING_TITLE.gate.start, MEETING_TITLE.gate.end);
  const lineA = smoothstep(local, MEETING_TITLE.lineA.start, MEETING_TITLE.lineA.end);
  const lineB = smoothstep(local, MEETING_TITLE.lineB.start, MEETING_TITLE.lineB.end);
  const lineC = smoothstep(local, MEETING_TITLE.lineC.start, MEETING_TITLE.lineC.end);

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
