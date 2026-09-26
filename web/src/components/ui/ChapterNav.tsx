"use client";

import { useState } from "react";
import { chapters } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

export function ChapterNav() {
  const [open, setOpen] = useState(false);
  const entered = useStoryStore((s) => s.entered);
  const chapterId = useStoryStore((s) => s.chapterId);
  const progress = useStoryStore((s) => s.progress);

  if (!entered) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-4 z-40 md:left-6 md:top-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto font-serif text-sm tracking-[0.35em] text-[#F7F3E9]/90 transition hover:text-[#C7A66A]"
        aria-expanded={open}
      >
        QDQC
        <span className="mt-1 block text-center text-base text-[#C7A66A]">∞</span>
      </button>

      <div
        className={`pointer-events-auto mt-4 overflow-hidden rounded-2xl border border-[#C7A66A]/25 bg-[#050810]/70 p-4 backdrop-blur-md transition-all duration-500 ${
          open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0 border-transparent p-0"
        }`}
      >
        <ul className="space-y-2">
          {chapters.map((c) => (
            <li key={c.id}>
              <span
                className={`block font-serif text-sm tracking-wide ${
                  c.id === chapterId ? "text-[#C7A66A]" : "text-[#F7F3E9]/65"
                }`}
              >
                {c.navLabel}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none mt-6 h-24 w-[2px] overflow-hidden rounded bg-[#F7F3E9]/15">
        <div
          className="w-full bg-[#C7A66A] transition-[height] duration-300"
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
