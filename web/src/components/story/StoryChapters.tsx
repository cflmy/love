"use client";

import { chapters, STORY_SCROLL_VH } from "@/data/chapters";
import {
  journeyLeadIn,
  journeyOutro,
  meetingScenes,
  pastScenes,
  prayerScenes,
  presentScenes,
  responseScenes,
  storyStrip,
} from "@/data/scenes";
import { JourneyChapter } from "./JourneyChapter";
import { MemoriesTimeline } from "./MemoriesTimeline";
import { QuietDaysChapter } from "./QuietDaysChapter";
import { LetterChapter } from "./LetterChapter";
import { EndingChapter } from "./EndingChapter";
import { SceneBeatView, StoryFilmStrip } from "./SceneBeat";
import { useStoryStore } from "@/store/story";

function ChapterBlock({
  title,
  subtitle,
  lines,
  tone = "dark",
  seal,
}: {
  title: string;
  subtitle: string;
  lines: string[];
  tone?: "dark" | "light";
  seal?: string;
}) {
  const light = tone === "light";
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-6 py-24">
      <div className={`chapter-panel mx-auto max-w-xl text-center ${light ? "is-light" : "is-dark"}`}>
        <p className="chapter-panel__eyebrow">{subtitle}</p>
        <h2 className="chapter-panel__title">{title}</h2>
        <div className="chapter-panel__lines">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {seal ? <p className="chapter-seal">{seal}</p> : null}
      </div>
    </section>
  );
}

export function StoryChapters() {
  const entered = useStoryStore((s) => s.entered);
  if (!entered) {
    return <div style={{ height: "100svh" }} aria-hidden />;
  }

  return (
    <div style={{ minHeight: `${STORY_SCROLL_VH}svh` }} className="relative">
      <ChapterBlock
        title="QDQC"
        subtitle="A quieter, brighter tomorrow."
        lines={["Que dure", "que câlin", "愿天长地久", "愿紧紧相拥"]}
      />

      {prayerScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <ChapterBlock
        title={chapters[1].title}
        subtitle={chapters[1].subtitle}
        lines={chapters[1].copy}
      />

      {responseScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} tone="light" />
      ))}
      <ChapterBlock
        title={chapters[2].title}
        subtitle={chapters[2].subtitle}
        lines={chapters[2].copy}
        tone="light"
      />

      <StoryFilmStrip images={storyStrip} label="故事长卷" />
      {meetingScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <ChapterBlock
        title={chapters[3].title}
        subtitle={chapters[3].subtitle}
        lines={chapters[3].copy}
      />

      {pastScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <ChapterBlock
        title={chapters[4].title}
        subtitle={chapters[4].subtitle}
        lines={["长风恋暮云，", "这是我们曾经的许诺。", "∞"]}
      />

      {presentScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} tone="light" />
      ))}
      <ChapterBlock
        title={chapters[5].title}
        subtitle={chapters[5].subtitle}
        lines={chapters[5].copy}
        tone="light"
        seal="老天安排的最大！"
      />

      {journeyLeadIn.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <JourneyChapter />
      {journeyOutro.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <ChapterBlock
        title={chapters[6].title}
        subtitle={chapters[6].subtitle}
        lines={[
          "山高路远，祝君日安。",
          "我会翻山越岭，拼尽全力来到你的身边。",
          "日后与君，平安喜乐。",
        ]}
      />

      <MemoriesTimeline />
      <QuietDaysChapter />
      <LetterChapter />
      <EndingChapter />
    </div>
  );
}
