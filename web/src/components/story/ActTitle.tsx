"use client";

import { getChapter, type ChapterId } from "@/data/chapters";

/**
 * Sparse cinematic title beat — one act, few lines, silence between.
 * Replaces stacked ChapterHero copy dumps.
 */
export function ActTitle({
  id,
  lines,
  tone = "dark",
  seal,
}: {
  id: ChapterId;
  lines?: string[];
  tone?: "dark" | "light";
  seal?: string;
}) {
  const chapter = getChapter(id);
  const shown = lines ?? chapter.copy.slice(0, 2);

  return (
    <section
      className={`chapter-panel act-title ${tone === "light" ? "is-light" : "is-dark"}`}
      aria-label={chapter.title}
      data-chapter={id}
    >
      <p className="chapter-panel__eyebrow">{chapter.subtitle}</p>
      <h2 className="chapter-panel__title">{chapter.title}</h2>
      <div className="chapter-panel__lines">
        {shown.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {seal ? <p className="chapter-seal">{seal}</p> : null}
    </section>
  );
}
