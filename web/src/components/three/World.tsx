"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { crops } from "@/data/assets";
import { chapterProgressBounds } from "@/data/chapters";
import { useStoryStore } from "@/store/story";

function useChapterLocal(id: string) {
  const progress = useStoryStore((s) => s.progress);
  return useMemo(() => {
    const bounds = chapterProgressBounds();
    const b = bounds.find((x) => x.id === id);
    if (!b) return 0;
    const span = Math.max(0.0001, b.end - b.start);
    return THREE.MathUtils.clamp((progress - b.start) / span, 0, 1);
  }, [progress, id]);
}

function Backdrop() {
  const texture = useTexture(crops.heroDesktop);
  texture.colorSpace = THREE.SRGBColorSpace;
  const progress = useStoryStore((s) => s.progress);
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const fade = 1 - THREE.MathUtils.smoothstep(past, 0.05, 0.35) + THREE.MathUtils.smoothstep(present, 0.7, 1) * 0.35;

  return (
    <mesh position={[0, 0.15 - progress * 0.7, -8]} scale={[14.2, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.88 * reveal * Math.max(0.15, fade)} />
    </mesh>
  );
}

function PastPlate() {
  const texture = useTexture(crops.pastMuyun);
  texture.colorSpace = THREE.SRGBColorSpace;
  const past = useChapterLocal("past");
  const reveal = useStoryStore((s) => s.worldReveal);
  const opacity = THREE.MathUtils.smoothstep(past, 0.02, 0.25) * (1 - THREE.MathUtils.smoothstep(past, 0.88, 1)) * 0.72 * reveal;

  return (
    <mesh position={[0, 0.1, -5.2]} scale={[11.5, 6.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
}

function PresentPlate() {
  const texture = useTexture(crops.lifeMeet);
  texture.colorSpace = THREE.SRGBColorSpace;
  const present = useChapterLocal("present");
  const reveal = useStoryStore((s) => s.worldReveal);
  const opacity = THREE.MathUtils.smoothstep(present, 0.08, 0.35) * 0.55 * reveal;

  return (
    <mesh position={[0, -0.05, -4.6]} scale={[10.8, 6.1, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
}

function BridgePlate() {
  const texture = useTexture(crops.bridgeFull);
  texture.colorSpace = THREE.SRGBColorSpace;
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const opacity = THREE.MathUtils.smoothstep(meet, 0.05, 0.35) * 0.42 * reveal;

  return (
    <mesh position={[0, -0.15, -3.2]} scale={[9.2, 5.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
}

function EndingHint() {
  const texture = useTexture(crops.heroEnding);
  texture.colorSpace = THREE.SRGBColorSpace;
  const progress = useStoryStore((s) => s.progress);
  const opacity = THREE.MathUtils.smoothstep(progress, 0.82, 0.98);

  return (
    <mesh position={[0, -0.4, -6.5]} scale={[12.5, 7, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity * 0.55} />
    </mesh>
  );
}

function Moon() {
  const ref = useRef<THREE.Mesh>(null);
  const progress = useStoryStore((s) => s.progress);
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const breath = 1 + Math.sin(clock.elapsedTime * 0.4) * 0.015;
    const myth = 1 + past * 0.25;
    ref.current.scale.setScalar(breath * (0.7 + reveal * 0.3) * myth);
    ref.current.position.y = 2.4 + progress * 0.35 + past * 0.2;
    ref.current.position.x = 2.6 - progress * 0.9;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + reveal * 0.67;
    mat.color.set(past > 0.2 ? "#FFE6B8" : "#F7F3E9");
  });

  return (
    <mesh ref={ref} position={[2.6, 2.4, -5]}>
      <circleGeometry args={[1.05, 64]} />
      <meshBasicMaterial color="#F7F3E9" transparent opacity={0.92} />
    </mesh>
  );
}

function Water() {
  const ref = useRef<THREE.Mesh>(null);
  const past = useChapterLocal("past");
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = -1.55 + Math.sin(clock.elapsedTime * 0.55) * 0.03;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.color.set(past > 0.15 ? "#2a1848" : "#1a3358");
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.05, 0, 0]} position={[0, -1.55, -2]}>
      <planeGeometry args={[20, 10, 32, 32]} />
      <meshStandardMaterial color="#1a3358" metalness={0.65} roughness={0.25} transparent opacity={0.55} />
    </mesh>
  );
}

function WindCloudInfinity() {
  const group = useRef<THREE.Group>(null);
  const past = useChapterLocal("past");

  useFrame(({ clock }) => {
    if (!group.current) return;
    const show = THREE.MathUtils.smoothstep(past, 0.45, 0.85);
    group.current.visible = show > 0.02;
    group.current.scale.setScalar(0.6 + show * 0.7);
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.35) * 0.08;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = show * (0.35 + (i % 2) * 0.25);
    });
  });

  return (
    <group ref={group} position={[0, 0.8, -2.2]}>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[0.55, 0.02, 8, 64]} />
        <meshBasicMaterial color="#6F8FB7" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, -0.2]}>
        <torusGeometry args={[0.55, 0.02, 8, 64]} />
        <meshBasicMaterial color="#C7A66A" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function BridgeLamps({ lit }: { lit: number }) {
  const lamps = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: -3.2 + i * 0.8,
        z: -1.15,
      })),
    [],
  );

  return (
    <group position={[0, -0.55, -1.1]}>
      {lamps.map((lamp, i) => {
        const on = THREE.MathUtils.smoothstep(lit, i / lamps.length, (i + 1.1) / lamps.length);
        return (
          <group key={i} position={[lamp.x, 0.35, lamp.z]}>
            <mesh>
              <sphereGeometry args={[0.055 + on * 0.03, 16, 16]} />
              <meshBasicMaterial color="#C7A66A" transparent opacity={0.15 + on * 0.85} />
            </mesh>
            {on > 0.2 && (
              <pointLight color="#C7A66A" intensity={on * 0.55} distance={2.2} decay={2} />
            )}
          </group>
        );
      })}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.8, 0.04, 12, 90, Math.PI]} />
        <meshStandardMaterial color="#2a4068" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Petals({ density }: { density: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = Math.random() * 5 - 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < 120; i++) {
      let y = attr.getY(i) - 0.004 - (i % 5) * 0.0008;
      if (y < -2) y = 4;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.4 + i) * 0.002);
    }
    attr.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.15 + density * 0.35;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F7F3E9" size={0.045} transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}

