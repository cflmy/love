"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { imageSize } from "@/data/imageSize";
import { LIFE_MEET_SNAKE, snakeScan } from "@/lib/snakeScan";

function mediaPath(url: string) {
  return url.split("?")[0] ?? url;
}

function textureAspect(url: string, texture: THREE.Texture) {
  const known = imageSize[mediaPath(url)];
  if (known?.w && known?.h) return known.w / known.h;
  const img = texture.image as { width?: number; height?: number } | undefined;
  if (img?.width && img?.height) return img.width / img.height;
  return 16 / 9;
}

export type RevealMode = "cover" | "fitGrow" | "scan" | "snake" | "curtain";

/**
 * Full-bleed backdrop that keeps intrinsic aspect (no stretch).
 * - cover: oversized cover + optional axis pan
 * - fitGrow: start contain (full art readable) → grow into cover while scanning
 * - scan: cover with forced L→R / T→B ken-burns scan
 * - snake: calm left-column → right → faces
 */
export type PanFocus = { x: number; y: number };

export function ScrollPanPlate({
  url,
  progress,
  z = -12,
  y = 0,
  opacity = 1,
  /** >1 leaves travel room beyond cover (used by cover/scan) */
  cover = 1.22,
  panAxis = "auto",
  reveal = "cover",
  damp = 2.8,
  color,
  depthWrite = false,
  /**
   * Normalized image focus 0=left/top → 1=right/bottom.
   * When set, scan/cover drift between `focus` and `focusEnd` (defaults to same).
   */
  focus,
  focusEnd,
}: {
  url: string;
  progress: number;
  z?: number;
  y?: number;
  opacity?: number;
  cover?: number;
  panAxis?: "auto" | "x" | "y" | "both";
  reveal?: RevealMode;
  damp?: number;
  color?: string;
  depthWrite?: boolean;
  focus?: PanFocus;
  focusEnd?: PanFocus;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

  const aspect = textureAspect(url, texture);
  const smoothed = useRef(new THREE.Vector3(0, y, z));
  const scaleSmoothed = useRef(1);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const persp = camera as THREE.PerspectiveCamera;
    const dist = Math.max(0.35, Math.abs(camera.position.z - z));
    const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2) * dist;
    const visibleW = visibleH * (size.width / Math.max(1, size.height));
    const viewAspect = visibleW / visibleH;
    const t = THREE.MathUtils.clamp(progress, 0, 1);

    // Cover size (fills frustum * cover factor)
    let coverH: number;
    let coverW: number;
    if (aspect >= viewAspect) {
      coverH = visibleH * cover;
      coverW = coverH * aspect;
    } else {
      coverW = visibleW * cover;
      coverH = coverW / aspect;
    }

    // Contain size (entire image visible inside frustum)
    let fitH: number;
    let fitW: number;
    if (aspect >= viewAspect) {
      fitW = visibleW * 0.92;
      fitH = fitW / aspect;
    } else {
      fitH = visibleH * 0.88;
      fitW = fitH * aspect;
    }

    let planeW = coverW;
    let planeH = coverH;
    let tx = 0;
    let ty = y;
    let snap = false;

    if (reveal === "fitGrow") {
      const grow = THREE.MathUtils.smoothstep(t, 0, 0.42);
      const scan = THREE.MathUtils.smoothstep(t, 0.38, 1);
      planeW = THREE.MathUtils.lerp(fitW, coverW * 1.08, grow);
      planeH = THREE.MathUtils.lerp(fitH, coverH * 1.08, grow);
      const overflowX = Math.max(0, planeW - visibleW);
      const overflowY = Math.max(0, planeH - visibleH);
      // Start reading top-left text, then scan to bottom-right
      tx = THREE.MathUtils.lerp(overflowX * 0.42, -overflowX * 0.48, scan);
      ty = y + THREE.MathUtils.lerp(-overflowY * 0.4, overflowY * 0.42, scan);
      snap = t < 0.04;
    } else if (reveal === "curtain") {
      /**
       * 幕布: full art (contain) first → grow into cover → pan focus→focusEnd.
       * Default pan BR→TL when focus omitted.
       */
      const grow = THREE.MathUtils.smoothstep(t, 0.28, 0.62);
      const pan = THREE.MathUtils.smoothstep(t, 0.48, 1);
      const coverMul = 1.32;
      // Slight breath while the full curtain holds
      const holdScale = 1 + THREE.MathUtils.smoothstep(t, 0.05, 0.22) * 0.04 * (1 - grow);
      planeW = THREE.MathUtils.lerp(fitW * holdScale, coverW * coverMul, grow);
      planeH = THREE.MathUtils.lerp(fitH * holdScale, coverH * coverMul, grow);
      const overflowX = Math.max(0, planeW - visibleW);
      const overflowY = Math.max(0, planeH - visibleH);
      const from = focus ?? { x: 0.9, y: 0.88 };
      const to = focusEnd ?? { x: 0.04, y: 0.06 };
      // Full-show: center (overflow≈0). After grow: pan along focus path.
      const fx = THREE.MathUtils.lerp(0.5, THREE.MathUtils.lerp(from.x, to.x, pan), grow);
      const fy = THREE.MathUtils.lerp(0.5, THREE.MathUtils.lerp(from.y, to.y, pan), grow);
      tx = THREE.MathUtils.lerp(overflowX * 0.5, -overflowX * 0.5, fx);
      ty = y + THREE.MathUtils.lerp(-overflowY * 0.5, overflowY * 0.5, fy);
      snap = t < 0.06;
    } else if (reveal === "scan") {
      // Hold at focus start briefly so chapter enter never lands mid-pan
      const hold = 0.14;
      const scan = THREE.MathUtils.smoothstep(Math.max(0, (t - hold) / (1 - hold)), 0, 1);
      planeW = coverW * 1.2;
      planeH = coverH * 1.2;
      const overflowX = Math.max(0, planeW - visibleW);
      const overflowY = Math.max(0, planeH - visibleH);
      if (focus) {
        const end = focusEnd ?? focus;
        const fx = THREE.MathUtils.lerp(focus.x, end.x, scan);
        const fy = THREE.MathUtils.lerp(focus.y, end.y, scan);
        tx = THREE.MathUtils.lerp(overflowX * 0.5, -overflowX * 0.5, fx);
        ty = y + THREE.MathUtils.lerp(-overflowY * 0.5, overflowY * 0.5, fy);
      } else {
        tx = THREE.MathUtils.lerp(overflowX * 0.5, -overflowX * 0.5, scan);
        // +Y is up in Three — top of texture needs negative offset
        ty = y + THREE.MathUtils.lerp(-overflowY * 0.5, overflowY * 0.5, scan);
      }
      snap = t <= hold;
    } else if (reveal === "snake") {
      const focus = snakeScan(t, LIFE_MEET_SNAKE);
      // Full-art window: both axes exceed frustum by focus.scale (same as DOM)
      let imgH = visibleH * focus.scale;
      let imgW = imgH * aspect;
      if (imgW < visibleW * focus.scale) {
        imgW = visibleW * focus.scale;
        imgH = imgW / aspect;
      }
      planeW = imgW;
      planeH = imgH;
      const overflowX = Math.max(0, imgW - visibleW);
      const overflowY = Math.max(0, imgH - visibleH);
      // focus 0 = left/top of art → plane shifts +X / -Y into view
      tx = THREE.MathUtils.lerp(overflowX * 0.5, -overflowX * 0.5, focus.x);
      ty = y + THREE.MathUtils.lerp(-overflowY * 0.5, overflowY * 0.5, focus.y);
      snap = t <= (LIFE_MEET_SNAKE.hold ?? 0.05);
    } else {
      const overflowX = Math.max(0, planeW - visibleW);
      const overflowY = Math.max(0, planeH - visibleH);
      let axis = panAxis;
      if (axis === "auto") axis = overflowX >= overflowY * 0.85 ? "x" : "y";
      if (axis === "x" || axis === "both") {
        tx = THREE.MathUtils.lerp(overflowX * 0.5, -overflowX * 0.5, t);
      }
      if (axis === "y" || axis === "both") {
        ty = y + THREE.MathUtils.lerp(overflowY * 0.42, -overflowY * 0.42, t);
      } else if (axis === "x" && overflowY > 0) {
        ty = y + THREE.MathUtils.lerp(overflowY * 0.1, -overflowY * 0.06, t);
      }
    }

    scaleSmoothed.current = THREE.MathUtils.damp(scaleSmoothed.current, 1, damp, dt);
    mesh.current.scale.set(planeW * scaleSmoothed.current, planeH * scaleSmoothed.current, 1);

    if (snap) {
      smoothed.current.set(tx, ty, z);
    } else {
      smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, tx, damp, dt);
      smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, ty, damp, dt);
      smoothed.current.z = z;
    }
    mesh.current.position.copy(smoothed.current);

    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
    mesh.current.visible = opacity > 0.015;
  });

  return (
    <mesh ref={mesh} position={[0, y, z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={depthWrite}
        toneMapped={false}
        color={color}
      />
    </mesh>
  );
}

/**
 * Cut-out subject billboard — intrinsic aspect, optional scroll lag.
 */
export function SubjectBillboard({
  url,
  position,
  /** World-unit height */
  height = 1.2,
  opacity = 1,
  progress = 0,
  parallax = 0.35,
  side = THREE.DoubleSide,
}: {
  url: string;
  position: [number, number, number];
  height?: number;
  opacity?: number;
  progress?: number;
  parallax?: number;
  side?: THREE.Side;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const aspect = textureAspect(url, texture);
  const width = height * aspect;
  const base = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position[0], position[1], position[2]],
  );
  const smoothed = useRef(base.clone());

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const tx = base.x - t * parallax;
    const ty = base.y - t * parallax * 0.22;
    const tz = base.z + t * parallax * 0.15;
    smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, tx, 3.2, dt);
    smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, ty, 3.2, dt);
    smoothed.current.z = THREE.MathUtils.damp(smoothed.current.z, tz, 3.2, dt);
    mesh.current.position.copy(smoothed.current);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
    mesh.current.visible = opacity > 0.02;
  });

  return (
    <mesh ref={mesh} position={position} scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={side}
        toneMapped={false}
      />
    </mesh>
  );
}

