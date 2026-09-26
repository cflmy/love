"use client";

import { useEffect, useState } from "react";
import { crops } from "@/data/assets";
import { useStoryStore } from "@/store/story";

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const bootReady = useStoryStore((s) => s.bootReady);
  const [assetsReady, setAssetsReady] = useState(false);
  const [fade, setFade] = useState(false);
  const ready = bootReady && assetsReady;

  useEffect(() => {
    let cancelled = false;
    const urls = [crops.nfcFront, crops.heroDesktop, crops.heroEnding, crops.meetBridge];
    Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setFade(true), 280);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <div className={`loading-gate ${fade ? "is-done" : ""}`} aria-hidden={fade}>
        <div className="loading-gate__mark">
          <span>QDQC</span>
          <span className="loading-gate__inf">∞</span>
        </div>
        <div className="loading-gate__bar">
          <i style={{ width: ready ? "100%" : assetsReady ? "70%" : "35%" }} />
        </div>
        <p className="loading-gate__hint">{ready ? "正在醒来" : "连接鹊桥…"}</p>
      </div>
      {ready ? children : null}
    </>
  );
}
