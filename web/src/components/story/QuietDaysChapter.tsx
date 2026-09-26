"use client";

import Image from "next/image";
import { crops } from "@/data/assets";

/** Breathing chapter after climax — almost no spectacle. */
export function QuietDaysChapter() {
  return (
    <section className="quiet-days" aria-label="Quiet Days">
      <div className="quiet-days__photo" aria-hidden>
        <Image
          src={crops.storyQuietTea}
          alt=""
          fill
          sizes="100vw"
          className="quiet-days__img"
        />
      </div>
      <div className="quiet-days__window" aria-hidden>
        <div className="quiet-days__sunshaft" />
        <div className="quiet-days__dust" />
      </div>
      <div className="quiet-days__copy">
        <p className="quiet-days__line a">Quiet days.</p>
        <p className="quiet-days__line b">Quiet cuddles.</p>
        <p className="quiet-days__line c">陪伴的日子安宁，坚定的拥抱无声。</p>
      </div>
      <div className="quiet-days__tea" aria-hidden>
        <span />
        <span />
      </div>
    </section>
  );
}
