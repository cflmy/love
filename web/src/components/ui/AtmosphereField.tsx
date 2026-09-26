"use client";

import { useMemo } from "react";
import Image from "next/image";
import { parts } from "@/data/assets";
import { useStoryStore } from "@/store/story";

type Floater = {
  src: string;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  opacity: number;
};

/**
 * DOM atmosphere — transparent zip parts drifting over the scroll story.
 * Softens the gap between WebGL world and chapter stills (docs: 蝶/鹊/花瓣反复出现).
 */
export function AtmosphereField() {
  const entered = useStoryStore((s) => s.entered);
  const reduced = useStoryStore((s) => s.reducedMotion);

  const floaters = useMemo<Floater[]>(() => {
    const pool = parts.floaters;
    return Array.from({ length: reduced ? 4 : 10 }, (_, i) => ({
      src: pool[i % pool.length],
      x: 4 + ((i * 19) % 90),
      y: 6 + ((i * 27) % 80),
      size: 44 + (i % 5) * 18,
      dur: 16 + (i % 5) * 4,
      delay: -(i * 2.1),
      opacity: 0.16 + (i % 4) * 0.05,
    }));
  }, [reduced]);

  if (!entered) return null;

  return (
    <div className={`atmosphere-field ${reduced ? "is-static" : ""}`} aria-hidden>
      {floaters.map((f, i) => (
        <div
          key={`${f.src}-${i}`}
          className="atmosphere-field__item"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <Image src={f.src} alt="" width={f.size} height={f.size} className="atmosphere-field__img" />
        </div>
      ))}
    </div>
  );
}
