"use client";

import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore } from "@/store/story";

export function MusicToggle() {
  const entered = useStoryStore((s) => s.entered);
  const musicEnabled = useStoryStore((s) => s.musicEnabled);
  const setMusicEnabled = useStoryStore((s) => s.setMusicEnabled);
  const chapterId = useStoryStore((s) => s.chapterId);

  if (!entered) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const next = !musicEnabled;
        setMusicEnabled(next);
        MusicEngine.setEnabled(next);
      }}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#C7A66A]/40 bg-[#050810]/55 text-[#F7F3E9] backdrop-blur-md transition hover:border-[#C7A66A] md:bottom-8 md:right-8"
      aria-label={musicEnabled ? "关闭音乐" : "开启音乐"}
      title={chapterId}
    >
      <span className="font-serif text-lg tracking-widest">
        {musicEnabled ? "♪" : "–"}
      </span>
    </button>
  );
}
