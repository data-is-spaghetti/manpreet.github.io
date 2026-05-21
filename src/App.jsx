import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import HUD from "./components/HUD";
import Sections from "./components/Sections";
import BootSequence from "./components/BootSequence";
import Fallback from "./components/Fallback";
import MobilePortfolio from "./components/MobilePortfolio";
import { useSpacetimeNav } from "./hooks/useSpacetimeNav";
import { useCursor } from "./hooks/useCursor";

// ════════════════════════════════════════════════════════════════
//  App — "The Geometry of Spacetime"
//  Layers (back to front):
//    1. R3F Canvas — the manifold + 3D content
//    2. UI layer — HUD, section overlays
//    3. Boot sequence — diegetic intro
//  Navigation is spatial (useSpacetimeNav), cursor drives lensing.
//
//  Mobile (<768px): bypasses 3D entirely → MobilePortfolio.
//  Why checked BEFORE hooks: React's Rules of Hooks require hooks
//  to be called unconditionally. The mobile check is a plain JS
//  expression (not a hook), so it can safely gate the return value.
//  The hooks below still run on mobile — they're just not used.
// ════════════════════════════════════════════════════════════════

// quick WebGL capability probe
function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

// mobile detection — checked once at load, not reactive.
// If someone rotates from portrait to landscape mid-session, they'd
// need to refresh. Acceptable tradeoff — avoids complex resize logic.
const isMobile = window.innerWidth < 768;

export default function App() {
  const hasWebGL = useMemo(detectWebGL, []);
  const [booted, setBooted] = useState(false);

  // hooks must always be called — Rules of Hooks.
  // useCursor and useSpacetimeNav are no-ops on mobile since
  // MobilePortfolio doesn't consume them, but they must still run.
  const cursor = useCursor();
  const { T, sectionIndex, viewport, jumpTo } = useSpacetimeNav();

  // mobile: skip 3D entirely, render the purpose-built 2D layout
  if (isMobile) {
    return <MobilePortfolio />;
  }

  // no WebGL on desktop: render the plain 2D fallback
  if (!hasWebGL) {
    return <Fallback />;
  }

  return (
    <>
      {/* ── 3D CANVAS LAYER ── */}
      <div className="canvas-layer">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 55, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 8, 22]} />
          <Scene
            cursor={cursor}
            T={T}
            sectionIndex={sectionIndex}
            viewport={viewport}
          />
        </Canvas>
      </div>

      {/* ── UI LAYER ── */}
      <div className="ui-layer">
        <HUD
          T={T}
          sectionIndex={sectionIndex}
          viewport={viewport}
          jumpTo={jumpTo}
        />
        <Sections T={T} sectionIndex={sectionIndex} />
      </div>

      {/* ── OVERLAYS ── */}
      <div className="crt-overlay" />
      <div className="vignette-overlay" />

      {/* ── BOOT ── */}
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
    </>
  );
}
