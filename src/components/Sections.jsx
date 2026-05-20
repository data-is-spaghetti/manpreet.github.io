import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { engine, profile, socials, skillBasis } from "../data/portfolio";
import { EASE } from "../lib/math";
import "./Sections.css";

// ════════════════════════════════════════════════════════════════
//  Section overlays
//  0x00 MAIN ENGINE and 0x03 SIGNAL BROADCAST render as fixed HTML
//  panels. 0x01 and 0x02 live in 3D space.
// ════════════════════════════════════════════════════════════════

// ── 0x00 — MAIN ENGINE ──
// Layout: name + statement up top, then spec strip + skills.
// The redundant "SOFTWARE ENGINEER" label is gone (it lives in the
// curtain, the section header, and the HUD identity stamp).
function MainEngine({ active }) {
  const [typed, setTyped] = useState("");
  const full = profile.coreVector;

  useEffect(() => {
    if (!active) {
      setTyped("");
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [active, full]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="section-panel engine-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE.reindex }}
        >
          <div className="engine-addr mono-label">
            SECTION 0x00 · MAIN ENGINE
          </div>

          <div className="engine-core">
            <h1 className="engine-name">{profile.name}</h1>
            <div className="engine-vector cursor-blink">{typed}</div>
            <p className="engine-statement">{engine.statement}</p>
          </div>

          <div className="engine-specs">
            {engine.specs.map((s) => (
              <div key={s.key} className="engine-spec">
                <span className="spec-key">{s.key}</span>
                <span className="spec-value">{s.value}</span>
                <span className="spec-note">{s.note}</span>
              </div>
            ))}
          </div>

          <div className="engine-skills">
            {Object.entries(skillBasis).map(([basis, items]) => (
              <div key={basis} className="skill-basis">
                <span className="skill-basis-label">{basis}</span>
                <span className="skill-basis-items">{items.join(" · ")}</span>
              </div>
            ))}
          </div>

          <a
            className="engine-resume"
            href={`${import.meta.env.BASE_URL}${profile.resumePath}`}
            target="_blank"
            rel="noreferrer"
          >
            ↓ DOWNLOAD RÉSUMÉ [PDF]
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── 0x03 — SIGNAL BROADCAST (terminal contact) ──
function SignalBroadcast({ active }) {
  const [line, setLine] = useState("");
  const [history, setHistory] = useState([
    { type: "sys", text: "SIGNAL BROADCAST TERMINAL · 0x03" },
    { type: "sys", text: "type 'help' for available channels" },
  ]);
  const inputRef = useRef();
  const historyRef = useRef();

  useEffect(() => {
    if (active && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [active]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const exec = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const out = [{ type: "in", text: `> ${raw}` }];

    if (cmd === "help") {
      out.push({
        type: "sys",
        text: "channels: " + socials.map((s) => s.label.toLowerCase()).join(", "),
      });
      out.push({ type: "sys", text: "commands: help, list, clear, whoami" });
    } else if (cmd === "list") {
      socials.forEach((s) =>
        out.push({ type: "out", text: `${s.label.padEnd(10)} ${s.handle}` })
      );
    } else if (cmd === "whoami") {
      out.push({ type: "out", text: `${profile.name} · ${profile.role}` });
      out.push({ type: "out", text: profile.origin });
    } else if (cmd === "clear") {
      setHistory([]);
      setLine("");
      return;
    } else if (cmd === "") {
      // noop
    } else {
      const match = socials.find((s) => s.label.toLowerCase() === cmd);
      if (match) {
        out.push({ type: "out", text: `opening channel: ${match.handle} ...` });
        window.open(match.url, match.url.startsWith("mailto:") ? "_self" : "_blank");
      } else {
        out.push({ type: "err", text: `unknown channel: ${cmd}` });
      }
    }
    setHistory((h) => [...h, ...out]);
    setLine("");
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="section-panel signal-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE.reindex }}
        >
          <div className="signal-addr mono-label">
            SECTION 0x03 · SIGNAL BROADCAST
          </div>
          <h2 className="signal-title">Open a channel.</h2>

          <div className="terminal">
            <div className="terminal-history" ref={historyRef} data-scrollable>
              {history.map((h, i) => (
                <div key={i} className={`term-line term-${h.type}`}>
                  {h.text}
                </div>
              ))}
            </div>
            <div className="terminal-input-row">
              <span className="terminal-prompt">signal@spacetime:~$</span>
              <input
                ref={inputRef}
                className="terminal-input"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") exec(line);
                }}
                spellCheck={false}
                autoComplete="off"
                placeholder="type a channel name..."
              />
            </div>
          </div>

          <div className="signal-direct">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target={s.url.startsWith("mailto:") ? "_self" : "_blank"}
                rel="noreferrer"
                className="signal-direct-link"
              >
                <span className="sdl-label">{s.label}</span>
                <span className="sdl-handle">{s.handle} ↗</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpatialLabel({ active, addr, name, hint }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="section-panel spatial-label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: EASE.transform }}
        >
          <div className="mono-label">{addr} · {name}</div>
          <div className="spatial-hint">{hint}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Sections({ T, sectionIndex }) {
  return (
    <>
      <MainEngine active={sectionIndex === 0 && T < 0.5} />
      <SpatialLabel
        active={sectionIndex === 1 && T > 0.5 && T < 1.5}
        addr="0x01"
        name="PROOFS & IMPLEMENTATIONS"
        hint="hover a node to project its architecture · W/A/S/D to traverse"
      />
      <SpatialLabel
        active={sectionIndex === 2 && T > 1.5 && T < 2.5}
        addr="0x02"
        name="TEMPORAL LATTICE"
        hint="the causal worldline · green branch = concurrent engineering"
      />
      <SignalBroadcast active={sectionIndex === 3 && T > 2.5} />
    </>
  );
}
