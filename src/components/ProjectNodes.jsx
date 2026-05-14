import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "../data/portfolio";
import { SECTION_ANCHORS } from "./CameraRig";

// ════════════════════════════════════════════════════════════════
//  ProjectNodes
//  Each project is a wireframe octahedron node floating in the
//  coordinate space around the 0x01 anchor. Hovering a node
//  expands a structural breakdown via a Drei <Html> overlay —
//  crisp DOM text, not blurry WebGL type.
// ════════════════════════════════════════════════════════════════

const ANCHOR = SECTION_ANCHORS[1]; // 0x01 PROOFS anchor

function ProjectNode({ project, onHover, isActive, dimmed }) {
  const meshRef = useRef();
  const ringRef = useRef();

  // node position = anchor + project coord
  const pos = [
    ANCHOR[0] + project.coord[0],
    ANCHOR[1] + project.coord[1],
    ANCHOR[2] - 6 + project.coord[2],
  ];

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // slow deterministic rotation — each node on its own phase
    meshRef.current.rotation.x = t * 0.18 + project.coord[0];
    meshRef.current.rotation.y = t * 0.24 + project.coord[1];

    // scale up when active
    const target = isActive ? 1.5 : dimmed ? 0.7 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target, target, target),
      Math.min(1, dt * 8)
    );

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      const ringTarget = isActive ? 1 : 0;
      ringRef.current.scale.lerp(
        new THREE.Vector3(
          1 + ringTarget * 0.5,
          1 + ringTarget * 0.5,
          1
        ),
        Math.min(1, dt * 8)
      );
    }
  });

  const color = isActive ? "#ffb000" : "#ffffff";

  return (
    <group position={pos}>
      {/* the node — wireframe octahedron */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(project.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={dimmed ? 0.25 : 0.9}
        />
      </mesh>

      {/* inner solid core */}
      <mesh scale={0.5}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.5 : 0.12}
        />
      </mesh>

      {/* active ring */}
      <mesh ref={ringRef} scale={0}>
        <ringGeometry args={[0.7, 0.74, 48]} />
        <meshBasicMaterial
          color="#ffb000"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* coordinate label — always visible, small */}
      <Html
        position={[0, -0.75, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: isActive ? "#ffb000" : "#4a4a4a",
            whiteSpace: "nowrap",
            transition: "color 0.3s",
            textShadow: "0 0 8px #000",
          }}
        >
          {project.id}
        </div>
      </Html>

      {/* expanded breakdown — only when active */}
      {isActive && (
        <Html
          position={[0.9, 0.2, 0]}
          distanceFactor={7}
          style={{ pointerEvents: "none" }}
        >
          <div className="node-breakdown">
            <div className="node-breakdown-title">{project.title}</div>
            <div className="node-breakdown-org">
              {project.org} · {project.year}
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

  if (!visible) return null;

  return (
    <group>
      {projects.map((p) => (
        <ProjectNode
          key={p.id}
          project={p}
          onHover={setHovered}
          isActive={hovered === p.id}
          dimmed={hovered !== null && hovered !== p.id}
        />
      ))}
    </group>
  );
}
