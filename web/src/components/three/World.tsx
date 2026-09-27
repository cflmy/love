"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { crops, parts } from "@/data/assets";
import { chapterProgressBounds } from "@/data/chapters";
import { MEETING_SHOTS, smoothstep as shotSmooth } from "@/data/meetingShots";
import { useStoryStore } from "@/store/story";
import { ScrollPanPlate, SubjectBillboard } from "./ScrollPanPlate";

/**
 * Persistent cinematic world — clear depth, one subject hierarchy.
 * Meeting (G1) owns the night river set; later acts swap atmosphere, not collage.
 *
 * Z (camera ~8 → look −2):
 *   sky −14 · moon −11 · far ridge −9 · mist −6.5 · water −2 · bridge −2.2 · creatures · fg +2
 */

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

/** Scroll-driven depth layer — different mul / damp = temporal lag. */
function ParallaxLayer({
  z,
  y = 0,
  mul = 0.25,
  damp = 2,
  children,
}: {
  z: number;
  y?: number;
  mul?: number;
  damp?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    target.set(meet * -mul, y - meet * mul * 0.12, z);
    dampToward(ref.current.position, target, damp, dt);
  });

  return (
    <group ref={ref} position={[0, y, z]}>
      {children}
    </group>
  );
}

/* ─── Environment (meeting night set) ─── */

function NightSky() {
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const leave = 1 - THREE.MathUtils.smoothstep(past, 0.02, 0.28);
  const opacity = reveal * leave * (0.34 + meet * 0.12);

  return (
    <group>
      {/* Cover + scroll-pan at true world Z — never stretch the night plate */}
      <ScrollPanPlate
        url={crops.bridgeNight}
        progress={meet}
        z={-14}
        y={0.35}
        opacity={opacity}
        cover={1.28}
        panAxis="auto"
        damp={1.4}
        color="#7a8eaa"
      />
      <mesh position={[0, 4.6, -13.7]} scale={[28, 6, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#050810" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Moon() {
  const ref = useRef<THREE.Group>(null);
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    const breath = 1 + Math.sin(clock.elapsedTime * 0.35) * 0.012;
    // Opposite drift vs camera track — depth cue
    target.set(2.2 + meet * 0.65, 2.35 + meet * 0.06 + past * 0.15, -11);
    dampToward(ref.current.position, target, 1.0, dt);
    ref.current.scale.setScalar(breath * (0.75 + reveal * 0.25) * (1 + past * 0.2));
    ref.current.visible = reveal > 0.05;
  });

  return (
    <group ref={ref} position={[2.2, 2.35, -11]}>
      <mesh>
        <circleGeometry args={[0.95, 64]} />
        <meshBasicMaterial color="#F7F3E9" transparent opacity={0.92} depthWrite={false} />
      </mesh>
      <mesh scale={1.55}>
        <circleGeometry args={[0.95, 48]} />
        <meshBasicMaterial color="#c9d7ef" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Dark geometric ridges — readable silhouette depth without photo stacking. */
function MountainRidges() {
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const far = useRef<THREE.Group>(null);
  const near = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const farT = useMemo(() => new THREE.Vector3(), []);
  const nearT = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const leave = 1 - THREE.MathUtils.smoothstep(past, 0.04, 0.35);
    if (far.current) {
      farT.set(meet * -0.22, -1.15, -9);
      dampToward(far.current.position, farT, 1.5, dt);
      far.current.visible = reveal * leave > 0.05;
      far.current.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.material && "opacity" in m.material) {
          (m.material as THREE.MeshStandardMaterial).opacity = reveal * leave * 0.92;
        }
      });
    }
    if (near.current) {
      nearT.set(meet * -0.55, -1.35, -6.2);
      dampToward(near.current.position, nearT, 2.4, dt);
      near.current.visible = reveal * leave > 0.05;
      near.current.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.material && "opacity" in m.material) {
          (m.material as THREE.MeshStandardMaterial).opacity = reveal * leave * 0.95;
        }
      });
    }
  });

  return (
    <>
      <group ref={far} position={[0, -1.15, -9]}>
        <mesh position={[-3.2, 0.4, 0]} rotation={[0, 0.15, 0]} scale={[7, 3.2, 1.2]}>
          <coneGeometry args={[1, 1.4, 4]} />
          <meshStandardMaterial color="#0e182c" transparent opacity={0.92} roughness={0.95} metalness={0.05} depthWrite />
        </mesh>
        <mesh position={[0.4, 0.55, -0.4]} rotation={[0, -0.1, 0]} scale={[8.5, 3.8, 1.4]}>
          <coneGeometry args={[1, 1.5, 5]} />
          <meshStandardMaterial color="#121f36" transparent opacity={0.92} roughness={0.95} metalness={0.05} depthWrite />
        </mesh>
        <mesh position={[4.2, 0.25, 0.2]} rotation={[0, 0.2, 0]} scale={[6, 2.6, 1]}>
          <coneGeometry args={[1, 1.3, 4]} />
          <meshStandardMaterial color="#0c1526" transparent opacity={0.92} roughness={0.95} metalness={0.05} depthWrite />
        </mesh>
      </group>
      <group ref={near} position={[0, -1.35, -6.2]}>
        <mesh position={[-2.4, 0.2, 0]} rotation={[0.05, 0.2, 0]} scale={[5.5, 2.4, 1.6]}>
          <coneGeometry args={[1, 1.2, 4]} />
          <meshStandardMaterial color="#172840" transparent opacity={0.95} roughness={0.9} metalness={0.08} depthWrite />
        </mesh>
        <mesh position={[2.8, 0.15, 0.3]} rotation={[0.04, -0.25, 0]} scale={[6.2, 2.2, 1.5]}>
          <coneGeometry args={[1, 1.15, 4]} />
          <meshStandardMaterial color="#1a2d48" transparent opacity={0.95} roughness={0.9} metalness={0.08} depthWrite />
        </mesh>
      </group>
    </>
  );
}

