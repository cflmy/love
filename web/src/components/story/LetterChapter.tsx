"use client";

import { useState } from "react";
import Image from "next/image";
import { crops } from "@/data/assets";

/** Minimal letter page embedded in the scroll — paper, not WebGL. */
export function LetterChapter() {
  const [open, setOpen] = useState(false);

  return (
    <section className="letter-chapter" aria-label="给你的一封信">
      <div className="letter-chapter__still">
        <Image
          src={crops.storyLetter}
          alt=""
          fill
          sizes="(max-width: 768px) 90vw, 520px"
          className="letter-chapter__img"
        />
      </div>

      <button
        type="button"
        className={`letter-envelope ${open ? "is-open" : ""}`}
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <span className="letter-envelope__seal">QDQC</span>
        <span className="letter-envelope__hint">{open ? "致我最想拥抱的人" : "打开这封信"}</span>
      </button>

      <article className={`letter-paper ${open ? "is-open" : ""}`}>
        <p className="letter-paper__to">致我最想拥抱的人</p>
        <p>
          相逢鹊渡，相守情长。
          <br />
          山高路远，我会一直相向而行。
          <br />
          愿天长地久，愿紧紧相拥。
        </p>
        <p className="letter-paper__sign">—— QDQC</p>
        <p className="letter-paper__date">More Days Together</p>
      </article>
    </section>
  );
}
