"use client";

import { usePathname, useRouter } from "next/navigation";
import { chapterProgressBounds, type ChapterId } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

/** Map ritual / retired chapter ids onto the scroll film spine. */
const CHAPTER_ALIAS: Record<string, ChapterId> = {
  opening: "meeting",
  prayer: "meeting",
  response: "meeting",
};

export function resolveChapterId(id: string): ChapterId {
  return CHAPTER_ALIAS[id] ?? (id as ChapterId);
}

export function scrollToChapter(id: ChapterId | string) {
  const resolved = resolveChapterId(id);
  const hit = chapterProgressBounds().find((b) => b.id === resolved);
  if (!hit) return;
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: hit.start * max + 8, behavior: "smooth" });
}

export function useGoChapter() {
  const router = useRouter();
  const pathname = usePathname();
  const entered = useStoryStore((s) => s.entered);
  const pushToast = useStoryStore((s) => s.pushToast);
  const locale = useStoryStore((s) => s.locale);

  return (id: ChapterId | string) => {
    const target = resolveChapterId(id);
    if (pathname === "/" && !entered) {
      pushToast(
        "info",
        locale === "fr"
          ? "Touchez le pont avant d'entrer dans un chapitre."
          : locale === "en"
            ? "Touch the bridge before entering a chapter."
            : "先触碰鹊桥，再走进这一章。",
      );
      return;
    }
    if (pathname === "/" && entered) {
      scrollToChapter(target);
      return;
    }
    sessionStorage.setItem("qdqc-at", target);
    router.push(`/?at=${target}`);
  };
}