function RiverMist() {
  const mesh = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!mesh.current) return;
    const leave = 1 - THREE.MathUtils.smoothstep(past, 0.05, 0.3);
    const t = clock.elapsedTime;
    target.set(Math.sin(t * 0.1) * 0.5 + meet * -0.5, -0.55 + Math.sin(t * 0.18) * 0.04, -5.4);
    dampToward(mesh.current.position, target, 2.8, dt);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = reveal * leave * (0.1 + meet * 0.1);
  });

  return (
    <mesh ref={mesh} position={[0, -0.55, -5.4]} scale={[16, 2.8, 1]} rotation={[0.12, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#9eb6d4" transparent opacity={0.12} depthWrite={false} />
    </mesh>
  );
}

function Water() {
  const ref = useRef<THREE.Mesh>(null);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const reveal = useStoryStore((s) => s.worldReveal);
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(28, 14, 48, 24);
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const cross = shotSmooth(meet, MEETING_SHOTS.crossing.start, MEETING_SHOTS.crossing.end);
    const bridge = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
    const leave = 1 - THREE.MathUtils.smoothstep(past, 0.08, 0.4);
    const pos = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.45 + t * 0.7) * 0.04 +
        Math.sin(y * 0.6 + t * 0.9) * 0.025 +
        Math.sin(x * 1.1 + y * 0.4 + t * 1.4) * 0.015 * cross;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    ref.current.position.set(meet * -0.2, -1.48, -2.4);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = reveal * leave * 0.72;
    mat.color.set(past > 0.15 ? "#241438" : "#142848");
    mat.emissiveIntensity = cross * 0.05 + bridge * 0.16;
  });

  return (
    <mesh ref={ref} geometry={geom} rotation={[-Math.PI / 2.08, 0, 0]} position={[0, -1.48, -2.4]} receiveShadow>
      <meshStandardMaterial
        color="#142848"
        metalness={0.72}
        roughness={0.28}
        transparent
        opacity={0.72}
        emissive="#C7A66A"
        emissiveIntensity={0}
      />
    </mesh>
  );
}