function Butterfly() {
  const group = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Mesh>(null);
  const wingR = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);

  useFrame(({ clock }) => {
    if (!group.current || !wingL.current || !wingR.current) return;
    const t = clock.elapsedTime;
    const flap = Math.sin(t * 9) * 0.5;
    wingL.current.rotation.y = -0.75 + flap;
    wingR.current.rotation.y = 0.75 - flap;

    const x = THREE.MathUtils.lerp(3.6, 0.35, THREE.MathUtils.smoothstep(meet, 0, 0.72));
    const z = THREE.MathUtils.lerp(1.2, -1.0, THREE.MathUtils.smoothstep(meet, 0.1, 0.8));
    const y = 0.55 + Math.sin(t * 1.3) * 0.12 + Math.sin(meet * Math.PI) * 0.25;
    group.current.position.set(x + Math.sin(t * 0.6) * 0.08, y, z);
    group.current.rotation.y = -0.55 - meet * 0.35;
    group.current.visible = reveal > 0.2 && meet < 0.98;
    group.current.scale.setScalar(0.28 + reveal * 0.1);
  });

  const wingMat = (
    <meshStandardMaterial
      color="#4E83B5"
      emissive="#4E83B5"
      emissiveIntensity={0.4}
      transparent
      opacity={0.88}
      side={THREE.DoubleSide}
    />
  );

  return (
    <Float speed={2.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={group} scale={0.35}>
        <mesh ref={wingL} position={[-0.35, 0, 0]}>
          <planeGeometry args={[0.7, 0.95]} />
          {wingMat}
        </mesh>
        <mesh ref={wingR} position={[0.35, 0, 0]}>
          <planeGeometry args={[0.7, 0.95]} />
          {wingMat}
        </mesh>
        <mesh>
          <capsuleGeometry args={[0.05, 0.35, 4, 8]} />
          <meshStandardMaterial color="#172B49" />
        </mesh>
      </group>
    </Float>
  );
}

