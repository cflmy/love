"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { imageSize } from "@/data/imageSize";

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

/**
 * Full-bleed backdrop that keeps intrinsic aspect (no stretch).
 * Oversized to cover the frustum, then pans on scroll so the whole plate can be read.
 */
export function ScrollPanPlate({
  url,
  progress,
  z = -12,
  y = 0,
  opacity = 1,
  /** >1 leaves travel room beyond cover */
  cover = 1.22,
  panAxis = "auto",
  damp = 2.8,
  color,
  depthWrite = false,
}: {
  url: string;
  progress: number;
  z?: number;
  y?: number;
  opacity?: number;
  cover?: number;
  panAxis?: "auto" | "x" | "y" | "both";
  damp?: number;
  color?: string;
  depthWrite?: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

  const aspect = textureAspect(url, texture);
  const smoothed = useRef(new THREE.Vector3(0, y, z));

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const persp = camera as THREE.PerspectiveCamera;
    const dist = Math.max(0.35, Math.abs(camera.position.z - z));
    const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2) * dist;
    const visibleW = visibleH * (size.width / Math.max(1, size.height));
    const viewAspect = visibleW / visibleH;

    let planeH: number;
    let planeW: number;
    if (aspect >= viewAspect) {
      planeH = visibleH * cover;
      planeW = planeH * aspect;
    } else {
      planeW = visibleW * cover;
      planeH = planeW / aspect;
    }
    mesh.current.scale.set(planeW, planeH, 1);

    const overflowX = Math.max(0, planeW - visibleW);
    const overflowY = Math.max(0, planeH - visibleH);
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    let axis = panAxis;
    if (axis === "auto") axis = overflowX >= overflowY * 0.85 ? "x" : "y";

    let tx = 0;
    let ty = y;
    if (axis === "x" || axis === "both") {
      tx = THREE.MathUtils.lerp(overflowX * 0.5, -overflowX * 0.5, t);
    }
    if (axis === "y" || axis === "both") {
      ty = y + THREE.MathUtils.lerp(overflowY * 0.42, -overflowY * 0.42, t);
    } else if (axis === "x" && overflowY > 0) {
      ty = y + THREE.MathUtils.lerp(overflowY * 0.1, -overflowY * 0.06, t);
    }

    smoothed.current.x = THREE.MathUtils.damp(smoothed.current.x, tx, damp, dt);
    smoothed.current.y = THREE.MathUtils.damp(smoothed.current.y, ty, damp, dt);
    smoothed.current.z = z;
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
