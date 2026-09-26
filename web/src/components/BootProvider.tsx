"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStoryStore } from "@/store/story";

const VISIT_KEY = "qdqc-visits";
const ENTRY_KEY = "qdqc-entry";

/** Hydrate visit count, NFC entry, motion & low-power flags once on boot. */
export function BootProvider({ children }: { children: React.ReactNode }) {
  const setVisitCount = useStoryStore((s) => s.setVisitCount);
  const setEntrySource = useStoryStore((s) => s.setEntrySource);
  const setReducedMotion = useStoryStore((s) => s.setReducedMotion);
  const setLowPower = useStoryStore((s) => s.setLowPower);
  const setBootReady = useStoryStore((s) => s.setBootReady);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromQuery = searchParams.get("from") === "nfc";
    const fromSession = sessionStorage.getItem(ENTRY_KEY) === "nfc";
    if (fromQuery || fromSession) {
      setEntrySource("nfc");
      sessionStorage.setItem(ENTRY_KEY, "nfc");
    }

    const prev = Number(localStorage.getItem(VISIT_KEY) || "0");
    const next = Number.isFinite(prev) ? prev + 1 : 1;
    localStorage.setItem(VISIT_KEY, String(next));
    setVisitCount(next);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotion = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMotion);

    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    const cores = navigator.hardwareConcurrency || 8;
    const narrow = window.matchMedia("(max-width: 720px)").matches;
    setLowPower(Boolean(saveData) || cores <= 4 || (narrow && cores <= 6));

    setBootReady(true);
    return () => mq.removeEventListener("change", onMotion);
  }, [
    searchParams,
    setVisitCount,
    setEntrySource,
    setReducedMotion,
    setLowPower,
    setBootReady,
  ]);

  return children;
}
