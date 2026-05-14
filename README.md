# Manpreet Kaur — "The Geometry of Spacetime"

A software engineering portfolio rendered as a navigable coordinate
system. React + React Three Fiber + Framer Motion.

The career timeline and project repository are treated as a deterministic
spacetime manifold. You don't scroll — you traverse.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/manpreet.github.io/`

## Navigation

- **W A S D** / arrow keys — traverse the manifold (free-look within a section)
- **Scroll wheel** — step through temporal intervals (T)
- **1–4** — jump directly to a coordinate (section)
- **Z / X** — step T backward / forward
- **Click** a registry item or scrubber node — coordinate jump
- Hover a **project node** — projects its architecture breakdown

A boot sequence on first load teaches these. There's a 2D fallback for
browsers without WebGL.

## Structure

```
src/
  App.jsx                 orchestrator + WebGL detection
  styles.css              global — absolute black, monospace scale
  data/portfolio.js       ALL content lives here
  lib/math.js             critically-damped easing, vector helpers
  shaders/manifold.js     gravitational-lensing vertex/fragment shaders
  hooks/
    useSpacetimeNav.js    spatial navigation (replaces scroll)
    useCursor.js          pointer tracking for the lensing effect
  components/
    Scene.jsx             assembles all 3D content
    Manifold.jsx          the particle grid + lensing
    CameraRig.jsx         camera = viewport vector; section anchors
    ProjectNodes.jsx      projects as 3D hypercube nodes
    Worldline.jsx         experience as a causal worldline
    HUD.jsx               coordinate readout, registry, scrubber
    Sections.jsx          0x00 hero + 0x03 terminal overlays
    BootSequence.jsx      diegetic intro
    Fallback.jsx          2D no-WebGL version
```

## Editing content

**Everything is in `src/data/portfolio.js`:**

- `profile` — name, role, core vector, resume path
- `engine` — hero statement + spec readout
- `projects` — each has a `coord` placing it in 3D space
- `worldline` — experience events along the causal line
- `events` — awards (rendered as marked events)
- `skillBasis` — skill groups
- `socials` — contact channels (also the terminal commands)

To move a project node in space, change its `coord: [x, y, z]`.
Section anchor positions are in `components/CameraRig.jsx` (`SECTION_ANCHORS`).

## Add your résumé

Drop `Manpreet_Kaur_Resume.pdf` into `/public`. See
`public/RESUME_INSTRUCTIONS.txt`.

## The math

Motion is **not** generic ease-in-out. `lib/math.js` implements a
critically damped harmonic oscillator — the physically-correct fastest
approach to a target with zero overshoot. Navigation, camera, and HUD
transitions all settle through it. The particle grid is generated with
a seeded RNG, so the manifold is byte-identical every load.

The vertex shader (`shaders/manifold.js`) displaces grid points along a
1/r potential gradient toward the cursor — a gravitational-lensing
approximation — with a tangential swirl term for frame-dragging flavour.

## Deploy to GitHub Pages

Repo: `data-is-spaghetti/manpreet.github.io`

```bash
git add .
git commit -m "Spacetime portfolio"
git push
```

Then on GitHub: **Settings → Pages → Source → GitHub Actions**.
The workflow in `.github/workflows/deploy.yml` builds and deploys.
Live at `https://data-is-spaghetti.github.io/manpreet.github.io/`

For a cleaner URL, rename the repo to `data-is-spaghetti.github.io`,
then set `base: '/'` in `vite.config.js`.

## Performance notes

- Three.js is split into its own cached chunk (~176KB gz)
- The particle grid is a single instanced draw call
- Cursor tracking uses a ref, never React state — zero re-renders on move
- Project nodes / worldline only mount when their section is in view
- Targets 60fps; the 2D fallback covers weak GPUs

## Tech

React 18 · React Three Fiber · @react-three/drei · Three.js ·
Framer Motion · Vite · JetBrains Mono
