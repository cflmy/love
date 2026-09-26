"use client";

import { useState } from "react";

/** Ending coda — never THE END. */
export function EndingChapter() {
  const [choice, setChoice] = useState<"none" | "yes" | "ofcourse">("none");

  return (
    <section className="ending-chapter" aria-label="更远的明天">
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
