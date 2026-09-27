"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { crops } from "@/data/assets";
import { chapterProgressBounds } from "@/data/chapters";
import { MEETING_SHOTS, smoothstep as shotSmooth } from "@/data/meetingShots";
import { useStoryStore } from "@/store/story";
import { CinematicPanel, DoorPanel, ScrollPanPlate } from "./ScrollPanPlate";

/**
 * Persistent cinematic world — camera + supplied art only.
 * Depth comes from scroll-pan plates + cinematic panel enter/exit.
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

function dampToward(current: THREE.Vector3, target: THREE.Vector3, lambda: number, dt: number) {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, dt);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, dt);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, dt);
}

function band(local: number, a: number, b: number) {
  return shotSmooth(local, a, b);
}

function leaveBand(local: number, a: number, b: number) {
  return 1 - shotSmooth(local, a, b);
}

/** Far night plate — atmosphere only, never stretched as wallpaper. */
function NightSky() {
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  // Hand off quickly so 暮云 owns early past
  const leave =
    leaveBand(meet, 0.94, 1) * (1 - THREE.MathUtils.smoothstep(past, 0, 0.08));
  const opacity = reveal * leave * (0.42 + meet * 0.18);

  return (
    <ScrollPanPlate
      url={crops.bridgeNight}
      progress={meet}
      z={-14}
      y={0.35}
      opacity={opacity}
      cover={1.22}
      panAxis="auto"
      damp={1.4}
      color="#8a9bb8"
    />
  );
}

/**
 * Act 01 · 相逢鹊渡 — spatial cinema, not opacity crossfades.
 * 1 她·渡河 (left fly-in) → 2 他·飞来 (right dive) → 3 桥上相逢 (rise + dolly).
 */
function MeetingPlate() {
  const group = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const reduced = useStoryStore((s) => s.reducedMotion);
  const target = useMemo(() => new THREE.Vector3(), []);

  // Exit during meeting coda + first breath of past — don't sit on 暮云
  const leaveMeet = leaveBand(meet, 0.93, 1);
  const leavePast = 1 - THREE.MathUtils.smoothstep(past, 0, 0.07);
  const gate = reveal * leaveMeet * leavePast;

  const sheSettle = band(meet, MEETING_SHOTS.butterfly.start - 0.02, MEETING_SHOTS.crossing.start + 0.04);
  const sheExit = band(meet, MEETING_SHOTS.magpieHint.start - 0.02, MEETING_SHOTS.magpieHint.start + 0.1);
  const sheOp = gate * sheSettle * leaveBand(meet, MEETING_SHOTS.magpieHint.start, MEETING_SHOTS.magpieHint.start + 0.12);

  const heSettle = band(meet, MEETING_SHOTS.magpieHint.start - 0.02, MEETING_SHOTS.magpieReveal.start + 0.06);
  const heExit = band(meet, MEETING_SHOTS.bridge.start - 0.02, MEETING_SHOTS.bridge.start + 0.1);
  const heOp = gate * heSettle * leaveBand(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.bridge.start + 0.12);

  const bridgeSettle = band(meet, MEETING_SHOTS.bridge.start - 0.02, MEETING_SHOTS.meeting.start);
  const bridgeExit = band(meet, 0.92, 0.98);
  const bridgeOp = gate * bridgeSettle * (1 - bridgeExit * 0.85);

  useFrame((_, dt) => {
    if (!group.current) return;
    const lift = reduced ? 0 : Math.sin(meet * Math.PI * 2) * 0.04;
    target.set(0, -0.28 - meet * 0.1 + lift, -2.35);
    dampToward(group.current.position, target, 3.2, dt);
    group.current.visible = gate > 0.04;
  });

  return (
    <group ref={group} position={[0, -0.28, -2.35]}>
      {sheOp > 0.02 ? (
        <CinematicPanel
          url={crops.meetShe}
          height={3.4}
          opacity={sheOp}
          settle={sheSettle}
          exit={sheExit}
          from={{ x: -2.9, y: -0.55, z: 1.4, rotZ: 0.1, scale: 0.78 }}
          home={{ x: -0.15, y: 0.52, z: 0, rotZ: -0.02, scale: 1 }}
          away={{ x: -2.4, y: 1.15, z: -0.9, rotZ: -0.12, scale: 0.88 }}
          damp={reduced ? 6 : 3.6}
        />
      ) : null}
      {heOp > 0.02 ? (
        <CinematicPanel
          url={crops.meetHe}
          height={3.4}
          opacity={heOp}
          settle={heSettle}
          exit={heExit}
          from={{ x: 2.8, y: 0.35, z: 1.6, rotZ: -0.12, scale: 0.76 }}
          home={{ x: 0.12, y: 0.52, z: 0, rotZ: 0.02, scale: 1 }}
          away={{ x: 2.2, y: 1.05, z: -0.85, rotZ: 0.1, scale: 0.88 }}
          damp={reduced ? 6 : 3.4}
        />
      ) : null}
      {bridgeOp > 0.02 ? (
        <CinematicPanel
          url={crops.meetBridge}
          height={3.55}
          opacity={bridgeOp}
          settle={bridgeSettle}
          exit={bridgeExit}
          from={{ x: 0, y: -1.9, z: 1.1, rotZ: 0, scale: 0.68 }}
          home={{ x: 0, y: 0.48, z: 0, rotZ: 0, scale: 1 }}
          away={{ x: 0, y: 1.4, z: -1.2, rotZ: 0, scale: 0.86 }}
          damp={reduced ? 5.5 : 3.1}
        />
      ) : null}
      {/* Broken keyed cutouts (butterfly/magpie parts) removed — jagged fringing. */}
    </group>
  );
}

