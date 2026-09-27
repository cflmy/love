"use client";

import Image from "next/image";
import { crops } from "@/data/assets";
import { useStoryStore } from "@/store/story";

/**
 * Chapter-seam flashes (same envelope shape):
 * · past → present: cream wash
 * · journey → memories: Add1 幕布 (full-bleed cover)
 *
 * Peak is brief so the next act can open cleanly underneath.
 */
export function EraFlash() {
  const chapterId = useStoryStore((s) => s.chapterId);
  const local = useStoryStore((s) => s.chapterLocal);

  let creamOp = 0;
  if (chapterId === "past" && local > 0.96) {
    creamOp = (local - 0.96) / 0.04;
  } else if (chapterId === "present" && local < 0.045) {
    creamOp = 1 - local / 0.045;
  }

  let add1Op = 0;
  if (chapterId === "journey" && local > 0.96) {
    add1Op = (local - 0.96) / 0.04;
  } else if (chapterId === "memories" && local < 0.055) {
    add1Op = 1 - local / 0.055;
  }

  return (
    <>
      <div className="era-flash" style={{ opacity: creamOp }} aria-hidden />
      <div className="era-flash era-flash--add1" style={{ opacity: add1Op }} aria-hidden>
        {add1Op > 0.01 ? (
          <Image
            src={crops.add1}
            alt=""
            fill
            sizes="100vw"
            priority
            className="era-flash__img"
          />
        ) : null}
      </div>
    </>
  );
}
