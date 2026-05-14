import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ════════════════════════════════════════════════════════════════
//  CameraRig
//  The camera IS the viewport vector. As T changes, the camera
//  performs a high-speed coordinate transform to the section's
//  position. Free-look (W/A/S/D) offsets it within a section.
//
//  Each section sits at a distinct point in coordinate space, so
//  moving between them is literally traversal, not a fade.
// ════════════════════════════════════════════════════════════════

// section anchor positions in 3D coordinate space
const SECTION_ANCHORS = [
  [0, 0, 7],      // 0x00 MAIN ENGINE
  [9, 0.5, 6],    // 0x01 PROOFS
  [4, -7, 6.5],   // 0x02 TEMPORAL LATTICE
  [-8, 2, 6],     // 0x03 SIGNAL BROADCAST
];

export default function CameraRig({ T, viewport }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // interpolate anchor position by continuous T
    const i0 = Math.floor(T);
    const i1 = Math.min(i0 + 1, SECTION_ANCHORS.length - 1);
    const frac = T - i0;

    const a = SECTION_ANCHORS[i0] || SECTION_ANCHORS[0];
    const b = SECTION_ANCHORS[i1] || SECTION_ANCHORS[0];

    const baseX = a[0] + (b[0] - a[0]) * frac;
    const baseY = a[1] + (b[1] - a[1]) * frac;
    const baseZ = a[2] + (b[2] - a[2]) * frac;

    // free-look offset (already critically damped upstream)
    const offX = viewport[0] * 0.55;
    const offY = viewport[1] * 0.55;

    camera.position.set(baseX + offX, baseY + offY, baseZ);

    // always look slightly ahead along the worldline — toward the
    // midpoint between current and next anchor
    const lx = baseX + (b[0] - a[0]) * 0.15 + offX * 0.5;
    const ly = baseY + (b[1] - a[1]) * 0.15 + offY * 0.5;
    const lz = baseZ - 6;
    lookTarget.current.set(lx, ly, lz);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export { SECTION_ANCHORS };
