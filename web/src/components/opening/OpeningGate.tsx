"use client";

import { useState } from "react";
import Image from "next/image";
import { images } from "@/data/assets";
import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore } from "@/store/story";

export function OpeningGate() {
  const entered = useStoryStore((s) => s.entered);
  const setEntered = useStoryStore((s) => s.setEntered);
  const setAudioUnlocked = useStoryStore((s) => s.setAudioUnlocked);
  const [phase, setPhase] = useState<"idle" | "awakening" | "done">("idle");

  if (entered && phase === "done") return null;

  const onTouch = async () => {
    setPhase("awakening");
    MusicEngine.unlock();
    setAudioUnlocked(true);
    MusicEngine.play("prologue", 900);
    await new Promise((r) => setTimeout(r, 1600));
    setEntered(true);
    setPhase("done");
    MusicEngine.play("prayer", 2200);
  };

  return (
    <div className={`opening-gate ${entered ? "is-entered" : ""}`}>
      <div className="opening-gate__veil" />
      <div className="opening-gate__blur">
        <Image src={images.nfcCard} alt="" fill priority className="object-cover blur-sm scale-110" />
      </div>

      <div className="opening-gate__panel">
        <p className="opening-gate__brand">QDQC</p>

        <div className={`opening-gate__card ${phase === "awakening" ? "is-awake" : ""}`}>
          <Image
            src={images.nfcCard}
            alt="QDQC NFC Card"
            fill
            priority
            className="object-cover object-left"
          />
        </div>

        <div className="opening-gate__titles">
          <h1>相逢鹊渡</h1>
          <p className="sub">相守情长</p>
          <p className="hint">戴上耳机，会更好。</p>
        </div>

        <button
          type="button"
          onClick={onTouch}
          disabled={phase !== "idle"}
          className="opening-gate__cta"
        >
          {phase === "idle" ? "触碰鹊桥" : "正在醒来…"}
        </button>

        <p className="opening-gate__motto">
          Que dure, que câlin.
          <br />
          Quiet days, quiet cuddles.
        </p>
      </div>
    </div>
  );
}
