"use client";

import { images } from "@/data/assets";

export type MemoryNode = {
  id: string;
  date: string;
  title: string;
  line: string;
  side: "left" | "right";
};

const PLACEHOLDER: MemoryNode[] = [
  {
    id: "m1",
    date: "缘起",
    title: "相遇",
    line: "人海之中，灯光如星，很幸运，我们相遇了。",
    side: "left",
  },
  {
    id: "m2",
    date: "日常",
    title: "相知",
    line: "一起发呆，一起做很多平凡的小事。",
    side: "right",
  },
  {
    id: "m3",
    date: "旅途",
    title: "山高路远",
    line: "无论多远，我都会奔赴你的身边。",
    side: "left",
  },
  {
    id: "m4",
    date: "此刻",
    title: "两杯茶",
    line: "一份安静，一份陪伴。",
    side: "right",
  },
];

/** 鹊桥时间线 — lantern nodes, floating memory cards (not a photo grid). */
export function MemoriesTimeline() {
  return (
    <section className="memories-bridge" aria-label="我们">
      <div className="memories-bridge__intro">
        <p className="chapter-panel__eyebrow">Memories</p>
        <h2>我们</h2>
        <p>每一盏灯，都是一次记得。</p>
      </div>

      <div className="memories-bridge__rail" aria-hidden>
        <div className="memories-bridge__arch" />
      </div>

      <ul className="memories-bridge__nodes">
        {PLACEHOLDER.map((node, i) => (
          <li key={node.id} className={`memory-node memory-node--${node.side}`}>
            <button type="button" className="memory-lantern" aria-label={node.title}>
              <span className="memory-lantern__glow" />
              <span className="memory-lantern__index">{String(i + 1).padStart(2, "0")}</span>
            </button>
            <article
              className="memory-card"
              style={{ ["--tilt" as string]: `${i % 2 === 0 ? -3 : 4}deg` }}
            >
              <div
                className="memory-card__photo"
                style={{ backgroundImage: `url(${images.presentSix})` }}
              />
              <p className="memory-card__date">{node.date}</p>
              <h3>{node.title}</h3>
              <p>{node.line}</p>
            </article>
          </li>
        ))}
      </ul>

      <p className="memories-bridge__note">真实照片可稍后放入灯笼节点。</p>
    </section>
  );
}