/**
 * Act 02 · 前世
 * - Far 双开门 backdrop: 暮云 left | 长风 right — recessed, unstretched, for 纵深
 * - Front animation: fitGrow 暮云→长风 heroes + myth cards (must stay readable)
 */
function PastRealm() {
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const reveal = useStoryStore((s) => s.worldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);

  const enter = THREE.MathUtils.smoothstep(past, 0, 0.05);
  const leavePresent = 1 - THREE.MathUtils.smoothstep(present, 0, 0.14);
  const gate = reveal * enter * leavePresent * leaveBand(past, 0.96, 1);

  if (gate < 0.02) return null;

  const amp = reduced ? 0.45 : 1;

  // Doors soft but large enough to kill black void; still under front plates
  const doorOp = gate * 0.62;
  const doorOpen = THREE.MathUtils.smoothstep(past, 0.05, 0.7) * (reduced ? 0.4 : 1);

  // Hero animation layer — front of doors
  const muyunOp = gate * band(past, 0.02, 0.12) * leaveBand(past, 0.3, 0.38) * 0.92;
  const changfengOp = gate * band(past, 0.28, 0.38) * leaveBand(past, 0.48, 0.56) * 0.9;
  const muyunT = THREE.MathUtils.clamp((past - 0.02) / 0.32, 0, 1);
  const changfengT = THREE.MathUtils.clamp((past - 0.28) / 0.26, 0, 1);

  /** Vertical stills — 初遇 / 同游 / 相守 / 山海 float in depth */
  const cards = [
    {
      url: crops.pastTravel,
      settle: band(past, 0.5, 0.6),
      exit: band(past, 0.68, 0.76),
      op: band(past, 0.5, 0.58) * leaveBand(past, 0.7, 0.78),
      from: { x: -1.8 * amp, y: -0.8, z: 0.9, rotZ: 0.08, scale: 0.75 },
      home: { x: -0.95, y: 0.05, z: 0.2, rotZ: -0.03, scale: 1 },
      away: { x: -2.2 * amp, y: 1.1, z: -0.4, rotZ: -0.1, scale: 0.85 },
      height: 2.1,
    },
    {
      url: crops.pastMeet,
      settle: band(past, 0.58, 0.68),
      exit: band(past, 0.76, 0.84),
      op: band(past, 0.58, 0.66) * leaveBand(past, 0.78, 0.86),
      from: { x: 1.9 * amp, y: -0.6, z: 1.0, rotZ: -0.08, scale: 0.74 },
      home: { x: 0.95, y: 0.1, z: 0.15, rotZ: 0.03, scale: 1 },
      away: { x: 2.3 * amp, y: 1.0, z: -0.35, rotZ: 0.1, scale: 0.85 },
      height: 2.0,
    },
    {
      url: crops.pastHold,
      settle: band(past, 0.7, 0.8),
      exit: band(past, 0.86, 0.93),
      op: band(past, 0.7, 0.78) * leaveBand(past, 0.88, 0.95),
      from: { x: 0, y: -1.4, z: 1.2, rotZ: 0, scale: 0.7 },
      home: { x: -0.35, y: 0.2, z: 0.35, rotZ: -0.02, scale: 1 },
      away: { x: -0.8, y: 1.3, z: -0.5, rotZ: 0.05, scale: 0.88 },
      height: 2.15,
    },
    {
      url: crops.pastSeas,
      settle: band(past, 0.8, 0.9),
      exit: 0,
      op: band(past, 0.8, 0.9) * leaveBand(past, 0.96, 1),
      from: { x: 0.4, y: -1.6, z: 1.0, rotZ: 0.04, scale: 0.68 },
      home: { x: 0.4, y: 0.15, z: 0.25, rotZ: 0.02, scale: 1 },
      away: { x: 0.4, y: 0.15, z: 0.25, rotZ: 0.02, scale: 1 },
      height: 2.05,
    },
  ] as const;

  return (
    <group position={[0, 0.05, -2.8]}>
      {/* Far 双开门 — recessed L|R, never stretch, never cover heroes */}
      <DoorPanel
        url={crops.pastMuyun}
        side="left"
        progress={past}
        opacity={doorOp}
        z={-12.5}
        open={doorOpen}
        damp={reduced ? 4 : 2.2}
      />
      <DoorPanel
        url={crops.pastChangfeng}
        side="right"
        progress={past}
        opacity={doorOp}
        z={-12.2}
        open={doorOpen}
        damp={reduced ? 4 : 2.3}
      />

      {/* Animation heroes — closer z, full readability */}
      {muyunOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.pastMuyun}
          progress={muyunT}
          z={-4.6}
          y={0.12}
          opacity={muyunOp}
          cover={1.18}
          reveal="fitGrow"
          damp={2.0}
        />
      ) : null}
      {changfengOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.pastChangfeng}
          progress={changfengT}
          z={-4.3}
          y={0.08}
          opacity={changfengOp}
          cover={1.18}
          reveal="fitGrow"
          damp={2.1}
        />
      ) : null}

      {cards.map((c) => {
        const op = gate * c.op;
        if (op < 0.02) return null;
        return (
          <CinematicPanel
            key={c.url}
            url={c.url}
            height={c.height}
            opacity={op}
            settle={c.settle}
            exit={c.exit}
            from={c.from}
            home={c.home}
            away={c.away}
            damp={reduced ? 5.2 : 3.0}
          />
        );
      })}
    </group>
  );
}

