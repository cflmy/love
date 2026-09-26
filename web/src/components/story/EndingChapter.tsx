"use client";

import { useState } from "react";
import Image from "next/image";
import { brand, crops, parts } from "@/data/assets";

/** Ending coda — never THE END. */
export function EndingChapter() {
  const [choice, setChoice] = useState<"none" | "yes" | "ofcourse">("none");

  return (
    <section className="ending-chapter" aria-label="更远的明天">
      <div className="ending-chapter__hero" aria-hidden>
        <Image
          src={crops.heroEnding}
          alt=""
          fill
          sizes="100vw"
          className="ending-chapter__img"
          priority={false}
        />
      </div>
      <div className="ending-chapter__still">
        <Image
          src={crops.storyCoda}
          alt=""
          fill
          sizes="(max-width: 768px) 90vw, 480px"
          className="ending-chapter__coda-img"
        />
        <div className="ending-chapter__sprites" aria-hidden>
          <Image src={parts.butterflyFront} alt="" width={120} height={90} />
          <Image src={parts.magpieSpread} alt="" width={130} height={100} />
        </div>
      </div>

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
            <button type="button" onClick={() => setChoice("yes")}>
              好
            </button>
            <button type="button" onClick={() => setChoice("ofcourse")}>
              当然
            </button>
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
