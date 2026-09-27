"use client";

import { STORY_SCROLL_VH } from "@/data/chapters";
import { MeetingChapter } from "./MeetingChapter";
import { PastChapter } from "./PastChapter";
import { PresentChapter } from "./PresentChapter";
import { JourneyChapter } from "./JourneyChapter";
import { MemoriesTimeline } from "./MemoriesTimeline";
import { QuietDaysChapter } from "./QuietDaysChapter";
import { LetterChapter } from "./LetterChapter";
import { EndingChapter } from "./EndingChapter";
import { ActTitle } from "./ActTitle";
import { useStoryStore } from "@/store/story";

/**
 * Continuous film after OpeningGate.
 * Spine · STORY_FLOW.md
 */
export function StoryChapters() {
  const entered = useStoryStore((s) => s.entered);
  if (!entered) {
    return <div style={{ height: "100svh" }} aria-hidden />;
  }

  return (
    <div style={{ minHeight: `${STORY_SCROLL_VH}svh` }} className="relative story-film">
      <MeetingChapter />
      <PastChapter />
      <PresentChapter />
      <JourneyChapter />

      <section className="story-act story-act--coda" data-act="memories" aria-label="我们">
        <ActTitle id="memories" tone="light" />
        <MemoriesTimeline />
      </section>

      <section className="story-act story-act--coda" data-act="quiet-days" aria-label="Quiet Days">
        <QuietDaysChapter />
      </section>

      <section className="story-act story-act--coda" data-act="letter" aria-label="给你的一封信">
        <LetterChapter />
      </section>

      <section className="story-act story-act--coda" data-act="future" aria-label="更远的明天">
        <EndingChapter />
      </section>
    </div>
  );
}
