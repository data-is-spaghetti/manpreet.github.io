import { profile, engine, projects, worldline, events, socials, skillBasis } from "../data/portfolio";
import "./Fallback.css";

// ════════════════════════════════════════════════════════════════
//  Fallback
//  A clean 2D version for environments without WebGL. Same content,
//  same design language — just static and scrollable. Nobody gets
//  a blank screen.
// ════════════════════════════════════════════════════════════════

export default function Fallback() {
  return (
    <div className="fallback" data-scrollable>
      <div className="fb-notice mono-label">
        [ 2D MODE — WebGL unavailable. Full spacetime interface requires a
        WebGL-capable browser. ]
      </div>

      {/* 0x00 */}
      <section className="fb-section">
        <div className="mono-label">0x00 — MAIN ENGINE</div>
        <div className="fb-role">{profile.role}</div>
        <h1 className="fb-name">{profile.name}</h1>
        <div className="fb-vector">{profile.coreVector}</div>
        <p className="fb-statement">{engine.statement}</p>
        <div className="fb-specs">
          {engine.specs.map((s) => (
            <div key={s.key} className="fb-spec">
              <span className="dim">{s.key}</span>
              <strong>{s.value}</strong>
              <span className="dim">{s.note}</span>
            </div>
          ))}
        </div>
        <a
          className="fb-resume"
          href={`${import.meta.env.BASE_URL}${profile.resumePath}`}
          target="_blank"
          rel="noreferrer"
        >
          ↓ DOWNLOAD RÉSUMÉ [PDF]
        </a>
      </section>

      {/* skills */}
      <section className="fb-section">
        <div className="mono-label">CAPABILITY BASIS</div>
        {Object.entries(skillBasis).map(([k, items]) => (
          <div key={k} className="fb-skill-row">
            <span className="amber">{k}</span>
            <span className="dim">{items.join(" · ")}</span>
          </div>
        ))}
      </section>

      {/* 0x01 */}
      <section className="fb-section">
        <div className="mono-label">0x01 — PROOFS &amp; IMPLEMENTATIONS</div>
        {projects.map((p) => (
          <div key={p.id} className="fb-project">
            <div className="fb-project-head">
              <span className="amber">{p.id}</span>
              <strong>{p.title}</strong>
              <span className="dim">{p.org} · {p.year}</span>
            </div>
            <p className="fb-project-arch">{p.architecture}</p>
            <div className="fb-metrics">
              {p.metrics.map((m) => (
                <span key={m.label} className="fb-metric">
                  <span className="dim">{m.label}</span> <span className="green">{m.value}</span>
                </span>
              ))}
            </div>
            <div className="fb-stack">{p.stack.join(" · ")}</div>
            {p.links.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="fb-link">
                {l.label} ↗
              </a>
            ))}
          </div>
        ))}
      </section>

      {/* 0x02 */}
      <section className="fb-section">
        <div className="mono-label">0x02 — TEMPORAL LATTICE</div>
        {worldline.map((e) => (
          <div key={e.role + e.t} className={`fb-event ${e.branch ? "branch" : ""}`}>
            <div className="fb-event-period">{e.period}</div>
            <strong>{e.role}</strong>
            <span className="green"> · {e.org}</span>
            <p className="fb-event-desc">{e.event}</p>
          </div>
        ))}
        <div className="fb-awards">
          {events.map((ev) => (
            <div key={ev.label} className="fb-award">
              <span className="amber">{ev.year}</span>
              <strong>{ev.label}</strong>
              <span className="dim">{ev.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 0x03 */}
      <section className="fb-section">
        <div className="mono-label">0x03 — SIGNAL BROADCAST</div>
        <h2 className="fb-contact-title">Open a channel.</h2>
        <div className="fb-socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target={s.url.startsWith("mailto:") ? "_self" : "_blank"}
              rel="noreferrer"
              className="fb-social"
            >
              <span className="dim">{s.label}</span>
              <span>{s.handle} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="fb-footer">
        {profile.name} · {profile.role} · {profile.location}
      </footer>
    </div>
  );
}
