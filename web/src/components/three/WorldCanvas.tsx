"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { QDQCWorld } from "./World";
import { useStoryStore } from "@/store/story";

export function WorldCanvas() {
  const entered = useStoryStore((s) => s.entered);
  const reveal = useStoryStore((s) => s.worldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const lowPower = useStoryStore((s) => s.lowPower);
  const opacity = entered ? 1 : 0.12 + reveal * 0.88;
  const lite = reduced || lowPower;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity, transition: "opacity 0.8s ease" }}
      aria-hidden
    >
      <Canvas
        dpr={lite ? [1, 1.1] : [1, 1.6]}
        camera={{ position: [0, 0.9, 8.2], fov: 40, near: 0.1, far: 48 }}
        gl={{
          antialias: !lite,
          alpha: false,
          powerPreference: lite ? "low-power" : "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <QDQCWorld />
          {!lite && (
            <EffectComposer multisampling={0}>
              {/* Soft vignette only — bloom kept very low so plates stay clean */}
              <Bloom intensity={0.08 + reveal * 0.04} luminanceThreshold={0.85} mipmapBlur />
              <Vignette eskil={false} offset={0.3} darkness={0.55} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
