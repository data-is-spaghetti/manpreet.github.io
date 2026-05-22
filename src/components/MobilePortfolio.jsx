import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  profile,
  socials,
  skillBasis,
  projects,
  worldline,
  events,
} from "../data/portfolio";
import "./MobilePortfolio.css";

// ════════════════════════════════════════════════════════════════
//  MobilePortfolio
//
//  A purpose-built 2D mobile layout. Not a degraded fallback —
//  a different experience designed for touch and small screens.
//
//  Why no 3D here:
//  1. Mobile GPUs can't sustain 60fps WebGL particle fields
//  2. W/A/S/D navigation doesn't exist on touchscreens
//  3. Fixed-position HUD panels eat 70%+ of a 390px screen
//
//  Same data, same design language, different renderer.
// ════════════════════════════════════════════════════════════════

// Reusable reveal animation.
// useInView watches whether the element has entered the viewport —
// when it has, we animate it in. `once: true` means it only fires
// once (not every time you scroll past it).
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  // once:true + margin:-60px means "trigger when 60px of the
  // element is visible" — avoids firing too early
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Section wrapper — gives each section its address label + border
function Section({ addr, label, children }) {
  return (
    <section className="mob-section">
      <div className="mob-section-header">
        <span className="mob-addr">{addr}</span>
        <span className="mob-section-label">{label}</span>
      </div>
      {children}
    </section>
  );
}

export default function MobilePortfolio() {
  return (
    // mob-root overrides the body's overflow:hidden with its own
    // scroll context — the key fix that makes mobile navigable
    <div className="mob-root">

      {/* ── HEADER ── */}
      <header className="mob-header">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mob-addr-small">0x00 · MAIN ENGINE</div>
          <h1 className="mob-name">{profile.name}</h1>
          <div className="mob-role">{profile.role}</div>
          <p className="mob-statement">{profile.coreVector}</p>
          <div className="mob-meta">
            <span>{profile.location}</span>
            <span className="mob-dot">·</span>
            <span className="mob-status">{profile.status}</span>
          </div>
        </motion.div>

        <motion.a
          className="mob-resume-btn"
          href={`${import.meta.env.BASE_URL}${profile.resumePath}`}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          ↓ Download Résumé [DOC]
        </motion.a>
      </header>

      {/* ── SKILLS ── */}
      <Section addr="0x01" label="CAPABILITIES">
        {Object.entries(skillBasis).map(([group, items], i) => (
          <Reveal key={group} delay={i * 0.05}>
            <div className="mob-skill-row">
              <span className="mob-skill-group">{group}</span>
              <div className="mob-skill-tags">
                {items.map((item) => (
                  <span key={item} className="mob-tag">{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </Section>

      {/* ── PROJECTS ── */}
      <Section addr="0x02" label="PROJECTS">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="mob-project">
              <div className="mob-project-head">
                <div>
                  <div className="mob-project-title">{p.title}</div>
                  <div className="mob-project-sub">{p.subtitle}</div>
                </div>
                <span className="mob-project-year">{p.year}</span>
              </div>

              <p className="mob-project-desc">{p.summary}</p>

              <div className="mob-project-metrics">
                {p.metrics.map((m) => (
                  <div key={m.label} className="mob-metric">
                    <span className="mob-metric-label">{m.label}</span>
                    <span className="mob-metric-value">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="mob-tags-row">
                {p.stack.map((t) => (
                  <span key={t} className="mob-tag">{t}</span>
                ))}
              </div>

              {p.links.length > 0 && (
                <div className="mob-project-links">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mob-link-btn"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section addr="0x03" label="EXPERIENCE">
        <div className="mob-timeline">
          {worldline.map((e, i) => (
            <Reveal key={e.role + e.t} delay={i * 0.08}>
              <div className={`mob-event ${e.branch ? "mob-branch" : ""}`}>
                <div className="mob-event-marker" />
                <div className="mob-event-body">
                  <div className="mob-event-period">{e.period}</div>
                  <div className="mob-event-role">{e.role}</div>
                  <div className="mob-event-org">{e.org}</div>
                  <p className="mob-event-desc">{e.event}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* awards as a separate block below the timeline */}
        <div className="mob-awards">
          <div className="mob-awards-label">RECOGNITION</div>
          {events.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 0.06}>
              <div className="mob-award">
                <span className="mob-award-year">{ev.year}</span>
                <div className="mob-award-right">
                  <div className="mob-award-title">{ev.label}</div>
                  <div className="mob-award-note">{ev.note}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── CONTACT ── */}
      <Section addr="0x04" label="CONTACT">
        <p className="mob-contact-note">
          Open to software engineering roles and good conversations.
        </p>
        <div className="mob-socials">
          {socials.map((s) => (
            <Reveal key={s.label}>
              <a
                href={s.url}
                target={s.url.startsWith("mailto:") ? "_self" : "_blank"}
                rel="noreferrer"
                className="mob-social-link"
              >
                <span className="mob-social-label">{s.label}</span>
                <span className="mob-social-handle">{s.handle} ↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <footer className="mob-footer">
        <span>{profile.name}</span>
        <span className="mob-dot">·</span>
        <span>{profile.location}</span>
        <span className="mob-dot">·</span>
        <span>Built with React + Three.js</span>
      </footer>
    </div>
  );
}
