"use client";

import { useMemo } from "react";
import { chapterProgressBounds } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

const QUOTES: { start: number; end: number; text: string }[] = [
  { start: 0.14, end: 0.28, text: "你别担心，太阳落山前我一定回来。" },
  { start: 0.3, end: 0.44, text: "不必着急。我在这里。" },
  { start: 0.48, end: 0.6, text: "我会翻山越岭，拼尽全力来到你的身边。" },
  { start: 0.62, end: 0.72, text: "当凤凰的光辉照耀村落…" },
  { start: 0.78, end: 0.88, text: "你向我奔来，我也向你归来。" },
  { start: 0.9, end: 0.99, text: "只要你回来，太阳永不落山。" },
];

export function JourneySubtitles() {
  const progress = useStoryStore((s) => s.progress);
  const chapterId = useStoryStore((s) => s.chapterId);

  const local = useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === "journey");
    if (!b) return 0;
    const span = Math.max(0.0001, b.end - b.start);
    return Math.min(1, Math.max(0, (progress - b.start) / span));
  }, [progress]);

  if (chapterId !== "journey") return null;

  const quote = QUOTES.find((q) => local >= q.start && local < q.end);
  if (!quote) return null;

  return (
    <div className="journey-subtitles" aria-live="polite">
      <p>{quote.text}</p>
    </div>
  );
}
