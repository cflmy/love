"use client";

import { useState } from "react";
import Image from "next/image";
import { FrameImage } from "@/components/ui/FrameImage";
import { ArtButton } from "@/components/ui/ArtButton";
import { brand, crops } from "@/data/assets";

/** G5 · Ending — return warm; More Days; ∞; no second climax. */
export function EndingChapter() {
  const [choice, setChoice] = useState<"none" | "yes" | "ofcourse">("none");

  return (
    <section className="ending-chapter" aria-label="更远的明天">
      <figure className="ending-chapter__hero">
        <FrameImage src={crops.heroEnding} sizes="(max-width: 900px) 100vw, 1100px" />
      </figure>
      <figure className="ending-chapter__still">
        <FrameImage src={crops.storyCoda} sizes="(max-width: 768px) 92vw, 520px" />
      </figure>

      <div className="ending-chapter__brand">
        <Image src={brand.hero} alt="" width={220} height={280} className="ending-chapter__brand-img" />
      </div>

      <p className="ending-chapter__eyebrow">To Be Continued…</p>
      <h2>与你，共赴更长的明天</h2>
      <p className="ending-chapter__more">More Days Together</p>
      <p className="ending-chapter__inf">∞</p>

      <div className="ending-chapter__close">
        <p>相逢鹊渡，</p>
        <p>相守情长。</p>
        <p className="ending-chapter__close-final">故与君鹊渡情长。</p>
      </div>

      {choice === "none" ? (
        <div className="qd-modal ending-egg">
          <p className="qd-modal__title">再陪我走一段吧</p>
          <p className="qd-modal__en">Are you ready?</p>
          <div className="ending-egg__actions">
            <ArtButton variant="more" label="好" hint="Yes" width={148} onClick={() => setChoice("yes")} />
            <ArtButton
              variant="memory"
              label="当然"
              hint="Of course"
              width={168}
              onClick={() => setChoice("ofcourse")}
            />
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
