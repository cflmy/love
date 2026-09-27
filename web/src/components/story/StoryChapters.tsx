"use client";

import type { CSSProperties } from "react";
import { STORY_SCROLL_VH, getChapter } from "@/data/chapters";
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
 * Spine · meeting → past → present → journey → memories → …
 * Section heights track scrollSpan so progress stays aligned with DOM.
 */
export function StoryChapters() {
  const entered = useStoryStore((s) => s.entered);
  if (!entered) {
    return <div style={{ height: "100svh" }} aria-hidden />;
  }

  const meetH = `${getChapter("meeting").scrollSpan * 100}svh`;
  const pastH = `${getChapter("past").scrollSpan * 100}svh`;
  const presentH = `${getChapter("present").scrollSpan * 100}svh`;
  const journeyH = `${getChapter("journey").scrollSpan * 100}svh`;
  const memoriesH = `${getChapter("memories").scrollSpan * 100}svh`;
  const quietH = `${getChapter("quiet-days").scrollSpan * 100}svh`;
  const letterH = `${getChapter("letter").scrollSpan * 100}svh`;
  const futureH = `${getChapter("future").scrollSpan * 100}svh`;

  const filmStyle = {
    minHeight: `${STORY_SCROLL_VH}svh`,
    ["--chapter-meeting-vh"]: meetH,
    ["--chapter-past-vh"]: pastH,
    ["--chapter-present-vh"]: presentH,
    ["--chapter-journey-vh"]: journeyH,
    ["--chapter-memories-vh"]: memoriesH,
    ["--chapter-quiet-vh"]: quietH,
    ["--chapter-letter-vh"]: letterH,
    ["--chapter-future-vh"]: futureH,
  } as CSSProperties;

  return (
    <div style={filmStyle} className="relative story-film">
      <MeetingChapter />
      <PastChapter />
      <PresentChapter />
      <JourneyChapter />

      <section
        className="story-act story-act--coda"
        data-act="memories"
        aria-label="我们"
        style={{ minHeight: memoriesH }}
      >
        <ActTitle id="memories" tone="foil" />
        <MemoriesTimeline />
      </section>

      <QuietDaysChapter />

      <LetterChapter />
      <EndingChapter />
    </div>
  );
}
