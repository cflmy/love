"use client";

import { useState } from "react";
import Image from "next/image";
import { FrameImage } from "@/components/ui/FrameImage";
import { ArtButton } from "@/components/ui/ArtButton";
import { brand, crops, parts } from "@/data/assets";

/** Ending coda — never THE END. */
export function EndingChapter() {
  const [choice, setChoice] = useState<"none" | "yes" | "ofcourse">("none");

  return (
    <section className="ending-chapter" aria-label="更远的明天">
      <figure className="ending-chapter__hero">
        <FrameImage src={crops.heroEnding} sizes="(max-width: 900px) 100vw, 1100px" />
      </figure>
      <figure className="ending-chapter__still">
        <FrameImage src={crops.storyCoda} sizes="(max-width: 768px) 92vw, 520px" />
        <div className="ending-chapter__sprites" aria-hidden>
          <Image src={parts.butterflyFront} alt="" width={120} height={90} />
          <Image src={parts.magpieSpread} alt="" width={130} height={100} />
        </div>
      </figure>

      <div className="ending-chapter__brand">
        <Image src={brand.hero} alt="" width={220} height={280} className="ending-chapter__brand-img" />
      </div>

      <p className="ending-chapter__eyebrow">To Be Continued…</p>
      <h2>与你，共赴更长的明天</h2>
      <p className="ending-chapter__more">More Days Together</p>
      <p className="ending-chapter__inf">∞</p>

      {choice === "none" ? (
        <div className="ending-egg">
          <p>如果你已经看到这里……</p>
          <p>再陪我走一段吧。</p>
          <div className="ending-egg__actions">
            <ArtButton variant="next" label="好" width={200} onClick={() => setChoice("yes")} />
            <ArtButton variant="memory" label="当然" width={220} onClick={() => setChoice("ofcourse")} />
          </div>
        </div>
      ) : (
        <div className="ending-egg is-done">
          <p>相逢鹊渡</p>
          <p>相守情长</p>
          <p className="ending-egg__qdqc">QDQC · ∞</p>
        </div>
      )}
    </section>
  );
}