function MagpieBridge({ lit }: { lit: number }) {
  const group = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  const lamps = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ x: -2.4 + i * 0.8 })),
    [],
  );

  const leave = 1 - THREE.MathUtils.smoothstep(past, 0.06, 0.32);
  const awake = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
  const plateOp =
    reveal * leave * (0.18 + THREE.MathUtils.smoothstep(meet, 0.1, 0.4) * 0.32 + awake * 0.42);

  useFrame((_, dt) => {
    if (!group.current) return;
    target.set(0, -0.72 - meet * 0.06, -2.15);
    dampToward(group.current.position, target, 3.6, dt);
    group.current.visible = reveal * leave > 0.04;
  });

  return (
    <group ref={group} position={[0, -0.72, -2.15]}>
      {/* Intrinsic bridge art — subject, not stretched wallpaper */}
      <SubjectBillboard
        url={crops.meetBridge}
        position={[0, 0.95, -0.12]}
        height={2.85}
        opacity={plateOp}
        progress={meet}
        parallax={0.2}
      />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <torusGeometry args={[2.6, 0.055, 10, 64, Math.PI]} />
        <meshStandardMaterial color="#243a5c" metalness={0.35} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.4, 0.55]} />
        <meshStandardMaterial color="#1a2a44" metalness={0.25} roughness={0.8} />
      </mesh>
      {lamps.map((lamp, i) => {
        const on = THREE.MathUtils.smoothstep(lit, i / lamps.length, (i + 1.15) / lamps.length);
        return (
          <group key={i} position={[lamp.x, 0.42, 0.12]}>
            <mesh>
              <sphereGeometry args={[0.045 + on * 0.028, 12, 12]} />
              <meshBasicMaterial color="#C7A66A" transparent opacity={0.2 + on * 0.8} />
            </mesh>
            {on > 0.25 ? (
              <pointLight color="#C7A66A" intensity={on * 0.45} distance={2} decay={2} />
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function ForegroundBranch() {
  const group = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);
  const leave = 1 - THREE.MathUtils.smoothstep(past, 0.1, 0.4);
  const opacity = reveal * leave * 0.55;

  useFrame((_, dt) => {
    if (!group.current) return;
    target.set(-3.1 + meet * -1.5, 0.55 - meet * 0.4, 2.1);
    dampToward(group.current.position, target, 5.8, dt);
    group.current.rotation.z = -0.28 - meet * 0.18;
    group.current.visible = reveal * leave > 0.12;
  });

  return (
    <group ref={group} position={[-3.1, 0.55, 2.1]}>
      <SubjectBillboard
        url={parts.floaters[0]}
        position={[0, 0, 0]}
        height={0.95}
        opacity={opacity}
        progress={meet}
        parallax={0.55}
      />
    </group>
  );
}

/* ─── Creatures ─── */

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
      a: new THREE.Vector3(-4.2, -0.35, 1.6),
      b: new THREE.Vector3(-2.2, 0.75, 0.35),
      c: new THREE.Vector3(-0.35, 0.05, -0.55),
      d: new THREE.Vector3(0.38, 0.42, -1.35),
    }),
    [],
  );
  const pos = useMemo(() => new THREE.Vector3(), []);
  const prev = useMemo(() => new THREE.Vector3(-4.2, -0.35, 1.6), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    if (!group.current || !mat.current) return;
    const t = clock.elapsedTime;
    const settle = shotSmooth(meet, MEETING_SHOTS.meeting.start, MEETING_SHOTS.title.end);
    const speed = (8 + Math.sin(meet * Math.PI) * 4) * (1 - settle * 0.65);
    const frame = Math.floor(t * speed) % textures.length;
    mat.current.map = textures[frame];
    mat.current.needsUpdate = true;

    const u = shotSmooth(meet, MEETING_SHOTS.butterfly.start, MEETING_SHOTS.bridge.start);
    const flight = u * u * (3 - 2 * u);
    bezier3(path.a, path.b, path.c, path.d, flight, target);
    target.y += Math.sin(t * 1.45 + meet * 4) * 0.08 * (1 - settle);
    dampToward(pos, target, 7.2 - settle * 3, dt);

    const dx = pos.x - prev.x;
    const dy = pos.y - prev.y;
    prev.copy(pos);
    group.current.position.copy(pos);
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      Math.atan2(dy, Math.max(0.001, dx)) * 0.4,
      4,
      dt,
    );
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0.5 - meet * 0.3, 3, dt);
    group.current.scale.setScalar(0.5 + reveal * 0.1 + Math.sin(t * 2.1) * 0.015);
    group.current.visible = reveal > 0.2 && meet > MEETING_SHOTS.butterfly.start - 0.04;
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[1.05, 0.66]} />
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
  const pos = useMemo(() => new THREE.Vector3(5.2, 1.85, -5.2), []);

  useFrame(({ clock }, dt) => {
    if (!ref.current || !mat.current) return;
    const appear = shotSmooth(meet, MEETING_SHOTS.magpieHint.start, MEETING_SHOTS.magpieReveal.start);
    const approach = shotSmooth(meet, MEETING_SHOTS.magpieReveal.start, MEETING_SHOTS.meeting.end);
    const t = clock.elapsedTime;
    const frame = Math.floor(t * (7 + approach * 4)) % textures.length;
    mat.current.map = textures[frame];
    mat.current.needsUpdate = true;

    target.set(
      THREE.MathUtils.lerp(5.2, -0.2, approach),
      THREE.MathUtils.lerp(1.85, 0.5, approach) + Math.cos(t * 0.9) * 0.05 * (1 - approach),
      THREE.MathUtils.lerp(-5.2, -1.25, approach),
    );
    dampToward(pos, target, 3.6, dt);
    ref.current.position.copy(pos);
    ref.current.visible = appear > 0.02;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(0.08, 0.52, appear * (0.3 + approach * 0.7)));
    mat.current.opacity = 0.25 + appear * 0.75;
    ref.current.rotation.y = -0.8 + approach * 0.35;
  });

  return (
    <group ref={ref}>
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

/* ─── Later acts: scroll-pan backdrops + cut-out subjects (no stretch) ─── */

function ChapterAtmosphere() {
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const reveal = useStoryStore((s) => s.worldReveal);

  const pastOp =
    THREE.MathUtils.smoothstep(past, 0.04, 0.28) *
    (1 - THREE.MathUtils.smoothstep(past, 0.88, 1)) *
    0.62 *
    reveal;
  const presentOp = THREE.MathUtils.smoothstep(present, 0.06, 0.3) * 0.52 * reveal;
  const journeyOp =
    THREE.MathUtils.smoothstep(journey, 0.04, 0.22) *
    (1 - THREE.MathUtils.smoothstep(journey, 0.9, 1)) *
    0.55 *
    reveal;

  const pastSubject =
    THREE.MathUtils.smoothstep(past, 0.12, 0.35) *
    (1 - THREE.MathUtils.smoothstep(past, 0.82, 1)) *
    reveal;
  const presentSubject = THREE.MathUtils.smoothstep(present, 0.14, 0.4) * reveal;
  const journeySubject =
    THREE.MathUtils.smoothstep(journey, 0.1, 0.35) *
    (1 - THREE.MathUtils.smoothstep(journey, 0.85, 1)) *
    reveal;

  return (
    <>
      {pastOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.pastMuyun}
          progress={past}
          z={-8.2}
          y={0.1}
          opacity={pastOp}
          cover={1.26}
          panAxis="auto"
          damp={2.2}
        />
      ) : null}
      {pastSubject > 0.02 ? (
        <>
          <SubjectBillboard
            url={parts.magpieSpread}
            position={[-1.55, 0.55, -4.2]}
            height={1.35}
            opacity={pastSubject * 0.85}
            progress={past}
            parallax={0.85}
          />
          <SubjectBillboard
            url={parts.floaters[5]}
            position={[2.1, 1.05, -3.4]}
            height={0.55}
            opacity={pastSubject * 0.55}
            progress={past}
            parallax={1.15}
          />
        </>
      ) : null}

      {presentOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.lifeMeet}
          progress={present}
          z={-7.8}
          y={0}
          opacity={presentOp}
          cover={1.24}
          panAxis="auto"
          damp={2.4}
        />
      ) : null}
      {presentSubject > 0.02 ? (
        <>
          <SubjectBillboard
            url={parts.butterflyFront}
            position={[1.7, 0.35, -3.6]}
            height={0.95}
            opacity={presentSubject * 0.7}
            progress={present}
            parallax={0.95}
          />
          <SubjectBillboard
            url={parts.floaters[2]}
            position={[-2.0, 0.9, -2.8]}
            height={0.48}
            opacity={presentSubject * 0.5}
            progress={present}
            parallax={1.3}
          />
        </>
      ) : null}

      {journeyOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.roadBeforeSunset}
          progress={journey}
          z={-7.5}
          y={0.05}
          opacity={journeyOp}
          cover={1.25}
          panAxis="auto"
          damp={2.0}
        />
      ) : null}
      {journeySubject > 0.02 ? (
        <SubjectBillboard
          url={parts.magpiePerch}
          position={[0.35, 0.15, -3.8]}
          height={1.15}
          opacity={journeySubject * 0.75}
          progress={journey}
          parallax={0.7}
        />
      ) : null}
    </>
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
    ref.current.visible = show > 0.02;
    ref.current.position.set(0.15, 1.4 - (hush ? 0.4 : journey * 0.65), -5);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.4 + show * 0.5;
    glow.current.intensity = show * (hush ? 1.8 : 1 + journey * 0.8);
    glow.current.position.copy(ref.current.position);
  });

  return (
    <>
      <mesh ref={ref}>
        <circleGeometry args={[0.7, 40]} />
        <meshBasicMaterial color="#E8A45A" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <pointLight ref={glow} color="#E8A45A" intensity={0} distance={14} />
    </>
  );
}

