"use client";

import { WorldCanvas } from "@/components/three/WorldCanvas";
import { OpeningGate } from "@/components/opening/OpeningGate";
import { StoryChapters } from "@/components/story/StoryChapters";
import { ChapterNav } from "@/components/ui/ChapterNav";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ScrollSync } from "@/engine/ScrollSync";

export function Experience() {
  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#050810] text-[#F7F3E9]">
      <WorldCanvas />
      <OpeningGate />
      <ChapterNav />
      <MusicToggle />
      <ScrollSync>
        <StoryChapters />
      </ScrollSync>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-[#050810]/80 to-transparent" />
    </main>
  );
}
