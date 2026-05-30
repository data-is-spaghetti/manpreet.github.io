import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "../data/portfolio";
import { SECTION_ANCHORS } from "./CameraRig";
import { fibonacciSphere } from "../lib/math";

// ════════════════════════════════════════════════════════════════
//  ProjectNodes
//
//  Projects render as wireframe octahedron nodes around the 0x01
//  anchor. Positions are computed by `fibonacciSphere(N)` so adding
//  a project to portfolio.js just slots it in — no manual coords.
//
//  Hovering a node projects the architectural breakdown via Drei's
//  <Html> overlay (crisp DOM text, not blurry WebGL type).
// ════════════════════════════════════════════════════════════════

const ANCHOR = SECTION_ANCHORS[1]; // 0x01 PROOFS anchor

// Layout tuning — keep these in one place so the whole grid can be
// rebalanced from a single edit when the project list grows.
const CLUSTER_RADIUS = 2.0;   // spread of the project cluster
const NODE_SIZE      = 0.26;  // octahedron size
const Z_SQUASH       = 0.55;  // flatten depth so nothing sits too far back
const Y_SQUASH       = 0.65;  // compress vertical so no node escapes the viewport

function hexId(i) {
  return `0x01.${String.fromCharCode(65 + i)}`; // 0x01.A, 0x01.B, ...
}

function ProjectNode({ project, index, position, onHover, isActive, dimmed }) {
  const meshRef = useRef();
  const ringRef = useRef();

  // absolute world position = anchor + offset
  const pos = [
    ANCHOR[0] + position[0],
    ANCHOR[1] + position[1],
    ANCHOR[2] - 6 + position[2],
  ];

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // slow deterministic rotation — each node on its own phase
    meshRef.current.rotation.x = t * 0.18 + index * 0.7;
    meshRef.current.rotation.y = t * 0.24 + index * 1.1;

    // smooth scale on hover
    const target = isActive ? 1.55 : dimmed ? 0.65 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      Math.min(1, dt * 8)
    );

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const ringTarget = isActive ? 1 : 0;
      ringRef.current.scale.lerp(
        new THREE.Vector3(1 + ringTarget * 0.5, 1 + ringTarget * 0.5, 1),
        Math.min(1, dt * 8)
      );
    }
  });

  const color = isActive ? "#ffb000" : "#ffffff";
  const id = hexId(index);

  return (
    <group position={pos}>
      {/* the node — wireframe octahedron */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(index);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <octahedronGeometry args={[NODE_SIZE, 0]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={dimmed ? 0.25 : 0.9}
        />
      </mesh>

      {/* inner solid core */}
      <mesh scale={0.5}>
        <octahedronGeometry args={[NODE_SIZE, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.5 : 0.12}
        />
      </mesh>

      {/* active ring */}
      <mesh ref={ringRef} scale={0}>
        <ringGeometry args={[NODE_SIZE * 1.7, NODE_SIZE * 1.78, 48]} />
        <meshBasicMaterial
          color="#ffb000"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* coordinate label — always visible */}
      <Html
        position={[0, -NODE_SIZE * 1.9, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: isActive ? "#ffb000" : "#cacaca",
            whiteSpace: "nowrap",
            transition: "color 0.3s",
            textShadow: "0 0 8px #000",
          }}
        >
          {id} · {project.title}
        </div>
      </Html>

      {/* expanded breakdown — only when active */}
      {isActive && (
        <Html
          position={[NODE_SIZE * 2.4, 0.15, 0]}
          distanceFactor={6.5}
          style={{ pointerEvents: "none" }}
        >
          <div className="node-breakdown">
            <div className="node-breakdown-title">{project.title}</div>
            <div className="node-breakdown-org">
              {project.subtitle} · {project.year}
            </div>
            <div className="node-breakdown-arch">{project.architecture}</div>
            <div className="node-breakdown-metrics">
              {project.metrics.map((m) => (
                <div key={m.label} className="node-metric">
                  <span className="node-metric-label">{m.label}</span>
                  <span className="node-metric-value">{m.value}</span>
                </div>
              ))}
            </div>
            <div className="node-breakdown-stack">
              {project.stack.join(" · ")}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ProjectNodes({ visible }) {
  const [hovered, setHovered] = useState(null);

  // Compute positions ONCE for the current project count. If projects.length
  // changes (e.g. you add one), this recomputes — but only on count change,
  // not on hover state changes.
  const positions = useMemo(
    () => fibonacciSphere(projects.length, CLUSTER_RADIUS, Z_SQUASH, Y_SQUASH),
    []
  );

  if (!visible) return null;

  return (
    <group>
      {projects.map((p, i) => (
        <ProjectNode
          key={p.title}
          project={p}
          index={i}
          position={positions[i]}
          onHover={setHovered}
          isActive={hovered === i}
          dimmed={hovered !== null && hovered !== i}
        />
      ))}
    </group>
  );
}
