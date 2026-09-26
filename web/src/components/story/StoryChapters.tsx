"use client";

import { chapters, STORY_SCROLL_VH } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

function ChapterBlock({
  title,
  subtitle,
  lines,
  tone = "dark",
}: {
  title: string;
  subtitle: string;
  lines: string[];
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-6 py-24">
      <div
        className={`chapter-panel mx-auto max-w-xl text-center ${light ? "is-light" : "is-dark"}`}
      >
        <p className="chapter-panel__eyebrow">{subtitle}</p>
        <h2 className="chapter-panel__title">{title}</h2>
        <div className="chapter-panel__lines">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
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
    <div style={{ height: `${STORY_SCROLL_VH}svh` }} className="relative">
      <ChapterBlock
        title="QDQC"
        subtitle="A quieter, brighter tomorrow."
        lines={[
          "Que dure",
          "que câlin",
          "愿天长地久",
          "愿紧紧相拥",
        ]}
      />
      <ChapterBlock
        title={chapters[1].title}
        subtitle={chapters[1].subtitle}
        lines={chapters[1].copy}
      />
      <ChapterBlock
        title={chapters[2].title}
        subtitle={chapters[2].subtitle}
        lines={chapters[2].copy}
        tone="light"
      />
      <ChapterBlock
        title={chapters[3].title}
        subtitle={chapters[3].subtitle}
        lines={chapters[3].copy}
      />
      <ChapterBlock
        title={chapters[4].title}
        subtitle={chapters[4].subtitle}
        lines={chapters[4].copy}
      />
      <ChapterBlock
        title={chapters[5].title}
        subtitle={chapters[5].subtitle}
        lines={chapters[5].copy}
      />
      <ChapterBlock
        title={chapters[6].title}
        subtitle={chapters[6].subtitle}
        lines={chapters[6].copy}
      />
      <ChapterBlock
        title={chapters[7].title}
        subtitle={chapters[7].subtitle}
        lines={chapters[7].copy}
      />
      <ChapterBlock
        title={chapters[8].title}
        subtitle={chapters[8].subtitle}
        lines={chapters[8].copy}
        tone="light"
      />
      <ChapterBlock
        title={chapters[9].title}
        subtitle={chapters[9].subtitle}
        lines={chapters[9].copy}
        tone="light"
      />
      <ChapterBlock
        title={chapters[10].title}
        subtitle={chapters[10].subtitle}
        lines={chapters[10].copy}
      />
    </div>
  );
}
