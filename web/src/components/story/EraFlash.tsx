"use client";

import { useStoryStore } from "@/store/story";

/**
 * Hard cut flash when leaving past into present.
 * Keep the peak brief so 今世缘起 (lifeMeet) can open at top-left
 * instead of being hidden mid-scan under the cream wash.
 */
export function EraFlash() {
  const chapterId = useStoryStore((s) => s.chapterId);
  const local = useStoryStore((s) => s.chapterLocal);

  let opacity = 0;
  if (chapterId === "past" && local > 0.96) {
    opacity = (local - 0.96) / 0.04;
  } else if (chapterId === "present" && local < 0.045) {
    opacity = 1 - local / 0.045;
  }

  return (
    <div
      className="era-flash"
      style={{ opacity }}
      aria-hidden
    />
  );
}
