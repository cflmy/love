"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { crops } from "@/data/assets";
import { chapterProgressBounds } from "@/data/chapters";
import {
  MEETING_PAST_HANDOFF,
  MEETING_SHOTS,
  smoothstep as shotSmooth,
} from "@/data/meetingShots";
import {
  PRESENT_STILLS,
  presentPlateOpacity,
  presentPlateT,
} from "@/data/presentShots";
import {
  JOURNEY_STILLS,
  journeyPlateOpacity,
  journeyPlateT,
} from "@/data/journeyShots";
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
  const { bridgeHoldUntil, bridgeGoneBy } = MEETING_PAST_HANDOFF;
  // Hold under title until closed 前世 doors cover — no pure-black gap
  const leave =
    leaveBand(meet, bridgeHoldUntil, bridgeGoneBy) *
    (1 - THREE.MathUtils.smoothstep(past, 0.02, 0.14));
  const opacity = reveal * leave * (0.58 + meet * 0.28);

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

  // Hold bridge under title; dissolve into closed past doors (no void, no fly-away mess)
  const { bridgeHoldUntil, bridgeGoneBy } = MEETING_PAST_HANDOFF;
  const leaveMeet = leaveBand(meet, bridgeHoldUntil, bridgeGoneBy);
  const leavePast = 1 - THREE.MathUtils.smoothstep(past, 0.02, 0.14);
  const gate = reveal * leaveMeet * leavePast;

  const sheSettle = band(meet, MEETING_SHOTS.butterfly.start - 0.02, MEETING_SHOTS.crossing.start + 0.04);
  const sheExit = band(meet, MEETING_SHOTS.magpieHint.start - 0.02, MEETING_SHOTS.magpieHint.start + 0.1);
  const sheOp = gate * sheSettle * leaveBand(meet, MEETING_SHOTS.magpieHint.start, MEETING_SHOTS.magpieHint.start + 0.12);

  const heSettle = band(meet, MEETING_SHOTS.magpieHint.start - 0.02, MEETING_SHOTS.magpieReveal.start + 0.06);
  const heExit = band(meet, MEETING_SHOTS.bridge.start - 0.02, MEETING_SHOTS.bridge.start + 0.1);
  const heOp = gate * heSettle * leaveBand(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.bridge.start + 0.12);

  const bridgeSettle = band(meet, MEETING_SHOTS.bridge.start - 0.02, MEETING_SHOTS.meeting.start);
  // Soft dissolve only — avoid chaotic upward “curtain” exit into 前世
  const bridgeExit = band(meet, bridgeHoldUntil, bridgeGoneBy) * 0.28;
  const bridgeOp = gate * bridgeSettle * leaveBand(meet, bridgeHoldUntil, bridgeGoneBy);

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
          // Soft recess, not a rising curtain into black
          away={{ x: 0, y: 0.55, z: -0.45, rotZ: 0, scale: 0.94 }}
          damp={reduced ? 5.5 : 2.6}
        />
      ) : null}
      {/* Broken keyed cutouts (butterfly/magpie parts) removed — jagged fringing. */}
    </group>
  );
}

/**
 * Act 02 · 前世
 * Closed door curtains warm under 相逢 title → then open → heroes → myth cards.
 * Preloads in late meeting so Suspense never flashes a black void.
 */
