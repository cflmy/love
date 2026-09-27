"use client";

import { useState } from "react";
import { FrameImage } from "@/components/ui/FrameImage";
import { StoryModal } from "@/components/ui/StoryModal";
import { crops } from "@/data/assets";
import { chromeCopy } from "@/data/chrome";
import { MEMORY_WATERFALL } from "@/data/gallery";
import { useStoryStore } from "@/store/story";

type MemoryNode = {
  id: string;
  date: string;
  title: string;
  line: string;
  photo: string;
};

const MEMORIES: MemoryNode[] = [
  {
    id: "m1",
    date: "缘起",
    title: "相遇",
    line: "人海之中，灯光如星。",
    photo: crops.daySight,
  },
  {
    id: "m2",
    date: "日常",
    title: "相知",
    line: "一起做很多平凡的小事。",
    photo: crops.dayDaily,
  },
  {
    id: "m3",
    date: "旅途",
    title: "第一次远行",
    line: "无论多远，我都会奔赴。",
    photo: crops.dayTravel,
  },
  {
    id: "m4",
    date: "特别",
    title: "特别的日子",
    line: "有些日子，只属于我们。",
    photo: crops.daySpecial,
  },
  {
    id: "m5",
    date: "此刻",
    title: "两杯茶",
    line: "一份安静，一份陪伴。",
    photo: crops.dayTea,
  },
  {
    id: "m6",
    date: "相拥",
    title: "归来",
    line: "只要你回来，太阳永不落山。",
    photo: crops.roadEmbrace,
  },
  {
    id: "m7",
    date: "明天",
    title: "更远一点",
    line: "与你，共赴更长的明天。",
    photo: crops.dayTomorrow,
  },
];

/** Lantern timeline + waterfall of story stills that were barely surfaced. */
export function MemoriesTimeline() {
  const locale = useStoryStore((s) => s.locale);
  const text = chromeCopy(locale);
  const [memory, setMemory] = useState<(typeof MEMORIES)[number] | null>(null);
  const [tile, setTile] = useState<(typeof MEMORY_WATERFALL)[number] | null>(null);

  return (
    <section className="qd-timeline" aria-label="我们">
      <div className="qd-timeline__scroller">
        <div className="qd-timeline__line" aria-hidden />
        <ol className="qd-timeline__nodes">
          {MEMORIES.map((node, i) => (
            <li key={node.id} className="qd-node">
              {i % 2 === 1 ? <span className="qd-lantern" aria-hidden /> : null}
              <button type="button" className="qd-node__hit" onClick={() => setMemory(node)}>
                <span className="qd-node__ring">
                  <FrameImage src={node.photo} alt="" sizes="120px" className="qd-node__img" />
                </span>
                <p className="qd-node__date">{node.date}</p>
                <h3>{node.title}</h3>
                <p>{node.line}</p>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="qd-waterfall" aria-label="照片瀑布流">
        {MEMORY_WATERFALL.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`qd-waterfall__item qd-waterfall__item--${(i % 5) + 1}`}
            onClick={() => setTile(item)}
          >
            <FrameImage src={item.src} alt="" sizes="(max-width: 720px) 46vw, 280px" />
            <span>{item.caption}</span>
          </button>
        ))}
      </div>

      <StoryModal
        open={Boolean(memory)}
        title={memory ? `${text.memoryTitle}` : text.memoryTitle}
        hint={memory ? `${memory.title} · ${text.memoryHint}` : text.memoryHint}
        cancelLabel={text.cancel}
        confirmLabel={text.yes}
        onCancel={() => setMemory(null)}
        onConfirm={() => setMemory(null)}
      />
      <StoryModal
        open={Boolean(tile)}
        title={tile?.caption ?? text.memoryTitle}
        hint={text.memoryHint}
        cancelLabel={text.cancel}
        confirmLabel={text.yes}
        onCancel={() => setTile(null)}
        onConfirm={() => setTile(null)}
      />
    </section>
  );
}
