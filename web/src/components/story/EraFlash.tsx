"use client";

import { useStoryStore } from "@/store/story";

/** Hard cut flash when leaving past into present. */
export function EraFlash() {
  const chapterId = useStoryStore((s) => s.chapterId);
  const local = useStoryStore((s) => s.chapterLocal);

  let opacity = 0;
  if (chapterId === "past" && local > 0.92) {
    opacity = (local - 0.92) / 0.08;
  } else if (chapterId === "present" && local < 0.12) {
    opacity = 1 - local / 0.12;
  }

  return (
    <div
      className="era-flash"
      style={{ opacity }}
      aria-hidden
    />
  );
}
