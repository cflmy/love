"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { images } from "@/data/assets";
import { MusicEngine } from "@/engine/MusicEngine";
import { useStoryStore, type OpeningPhase } from "@/store/story";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function OpeningGate() {
  const entered = useStoryStore((s) => s.entered);
  const phase = useStoryStore((s) => s.openingPhase);
  const setPhase = useStoryStore((s) => s.setOpeningPhase);
  const setEntered = useStoryStore((s) => s.setEntered);
  const setAudioUnlocked = useStoryStore((s) => s.setAudioUnlocked);
  const setWorldReveal = useStoryStore((s) => s.setWorldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await wait(reduced ? 200 : 700);
      if (cancelled) return;
      setPhase("mark");
      await wait(reduced ? 400 : 1100);
      if (cancelled) return;
      setPhase("invite");
    })();
    return () => {
      cancelled = true;
    };
  }, [reduced, setPhase]);

  const runRitual = async () => {
    if (busy || phase !== "invite") return;
    setBusy(true);

    setPhase("unlock");
    MusicEngine.unlock();
    setAudioUnlocked(true);
    MusicEngine.play("prologue", 700);
    await wait(reduced ? 400 : 900);

    setPhase("card");
    await wait(reduced ? 500 : 1200);

    setPhase("flip");
    await wait(reduced ? 700 : 1600);

    setPhase("butterfly");
    await wait(reduced ? 600 : 1400);

    setPhase("portal");
    // Ease world in while gate dissolves.
    const steps = reduced ? 6 : 18;
    for (let i = 1; i <= steps; i++) {
      setWorldReveal(i / steps);
      await wait(reduced ? 30 : 45);
    }

    setEntered(true);
    setPhase("done");
    MusicEngine.play("prayer", 2400);
    setBusy(false);
  };

  if (phase === "done" && entered) return null;

  return (
    <div
      className={[
        "opening-gate",
        `phase-${phase}`,
        entered ? "is-entered" : "",
      ].join(" ")}
      data-phase={phase}
    >
      <div className="opening-gate__veil" />
      <div className="opening-gate__stars" aria-hidden />

      <div className="opening-gate__mark" aria-hidden={phase === "silence"}>
        <span className="opening-gate__qdqc">QDQC</span>
        <span className="opening-gate__inf">∞</span>
        <span className="opening-gate__tag">More Days Together</span>
      </div>

      <div className="opening-gate__stage">
        <div className={`nfc-stage ${flipClass(phase)}`}>
          <div className="nfc-card">
            <div className="nfc-card__inner">
              <div className="nfc-face nfc-face--front">
                <Image
                  src={images.nfcCard}
                  alt="QDQC card front"
                  fill
                  priority
                  sizes="200px"
                  className="nfc-face__img nfc-face__img--front"
                />
              </div>
              <div className="nfc-face nfc-face--back">
                <Image
                  src={images.nfcCard}
                  alt="QDQC card back"
                  fill
                  priority
                  sizes="200px"
                  className="nfc-face__img nfc-face__img--back"
                />
              </div>
            </div>
          </div>

          <div className="opening-butterfly" aria-hidden>
            <span className="opening-butterfly__wing left" />
            <span className="opening-butterfly__body" />
            <span className="opening-butterfly__wing right" />
            <span className="opening-butterfly__trail" />
          </div>
        </div>

        <div className="opening-gate__copy">
          <p className="opening-gate__line a">相逢鹊渡</p>
          <p className="opening-gate__line b">相守情长</p>
          <p className="opening-gate__line c">戴上耳机，会更好。</p>
        </div>

        <button
          type="button"
          className="opening-gate__cta"
          onClick={runRitual}
          disabled={phase !== "invite" || busy}
        >
          {ctaLabel(phase)}
        </button>

        <p className="opening-gate__motto">
          Que dure, que câlin.
          <br />
          Quiet days, quiet cuddles.
        </p>
      </div>

      <div className="opening-gate__portal" aria-hidden />
    </div>
  );
}

function flipClass(phase: OpeningPhase) {
  if (phase === "flip" || phase === "butterfly" || phase === "portal") return "is-flipped";
  if (phase === "card" || phase === "unlock") return "is-visible";
  return "";
}

function ctaLabel(phase: OpeningPhase) {
  if (phase === "invite") return "触碰鹊桥";
  if (phase === "unlock" || phase === "card") return "听见了…";
  if (phase === "flip") return "另一面";
  if (phase === "butterfly") return "化蝶";
  if (phase === "portal") return "进入世界";
  return "…";
}
