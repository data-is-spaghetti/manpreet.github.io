import { useState, useEffect, useRef, useCallback } from "react";
import { criticallyDamped, clamp } from "../lib/math";

// ════════════════════════════════════════════════════════════════
//  useSpacetimeNav
//  Replaces traditional scroll with a coordinate system.
//  - W/A/S/D or arrows: traverse the manifold (X/Y viewport vector)
//  - wheel / Z-X keys: step through T (temporal interval = section)
//  - jumpTo(index): high-speed coordinate transform to a section
//
//  The viewport vector and T are critically damped — they settle
//  into targets with zero overshoot.
// ════════════════════════════════════════════════════════════════

const SECTION_COUNT = 4; // 0x00..0x03

export function useSpacetimeNav() {
  // T = which temporal interval (section) we're at. Continuous 0..3.
  const [T, setT] = useState(0);
  // free-look viewport offset within a section
  const [viewport, setViewport] = useState([0, 0]);

  // refs for the physics loop
  const state = useRef({
    T: 0, Tv: 0, Ttarget: 0,
    vx: 0, vxv: 0, vxTarget: 0,
    vy: 0, vyv: 0, vyTarget: 0,
    keys: new Set(),
    raf: 0,
    last: performance.now(),
  });

  const sectionIndex = Math.round(T);

  // jump to a section via high-speed coordinate transform
  const jumpTo = useCallback((index) => {
    const i = clamp(index, 0, SECTION_COUNT - 1);
    state.current.Ttarget = i;
    // reset free-look on jump
    state.current.vxTarget = 0;
    state.current.vyTarget = 0;
  }, []);

  const stepT = useCallback((dir) => {
    const next = clamp(Math.round(state.current.Ttarget) + dir, 0, SECTION_COUNT - 1);
    state.current.Ttarget = next;
    state.current.vxTarget = 0;
    state.current.vyTarget = 0;
  }, []);

  useEffect(() => {
    const s = state.current;

    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      // ignore when typing in the contact terminal
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      s.keys.add(k);

      // T stepping
      if (k === "z" || k === "[") stepT(-1);
      if (k === "x" || k === "]") stepT(1);
      // number keys jump directly
      if (["1", "2", "3", "4"].includes(k)) jumpTo(parseInt(k, 10) - 1);
      // home
      if (k === "0") jumpTo(0);
    };
    const onKeyUp = (e) => s.keys.delete(e.key.toLowerCase());

    // wheel steps through T (re-purposed, not scroll)
    let wheelLock = false;
    const onWheel = (e) => {
      if (e.target.closest("[data-scrollable]")) return; // let panels scroll
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      setTimeout(() => (wheelLock = false), 280);
      stepT(e.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("wheel", onWheel, { passive: false });

    // physics loop — critically damped settle
    const tick = () => {
      const now = performance.now();
      let dt = (now - s.last) / 1000;
      s.last = now;
      dt = Math.min(dt, 0.05); // clamp big frame gaps

      // read movement keys into free-look targets
      const speed = 2.6;
      let tx = s.vxTarget;
      let ty = s.vyTarget;
      if (s.keys.has("a") || s.keys.has("arrowleft")) tx = -speed;
      else if (s.keys.has("d") || s.keys.has("arrowright")) tx = speed;
      else tx = 0;
      if (s.keys.has("w") || s.keys.has("arrowup")) ty = speed;
      else if (s.keys.has("s") || s.keys.has("arrowdown")) ty = -speed;
      else ty = 0;
      s.vxTarget = tx;
      s.vyTarget = ty;

      // integrate free-look (faster settle)
      [s.vx, s.vxv] = criticallyDamped(s.vx, s.vxv, s.vxTarget, 7, dt);
      [s.vy, s.vyv] = criticallyDamped(s.vy, s.vyv, s.vyTarget, 7, dt);

      // integrate T (coordinate transform — snappier omega)
      [s.T, s.Tv] = criticallyDamped(s.T, s.Tv, s.Ttarget, 9, dt);

      // commit to react state (throttle-ish — only when meaningfully changed)
      setT((prev) => (Math.abs(prev - s.T) > 0.0005 ? s.T : prev));
      setViewport((prev) =>
        Math.abs(prev[0] - s.vx) > 0.001 || Math.abs(prev[1] - s.vy) > 0.001
          ? [s.vx, s.vy]
          : prev
      );

      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(s.raf);
    };
  }, [jumpTo, stepT]);

  return { T, sectionIndex, viewport, jumpTo, stepT };
}
