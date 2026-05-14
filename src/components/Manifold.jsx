import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  manifoldVertex,
  manifoldFragment,
  latticeVertex,
  latticeFragment,
} from "../shaders/manifold";
import { seededRandom } from "../lib/math";

// ════════════════════════════════════════════════════════════════
//  Manifold
//  A deterministic particle grid (the Lorentzian manifold) that
//  warps under cursor proximity via the lensing vertex shader.
//  Grid is generated once with a seeded RNG — identical every load.
// ════════════════════════════════════════════════════════════════

const GRID_W = 60; // columns
const GRID_H = 36; // rows
const SPACING = 0.32;

export default function Manifold({ cursor, warpStrength = 1 }) {
  const pointsRef = useRef();
  const latticeRef = useRef();
  const { viewport } = useThree();

  // ── build the grid geometry once ──
  const { pointGeo, lineGeo } = useMemo(() => {
    const rand = seededRandom(0x5face7); // deterministic seed
    const positions = [];
    const indices = [];

    const halfW = (GRID_W * SPACING) / 2;
    const halfH = (GRID_H * SPACING) / 2;

    for (let j = 0; j < GRID_H; j++) {
      for (let i = 0; i < GRID_W; i++) {
        const x = i * SPACING - halfW;
        const y = j * SPACING - halfH;
        // tiny deterministic z jitter so the manifold isn't a flat plane
        const z = (rand() - 0.5) * 0.12;
        positions.push(x, y, z);
        indices.push(j * GRID_W + i);
      }
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    pointGeo.setAttribute(
      "aIndex",
      new THREE.Float32BufferAttribute(indices, 1)
    );

    // ── lattice lines: connect each point to its right & bottom neighbour ──
    const linePositions = [];
    const idx = (i, j) => (j * GRID_W + i) * 3;
    for (let j = 0; j < GRID_H; j++) {
      for (let i = 0; i < GRID_W; i++) {
        const a = idx(i, j);
        if (i < GRID_W - 1) {
          const b = idx(i + 1, j);
          linePositions.push(
            positions[a], positions[a + 1], positions[a + 2],
            positions[b], positions[b + 1], positions[b + 2]
          );
        }
        if (j < GRID_H - 1) {
          const c = idx(i, j + 1);
          linePositions.push(
            positions[a], positions[a + 1], positions[a + 2],
            positions[c], positions[c + 1], positions[c + 2]
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    return { pointGeo, lineGeo };
  }, []);

  // ── shared uniforms ──
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCursor: { value: new THREE.Vector3(0, 0, 0) },
      uCursorActive: { value: 0 },
      uWarpStrength: { value: warpStrength },
      uColorBase: { value: new THREE.Color("#ffffff") },
      uColorWarp: { value: new THREE.Color("#ffb000") },
    }),
    [warpStrength]
  );

  const lineUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCursor: { value: uniforms.uCursor.value },
      uCursorActive: { value: 0 },
      uWarpStrength: { value: warpStrength },
      uColorBase: { value: new THREE.Color("#1a1a1a") },
      uColorWarp: { value: new THREE.Color("#ffb000") },
    }),
    [warpStrength, uniforms]
  );

  // smoothed cursor-active value
  const activeSmooth = useRef(0);

  useFrame((stateThree, dt) => {
    const t = stateThree.clock.elapsedTime;
    uniforms.uTime.value = t;
    lineUniforms.uTime.value = t;

    // project cursor (-1..1) onto the manifold plane
    const c = cursor.current;
    const halfW = (GRID_W * SPACING) / 2;
    const halfH = (GRID_H * SPACING) / 2;
    const cx = c.x * halfW * 1.1;
    const cy = c.y * halfH * 1.1;
    uniforms.uCursor.value.set(cx, cy, 0.4);

    // smooth the active fade
    activeSmooth.current +=
      (c.active - activeSmooth.current) * Math.min(1, dt * 5);
    uniforms.uCursorActive.value = activeSmooth.current;
    lineUniforms.uCursorActive.value = activeSmooth.current;
  });

  return (
    <group>
      <lineSegments ref={latticeRef} geometry={lineGeo}>
        <shaderMaterial
          vertexShader={latticeVertex}
          fragmentShader={latticeFragment}
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points ref={pointsRef} geometry={pointGeo}>
        <shaderMaterial
          vertexShader={manifoldVertex}
          fragmentShader={manifoldFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
