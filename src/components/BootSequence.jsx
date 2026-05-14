import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "../lib/math";
import "./BootSequence.css";

// ════════════════════════════════════════════════════════════════
//  BootSequence
//  A diegetic boot readout. Not a tutorial popup — the "system"
//  reporting its own interface. Teaches navigation by showing it,
//  then dissolves into the persistent HUD.
// ════════════════════════════════════════════════════════════════

const LINES = [
  { txt: "SPACETIME ENGINE v1.0.0", cls: "boot-amber", delay: 0.1 },
  { txt: "initializing manifold ........... OK", cls: "boot-dim", delay: 0.5 },
  { txt: "loading worldline data .......... OK", cls: "boot-dim", delay: 0.8 },
  { txt: "calibrating coordinate basis .... OK", cls: "boot-dim", delay: 1.1 },
  { txt: "", cls: "", delay: 1.3 },
  { txt: "INTERFACE", cls: "boot-amber", delay: 1.5 },
  { txt: "[ W A S D ]  traverse manifold", cls: "boot-white", delay: 1.7 },
  { txt: "[ SCROLL  ]  step temporal interval T", cls: "boot-white", delay: 1.9 },
  { txt: "[ 1-4 KEY ]  jump to coordinate", cls: "boot-white", delay: 2.1 },
  { txt: "[ CLICK   ]  select node", cls: "boot-white", delay: 2.3 },
  { txt: "", cls: "", delay: 2.5 },
  { txt: "system ready_", cls: "boot-green", delay: 2.7 },
];

export default function BootSequence({ onComplete }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onComplete?.();
    }, 3800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE.reindex } }}
        >
          <div className="boot-inner">
            {LINES.map((line, i) => (
              <motion.div
                key={i}
                className={`boot-line ${line.cls}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: line.delay, ease: EASE.transform }}
              >
                {line.txt || "\u00A0"}
              </motion.div>
            ))}
          </div>
          <motion.div
            className="boot-skip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            onClick={() => {
              setDone(true);
              onComplete?.();
            }}
          >
            [ skip ]
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
