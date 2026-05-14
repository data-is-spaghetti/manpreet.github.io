import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { worldline, events } from "../data/portfolio";
import { SECTION_ANCHORS } from "./CameraRig";

// ════════════════════════════════════════════════════════════════
//  Worldline
//  The experience timeline as a true spacetime diagram: a causal
//  worldline running through coordinate space. Each role is an
//  event on the line; concurrent work branches off as a second
//  worldline. Awards are discrete marked events.
// ════════════════════════════════════════════════════════════════

const ANCHOR = SECTION_ANCHORS[2]; // 0x02 TEMPORAL LATTICE

// the worldline runs along Y (time axis), centered on the anchor
const T_SPACING = 2.4;

function eventPos(t, branch) {
  const x = ANCHOR[0] + (branch === "concurrent" ? 2.2 : 0);
  const y = ANCHOR[1] + 3 - t * T_SPACING;
  const z = ANCHOR[2] - 6;
  return [x, y, z];
}

export default function Worldline({ visible }) {
  const pulseRef = useRef();

  // build the line geometry
  const { mainLine, branchLine } = useMemo(() => {
    const main = [];
    const branch = [];

    // main worldline through non-branch events
    const mainEvents = worldline.filter((e) => !e.branch);
    for (let i = 0; i < mainEvents.length; i++) {
      const p = eventPos(mainEvents[i].t, null);
      main.push([p[0], p[1], p[2]]);
    }
    // extend the line a little past the last event
    if (mainEvents.length) {
      const last = eventPos(mainEvents[mainEvents.length - 1].t, null);
      main.push([last[0], last[1] - 1.5, last[2]]);
    }

    // branch line — from the branch point off to the concurrent worldline
    const branchEvent = worldline.find((e) => e.branch === "concurrent");
    if (branchEvent) {
      // branch originates from the previous main event
      const origin = eventPos(branchEvent.t - 1, null);
      const bpos = eventPos(branchEvent.t, "concurrent");
      branch.push([origin[0], origin[1], origin[2]]);
      branch.push([bpos[0], bpos[1], bpos[2]]);
      branch.push([bpos[0], bpos[1] - 1.5, bpos[2]]);
    }

    // drei <Line> needs at least 2 points; guard the branch
    const branchSafe = branch.length >= 2 ? branch : null;

    return { mainLine: main, branchLine: branchSafe };
  }, []);

  // a light pulse travelling along the worldline
  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = state.clock.elapsedTime;
    const cycle = (t * 0.35) % 1;
    const yTop = ANCHOR[1] + 3;
    const yBot = ANCHOR[1] + 3 - (worldline.length) * T_SPACING;
    pulseRef.current.position.set(
      ANCHOR[0],
      yTop + (yBot - yTop) * cycle,
      ANCHOR[2] - 6
    );
  });

  if (!visible) return null;

  return (
    <group>
      {/* main causal worldline */}
      <Line
        points={mainLine}
        color="#ffffff"
        transparent
        opacity={0.5}
        lineWidth={1}
      />

      {/* concurrent branch */}
      {branchLine && (
        <Line
          points={branchLine}
          color="#00ff66"
          transparent
          opacity={0.4}
          lineWidth={1}
        />
      )}

      {/* travelling light pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ffb000" />
      </mesh>

      {/* event nodes */}
      {worldline.map((e) => {
        const p = eventPos(e.t, e.branch);
        const isBranch = e.branch === "concurrent";
        return (
          <group key={e.role + e.t} position={p}>
            <mesh>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshBasicMaterial color={isBranch ? "#00ff66" : "#ffffff"} />
            </mesh>
            <Html
              position={[isBranch ? 0.5 : -0.5, 0, 0]}
              center={false}
              distanceFactor={7}
              style={{ pointerEvents: "none" }}
            >
              <div
                className={`worldline-event ${isBranch ? "branch" : ""}`}
                style={{
                  transform: isBranch ? "none" : "translateX(-100%)",
                  textAlign: isBranch ? "left" : "right",
                }}
              >
                <div className="worldline-period">{e.period}</div>
                <div className="worldline-role">{e.role}</div>
                <div className="worldline-org">{e.org}</div>
                <div className="worldline-desc">{e.event}</div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* award events — small markers off to the side */}
      {events.map((ev, i) => {
        const y = ANCHOR[1] + 1.5 - i * 1.4;
        return (
          <group key={ev.label} position={[ANCHOR[0] - 3.4, y, ANCHOR[2] - 6]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.14, 0.14]} />
              <meshBasicMaterial color="#ffb000" side={THREE.DoubleSide} />
            </mesh>
            <Html
              position={[-0.35, 0, 0]}
              distanceFactor={7}
              style={{ pointerEvents: "none" }}
            >
              <div className="award-event">
                <span className="award-year">{ev.year}</span>
                <span className="award-label">{ev.label}</span>
                <span className="award-note">{ev.note}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