function Magpie() {
  const ref = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const appear = THREE.MathUtils.smoothstep(meet, 0.22, 0.45);
    const t = clock.elapsedTime;
    ref.current.visible = appear > 0.02 && meet < 0.98;
    const x = THREE.MathUtils.lerp(-3.8, -0.25, THREE.MathUtils.smoothstep(meet, 0.22, 0.78));
    const z = THREE.MathUtils.lerp(0.9, -1.05, THREE.MathUtils.smoothstep(meet, 0.28, 0.82));
    ref.current.position.set(x + Math.sin(t * 0.5) * 0.08, 0.7 + Math.cos(t * 0.9) * 0.08, z);
    ref.current.rotation.y = 0.55 + meet * 0.35;
    ref.current.scale.setScalar(0.22 + appear * 0.08);
  });

  return (
    <group ref={ref} scale={0.28}>
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#101820" metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.12, 0.55, 8]} />
        <meshStandardMaterial color="#4E83B5" emissive="#4E83B5" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[-0.15, 0.05, 0.05]} rotation={[0.2, 0, 0.6]}>
        <planeGeometry args={[0.9, 0.35]} />
        <meshStandardMaterial color="#6F8FB7" side={THREE.DoubleSide} transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

function JourneyPlate() {
  const texture = useTexture(crops.roadBeforeSunset);
  texture.colorSpace = THREE.SRGBColorSpace;
  const journey = useChapterLocal("journey");
  const reveal = useStoryStore((s) => s.worldReveal);
  const opacity =
    THREE.MathUtils.smoothstep(journey, 0.05, 0.25) *
    (1 - THREE.MathUtils.smoothstep(journey, 0.92, 1)) *
    0.58 *
    reveal;

  return (
    <mesh position={[0, 0.05, -4.9]} scale={[11.2, 6.3, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
}

function HeldSun() {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const journey = useChapterLocal("journey");

  useFrame(() => {
    if (!ref.current || !glow.current) return;
    const show = THREE.MathUtils.smoothstep(journey, 0.08, 0.3);
    const hush = journey > 0.9;
    // Before hush the sun sinks; after embrace it freezes near the ridge.
    const sink = hush ? 0.42 : journey * 0.7;
    ref.current.visible = show > 0.02;
    ref.current.position.set(0.2, 1.55 - sink, -4.2);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.35 + show * 0.55 + (hush ? 0.15 : 0);
    glow.current.intensity = show * (hush ? 2.2 : 1.2 + journey);
    glow.current.position.copy(ref.current.position);
  });

  return (
    <>
      <mesh ref={ref}>
        <circleGeometry args={[0.85, 48]} />
        <meshBasicMaterial color="#E8A45A" transparent opacity={0.8} />
      </mesh>
      <pointLight ref={glow} color="#E8A45A" intensity={0} distance={16} />
    </>
  );
}

function Atmosphere() {
  const fogRef = useRef<THREE.Fog>(null);
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const sunRef = useRef<THREE.PointLight>(null);
  const mythRef = useRef<THREE.PointLight>(null);
  const phoenixRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (fogRef.current) {
      const c = new THREE.Color();
      if (journey > 0.05) {
        // Warm dusk during climax, cooler after hush.
        if (journey > 0.9) c.set("#12182a");
        else c.setRGB(0.12 + journey * 0.1, 0.05 + journey * 0.04, 0.04);
      } else if (present > 0.05) {
        c.set("#1a2438");
      } else if (past > 0.05) {
        c.setRGB(0.05 + past * 0.12, 0.02 + past * 0.04, 0.08 + past * 0.1);
      } else {
        c.set("#050810");
      }
      fogRef.current.color.copy(c);
    }
    if (mythRef.current) {
      mythRef.current.intensity = THREE.MathUtils.smoothstep(past, 0.1, 0.7) * 1.6;
    }
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.smoothstep(present, 0.1, 0.6) * 1.3;
    }
    if (phoenixRef.current) {
      const flare = THREE.MathUtils.smoothstep(journey, 0.55, 0.78);
      phoenixRef.current.intensity = flare * 2.4 * (journey > 0.9 ? 0.25 : 1);
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#050810", 6, 16]} />
      <pointLight ref={mythRef} position={[-2, 2.2, -3]} color="#9C493E" intensity={0} distance={14} />
      <pointLight ref={sunRef} position={[3, 3, -2]} color="#C7A66A" intensity={0} distance={14} />
      <pointLight ref={phoenixRef} position={[0, 2.8, -3.5]} color="#FFB46A" intensity={0} distance={18} />
    </>
  );
}

function CameraRig() {
  const progress = useStoryStore((s) => s.progress);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const journey = useChapterLocal("journey");

  useFrame(({ camera }) => {
    if (reduced) {
      camera.position.set(0, 0.6, 5.2);
      camera.lookAt(0, 0.2, -2);
      return;
    }
    const portalZ = THREE.MathUtils.lerp(8.5, 6.0, reveal);
    const journeyZ = portalZ - progress * 3.2;
    const meetPull = THREE.MathUtils.smoothstep(meet, 0.55, 0.95) * 1.1;
    const mythLift = THREE.MathUtils.smoothstep(past, 0.2, 0.8) * 0.45;
    const climaxPush = THREE.MathUtils.smoothstep(journey, 0.7, 0.92) * 1.35;
    const hushPull = journey > 0.92 ? (journey - 0.92) * 2.5 : 0;
    const z = journeyZ - meetPull - climaxPush + hushPull;
    const y = 0.95 - progress * 0.5 - meetPull * 0.15 + mythLift + climaxPush * 0.15;
    const x =
      Math.sin(progress * Math.PI * 2) * 0.28 +
      past * 0.2 +
      Math.sin(journey * Math.PI) * 0.45;
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.07);
    camera.lookAt(0, 0.1 - progress * 0.15 + mythLift * 0.2, -2.4);
  });

  return null;
}

export function QDQCWorld() {
  const meet = useChapterLocal("meeting");
  const journey = useChapterLocal("journey");
  const lit = THREE.MathUtils.smoothstep(meet, 0.45, 0.92);
  const reduced = useStoryStore((s) => s.reducedMotion);

  return (
    <>
      <color attach="background" args={["#050810"]} />
      <Atmosphere />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 6, 2]} intensity={0.85} color="#c9d7ef" />
      <pointLight position={[2.6, 2.4, -4]} intensity={1.4} color="#F7F3E9" distance={12} />
      <pointLight position={[0, 0.2, -1]} intensity={0.55 + lit * 1.1} color="#C7A66A" distance={9} />

      <CameraRig />
      <Backdrop />
      <PastPlate />
      <PresentPlate />
      <JourneyPlate />
      <BridgePlate />
      <EndingHint />
      <Moon />
      <HeldSun />
      <Water />
      <WindCloudInfinity />
      <BridgeLamps lit={lit} />
      <Butterfly />
      <Magpie />
      {!reduced && <Petals density={0.35 + meet * 0.45 + journey * 0.4} />}
    </>
  );
}
