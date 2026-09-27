"use client";

import { useEffect, useState } from "react";
import { useStoryStore } from "@/store/story";

/** Pointer from the cursor sheet: arrow, hover butterfly, click ring. */
export function StoryCursor() {
  const reduced = useStoryStore((s) => s.reducedMotion);
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState({ x: -40, y: -40 });
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setOn(true);
    document.body.classList.add("qd-cursor-on");
    const move = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target instanceof Element ? e.target : null;
      setHot(Boolean(el?.closest("button, a")));
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", downFn);
    window.addEventListener("pointerup", upFn);
    return () => {
      document.body.classList.remove("qd-cursor-on");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", downFn);
      window.removeEventListener("pointerup", upFn);
    };
  }, [reduced]);

  if (!on) return null;

  return (
    <div
      className={`qd-cursor ${hot ? "is-hot" : ""} ${down ? "is-down" : ""}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden
    />
  );
}
