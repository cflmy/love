"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { crops, parts } from "@/data/assets";
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

/** Cubic Bezier sample for butterfly flight. */
function bezier3(
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  d: THREE.Vector3,
  t: number,
  out: THREE.Vector3,
) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  out.set(0, 0, 0);
  out.addScaledVector(a, uuu);
  out.addScaledVector(b, 3 * uu * t);
  out.addScaledVector(c, 3 * u * tt);
  out.addScaledVector(d, ttt);
  return out;
}

function dampToward(current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, dt);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, dt);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, dt);
}

function Backdrop() {
  const texture = useTexture(crops.heroDesktop);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = useRef<THREE.Mesh>(null);
  const progress = useStoryStore((s) => s.progress);
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const fade =
    1 -
    THREE.MathUtils.smoothstep(past, 0.05, 0.35) +
    THREE.MathUtils.smoothstep(present, 0.7, 1) * 0.35;
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    // sky / far plate — slowest parallax
    target.set(meet * -0.15, 0.2 - progress * 0.35 - meet * 0.08, -9.2);
    dampToward(mesh.current.position, target, 1.2, dt);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.82 * reveal * Math.max(0.12, fade);
  });

  return (
    <mesh ref={mesh} position={[0, 0.2, -9.2]} scale={[15.5, 8.7, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.82} depthWrite={false} />
    </mesh>
  );
}

function FarMountains() {
  const texture = useTexture(crops.bridgeNight);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const show = reveal * (1 - THREE.MathUtils.smoothstep(past, 0.05, 0.4));
    target.set(meet * -0.35, -0.35 - meet * 0.12, -7.4);
    dampToward(mesh.current.position, target, 1.8, dt);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = show * (0.28 + meet * 0.22);
  });

  return (
    <mesh ref={mesh} position={[0, -0.35, -7.4]} scale={[13.2, 5.8, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.35} depthWrite={false} />
    </mesh>
  );
}

function NearMountains() {
  const texture = useTexture(crops.bridgeFull);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const show = reveal * (1 - THREE.MathUtils.smoothstep(past, 0.08, 0.45));
    target.set(meet * -0.55, -0.55 - meet * 0.18, -5.6);
    dampToward(mesh.current.position, target, 2.4, dt);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = show * (0.22 + THREE.MathUtils.smoothstep(meet, 0.05, 0.4) * 0.35);
  });

  return (
    <mesh ref={mesh} position={[0, -0.55, -5.6]} scale={[11.4, 5.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.3} depthWrite={false} />
    </mesh>
  );
}

function MistBand() {
  const mesh = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    target.set(Math.sin(t * 0.12) * 0.4 + meet * -0.7, -0.85 + Math.sin(t * 0.2) * 0.05, -4.2);
    dampToward(mesh.current.position, target, 3.2, dt);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = reveal * (0.12 + meet * 0.18);
  });

  return (
    <mesh ref={mesh} position={[0, -0.85, -4.2]} scale={[14, 2.4, 1]} rotation={[0.08, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#9eb6d4" transparent opacity={0.16} depthWrite={false} />
    </mesh>
  );
}

function PastPlate() {
  const texture = useTexture(crops.pastMuyun);
  texture.colorSpace = THREE.SRGBColorSpace;
  const past = useChapterLocal("past");
  const reveal = useStoryStore((s) => s.worldReveal);
  const opacity =
    THREE.MathUtils.smoothstep(past, 0.02, 0.25) *
    (1 - THREE.MathUtils.smoothstep(past, 0.88, 1)) *
    0.72 *
    reveal;

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
  const texture = useTexture(crops.meetBridge);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const awake = THREE.MathUtils.smoothstep(meet, 0.55, 0.92);
    target.set(0, -0.25 - meet * 0.08, -3.05);
    dampToward(mesh.current.position, target, 4.2, dt);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    // light sweep feel via opacity + slight brightness — not a hard fade-in
    mat.opacity = reveal * (0.12 + THREE.MathUtils.smoothstep(meet, 0.08, 0.35) * 0.25 + awake * 0.35);
  });

  return (
    <mesh ref={mesh} position={[0, -0.25, -3.05]} scale={[8.6, 5.4, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={0.2} depthWrite={false} />
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
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    const breath = 1 + Math.sin(clock.elapsedTime * 0.4) * 0.015;
    const myth = 1 + past * 0.25;
    ref.current.scale.setScalar(breath * (0.7 + reveal * 0.3) * myth);
    target.set(2.55 - progress * 0.55 - meet * 0.35, 2.55 + progress * 0.2 + past * 0.2 + meet * 0.08, -6.2);
    dampToward(ref.current.position, target, 1.1, dt);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.22 + reveal * 0.7;
    mat.color.set(past > 0.2 ? "#FFE6B8" : "#F7F3E9");
  });

  return (
    <mesh ref={ref} position={[2.55, 2.55, -6.2]}>
      <circleGeometry args={[1.05, 64]} />
      <meshBasicMaterial color="#F7F3E9" transparent opacity={0.92} />
    </mesh>
  );
}

