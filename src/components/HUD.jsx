import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sections, profile } from "../data/portfolio";
import { fmtCoord, EASE } from "../lib/math";
import { SECTION_ANCHORS } from "./CameraRig";
import "./HUD.css";

// ════════════════════════════════════════════════════════════════
//  HUD
//  The persistent heads-up display. Top-left: live system clock +
//  coordinate vector. Top-right: section registry (clickable jump
//  targets). Bottom: the temporal interval scrubber.
// ════════════════════════════════════════════════════════════════

export default function HUD({ T, sectionIndex, viewport, jumpTo }) {
  const [clock, setClock] = useState("");
  const [mem, setMem] = useState(0);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
        ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
      // a fake but plausible "memory load" that drifts
      setMem(42 + Math.sin(d.getTime() / 3000) * 6);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // current coordinate vector = interpolated anchor + viewport offset
  const i0 = Math.floor(T);
  const i1 = Math.min(i0 + 1, SECTION_ANCHORS.length - 1);
  const frac = T - i0;
  const a = SECTION_ANCHORS[i0] || SECTION_ANCHORS[0];
  const b = SECTION_ANCHORS[i1] || SECTION_ANCHORS[0];
  const X = a[0] + (b[0] - a[0]) * frac + viewport[0] * 0.55;
  const Y = a[1] + (b[1] - a[1]) * frac + viewport[1] * 0.55;
  const Z = a[2] + (b[2] - a[2]) * frac;

  return (
    <>
      {/* TOP-LEFT — system readout */}
      <motion.div
        className="hud hud-tl"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE.transform }}
      >
        <div className="hud-row">
          <span className="hud-key">SYS.TIME</span>
          <span className="hud-val">{clock}</span>
        </div>
        <div className="hud-row">
          <span className="hud-key">MEM.LOAD</span>
          <span className="hud-val">{mem.toFixed(1)}%</span>
        </div>
        <div className="hud-divider" />
        <div className="hud-row">
          <span className="hud-key">VECTOR</span>
          <span className="hud-val hud-coord">
            <span className="axis">X</span>{fmtCoord(X)}{" "}
            <span className="axis">Y</span>{fmtCoord(Y)}{" "}
            <span className="axis">Z</span>{fmtCoord(Z)}
          </span>
        </div>
        <div className="hud-row">
          <span className="hud-key">T.INTERVAL</span>
          <span className="hud-val amber">{T.toFixed(3)}</span>
        </div>
      </motion.div>

      {/* TOP-RIGHT — section registry */}
      <motion.div
        className="hud hud-tr"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE.transform }}
      >
        <div className="hud-registry-label">COORDINATE REGISTRY</div>
        {sections.map((s, i) => (
          <button
            key={s.addr}
            className={`hud-registry-item ${
              sectionIndex === i ? "active" : ""
            }`}
            onClick={() => jumpTo(i)}
          >
            <span className="reg-addr">{s.addr}</span>
            <span className="reg-name">{s.name}</span>
            <span className="reg-marker">
              {sectionIndex === i ? "◆" : "◇"}
            </span>
          </button>
        ))}
      </motion.div>

      {/* BOTTOM — temporal scrubber */}
      <motion.div
        className="hud hud-bottom"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE.transform }}
      >
        <span className="hud-key">WORLDLINE</span>
        <div className="scrubber">
          <div className="scrubber-track">
            <motion.div
              className="scrubber-fill"
              animate={{ width: `${(T / (sections.length - 1)) * 100}%` }}
              transition={{ duration: 0.2, ease: EASE.damped }}
            />
            {sections.map((s, i) => (
              <button
                key={s.addr}
                className={`scrubber-node ${sectionIndex === i ? "active" : ""}`}
                style={{ left: `${(i / (sections.length - 1)) * 100}%` }}
                onClick={() => jumpTo(i)}
              >
                <span className="scrubber-node-dot" />
                <span className="scrubber-node-label">{s.addr}</span>
              </button>
            ))}
          </div>
        </div>
        <span className="hud-hint">[ scroll · W A S D · 1-4 ]</span>
      </motion.div>

      {/* identity stamp — bottom left */}
      <motion.div
        className="hud hud-stamp"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {profile.name} · {profile.role}
      </motion.div>
    </>
  );
}
