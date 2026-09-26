"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { QDQCWorld } from "./World";
import { useStoryStore } from "@/store/story";

export function WorldCanvas() {
  const entered = useStoryStore((s) => s.entered);
  const reduced = useStoryStore((s) => s.reducedMotion);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
      style={{ opacity: entered ? 1 : 0.35 }}
      aria-hidden
    >
      <Canvas
        dpr={reduced ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 0.8, 6.2], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <QDQCWorld />
          {!reduced && (
            <EffectComposer>
              <Bloom intensity={0.45} luminanceThreshold={0.55} mipmapBlur />
              <Vignette eskil={false} offset={0.25} darkness={0.55} />
              <Noise opacity={0.035} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
