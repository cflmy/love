"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapterProgressBounds, chapters } from "@/data/chapters";
import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore } from "@/store/story";
import type { audio } from "@/data/assets";

gsap.registerPlugin(ScrollTrigger);

type TrackId = keyof typeof audio;

/** Map scroll beats across all 17 OST tracks. */
function trackForChapter(id: string, local: number): TrackId | null {
  const chapter = chapters.find((c) => c.id === id);
  if (!chapter?.themeTrack) return null;

  switch (id) {
    case "opening":
      return "prologue";
    case "meeting":
      return local < 0.45 ? "butterfly" : "magpieBridge";
    case "past":
      if (local < 0.32) return "past";
      if (local < 0.66) return "changfeng";
      return "promise";
    case "present":
      return "present";
    case "journey":
      if (local < 0.16) return "journey";
      if (local < 0.34) return "dontHurry";
      if (local < 0.52) return "mountains";
      if (local < 0.72) return "towardYou";
      return "sunNeverSets";
    case "memories":
      return local < 0.55 ? "quietDays" : "reprise";
    case "quiet-days":
      return "quietDays";
    case "letter":
      return local < 0.45 ? "reprise" : "sunNeverSets";
    case "future":
      return "moreDays";
    default:
      return chapter.themeTrack;
  }
}

export function ScrollSync({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const setProgress = useStoryStore((s) => s.setProgress);
  const setChapterId = useStoryStore((s) => s.setChapterId);
  const setChapterLocal = useStoryStore((s) => s.setChapterLocal);
  const setIntensity = useStoryStore((s) => s.setIntensity);
  const entered = useStoryStore((s) => s.entered);
  const musicEnabled = useStoryStore((s) => s.musicEnabled);
  const audioUnlocked = useStoryStore((s) => s.audioUnlocked);
  const lastTrack = useRef<TrackId | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    useStoryStore.getState().setReducedMotion(mq.matches);
    const onChange = () => useStoryStore.getState().setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!entered) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const bounds = chapterProgressBounds();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.65,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);
        setIntensity(Math.sin(p * Math.PI));
        const chapter =
          bounds.find((b) => p >= b.start && p < b.end) ?? bounds[bounds.length - 1];
        const span = Math.max(0.0001, chapter.end - chapter.start);
        const local = (p - chapter.start) / span;
        setChapterId(chapter.id);
        setChapterLocal(local);

        if (useStoryStore.getState().audioUnlocked && useStoryStore.getState().musicEnabled) {
          const track = trackForChapter(chapter.id, local);
          if (track && track !== lastTrack.current) {
            lastTrack.current = track;
            const fade =
              chapter.id === "meeting" || chapter.id === "journey" ? 2200 : 1600;
            MusicEngine.play(track, fade);
          }
          // Journey intensity: crescendo then sudden hush at embrace.
          if (chapter.id === "journey") {
            const rise = Math.min(1, local / 0.78);
            const hush = local > 0.9 ? Math.max(0.15, 1 - (local - 0.9) / 0.08) : 1;
            MusicEngine.setIntensity(0.35 + rise * 0.65 * hush);
          } else {
            MusicEngine.setIntensity(0.35 + p * 0.65);
          }
        }
      },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [entered, setProgress, setChapterId, setChapterLocal, setIntensity]);

  useEffect(() => {
    if (!entered || !audioUnlocked) return;
    MusicEngine.setEnabled(musicEnabled);
    if (!musicEnabled) return;
    const { chapterId, chapterLocal } = useStoryStore.getState();
    const track = trackForChapter(chapterId, chapterLocal);
    if (track) {
      lastTrack.current = track;
      MusicEngine.play(track);
    }
  }, [entered, audioUnlocked, musicEnabled]);

  return (
    <div ref={rootRef} className="relative z-10">
      {children}
    </div>
  );
}