/** Present / journey atmospheres — one scroll-pan each. */
function LaterAtmosphere() {
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const reveal = useStoryStore((s) => s.worldReveal);

  const presentOp =
    THREE.MathUtils.smoothstep(present, 0.04, 0.18) *
    (1 - THREE.MathUtils.smoothstep(present, 0.88, 1)) *
    0.52 *
    reveal;
  const journeyOp =
    THREE.MathUtils.smoothstep(journey, 0.04, 0.22) *
    (1 - THREE.MathUtils.smoothstep(journey, 0.9, 1)) *
    0.5 *
    reveal;

  return (
    <>
      {presentOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.lifeMeet}
          progress={present}
          z={-7.8}
          y={0}
          opacity={presentOp}
          cover={1.24}
          reveal="scan"
          damp={2.2}
        />
      ) : null}

      {journeyOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.roadBeforeSunset}
          progress={journey}
          z={-7.5}
          y={0.05}
          opacity={journeyOp}
          cover={1.22}
          reveal="scan"
          damp={2.0}
        />
      ) : null}
    </>
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
    else if (past > 0.05) c.setRGB(0.08 + past * 0.08, 0.04 + past * 0.03, 0.1 + past * 0.06);
    else c.set("#050810");
    fogRef.current.density = 0.032 + meet * 0.008 + past * 0.006;
  });

  return <fogExp2 ref={fogRef} attach="fog" args={["#050810", 0.04]} />;
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

    const approach = shotSmooth(meet, MEETING_SHOTS.butterfly.start, MEETING_SHOTS.crossing.end);
    const magpieSwing = shotSmooth(meet, MEETING_SHOTS.magpieHint.start, MEETING_SHOTS.magpieReveal.end);
    const bridgePush = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
    const settle = shotSmooth(meet, MEETING_SHOTS.meeting.start, MEETING_SHOTS.title.end);
    const establish = 1 - shotSmooth(meet, 0.08, 0.2);

    const amp = reduced ? 0.32 : 1;
    const meetX = (approach * -0.75 + magpieSwing * 0.85 + bridgePush * -0.15) * amp;
    const meetY =
      (0.95 * establish + THREE.MathUtils.lerp(0.85, 0.48, approach) - bridgePush * 0.32 + settle * 0.12) *
      (reduced ? 0.65 : 1);
    const meetZ =
      portalZ -
      approach * 1.25 * amp -
      magpieSwing * 0.55 * amp -
      bridgePush * 2.1 * amp +
      settle * 0.4 -
      (reduced ? 0 : meet * 0.22);

    const mythOrbit = Math.sin(past * Math.PI * 2) * 0.35 * amp;
    const mythLift = shotSmooth(past, 0.15, 0.85) * 0.55;
    const mythDolly = shotSmooth(past, 0.45, 0.9) * 0.9 * amp;
    const climaxPush = shotSmooth(journey, 0.7, 0.92) * 1.1;
    const hushPull = journey > 0.92 ? (journey - 0.92) * 2.2 : 0;

    posTarget.set(
      meetX + mythOrbit + Math.sin(journey * Math.PI) * 0.28,
      meetY + mythLift + climaxPush * 0.08 - progress * 0.06,
      meetZ - mythDolly - climaxPush + hushPull,
    );
    lookTarget.set(
      meet * 0.06 * amp + mythOrbit * 0.2,
      -0.02 - bridgePush * 0.12 + mythLift * 0.15,
      -2.3 - bridgePush * 0.55 - mythDolly * 0.2,
    );

    dampToward(camPos, posTarget, reduced ? 4.2 : 2.4, dt);
    dampToward(look, lookTarget, reduced ? 4.8 : 3.0, dt);
    camera.position.copy(camPos);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      reduced ? 0 : Math.sin(meet * Math.PI) * 0.02 + Math.sin(past * Math.PI * 2) * 0.012,
      2,
      dt,
    );
  });

  return null;
}

export function QDQCWorld() {
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const lit = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
  const mythGlow = THREE.MathUtils.smoothstep(past, 0.1, 0.5);

  return (
    <>
      <color attach="background" args={["#050810"]} />
      <Atmosphere />
      <ambientLight intensity={0.32 + mythGlow * 0.08} />
      <directionalLight position={[3.5, 5.5, 2]} intensity={0.45} color="#a8bdd8" />
      <pointLight position={[2.4, 2.5, -8]} intensity={0.7} color="#F7F3E9" distance={18} decay={2} />
      <pointLight position={[0, 0.5, -2]} intensity={0.2 + lit * 0.4} color="#C7A66A" distance={10} decay={2} />
      <pointLight
        position={[-1.5, 1.2, -3]}
        intensity={mythGlow * 0.55}
        color="#9C493E"
        distance={14}
        decay={2}
      />

      <CameraRig />

      <NightSky />
      <MeetingPlate />
      <PastRealm />
      <LaterAtmosphere />
    </>
  );
}
