"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapterProgressBounds, chapters } from "@/data/chapters";
import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore } from "@/store/story";
import { audio } from "@/data/assets";

gsap.registerPlugin(ScrollTrigger);

export function ScrollSync({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const setProgress = useStoryStore((s) => s.setProgress);
  const setChapterId = useStoryStore((s) => s.setChapterId);
  const setIntensity = useStoryStore((s) => s.setIntensity);
  const entered = useStoryStore((s) => s.entered);
  const musicEnabled = useStoryStore((s) => s.musicEnabled);
  const audioUnlocked = useStoryStore((s) => s.audioUnlocked);

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
        setChapterId(chapter.id);
        MusicEngine.setIntensity(0.35 + p * 0.65);
      },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [entered, setProgress, setChapterId, setIntensity]);

  useEffect(() => {
    if (!entered || !audioUnlocked) return;
    const chapter = chapters.find((c) => c.id === useStoryStore.getState().chapterId);
    if (!chapter?.themeTrack) return;
    MusicEngine.setEnabled(musicEnabled);
    MusicEngine.play(chapter.themeTrack as keyof typeof audio);
  }, [entered, audioUnlocked, musicEnabled]);

  useEffect(() => {
    if (!entered || !audioUnlocked || !musicEnabled) return;
    const unsub = useStoryStore.subscribe((state, prev) => {
      if (state.chapterId === prev.chapterId) return;
      const chapter = chapters.find((c) => c.id === state.chapterId);
      if (chapter?.themeTrack) {
        MusicEngine.play(chapter.themeTrack as keyof typeof audio);
      }
    });
    return unsub;
  }, [entered, audioUnlocked, musicEnabled]);

  return (
    <div ref={rootRef} className="relative z-10">
      {children}
    </div>
  );
}