function PastRealm() {
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const reveal = useStoryStore((s) => s.worldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);
  const H = MEETING_PAST_HANDOFF;

  const preload = meet > H.preloadFrom || past > 0.001;
  if (!preload) return null;

  // Closed curtains under title, then past owns the frame
  const doorWarm = shotSmooth(meet, H.doorWarmStart, H.doorWarmEnd);
  const pastEnter = THREE.MathUtils.smoothstep(past, 0, 0.08);
  const leavePresent = 1 - THREE.MathUtils.smoothstep(present, 0, 0.06);
  const gate =
    reveal *
    Math.max(doorWarm, pastEnter) *
    leavePresent *
    leaveBand(past, 0.96, 1);

  const amp = reduced ? 0.45 : 1;

  // Open only after past owns the frame — closed curtains kill the void first
  const doorOpen =
    THREE.MathUtils.smoothstep(past, H.doorOpenStart, H.doorOpenEnd) * (reduced ? 0.35 : 1);
  // Nearly opaque when closed; soften as they open behind heroes
  const doorOp = gate * THREE.MathUtils.lerp(0.94, 0.48, doorOpen);

  // Heroes wait for curtains — no messy overlap with door art
  const heroGate = gate * THREE.MathUtils.smoothstep(past, H.heroStart - 0.02, H.heroStart + 0.06);
  const muyunOp = heroGate * band(past, H.heroStart, H.heroStart + 0.1) * leaveBand(past, 0.34, 0.42) * 0.94;
  const changfengOp = heroGate * band(past, 0.32, 0.42) * leaveBand(past, 0.5, 0.58) * 0.92;
  const muyunT = THREE.MathUtils.clamp((past - H.heroStart) / 0.3, 0, 1);
  const changfengT = THREE.MathUtils.clamp((past - 0.32) / 0.26, 0, 1);

  /** Vertical stills — 初遇 / 同游 / 相守 / 山海 float in depth */
  const cards = [
    {
      url: crops.pastTravel,
      settle: band(past, 0.52, 0.62),
      exit: band(past, 0.7, 0.78),
      op: band(past, 0.52, 0.6) * leaveBand(past, 0.72, 0.8),
      from: { x: -1.8 * amp, y: -0.55, z: 0.9, rotZ: 0.06, scale: 0.78 },
      home: { x: -0.95, y: 0.05, z: 0.2, rotZ: -0.03, scale: 1 },
      away: { x: -2.0 * amp, y: 0.85, z: -0.35, rotZ: -0.08, scale: 0.88 },
      height: 2.1,
    },
    {
      url: crops.pastMeet,
      settle: band(past, 0.6, 0.7),
      exit: band(past, 0.78, 0.86),
      op: band(past, 0.6, 0.68) * leaveBand(past, 0.8, 0.88),
      from: { x: 1.8 * amp, y: -0.45, z: 1.0, rotZ: -0.06, scale: 0.78 },
      home: { x: 0.95, y: 0.1, z: 0.15, rotZ: 0.03, scale: 1 },
      away: { x: 2.1 * amp, y: 0.8, z: -0.3, rotZ: 0.08, scale: 0.88 },
      height: 2.0,
    },
    {
      url: crops.pastHold,
      settle: band(past, 0.72, 0.82),
      exit: band(past, 0.88, 0.94),
      op: band(past, 0.72, 0.8) * leaveBand(past, 0.9, 0.96),
      from: { x: 0, y: -1.1, z: 1.15, rotZ: 0, scale: 0.74 },
      home: { x: -0.3, y: 0.18, z: 0.35, rotZ: -0.02, scale: 1 },
      away: { x: -0.7, y: 1.05, z: -0.4, rotZ: 0.04, scale: 0.9 },
      height: 2.15,
    },
    {
      url: crops.pastSeas,
      settle: band(past, 0.82, 0.92),
      exit: 0,
      op: band(past, 0.82, 0.92) * leaveBand(past, 0.96, 1),
      from: { x: 0.35, y: -1.2, z: 1.0, rotZ: 0.03, scale: 0.72 },
      home: { x: 0.35, y: 0.12, z: 0.25, rotZ: 0.02, scale: 1 },
      away: { x: 0.35, y: 0.12, z: 0.25, rotZ: 0.02, scale: 1 },
      height: 2.05,
    },
  ] as const;

  return (
    <group position={[0, 0.05, -2.8]}>
      {/* Far 双开门 — closed first to cover void, then gentle open */}
      <DoorPanel
        url={crops.pastMuyun}
        side="left"
        progress={Math.max(past, doorWarm * 0.08)}
        opacity={doorOp}
        z={-12.5}
        open={doorOpen}
        damp={reduced ? 4 : 2.0}
      />
      <DoorPanel
        url={crops.pastChangfeng}
        side="right"
        progress={Math.max(past, doorWarm * 0.08)}
        opacity={doorOp}
        z={-12.2}
        open={doorOpen}
        damp={reduced ? 4 : 2.1}
      />

      {/* Heroes — after curtains settled; always mounted once preloaded */}
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

      {cards.map((c) => {
        const op = gate * THREE.MathUtils.smoothstep(past, 0.48, 0.54) * c.op;
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

/**
 * Soft bases per act — never reuse 今世缘起 after present ends.
 * · present → lifeMeet
 * · journey → roadBeforeSunset「你别担心，太阳落山前我一定回来」
 * Add1 幕布 = DOM EraFlash; soft backdrop = Add1Backdrop after 我们 opens.
 */
function ChapterUnderlays() {
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const reveal = useStoryStore((s) => s.worldReveal);

  const presentOp =
    reveal *
    THREE.MathUtils.smoothstep(present, 0.01, 0.05) *
    leaveBand(present, 0.97, 1) *
    0.38;

  // Hold until EraFlash Add1 幕布 (journey local > 0.96) takes the seam
  const journeyOp =
    reveal *
    THREE.MathUtils.smoothstep(journey, 0.01, 0.08) *
    leaveBand(journey, 0.95, 0.995) *
    0.52;

  return (
    <group>
      {presentOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.lifeMeet}
          progress={THREE.MathUtils.clamp(present, 0, 1)}
          z={-8.6}
          y={0.02}
          opacity={presentOp}
          cover={1.28}
          reveal="snake"
          damp={1.8}
          color="#c8b896"
        />
      ) : null}
      {journeyOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.roadBeforeSunset}
          progress={0.2 + journey * 0.55}
          z={-8.5}
          y={0.04}
          opacity={journeyOp}
          cover={1.24}
          reveal="scan"
          damp={1.9}
          color="#c4a070"
        />
      ) : null}
    </group>
  );
}

/**
 * Add1 背景 — keep the good establish framing, nudge gently to top-left.
 * 幕布 seam flash stays in DOM EraFlash. No long BR→TL journey.
 */
function Add1Backdrop() {
  const journey = useChapterLocal("journey");
  const memories = useChapterLocal("memories");
  const quiet = useChapterLocal("quiet-days");
  const letter = useChapterLocal("letter");
  const future = useChapterLocal("future");
  const reveal = useStoryStore((s) => s.worldReveal);

  const warm = journey > 0.88 || memories > 0.001;
  if (!warm) return null;

  const inMemories =
    THREE.MathUtils.smoothstep(memories, 0.05, 0.14) * leaveBand(memories, 0.9, 0.98);
  const inCoda =
    THREE.MathUtils.smoothstep(Math.max(quiet, letter, future), 0.02, 0.12) *
    leaveBand(future, 0.88, 0.98) *
    0.55;

  const opacity = reveal * (inMemories * 0.56 + inCoda * 0.3);
  // Soft breath only — stay in the left-top desk / daisy core
  const progress = THREE.MathUtils.clamp(memories * 0.55, 0, 1);

  return (
    <ScrollPanPlate
      url={crops.add1}
      progress={progress}
      z={-8.3}
      y={0.02}
      opacity={opacity}
      cover={1.22}
      reveal="scan"
      damp={1.8}
      color="#e8d8b0"
      /* Current good frame → slight settle into top-left */
      focus={{ x: 0.36, y: 0.32 }}
      focusEnd={{ x: 0.16, y: 0.12 }}
    />
  );
}

/**
 * Act 09 · 今世 — Three.js sheet 14→15 carousel.
 * Spatial depth + staggered pans; foil copy stays in DOM.
 */
function PresentRealm() {
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const reveal = useStoryStore((s) => s.worldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);

  const gate =
    reveal *
    THREE.MathUtils.smoothstep(present, 0.008, 0.04) *
    leaveBand(present, 0.97, 1);

  // Preload textures in late 前世 so 缘起 does not suspend the canvas
  const warm = past > 0.82 || present > 0.001;
  if (!warm) return null;

  const fade = reduced ? 0.03 : 0.05;

  return (
    <group position={[0, 0.02, 0]}>
      {/* Always mount once gated — avoids Suspense flash on each still enter */}
      {PRESENT_STILLS.map((still, i) => {
        const op = gate * presentPlateOpacity(present, still.start, still.end, fade);
        const t = presentPlateT(present, still.start, still.end);
        // Nearer layers lag slightly less — temporal depth
        const damp = (still.damp ?? 2.2) * (reduced ? 1.6 : 1) + i * 0.02;
        return (
          <ScrollPanPlate
            key={still.id}
            url={still.url}
            progress={t}
            z={still.z}
            y={still.y ?? 0}
            opacity={op}
            cover={still.cover ?? 1.16}
            reveal={still.reveal}
            damp={damp}
          />
        );
      })}
    </group>
  );
}

/**
 * Act 10 · 山高路远 — Three.js sheets 16→17→18 carousel.
 * Spatial stills; captions stay in DOM JourneyChapter.
 */
function JourneyRealm() {
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const reveal = useStoryStore((s) => s.worldReveal);
  const reduced = useStoryStore((s) => s.reducedMotion);

  // Hold until EraFlash Add1 幕布 at journey → 我们 seam
  const gate =
    reveal *
    THREE.MathUtils.smoothstep(journey, 0.008, 0.04) *
    leaveBand(journey, 0.95, 0.995);

  // Preload near end of 今世 so first road plate does not suspend
  const warm = present > 0.85 || journey > 0.001;
  if (!warm) return null;

  const fade = reduced ? 0.03 : 0.05;

  return (
    <group position={[0, 0.02, 0]}>
      {JOURNEY_STILLS.map((still, i) => {
        const op = gate * journeyPlateOpacity(journey, still.start, still.end, fade);
        const t = journeyPlateT(journey, still.start, still.end);
        const damp = (still.damp ?? 2.1) * (reduced ? 1.6 : 1) + i * 0.015;
        return (
          <ScrollPanPlate
            key={still.id}
            url={still.url}
            progress={t}
            z={still.z}
            y={still.y ?? 0}
            opacity={op}
            cover={still.cover ?? 1.15}
            reveal={still.reveal}
            damp={damp}
          />
        );
      })}
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
    } else if (present > 0.02) c.setRGB(0.12 + present * 0.06, 0.1 + present * 0.04, 0.14 + present * 0.05);
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
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const camPos = useMemo(() => new THREE.Vector3(0, 0.95, 8.2), []);
  const look = useMemo(() => new THREE.Vector3(0, 0.1, -2.2), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const posTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, dt) => {
    const portalZ = THREE.MathUtils.lerp(8.8, 6.4, reveal);
    const portrait = size.height > size.width;
    const presentNear = shotSmooth(present, 0.02, 0.35);
    const fovTarget = portrait ? 50 - presentNear * 2 : 40 - presentNear * 1.5;
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
    // Human-scale intimacy — slow dolly in through 今世 stills
    const presentPush = shotSmooth(present, 0.05, 0.9) * 0.85 * amp;
    const presentDrift = Math.sin(present * Math.PI * 1.5) * 0.12 * amp;
    const climaxPush = shotSmooth(journey, 0.7, 0.92) * 1.1;
    const hushPull = journey > 0.92 ? (journey - 0.92) * 2.2 : 0;

    posTarget.set(
      meetX + mythOrbit + presentDrift + Math.sin(journey * Math.PI) * 0.28,
      meetY + mythLift - presentPush * 0.1 + climaxPush * 0.08 - progress * 0.06,
      meetZ - mythDolly - presentPush - climaxPush + hushPull,
    );
    lookTarget.set(
      meet * 0.06 * amp + mythOrbit * 0.2 + presentDrift * 0.35,
      -0.02 - bridgePush * 0.12 + mythLift * 0.15 - presentPush * 0.04,
      -2.3 - bridgePush * 0.55 - mythDolly * 0.2 - presentPush * 0.15,
    );

    dampToward(camPos, posTarget, reduced ? 4.2 : 2.4, dt);
    dampToward(look, lookTarget, reduced ? 4.8 : 3.0, dt);
    camera.position.copy(camPos);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      reduced
        ? 0
        : Math.sin(meet * Math.PI) * 0.02 +
            Math.sin(past * Math.PI * 2) * 0.012 +
            Math.sin(present * Math.PI) * 0.008,
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
      {/* Nested Suspense — late-meeting preload; never blank the canvas on handoff */}
      <Suspense fallback={null}>
        <PastRealm />
      </Suspense>
      <Suspense fallback={null}>
        <ChapterUnderlays />
        <PresentRealm />
        <JourneyRealm />
        <Add1Backdrop />
      </Suspense>
    </>
  );
}