export type PanelPose = {
  x: number;
  y: number;
  z: number;
  rotZ?: number;
  scale?: number;
};

/**
 * Far L|R door leaf — 外突内凹 (outer edges toward camera, seam recessed).
 * Large enough to cover the void; intrinsic aspect (no stretch).
 */
export function DoorPanel({
  url,
  side,
  progress,
  opacity = 1,
  z = -12,
  /** 0→1 deepens the 外突内凹 yaw */
  open = 0,
  damp = 2.4,
}: {
  url: string;
  side: "left" | "right";
  progress: number;
  opacity?: number;
  z?: number;
  open?: number;
  damp?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  const aspect = textureAspect(url, texture);
  const pos = useRef(new THREE.Vector3());
  const rotY = useRef(0);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const persp = camera as THREE.PerspectiveCamera;
    const dist = Math.max(0.35, Math.abs(camera.position.z - z));
    const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2) * dist;
    const visibleW = visibleH * (size.width / Math.max(1, size.height));
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const o = THREE.MathUtils.clamp(open, 0, 1);

    // Half-door bay — cover void, modest center overlap (not a heavy cross)
    const maxW = visibleW * 0.58;
    const maxH = visibleH * 1.2;
    let planeH = maxH;
    let planeW = planeH * aspect;
    if (planeW < maxW) {
      // Prefer filling width of the door bay when art is wide enough
      planeW = maxW;
      planeH = planeW / aspect;
      if (planeH < maxH) {
        planeH = maxH;
        planeW = planeH * aspect;
      }
    }
    mesh.current.scale.set(planeW, planeH, 1);

    const sign = side === "left" ? -1 : 1;
    // Pivot near center seam: outer edge comes forward (外突), inner goes back (内凹)
    const baseX = sign * (visibleW * 0.3);
    const baseZ = z + o * 0.35; // slight overall approach while opening
    // Left: negative yaw → outer (-X) toward +camera in R3F (camera looks -Z... wait)
    // R3F: camera looks down -Z; +Z is toward camera from scene origin behind.
    // Mesh facing camera is at negative Z. rotateY: left leaf wants outer edge closer to camera
    // = larger z (less negative) on the outer side.
    // Left leaf at -X: rotateY(+θ) lifts -X side toward +Z? 
    // RHR: rotateY(+): x' = x cos z + z sin... For point at local -x (outer on left panel if pivot center-right):
    // Hinge at inner: left panel pivot near its right. We position mesh center left of seam.
    // yaw = -sign * angle → left gets +angle, right gets -angle for 外突内凹
    const yaw = -sign * (0.28 + o * 0.22); // ~16°–29°, outer forward
    const panY = THREE.MathUtils.lerp(planeH * 0.01, -planeH * 0.03, t);

    pos.current.x = THREE.MathUtils.damp(pos.current.x, baseX, damp, dt);
    pos.current.y = THREE.MathUtils.damp(pos.current.y, panY, damp, dt);
    pos.current.z = THREE.MathUtils.damp(pos.current.z, baseZ, damp, dt);
    rotY.current = THREE.MathUtils.damp(rotY.current, yaw, damp, dt);

    mesh.current.position.copy(pos.current);
    mesh.current.rotation.set(0, rotY.current, 0);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
    mesh.current.visible = opacity > 0.015;
  });

  return (
    <mesh ref={mesh} position={[side === "left" ? -2 : 2, 0, z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Story still with spatial enter → settle → exit (not opacity-only fades).
 * `settle` / `exit` are 0→1 amounts driven by chapter local progress.
 */
export function CinematicPanel({
  url,
  height = 3.2,
  opacity = 1,
  settle = 1,
  exit = 0,
  from,
  home,
  away,
  damp = 4.2,
  side = THREE.DoubleSide,
}: {
  url: string;
  height?: number;
  opacity?: number;
  settle?: number;
  exit?: number;
  from: PanelPose;
  home: PanelPose;
  away: PanelPose;
  damp?: number;
  side?: THREE.Side;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  const aspect = textureAspect(url, texture);
  const baseW = height * aspect;
  const pos = useRef(new THREE.Vector3(from.x, from.y, from.z));
  const rotZ = useRef(from.rotZ ?? 0);
  const scl = useRef(from.scale ?? 0.82);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const s = THREE.MathUtils.clamp(settle, 0, 1);
    const e = THREE.MathUtils.clamp(exit, 0, 1);
    const ix = THREE.MathUtils.lerp(from.x, home.x, s);
    const iy = THREE.MathUtils.lerp(from.y, home.y, s);
    const iz = THREE.MathUtils.lerp(from.z, home.z, s);
    const ir = THREE.MathUtils.lerp(from.rotZ ?? 0, home.rotZ ?? 0, s);
    const is = THREE.MathUtils.lerp(from.scale ?? 0.82, home.scale ?? 1, s);

    const tx = THREE.MathUtils.lerp(ix, away.x, e);
    const ty = THREE.MathUtils.lerp(iy, away.y, e);
    const tz = THREE.MathUtils.lerp(iz, away.z, e);
    const tr = THREE.MathUtils.lerp(ir, away.rotZ ?? 0, e);
    const ts = THREE.MathUtils.lerp(is, away.scale ?? 0.9, e);

    pos.current.x = THREE.MathUtils.damp(pos.current.x, tx, damp, dt);
    pos.current.y = THREE.MathUtils.damp(pos.current.y, ty, damp, dt);
    pos.current.z = THREE.MathUtils.damp(pos.current.z, tz, damp, dt);
    rotZ.current = THREE.MathUtils.damp(rotZ.current, tr, damp, dt);
    scl.current = THREE.MathUtils.damp(scl.current, ts, damp, dt);

    mesh.current.position.copy(pos.current);
    mesh.current.rotation.z = rotZ.current;
    mesh.current.scale.set(baseW * scl.current, height * scl.current, 1);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
    mesh.current.visible = opacity > 0.02;
  });

  return (
    <mesh ref={mesh} position={[from.x, from.y, from.z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={side}
        toneMapped={false}
      />
    </mesh>
  );
}
