"use client";

import Image from "next/image";
import { FrameImage } from "@/components/ui/FrameImage";
import { crops, parts } from "@/data/assets";

/** Breathing chapter after climax — almost no spectacle. */
export function QuietDaysChapter() {
  return (
    <section className="quiet-days" aria-label="Quiet Days">
      <div className="quiet-days__window" aria-hidden>
        <div className="quiet-days__sunshaft" />
        <div className="quiet-days__dust" />
      </div>
      <figure className="quiet-days__banner">
        <FrameImage src={crops.storyQuietTea} sizes="(max-width: 768px) 92vw, 640px" />
      </figure>
      <figure className="quiet-days__still">
        <FrameImage src={crops.dayTea} sizes="360px" />
      </figure>
      <div className="quiet-days__copy">
        <p className="quiet-days__line a">Quiet days.</p>
        <p className="quiet-days__line b">Quiet cuddles.</p>
        <p className="quiet-days__line c">陪伴的日子安宁，坚定的拥抱无声。</p>
      </div>
      <div className="quiet-days__petals" aria-hidden>
        <Image src={parts.butterflyFront} alt="" width={96} height={72} />
      </div>
      <div className="quiet-days__tea" aria-hidden>
        <span />
        <span />
      </div>
    </section>
  );
}
