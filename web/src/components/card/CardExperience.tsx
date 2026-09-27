"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { crops } from "@/data/assets";
import { MusicEngine } from "@/engine/MusicEngine";
import { ArtButton } from "@/components/ui/ArtButton";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = "idle" | "touch" | "front" | "flip" | "other" | "go";

export function CardExperience({ initialFace = "front" }: { initialFace?: "front" | "back" }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(initialFace === "back" ? "other" : "idle");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("qdqc-entry", "nfc");
    if (initialFace === "back") {
      // Show back face immediately for /card/back deep link.
      setPhase("other");
    }
  }, [initialFace]);

  const awaken = async () => {
    if (busy || phase !== "idle") return;
    setBusy(true);
    setPhase("touch");
    MusicEngine.unlock();
    MusicEngine.play("prologue", 600);
    await wait(700);
    setPhase("front");
    await wait(1100);
    setPhase("flip");
    await wait(1400);
    setPhase("other");
    setBusy(false);
  };

  const enterStory = () => {
    setPhase("go");
    sessionStorage.setItem("qdqc-entry", "nfc");
    router.push("/?from=nfc");
  };

  return (
    <main className={`card-page phase-${phase}`}>
      <div className="card-page__veil" />
      <p className="card-page__brand">QDQC</p>
      <p className="card-page__inf">∞</p>

      {phase === "idle" && (
        <div className="card-page__idle">
          <p className="card-page__whisper">A touch</p>
          <p className="card-page__whisper">awakens our world.</p>
          <ArtButton variant="start" label="触碰这张卡" hint="Awaken" width={260} onClick={awaken} />
        </div>
      )}

      {(phase === "touch" ||
        phase === "front" ||
        phase === "flip" ||
        phase === "other" ||
        phase === "go") && (
        <div
          className={`card-page__stage ${
            phase === "flip" || phase === "other" || phase === "go" || initialFace === "back"
              ? "is-flipped"
              : ""
          }`}
        >
          <div className="nfc-card">
            <div className="nfc-card__inner">
              <div className="nfc-face nfc-face--front">
                <Image
                  src={crops.nfcFront}
                  alt="QDQC front"
                  fill
                  priority
                  sizes="220px"
                  className="nfc-face__img nfc-face__img--front"
                />
              </div>
              <div className="nfc-face nfc-face--back">
                <Image
                  src={crops.nfcBack}
                  alt="QDQC back"
                  fill
                  priority
                  sizes="220px"
                  className="nfc-face__img nfc-face__img--back"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "other" && (
        <div className="card-page__reveal">
          <p>You found the other side.</p>
          <p className="zh">另一半的故事，正在等待你。</p>
          <ArtButton variant="memory" label="进入我们的世界" hint="Enter our world" width={280} onClick={enterStory} />
        </div>
      )}

      <nav className="card-page__links">
        <Link href="/card/front">正面</Link>
        <Link href="/card/back">背面</Link>
        <Link href="/">故事</Link>
      </nav>
    </main>
  );
}
