"use client";

import { bandOpacity, useChapterLocal } from "@/hooks/useChapterLocal";
import { useStoryStore } from "@/store/story";

/** Climax-only overlay — early journey lines live inside JourneyChapter sticky. */
const QUOTES = [
  { start: 0.54, end: 0.64, text: "我会翻山越岭，拼尽全力来到你的身边。" },
  { start: 0.68, end: 0.78, text: "你向我奔来，我也向你归来。" },
  { start: 0.9, end: 0.98, text: "只要你回来，太阳永不落山。" },
] as const;

export function JourneySubtitles() {
  const chapterId = useStoryStore((s) => s.chapterId);
  const local = useChapterLocal("journey");
  const reduced = useStoryStore((s) => s.reducedMotion);

  if (chapterId !== "journey") return null;

  const quote = QUOTES.find((q) => {
    const o = reduced
      ? local >= q.start && local < q.end
        ? 1
        : 0
      : bandOpacity(local, q.start, q.end, 0.04);
    return o > 0.15;
  });
  if (!quote) return null;

  return (
    <div className="journey-subtitles" aria-live="polite">
      <p>{quote.text}</p>
    </div>
  );
}
