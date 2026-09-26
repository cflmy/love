"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { images } from "@/data/assets";
import { useStoryStore } from "@/store/story";

function Backdrop() {
  const texture = useTexture(images.heroDesktop);
  texture.colorSpace = THREE.SRGBColorSpace;
  const progress = useStoryStore((s) => s.progress);

  return (
    <mesh position={[0, 0.2 - progress * 0.8, -8]} scale={[14.2, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.92} />
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

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const breath = 1 + Math.sin(clock.elapsedTime * 0.4) * 0.015;
    ref.current.scale.setScalar(breath);
    ref.current.position.y = 2.4 + progress * 0.35;
    ref.current.position.x = 2.6 - progress * 0.9;
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
      Array.from({ length: 7 }, (_, i) => ({
        x: -2.4 + i * 0.8,
        z: -1.2,
      })),
    [],
  );

  return (
    <group position={[0, -0.55, -1.1]}>
      {lamps.map((lamp, i) => {
        const on = THREE.MathUtils.smoothstep(lit, i / lamps.length, (i + 1.2) / lamps.length);
        return (
          <mesh key={i} position={[lamp.x, 0.35, lamp.z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#C7A66A" transparent opacity={0.2 + on * 0.8} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.6, 0.045, 12, 80, Math.PI]} />
        <meshStandardMaterial color="#2a4068" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Butterfly() {
  const group = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Mesh>(null);
  const wingR = useRef<THREE.Mesh>(null);
  const progress = useStoryStore((s) => s.progress);

  useFrame(({ clock }) => {
    if (!group.current || !wingL.current || !wingR.current) return;
    const t = clock.elapsedTime;
    const flap = Math.sin(t * 8) * 0.45;
    wingL.current.rotation.y = -0.7 + flap;
    wingR.current.rotation.y = 0.7 - flap;

    // Travel across river as meeting chapter approaches.
    const meet = THREE.MathUtils.smoothstep(progress, 0.18, 0.42);
    group.current.position.set(
      3.2 - meet * 3.4 + Math.sin(t * 0.7) * 0.15,
      0.35 + Math.sin(t * 1.2) * 0.12,
      0.8 - meet * 1.6,
    );
    group.current.rotation.y = -0.4 - meet * 0.5;
  });

  const wingMat = (
    <meshStandardMaterial
      color="#4E83B5"
      emissive="#4E83B5"
      emissiveIntensity={0.35}
      transparent
      opacity={0.85}
      side={THREE.DoubleSide}
    />
  );

  return (
    <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.35}>
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
  const progress = useStoryStore((s) => s.progress);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const meet = THREE.MathUtils.smoothstep(progress, 0.24, 0.48);
    const t = clock.elapsedTime;
    ref.current.visible = meet > 0.02;
    ref.current.position.set(
      -3.4 + meet * 3.2 + Math.sin(t * 0.55) * 0.1,
      0.55 + Math.cos(t * 0.9) * 0.08,
      0.4 - meet * 1.3,
    );
    ref.current.rotation.y = 0.5 + meet * 0.4;
  });

  return (
    <group ref={ref} scale={0.28}>
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#101820" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.12, 0.55, 8]} />
        <meshStandardMaterial color="#4E83B5" emissive="#4E83B5" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.15, 0.05, 0.05]} rotation={[0.2, 0, 0.6]}>
        <planeGeometry args={[0.9, 0.35]} />
        <meshStandardMaterial color="#6F8FB7" side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function CameraRig() {
  const progress = useStoryStore((s) => s.progress);
  const reduced = useStoryStore((s) => s.reducedMotion);

  useFrame(({ camera }) => {
    if (reduced) {
      camera.position.set(0, 0.6, 5.2);
      camera.lookAt(0, 0.2, -2);
      return;
    }
    const z = 6.2 - progress * 3.4;
    const y = 0.85 - progress * 0.55;
    const x = Math.sin(progress * Math.PI * 2) * 0.35;
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.08);
    camera.lookAt(0, 0.15 - progress * 0.2, -2.5);
  });

  return null;
}

export function QDQCWorld() {
  const progress = useStoryStore((s) => s.progress);
  const lit = THREE.MathUtils.smoothstep(progress, 0.3, 0.5);

  return (
    <>
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 6, 16]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 2]} intensity={0.85} color="#c9d7ef" />
      <pointLight position={[2.6, 2.4, -4]} intensity={1.4} color="#F7F3E9" distance={12} />
      <pointLight position={[0, 0.2, -1]} intensity={0.6 + lit} color="#C7A66A" distance={8} />

      <CameraRig />
      <Backdrop />
      <EndingHint />
      <Moon />
      <Water />
      <BridgeLamps lit={lit} />
      <Butterfly />
      <Magpie />
    </>
  );
}
