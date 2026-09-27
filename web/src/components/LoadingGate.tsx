"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brand, crops } from "@/data/assets";
import { useStoryStore } from "@/store/story";
import { BlossomMark } from "@/components/ui/icons";

const STAGES = [
  { label: "加载中", en: "Loading" },
  { label: "相遇中", en: "Connecting" },
  { label: "记忆拼接", en: "Gathering" },
  { label: "马上见面", en: "Almost there" },
];

export function LoadingGate({ children }: { children: React.ReactNode }) {
  const bootReady = useStoryStore((s) => s.bootReady);
  const [assetsReady, setAssetsReady] = useState(false);
  const [fade, setFade] = useState(false);
  const ready = bootReady && assetsReady;
  const step = ready ? 3 : assetsReady ? 2 : bootReady ? 1 : 0;
  const pct = [22, 48, 76, 100][step] ?? 22;

  useEffect(() => {
    let cancelled = false;
    const urls = [
      crops.nfcFront,
      crops.heroDesktop,
      crops.bridgeNight,
      crops.meetShe,
      crops.meetBridge,
      brand.icon,
    ];
    Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
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
    const t = setTimeout(() => setFade(true), 420);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <div className={`loading-gate ${fade ? "is-done" : ""}`} aria-hidden={fade}>
        <div className="loading-gate__bg" aria-hidden>
          <Image
            src={crops.bridgeNight}
            alt=""
            fill
            priority
            sizes="100vw"
            className="loading-gate__photo"
          />
          <div className="loading-gate__shade" />
        </div>

        <div className="loading-gate__mark">
          <Image src={brand.icon} alt="" width={72} height={76} className="loading-gate__logo" priority />
          <span>QDQC</span>
          <span className="loading-gate__inf">∞</span>
        </div>

        <div className="qd-load" aria-label="加载进度">
          <ol className="qd-load__stages">
            {STAGES.map((stage, i) => (
              <li key={stage.en} className={i <= step ? "is-on" : ""}>
                <span className="qd-load__moon" aria-hidden>
                  {i === step ? <BlossomMark className="qd-load__bloom" /> : <i />}
                </span>
                <strong>{stage.label}</strong>
                <em>{stage.en}</em>
              </li>
            ))}
          </ol>
          <div className="qd-load__bar" style={{ ["--pct" as string]: `${pct}%` }}>
            <i />
            <BlossomMark className="qd-load__thumb" />
          </div>
          <p className="qd-load__pct">{pct}%</p>
        </div>

        <p className="loading-gate__hint">{ready ? "正在醒来" : "连接鹊桥…"}</p>
      </div>
      {ready ? children : null}
    </>
  );
}