function WindCloudInfinity() {
  const group = useRef<THREE.Group>(null);
  const past = useChapterLocal("past");

  useFrame(({ clock }) => {
    if (!group.current) return;
    const show = THREE.MathUtils.smoothstep(past, 0.45, 0.85);
    group.current.visible = show > 0.02;
    group.current.scale.setScalar(0.55 + show * 0.55);
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.06;
    group.current.children.forEach((child, i) => {
      ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = show * (0.3 + (i % 2) * 0.2);
    });
  });

  return (
    <group ref={group} position={[0, 0.9, -3.5]}>
      <mesh position={[-0.5, 0, 0]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[0.5, 0.018, 8, 48]} />
        <meshBasicMaterial color="#6F8FB7" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -0.2]}>
        <torusGeometry args={[0.5, 0.018, 8, 48]} />
        <meshBasicMaterial color="#C7A66A" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function Atmosphere() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");

  useFrame(() => {
    if (!fogRef.current) return;
    const c = fogRef.current.color;
    if (journey > 0.05) {
      if (journey > 0.9) c.set("#12182a");
      else c.setRGB(0.1 + journey * 0.08, 0.04 + journey * 0.03, 0.03);
    } else if (present > 0.05) c.set("#1a2438");
    else if (past > 0.05) c.setRGB(0.05 + past * 0.1, 0.02, 0.08 + past * 0.08);
    else c.set("#050810");
    // denser fog = clearer depth falloff
    fogRef.current.density = 0.045 + meet * 0.01 + past * 0.015;
  });

  return <fogExp2 ref={fogRef} attach="fog" args={["#050810", 0.048]} />;
}

