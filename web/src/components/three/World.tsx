"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { images } from "@/data/assets";
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
  const texture = useTexture(images.heroDesktop);
  texture.colorSpace = THREE.SRGBColorSpace;
  const progress = useStoryStore((s) => s.progress);
  const reveal = useStoryStore((s) => s.worldReveal);

  return (
    <mesh position={[0, 0.15 - progress * 0.7, -8]} scale={[14.2, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.88 * reveal} />
    </mesh>
  );
}

function BridgePlate() {
  const texture = useTexture(images.bridgeSheet);
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
  const texture = useTexture(images.endingHero);
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

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const breath = 1 + Math.sin(clock.elapsedTime * 0.4) * 0.015;
    ref.current.scale.setScalar(breath * (0.7 + reveal * 0.3));
    ref.current.position.y = 2.4 + progress * 0.35;
    ref.current.position.x = 2.6 - progress * 0.9;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + reveal * 0.67;
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
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = -1.55 + Math.sin(clock.elapsedTime * 0.55) * 0.03;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.05, 0, 0]} position={[0, -1.55, -2]}>
      <planeGeometry args={[20, 10, 32, 32]} />
      <meshStandardMaterial
        color="#1a3358"
        metalness={0.65}
        roughness={0.25}
        transparent
        opacity={0.55}
      />
    </mesh>
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

    // Approach from right, cross river, settle near bridge center.
    const x = THREE.MathUtils.lerp(3.6, 0.35, THREE.MathUtils.smoothstep(meet, 0, 0.72));
    const z = THREE.MathUtils.lerp(1.2, -1.0, THREE.MathUtils.smoothstep(meet, 0.1, 0.8));
    const y = 0.55 + Math.sin(t * 1.3) * 0.12 + Math.sin(meet * Math.PI) * 0.25;
    group.current.position.set(x + Math.sin(t * 0.6) * 0.08, y, z);
    group.current.rotation.y = -0.55 - meet * 0.35;
    group.current.visible = reveal > 0.2;
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
    ref.current.visible = appear > 0.02;
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

function CameraRig() {
  const progress = useStoryStore((s) => s.progress);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");

  useFrame(({ camera }) => {
    if (reduced) {
      camera.position.set(0, 0.6, 5.2);
      camera.lookAt(0, 0.2, -2);
      return;
    }
    // Portal push-in, then journey, with a closer beat during meeting climax.
    const portalZ = THREE.MathUtils.lerp(8.5, 6.0, reveal);
    const journeyZ = portalZ - progress * 3.2;
    const meetPull = THREE.MathUtils.smoothstep(meet, 0.55, 0.95) * 1.1;
    const z = journeyZ - meetPull;
    const y = 0.95 - progress * 0.5 - meetPull * 0.15;
    const x = Math.sin(progress * Math.PI * 2) * 0.28;
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.07);
    camera.lookAt(0, 0.1 - progress * 0.15, -2.4);
  });

  return null;
}

export function QDQCWorld() {
  const meet = useChapterLocal("meeting");
  const lit = THREE.MathUtils.smoothstep(meet, 0.45, 0.92);
  const reduced = useStoryStore((s) => s.reducedMotion);

  return (
    <>
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 6, 16]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 6, 2]} intensity={0.85} color="#c9d7ef" />
      <pointLight position={[2.6, 2.4, -4]} intensity={1.4} color="#F7F3E9" distance={12} />
      <pointLight position={[0, 0.2, -1]} intensity={0.55 + lit * 1.1} color="#C7A66A" distance={9} />

      <CameraRig />
      <Backdrop />
      <BridgePlate />
      <EndingHint />
      <Moon />
      <Water />
      <BridgeLamps lit={lit} />
      <Butterfly />
      <Magpie />
      {!reduced && <Petals density={0.35 + meet * 0.65} />}
    </>
  );
}
