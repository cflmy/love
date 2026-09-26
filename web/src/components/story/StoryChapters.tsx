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
import { crops, parts } from "@/data/assets";
import { JourneyChapter } from "./JourneyChapter";
import { MemoriesTimeline } from "./MemoriesTimeline";
import { QuietDaysChapter } from "./QuietDaysChapter";
import { LetterChapter } from "./LetterChapter";
import { EndingChapter } from "./EndingChapter";
import { ChapterHero } from "./ChapterHero";
import { MeetingTriptych, SceneBeatView, StoryFilmStrip } from "./SceneBeat";
import { useStoryStore } from "@/store/story";

export function StoryChapters() {
  const entered = useStoryStore((s) => s.entered);
  if (!entered) {
    return <div style={{ height: "100svh" }} aria-hidden />;
  }

  return (
    <div style={{ minHeight: `${STORY_SCROLL_VH}svh` }} className="relative">
      <ChapterHero
        image={crops.heroDesktop}
        title="QDQC"
        subtitle="A quieter, brighter tomorrow."
        lines={["Que dure", "que câlin", "愿天长地久", "愿紧紧相拥"]}
        overlay={parts.butterflyFront}
      />

      {prayerScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <ChapterHero
        image={crops.posterHer}
        title={chapters[1].title}
        subtitle={chapters[1].subtitle}
        lines={chapters[1].copy}
        overlay={parts.butterflySide}
      />

      {responseScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} tone="light" />
      ))}
      <ChapterHero
        image={crops.dayTea}
        title={chapters[2].title}
        subtitle={chapters[2].subtitle}
        lines={chapters[2].copy}
        tone="light"
      />

      <StoryFilmStrip images={storyStrip} label="故事长卷" />

      {/* docs: 相逢先 WatchBeat，标题后置 */}
      <MeetingTriptych
        images={[crops.meetShe, crops.meetHe, crops.meetBridge]}
        captions={["她·渡河", "他·远方", "桥·灯起"]}
      />
      {meetingScenes
        .filter((b) => !["meet-she", "meet-he", "meet-bridge"].includes(b.id))
        .map((beat) => (
          <SceneBeatView key={beat.id} beat={beat} />
        ))}
      <ChapterHero
        image={crops.bridgeFull}
        title={chapters[3].title}
        subtitle={chapters[3].subtitle}
        lines={chapters[3].copy}
        overlay={parts.magpieSpread}
      />

      {pastScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} />
      ))}
      <ChapterHero
        image={crops.pastChangfeng}
        title={chapters[4].title}
        subtitle={chapters[4].subtitle}
        lines={["长风恋暮云，", "这是我们曾经的许诺。", "∞"]}
        overlay={parts.magpiePerch}
      />

      {presentScenes.map((beat) => (
        <SceneBeatView key={beat.id} beat={beat} tone="light" />
      ))}
      <ChapterHero
        image={crops.lifeLuck}
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
      <ChapterHero
        image={crops.roadEmbrace}
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
