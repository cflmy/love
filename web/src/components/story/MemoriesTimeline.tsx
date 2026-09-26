"use client";

import Image from "next/image";
import { crops } from "@/data/assets";

export type MemoryNode = {
  id: string;
  date: string;
  title: string;
  line: string;
  side: "left" | "right";
  photo: string;
};

const MEMORIES: MemoryNode[] = [
  {
    id: "m1",
    date: "缘起",
    title: "相遇",
    line: "人海之中，灯光如星，很幸运，我们相遇了。",
    side: "left",
    photo: crops.daySight,
  },
  {
    id: "m2",
    date: "日常",
    title: "相知",
    line: "一起发呆，一起做很多平凡的小事。",
    side: "right",
    photo: crops.dayDaily,
  },
  {
    id: "m3",
    date: "旅途",
    title: "山高路远",
    line: "无论多远，我都会奔赴你的身边。",
    side: "left",
    photo: crops.dayTravel,
  },
  {
    id: "m4",
    date: "特别",
    title: "纪念日",
    line: "有些日子，只属于我们两个人。",
    side: "right",
    photo: crops.daySpecial,
  },
  {
    id: "m5",
    date: "此刻",
    title: "两杯茶",
    line: "一份安静，一份陪伴。",
    side: "left",
    photo: crops.dayTea,
  },
  {
    id: "m6",
    date: "明天",
    title: "更远一点",
    line: "与你，共赴更长的明天。",
    side: "right",
    photo: crops.dayTomorrow,
  },
  {
    id: "m7",
    date: "人间",
    title: "鸿运",
    line: "祥云聚顶，鸿运当头。",
    side: "left",
    photo: crops.lifeLuck,
  },
  {
    id: "m8",
    date: "相拥",
    title: "归来",
    line: "只要你回来，太阳永不落山。",
    side: "right",
    photo: crops.roadEmbrace,
  },
];

/** 鹊桥时间线 — lantern nodes with real cropped photos. */
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
        {MEMORIES.map((node, i) => (
          <li key={node.id} className={`memory-node memory-node--${node.side}`}>
            <button type="button" className="memory-lantern" aria-label={node.title}>
              <span className="memory-lantern__glow" />
              <span className="memory-lantern__index">{String(i + 1).padStart(2, "0")}</span>
            </button>
            <article
              className="memory-card"
              style={{ ["--tilt" as string]: `${i % 2 === 0 ? -3 : 4}deg` }}
            >
              <div className="memory-card__photo">
                <Image
                  src={node.photo}
                  alt={node.title}
                  fill
                  sizes="(max-width: 768px) 70vw, 280px"
                  className="memory-card__img"
                />
              </div>
              <p className="memory-card__date">{node.date}</p>
              <h3>{node.title}</h3>
              <p>{node.line}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
