"use client";

import Image from "next/image";
import { NAV_ITEMS, chromeCopy } from "@/data/chrome";
import type { ChapterId } from "@/data/chapters";
import { useGoChapter } from "@/engine/goChapter";
import { useStoryStore } from "@/store/story";
import { StoryIcon } from "./icons";

function activeKey(id: ChapterId): ChapterId {
  if (id === "opening") return "meeting";
  return id;
}

/** Side chapter list from the navigation-menu sheet. */
export function ChapterNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const chapterId = useStoryStore((s) => s.chapterId);
  const locale = useStoryStore((s) => s.locale);
  const go = useGoChapter();
  const text = chromeCopy(locale);
  const current = activeKey(chapterId);

  const choose = (id: ChapterId) => {
    go(id);
    onClose();
  };

  return (
    <div id="chapter-menu" className={`chapter-menu chapter-menu--drawer qd-scroll ${open ? "is-open" : ""}`} hidden={!open}>
      <div className="chapter-menu__orbs qd-scroll">
        {NAV_ITEMS.filter((item) => item.image).map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`chapter-orb ${item.id === current ? "is-active" : ""}`}
            onClick={() => choose(item.id)}
          >
            <span className="chapter-orb__ring">
              <Image src={item.image!} alt="" width={72} height={72} className="chapter-orb__img" />
            </span>
            <span className="chapter-orb__index">{index + 1}</span>
            <span className="chapter-orb__label">{text[item.key]}</span>
          </button>
        ))}
      </div>
      <ul className="chapter-menu__list qd-scroll">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`chapter-menu__item ${item.id === current ? "is-active" : ""}`}
              onClick={() => choose(item.id)}
            >
              <StoryIcon name={item.icon} />
              <span>
                <strong>{text[item.key]}</strong>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