function Water() {
  const ref = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    target.set(meet * -0.25, -1.55 + Math.sin(clock.elapsedTime * 0.55) * 0.03, -2.1);
    dampToward(ref.current.position, target, 3.5, dt);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.color.set(past > 0.15 ? "#2a1848" : "#1a3358");
    mat.emissive.set("#C7A66A");
    mat.emissiveIntensity = THREE.MathUtils.smoothstep(meet, 0.6, 0.95) * 0.18;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.05, 0, 0]} position={[0, -1.55, -2.1]}>
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
        // light sweep left → center → right
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

function ForegroundBranch() {
  const textures = useTexture([...parts.floaters.slice(0, 2)]);
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  const group = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!group.current) return;
    target.set(-2.8 + meet * -0.9, 0.9 - meet * 0.35, 1.35);
    dampToward(group.current.position, target, 6.5, dt);
    group.current.rotation.z = -0.25 - meet * 0.15;
    group.current.visible = reveal > 0.15;
  });

  return (
    <group ref={group} position={[-2.8, 0.9, 1.35]}>
      {textures.map((map, i) => (
        <mesh key={i} position={[i * 0.55, i * -0.2, 0]} scale={[0.9 + i * 0.15, 0.55 + i * 0.1, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={map} transparent depthWrite={false} opacity={0.55} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function SpriteDrift() {
  const group = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const textures = useTexture([...parts.floaters.slice(0, 5)]);
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });

  const seeds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        x: -3.5 + i * 1.6,
        y: 0.2 + (i % 3) * 0.55,
        z: -1.8 - (i % 2) * 0.4,
        s: 0.35 + (i % 3) * 0.12,
        speed: 0.4 + i * 0.08,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const show = reveal * (0.35 + meet * 0.45);
    group.current.visible = show > 0.05;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const seed = seeds[i];
      mesh.position.x = seed.x + Math.sin(t * seed.speed + i) * 0.35 + meet * -0.4;
      mesh.position.y = seed.y + Math.cos(t * 0.55 + i) * 0.2;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = show * (0.35 + (i % 3) * 0.12);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((seed, i) => (
        <mesh key={i} position={[seed.x, seed.y, seed.z]} scale={[seed.s * 1.4, seed.s, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={textures[i]}
            transparent
            depthWrite={false}
            opacity={0.4}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Butterfly() {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const textures = useTexture([...parts.butterflyFlight]);
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });

  const path = useMemo(
    () => ({
      a: new THREE.Vector3(4.2, 0.35, 1.6),
      b: new THREE.Vector3(2.6, 1.35, 0.4),
      c: new THREE.Vector3(1.1, 0.15, -0.55),
      d: new THREE.Vector3(0.35, 0.55, -1.05),
    }),
    [],
  );
  const pos = useMemo(() => new THREE.Vector3(), []);
  const prev = useMemo(() => new THREE.Vector3(4.2, 0.35, 1.6), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!group.current || !mat.current) return;
    const t = clock.elapsedTime;
    // wing flap via texture cycle — slightly faster mid-flight
    const speed = 8 + Math.sin(meet * Math.PI) * 4;
    const frame = Math.floor(t * speed) % textures.length;
    mat.current.map = textures[frame];
    mat.current.needsUpdate = true;

    // Non-linear easing along Bezier (slow start / settle near bridge)
    const u = THREE.MathUtils.smoothstep(meet, 0.08, 0.78);
    const flight = u * u * (3 - 2 * u);
    bezier3(path.a, path.b, path.c, path.d, flight, target);
    target.y += Math.sin(t * 1.45 + meet * 4) * 0.1;
    dampToward(pos, target, 7.5, dt);

    const dx = pos.x - prev.x;
    const dy = pos.y - prev.y;
    prev.copy(pos);
    group.current.position.copy(pos);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, Math.atan2(dy, Math.max(0.001, -dx)) * 0.35, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.65 - meet * 0.4, 3, dt);
    const breath = 0.52 + reveal * 0.12 + Math.sin(t * 2.2) * 0.02;
    group.current.scale.setScalar(breath);
    group.current.visible = reveal > 0.2 && meet > 0.05 && meet < 0.98;
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[1.15, 0.72]} />
        <meshBasicMaterial
          ref={mat}
          map={textures[0]}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Magpie() {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const meet = useChapterLocal("meeting");
  const textures = useTexture([...parts.magpieFlight]);
  textures.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace;
  });
  const target = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(-5.2, 1.8, -4.5), []);

  useFrame(({ clock }, dt) => {
    if (!ref.current || !mat.current) return;
    // Distance reveal: tiny far silhouette → approach → perch
    const appear = THREE.MathUtils.smoothstep(meet, 0.35, 0.52);
    const approach = THREE.MathUtils.smoothstep(meet, 0.48, 0.88);
    const t = clock.elapsedTime;
    const frame = Math.floor(t * (7 + approach * 4)) % textures.length;
    mat.current.map = textures[frame];
    mat.current.needsUpdate = true;

    target.set(
      THREE.MathUtils.lerp(-5.2, -0.2, approach),
      THREE.MathUtils.lerp(1.85, 0.62, approach) + Math.cos(t * 0.9) * 0.06 * (1 - approach),
      THREE.MathUtils.lerp(-4.6, -1.05, approach),
    );
    dampToward(pos, target, 3.8, dt);
    ref.current.position.copy(pos);
    ref.current.visible = appear > 0.02 && meet < 0.98;
    // far = small / soft; near = full size
    const s = THREE.MathUtils.lerp(0.12, 0.58, appear * (0.35 + approach * 0.65));
    ref.current.scale.setScalar(s);
    mat.current.opacity = 0.35 + appear * 0.65;
    ref.current.rotation.y = 0.75 - approach * 0.35;
  });

  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[1.25, 0.78]} />
        <meshBasicMaterial
          ref={mat}
          map={textures[0]}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
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

/**
 * Camera shot script — meeting chapter is the cinematic gate.
 * Other chapters keep a quieter path so we do not over-animate everything equally.
 */
function CameraRig() {
  const progress = useStoryStore((s) => s.progress);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const journey = useChapterLocal("journey");
  const camPos = useMemo(() => new THREE.Vector3(0, 0.95, 8.2), []);
  const look = useMemo(() => new THREE.Vector3(0, 0.15, -2.4), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const posTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, dt) => {
    if (reduced) {
      camera.position.set(0, 0.6, 5.2);
      camera.lookAt(0, 0.2, -2);
      return;
    }

    const portalZ = THREE.MathUtils.lerp(8.6, 6.2, reveal);

    // Meeting shot script
    const establish = 1 - THREE.MathUtils.smoothstep(meet, 0.12, 0.28);
    const follow = THREE.MathUtils.smoothstep(meet, 0.18, 0.48);
    const revealMagpie = THREE.MathUtils.smoothstep(meet, 0.42, 0.62);
    const bridgePush = THREE.MathUtils.smoothstep(meet, 0.62, 0.9);
    const settle = THREE.MathUtils.smoothstep(meet, 0.88, 1);

    const meetX =
      Math.sin(meet * Math.PI) * -0.55 * follow +
      revealMagpie * 0.45 +
      bridgePush * -0.15;
    const meetY =
      1.05 * establish +
      THREE.MathUtils.lerp(0.85, 0.55, follow) +
      revealMagpie * 0.12 -
      bridgePush * 0.22 +
      settle * 0.08;
    const meetZ =
      portalZ -
      progress * 2.4 -
      follow * 0.85 +
      revealMagpie * 0.55 -
      bridgePush * 1.35 +
      settle * 0.25;

    const mythLift = THREE.MathUtils.smoothstep(past, 0.2, 0.8) * 0.45;
    const climaxPush = THREE.MathUtils.smoothstep(journey, 0.7, 0.92) * 1.35;
    const hushPull = journey > 0.92 ? (journey - 0.92) * 2.5 : 0;

    posTarget.set(
      meetX + Math.sin(progress * Math.PI * 2) * 0.18 + past * 0.2 + Math.sin(journey * Math.PI) * 0.4,
      meetY - progress * 0.35 + mythLift + climaxPush * 0.12,
      meetZ - climaxPush + hushPull,
    );

    lookTarget.set(
      meet * 0.15 + Math.sin(meet * Math.PI) * 0.2,
      0.12 - progress * 0.12 + mythLift * 0.2 - bridgePush * 0.08,
      -2.2 - bridgePush * 0.45,
    );

    // Temporal lag: camera lags behind fast scroll
    dampToward(camPos, posTarget, 2.8, dt);
    dampToward(look, lookTarget, 3.4, dt);
    camera.position.copy(camPos);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      Math.sin(meet * Math.PI) * 0.025 + Math.sin(journey * Math.PI) * 0.02,
      2,
      dt,
    );
  });

  return null;
}

export function QDQCWorld() {
  const meet = useChapterLocal("meeting");
  const lit = THREE.MathUtils.smoothstep(meet, 0.55, 0.94);
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
      <FarMountains />
      <NearMountains />
      <MistBand />
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
      <ForegroundBranch />
      {!reduced && <SpriteDrift />}
    </>
  );
}
