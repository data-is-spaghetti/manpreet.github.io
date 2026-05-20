import { motion, AnimatePresence } from "framer-motion";
import { worldline, events } from "../data/portfolio";
import { EASE } from "../lib/math";
import "./WorldlineOverlay.css";

// ════════════════════════════════════════════════════════════════
//  WorldlineOverlay
//  A 2D vertical timeline rendered in the UI layer over the manifold.
//  Roles on the right of the line, awards on the left, branch indented.
//  The 3D background still does its thing behind this overlay.
// ════════════════════════════════════════════════════════════════

export default function WorldlineOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="section-panel worldline-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE.reindex }}
        >
          <div className="wlo-header">
            <div className="mono-label">SECTION 0x02 · TEMPORAL LATTICE</div>
            <div className="wlo-hint">the causal worldline · green branch = concurrent engineering</div>
          </div>

          <div className="wlo-grid">
            {/* LEFT COLUMN — awards */}
            <div className="wlo-awards" data-scrollable>
              <div className="wlo-col-label">AWARDS &amp; RECOGNITION</div>
              {events.map((ev, i) => (
                <motion.div
                  key={ev.label}
                  className="wlo-award"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE.transform }}
                >
                  <span className="wlo-award-marker" />
                  <div className="wlo-award-body">
                    <div className="wlo-award-year">{ev.year}</div>
                    <div className="wlo-award-label">{ev.label}</div>
                    <div className="wlo-award-note">{ev.note}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CENTER COLUMN — the causal worldline */}
            <div className="wlo-line">
              <div className="wlo-line-spine" />
              <motion.div
                className="wlo-line-pulse"
                animate={{ y: ["0%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* RIGHT COLUMN — experience events */}
            <div className="wlo-events" data-scrollable>
              <div className="wlo-col-label">EXPERIENCE</div>
              {worldline.map((e, i) => (
                <motion.div
                  key={e.role + e.t}
                  className={`wlo-event ${e.branch === "concurrent" ? "wlo-branch" : ""}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: EASE.transform }}
                >
                  <span className="wlo-event-marker" />
                  <div className="wlo-event-body">
                    <div className="wlo-event-period">{e.period}</div>
                    <div className="wlo-event-role">{e.role}</div>
                    <div className="wlo-event-org">{e.org}</div>
                    <div className="wlo-event-desc">{e.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
