"use client";

import { useState } from "react";
import { FrameImage } from "@/components/ui/FrameImage";
import { crops } from "@/data/assets";
import { LetterForm } from "./LetterForm";

/** Paper letter — envelope and sheet are CSS, the still above is the scene plate. */
export function LetterChapter() {
  const [open, setOpen] = useState(false);

  return (
    <section className="letter-chapter" aria-label="给你的一封信">
      <figure className="letter-chapter__still">
        <FrameImage src={crops.storyLetter} sizes="(max-width: 768px) 92vw, 640px" />
      </figure>

      <div className={`letter-desk ${open ? "is-open" : ""}`}>
        <button
          type="button"
          className="letter-envelope"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          <span className="letter-envelope__flap" aria-hidden />
          <span className="letter-envelope__sheet">
            <span className="letter-envelope__brand">QDQC</span>
            <svg className="letter-envelope__wing" viewBox="0 0 64 48" aria-hidden>
              <path d="M30 26c-2-8-12-12-18-7-5 4-1 11 5 13 4 1.4 8-.4 13-6Z" />
              <path d="M34 26c2-8 12-12 18-7 5 4 1 11-5 13-4 1.4-8-.4-13-6Z" />
              <path d="M32 24v12" />
            </svg>
          </span>
          <span className="letter-envelope__wax" aria-hidden>
            ∞
          </span>
          <span className="letter-envelope__hint">{open ? "已经展开" : "打开这封信"}</span>
        </button>

        <article className={`letter-paper ${open ? "is-open" : ""}`}>
          <p className="letter-paper__kicker">QDQC</p>
          <h3>给你的一封信</h3>
          <p className="letter-paper__en">A Letter to You</p>
          <span className="qd-rule" aria-hidden />
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
      </div>
      {open ? <LetterForm /> : null}
    </section>
  );
}
