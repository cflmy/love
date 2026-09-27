"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { crops } from "@/data/assets";
import { chapterProgressBounds } from "@/data/chapters";
import { MEETING_SHOTS, smoothstep as shotSmooth } from "@/data/meetingShots";
import { useStoryStore } from "@/store/story";
import { ScrollPanPlate, SubjectBillboard } from "./ScrollPanPlate";

/**
 * Persistent cinematic world — camera + supplied art only.
 * No procedural cones/tori/water meshes; no broken cut-out sprites.
 * Depth comes from scroll-pan plates + parallax billboards.
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

/** Far night plate — atmosphere only, never stretched as wallpaper. */
function NightSky() {
  const reveal = useStoryStore((s) => s.worldReveal);
  const meet = useChapterLocal("meeting");
  const past = useChapterLocal("past");
  const leave = 1 - THREE.MathUtils.smoothstep(past, 0.02, 0.28);
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

/** Meeting hero — one supplied illustration, clean subject. */
function MeetingPlate() {
  const group = useRef<THREE.Group>(null);
  const meet = useChapterLocal("meeting");
  const reveal = useStoryStore((s) => s.worldReveal);
  const past = useChapterLocal("past");
  const target = useMemo(() => new THREE.Vector3(), []);

  const leave = 1 - THREE.MathUtils.smoothstep(past, 0.06, 0.32);
  const awake = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
  const plateOp =
    reveal * leave * (0.28 + THREE.MathUtils.smoothstep(meet, 0.08, 0.35) * 0.35 + awake * 0.37);

  useFrame((_, dt) => {
    if (!group.current) return;
    target.set(0, -0.35 - meet * 0.08, -2.4);
    dampToward(group.current.position, target, 3.2, dt);
    group.current.visible = reveal * leave > 0.04;
  });

  return (
    <group ref={group} position={[0, -0.35, -2.4]}>
      <SubjectBillboard
        url={crops.meetBridge}
        position={[0, 0.55, 0]}
        height={3.4}
        opacity={plateOp}
        progress={meet}
        parallax={0.18}
      />
    </group>
  );
}

/** Later acts: one scroll-pan photo each — no cut-out ornament subjects. */
function ChapterAtmosphere() {
  const past = useChapterLocal("past");
  const present = useChapterLocal("present");
  const journey = useChapterLocal("journey");
  const reveal = useStoryStore((s) => s.worldReveal);

  const pastOp =
    THREE.MathUtils.smoothstep(past, 0.04, 0.28) *
    (1 - THREE.MathUtils.smoothstep(past, 0.88, 1)) *
    0.55 *
    reveal;
  const presentOp = THREE.MathUtils.smoothstep(present, 0.06, 0.3) * 0.48 * reveal;
  const journeyOp =
    THREE.MathUtils.smoothstep(journey, 0.04, 0.22) *
    (1 - THREE.MathUtils.smoothstep(journey, 0.9, 1)) *
    0.5 *
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
          cover={1.2}
          panAxis="auto"
          damp={2.2}
        />
      ) : null}

      {presentOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.lifeMeet}
          progress={present}
          z={-7.8}
          y={0}
          opacity={presentOp}
          cover={1.18}
          panAxis="auto"
          damp={2.4}
        />
      ) : null}

      {journeyOp > 0.02 ? (
        <ScrollPanPlate
          url={crops.roadBeforeSunset}
          progress={journey}
          z={-7.5}
          y={0.05}
          opacity={journeyOp}
          cover={1.2}
          panAxis="auto"
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
    else if (past > 0.05) c.setRGB(0.05 + past * 0.1, 0.02, 0.08 + past * 0.08);
    else c.set("#050810");
    fogRef.current.density = 0.038 + meet * 0.008 + past * 0.012;
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
    const bridgePush = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);
    const settle = shotSmooth(meet, MEETING_SHOTS.meeting.start, MEETING_SHOTS.title.end);
    const establish = 1 - shotSmooth(meet, 0.08, 0.2);

    const amp = reduced ? 0.32 : 1;
    const meetX = (approach * -0.55 + bridgePush * 0.2) * amp;
    const meetY =
      (0.95 * establish + THREE.MathUtils.lerp(0.85, 0.48, approach) - bridgePush * 0.28 + settle * 0.1) *
      (reduced ? 0.65 : 1);
    const meetZ =
      portalZ -
      approach * 1.1 * amp -
      bridgePush * 1.85 * amp +
      settle * 0.35 -
      (reduced ? 0 : meet * 0.28);

    const mythLift = shotSmooth(past, 0.2, 0.8) * 0.45;
    const climaxPush = shotSmooth(journey, 0.7, 0.92) * 1.1;
    const hushPull = journey > 0.92 ? (journey - 0.92) * 2.2 : 0;

    posTarget.set(
      meetX + past * 0.12 + Math.sin(journey * Math.PI) * 0.28,
      meetY + mythLift + climaxPush * 0.08 - progress * 0.06,
      meetZ - climaxPush + hushPull,
    );
    lookTarget.set(
      meet * 0.08 * amp,
      -0.02 - bridgePush * 0.1 + mythLift * 0.12,
      -2.3 - bridgePush * 0.45,
    );

    dampToward(camPos, posTarget, reduced ? 4.2 : 2.4, dt);
    dampToward(look, lookTarget, reduced ? 4.8 : 3.0, dt);
    camera.position.copy(camPos);
    camera.lookAt(look);
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      reduced ? 0 : Math.sin(meet * Math.PI) * 0.015,
      2,
      dt,
    );
  });

  return null;
}

export function QDQCWorld() {
  const meet = useChapterLocal("meeting");
  const lit = shotSmooth(meet, MEETING_SHOTS.bridge.start, MEETING_SHOTS.meeting.end);

  return (
    <>
      <color attach="background" args={["#050810"]} />
      <Atmosphere />
      <ambientLight intensity={0.32} />
      <directionalLight position={[3.5, 5.5, 2]} intensity={0.45} color="#a8bdd8" />
      <pointLight position={[2.4, 2.5, -8]} intensity={0.7} color="#F7F3E9" distance={18} decay={2} />
      <pointLight position={[0, 0.5, -2]} intensity={0.2 + lit * 0.35} color="#C7A66A" distance={10} decay={2} />

      <CameraRig />

      <NightSky />
      <MeetingPlate />
      <ChapterAtmosphere />
    </>
  );
}
