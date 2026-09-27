"use client";

import Image from "next/image";
import { DECK_ITEMS, chromeCopy } from "@/data/chrome";
import { chapters, type ChapterId } from "@/data/chapters";
import { useGoChapter } from "@/engine/goChapter";
import { useStoryStore } from "@/store/story";
import { BlossomMark, StoryIcon } from "@/components/ui/icons";

function rank(id: ChapterId) {
  return chapters.find((c) => c.id === id)?.index ?? 0;
}

/** Chapter cards plus the status row from the kit. */
export function ChapterDeck() {
  const locale = useStoryStore((s) => s.locale);
  const chapterId = useStoryStore((s) => s.chapterId);
  const text = chromeCopy(locale);
  const go = useGoChapter();
  const here = rank(chapterId === "opening" ? "meeting" : chapterId);

  return (
    <section className="qd-deck" aria-label={text.deckTitle}>
      <p className="chapter-panel__eyebrow">{text.deckHint}</p>
      <h2>{text.deckTitle}</h2>
      <span className="qd-rule" aria-hidden />
      <ol className="qd-steps" aria-label={text.deckTitle}>
        {DECK_ITEMS.slice(0, 4).map((item, i) => (
          <li key={item.id} className={rank(item.id) <= here ? "is-on" : ""}>
            <i>{i + 1}</i>
          </li>
        ))}
      </ol>
      <ul className="qd-deck__grid">
        {DECK_ITEMS.map((item) => {
          const order = rank(item.id);
          const live = item.id === chapterId || (chapterId === "opening" && item.id === "meeting");
          const done = order < here;
          const marked = item.id === "journey";
          const status = live ? text.statusLive : done ? text.statusDone : marked ? text.statusMark : text.statusLocked;
          return (
            <li key={item.id}>
              <button type="button" className="qd-card" onClick={() => go(item.id)}>
                <span className="qd-card__frame">
                  <Image src={item.image!} alt="" width={280} height={420} className="qd-card__img" />
                </span>
                <span className="qd-card__foot">
                  <StoryIcon name={item.icon} />
                  <strong>{text[item.key]}</strong>
                  <em>{status}</em>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="qd-status">
        <li>
          <StoryIcon name="butterfly" />
          {text.statusLive}
        </li>
        <li>
          <BlossomMark className="qd-status__bloom" />
          {text.statusDone}
        </li>
        <li>
          <StoryIcon name="lock" />
          {text.statusLocked}
        </li>
        <li>
          <StoryIcon name="heart" />
          {text.statusMark}
        </li>
      </ul>
    </section>
  );
}
