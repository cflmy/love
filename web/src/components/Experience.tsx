"use client";

import { Suspense } from "react";
import { WorldCanvas } from "@/components/three/WorldCanvas";
import { OpeningGate } from "@/components/opening/OpeningGate";
import { StoryChapters } from "@/components/story/StoryChapters";
import { EraFlash } from "@/components/story/EraFlash";
import { JourneySubtitles } from "@/components/story/JourneySubtitles";
import { MeetingTitle } from "@/components/story/MeetingTitle";
import { ScrollSync } from "@/engine/ScrollSync";
import { BootProvider } from "@/components/BootProvider";
import { LoadingGate } from "@/components/LoadingGate";

export function Experience() {
  return (
    <Suspense fallback={null}>
      <BootProvider>
        <LoadingGate>
          <main className="relative min-h-svh overflow-x-hidden bg-[#050810] text-[#F7F3E9]">
            <WorldCanvas />
            <OpeningGate />
            <ScrollSync>
              <StoryChapters />
            </ScrollSync>
            <JourneySubtitles />
            <MeetingTitle />
            <EraFlash />
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-[#050810]/80 to-transparent" />
          </main>
        </LoadingGate>
      </BootProvider>
    </Suspense>
  );
}
