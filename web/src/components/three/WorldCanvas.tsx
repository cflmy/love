"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { QDQCWorld } from "./World";
import { useStoryStore } from "@/store/story";

export function WorldCanvas() {
  const entered = useStoryStore((s) => s.entered);
  const reveal = useStoryStore((s) => s.worldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const lowPower = useStoryStore((s) => s.lowPower);
  const opacity = entered ? 1 : 0.15 + reveal * 0.85;
  const lite = reduced || lowPower;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity, transition: "opacity 0.8s ease" }}
      aria-hidden
    >
      <Canvas
        dpr={lite ? [1, 1.15] : [1, 1.75]}
        camera={{ position: [0, 0.9, 8.2], fov: 42, near: 0.1, far: 40 }}
        gl={{
          antialias: !lite,
          alpha: false,
          powerPreference: lite ? "low-power" : "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <QDQCWorld />
          {!lite && (
            <EffectComposer>
              <Bloom intensity={0.4 + reveal * 0.15} luminanceThreshold={0.55} mipmapBlur />
              <Vignette eskil={false} offset={0.25} darkness={0.55} />
              <Noise opacity={0.03} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
