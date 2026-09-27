"use client";

import { useMemo } from "react";
import { chapterProgressBounds, type ChapterId } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

/** Local 0→1 progress inside a scroll chapter. */
export function useChapterLocal(id: ChapterId) {
  const progress = useStoryStore((s) => s.progress);
  return useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === id);
    if (!b) return 0;
    const span = Math.max(0.0001, b.end - b.start);
    return Math.min(1, Math.max(0, (progress - b.start) / span));
  }, [progress, id]);
}

export function bandOpacity(local: number, start: number, end: number, fade = 0.05) {
  if (local < start) return 0;
  if (local > end) return Math.max(0, 1 - (local - end) / Math.max(0.01, fade));
  const t = Math.min(1, (local - start) / fade);
  return t * t * (3 - 2 * t);
}