function CameraRig() {
  const progress = useStoryStore((s) => s.progress);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const journey = useChapterLocal("journey");
  const camPos = useMemo(() => new THREE.Vector3(0, 0.95, 8.2), []);
  const look = useMemo(() => new THREE.Vector3(0, 0.1, -2.2), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const posTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, dt) => {
    const portalZ = THREE.MathUtils.lerp(8.8, 6.4, reveal);
    const portrait = size.height > size.width;
    const fovTarget = portrait ? 50 : 40;
    const persp = camera as THREE.PerspectiveCamera;
    if ("fov" in persp && Math.abs(persp.fov - fovTarget) > 0.05) {
      persp.fov = THREE.MathUtils.damp(persp.fov, fovTarget, 2, dt);
      persp.updateProjectionMatrix();
    }

    const follow = shotSmooth(meet, MEETING_SHOTS.butterfly.start, MEETING_SHOTS.crossing.end);
    const revealMagpie = shotSmooth(meet, MEETING_SHOTS.magpieHint.start, MEETING_SHOTS.magpieReveal.end);
    const bridgePush = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
    const settle = shotSmooth(meet, MEETING_SHOTS.meeting.start, MEETING_SHOTS.title.end);
    const establish = 1 - shotSmooth(meet, 0.08, 0.2);

    const amp = reduced ? 0.32 : 1;
    // Stronger Z travel so layers separate in perspective
    const meetX = (follow * -0.95 + revealMagpie * 1.15 + bridgePush * -0.25) * amp;
    const meetY =
      (0.95 * establish + THREE.MathUtils.lerp(0.85, 0.42, follow) + revealMagpie * 0.15 - bridgePush * 0.32 + settle * 0.12) *
      (reduced ? 0.65 : 1);
    const meetZ =
      portalZ -
      follow * 1.35 * amp +
      revealMagpie * 0.9 * amp -
      bridgePush * 2.1 * amp +
      settle * 0.4 -
      (reduced ? 0 : meet * 0.35);

    const mythLift = shotSmooth(past, 0.2, 0.8) * 0.5;
    const climaxPush = shotSmooth(journey, 0.7, 0.92) * 1.2;
    const hushPull = journey > 0.92 ? (journey - 0.92) * 2.2 : 0;

    posTarget.set(
      meetX + past * 0.15 + Math.sin(journey * Math.PI) * 0.35,
      meetY + mythLift + climaxPush * 0.1 - progress * 0.08,
      meetZ - climaxPush + hushPull,
    );
    lookTarget.set(
      meet * 0.12 * amp,
      -0.05 - bridgePush * 0.12 + mythLift * 0.15,
      -2.3 - bridgePush * 0.55,
    );

    dampToward(camPos, posTarget, reduced ? 4.2 : 2.4, dt);
    dampToward(look, lookTarget, reduced ? 4.8 : 3.0, dt);
    camera.position.copy(camPos);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      reduced ? 0 : Math.sin(meet * Math.PI) * 0.02,
      2,
      dt,
    );
  });

  return null;
}

