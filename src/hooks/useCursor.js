import { useRef, useEffect } from "react";

// ════════════════════════════════════════════════════════════════
//  useCursor
//  Tracks the pointer in normalized device coords (-1..1).
//  Returns a ref (not state) — the canvas reads it every frame,
//  so we never trigger React re-renders from mouse movement.
// ════════════════════════════════════════════════════════════════

export function useCursor() {
  const cursor = useRef({
    x: 0, y: 0,        // normalized -1..1
    active: 0,          // 0..1 — fades effect when pointer leaves
    raw: { x: 0, y: 0 },
  });

  useEffect(() => {
    const onMove = (e) => {
      cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      cursor.current.raw.x = e.clientX;
      cursor.current.raw.y = e.clientY;
      cursor.current.active = 1;
    };
    const onLeave = () => {
      cursor.current.active = 0;
    };
    const onEnter = () => {
      cursor.current.active = 1;
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return cursor;
}
