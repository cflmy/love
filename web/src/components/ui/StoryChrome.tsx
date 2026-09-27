"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { chromeCopy } from "@/data/chrome";
import { scrollToChapter } from "@/engine/goChapter";
import { useStoryStore } from "@/store/story";
import { MusicPlayer } from "./MusicPlayer";
import { StoryBar } from "./StoryBar";
import { StoryCursor } from "./StoryCursor";
import { StoryIcon } from "./icons";
import { ToastHost } from "./ToastHost";

function ScrollTarget() {
  const entered = useStoryStore((s) => s.entered);
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (pathname !== "/" || !entered) return;
    const raw = search.get("at") || sessionStorage.getItem("qdqc-at");
    if (!raw) return;
    sessionStorage.removeItem("qdqc-at");
    const timer = window.setTimeout(() => scrollToChapter(raw), 480);
    return () => window.clearTimeout(timer);
  }, [entered, pathname, search]);

  return null;
}

function PageVeil() {
  const pathname = usePathname();
  const [veil, setVeil] = useState(pathname);

  useEffect(() => {
    if (pathname === veil) return;
    setVeil(pathname);
  }, [pathname, veil]);

  return <div key={pathname} className="page-fade" aria-hidden />;
}

/** Site-wide chrome: bar, player, toasts, cursor, return, scroll cue. */
export function StoryChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const entered = useStoryStore((s) => s.entered);
  const progress = useStoryStore((s) => s.progress);
  const locale = useStoryStore((s) => s.locale);
  const text = chromeCopy(locale);
  const showCue = pathname === "/" && entered && progress < 0.03;
  const showTop = pathname === "/" ? entered && progress > 0.08 : true;

  return (
    <>
      <StoryBar />
      <Suspense fallback={null}>
        <ScrollTarget />
      </Suspense>
      <PageVeil />
      {children}
      <MusicPlayer />
      <ToastHost />
      <StoryCursor />
      {showCue ? (
        <p className="qd-scrollcue">
          <i />
          {text.scroll}
        </p>
      ) : null}
      {showTop ? (
        <button
          type="button"
          className="qd-top"
          aria-label={text.backTop}
          onClick={() => {
            if (pathname === "/" && entered) scrollToChapter("meeting");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <StoryIcon name="up" />
          <span>{text.backTop}</span>
        </button>
      ) : null}
    </>
  );
}