export function QDQCWorld() {
  const meet = useChapterLocal("meeting");
  const lit = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
  const chapterId = useStoryStore((s) => s.chapterId);
  const showMeetingCast = chapterId === "opening" || chapterId === "meeting";

  return (
    <>
      <color attach="background" args={["#050810"]} />
      <Atmosphere />
      <ambientLight intensity={0.28} />
      <directionalLight position={[3.5, 5.5, 2]} intensity={0.55} color="#a8bdd8" />
      <pointLight position={[2.4, 2.5, -8]} intensity={0.9} color="#F7F3E9" distance={18} decay={2} />
      <pointLight position={[0, 0.4, -1.5]} intensity={0.35 + lit * 0.85} color="#C7A66A" distance={8} decay={2} />

      <CameraRig />

      {/* Meeting spatial set — one hierarchy, no collage */}
      <NightSky />
      <Moon />
      <MountainRidges />
      <RiverMist />
      <Water />
      <MagpieBridge lit={lit} />
      {showMeetingCast ? (
        <>
          <Butterfly />
          <Magpie />
          <ForegroundBranch />
        </>
      ) : null}

      {/* Later acts: single atmosphere plate each */}
      <ChapterAtmosphere />
      <HeldSun />
      <WindCloudInfinity />
    </>
  );
}
