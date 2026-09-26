"use client";

import { chapters, STORY_SCROLL_VH } from "@/data/chapters";
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

function WatchBeat({ hint }: { hint: string }) {
  return (
    <section className="chapter-watch">
      <p className="chapter-watch__hint">{hint}</p>
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

      <WatchBeat hint="看" />
      <WatchBeat hint="她渡河" />
      <WatchBeat hint="他从远方来" />
      <WatchBeat hint="桥灯亮起" />
      <ChapterBlock
        title={chapters[3].title}
        subtitle={chapters[3].subtitle}
        lines={chapters[3].copy}
      />

      <WatchBeat hint="前世" />
      <ChapterBlock
        title="暮云"
        subtitle="Past · 林暮云"
        lines={["君为暮云我为风，", "生生世世不相离。"]}
      />
      <ChapterBlock
        title="长风"
        subtitle="Past · 木长风"
        lines={["君为长风我为云，", "世世生生不相弃。"]}
      />
      <ChapterBlock
        title={chapters[4].title}
        subtitle={chapters[4].subtitle}
        lines={["长风恋暮云，", "这是我们曾经的许诺。", "∞"]}
      />

      <WatchBeat hint="人间" />
      <ChapterBlock
        title={chapters[5].title}
        subtitle={chapters[5].subtitle}
        lines={chapters[5].copy}
        tone="light"
        seal="老天安排的最大！"
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
