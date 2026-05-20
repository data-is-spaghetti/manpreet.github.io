// ════════════════════════════════════════════════════════════════
//  MATH — deterministic motion. No generic ease-in-out.
//  Easing derived from a critically damped harmonic oscillator:
//  the fastest approach to a target with zero overshoot.
// ════════════════════════════════════════════════════════════════

// Critically damped step. Given current value, velocity, target, and
// dt, returns [newValue, newVelocity]. omega = stiffness.
// This is the physically-correct "snap to target" — what a well-tuned
// servo does. No oscillation, no overshoot, deterministic.
export function criticallyDamped(current, velocity, target, omega, dt) {
  // closed-form solution of x'' + 2*omega*x' + omega^2*(x - target) = 0
  const x = current - target;
  const exp = Math.exp(-omega * dt);
  const newX = (x + (velocity + omega * x) * dt) * exp;
  const newV = (velocity - (velocity + omega * x) * omega * dt) * exp;
  return [newX + target, newV];
}

// Critically damped easing as a 0..1 normalized curve (for framer-motion).
// Sampled and fit — gives that precise "instrument settling" feel.
export function dampedEase(t) {
  // omega tuned so it visually settles at t=1
  const omega = 6.0;
  const x = 1 - (1 + omega * t) * Math.exp(-omega * t);
  return Math.min(1, x / (1 - (1 + omega) * Math.exp(-omega)));
}

// framer-motion cubic-bezier approximations of damped curves.
// These are NOT the default easings — derived to mimic damped response.
export const EASE = {
  // critically damped — fast out, precise settle
  damped: [0.16, 1, 0.3, 1],
  // high-speed coordinate transform — near-instant with a hair of settle
  transform: [0.7, 0, 0.2, 1],
  // instantaneous re-index — almost linear, very fast
  reindex: [0.9, 0, 0.1, 1],
};

// ── Vector helpers ──
export const vec = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  scale: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  len: (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]),
  lerp: (a, b, t) => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ],
  // angle of approach in the XY plane — for directional hover feedback
  angle2d: (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]),
};

// clamp
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// map a value from one range to another
export const remap = (v, inLo, inHi, outLo, outHi) =>
  outLo + ((v - inLo) / (inHi - inLo)) * (outHi - outLo);

// deterministic pseudo-random — same seed, same sequence.
// (mulberry32) — used so the particle grid is identical every load.
export function seededRandom(seed) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// format a number as a fixed-width hex-ish coordinate string
export function fmtCoord(n) {
  const sign = n >= 0 ? "+" : "-";
  return sign + Math.abs(n).toFixed(2);
}

// ════════════════════════════════════════════════════════════════
//  Fibonacci sphere layout — N points distributed evenly on a sphere.
//
//  Why: when you naively place points by lat/lon, they cluster at the
//  poles. The Fibonacci spiral uses the golden angle to walk around the
//  sphere in a way that no two points ever land close together.
//
//  Used by NASA for satellite placement, by R3F demos for particles, and
//  here for project nodes — so adding more projects just redistributes,
//  never overflows the viewport.
//
//  Returns an array of [x, y, z] tuples on a sphere of given radius.
//  We compress the Z axis a bit so projects don't sit too far behind
//  the camera frustum.
// ════════════════════════════════════════════════════════════════
export function fibonacciSphere(count, radius = 1.6, zSquash = 0.7) {
  if (count <= 0) return [];
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

  for (let i = 0; i < count; i++) {
    // y goes from +1 to -1 evenly
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(1 - y * y); // radius at this y slice
    const theta = phi * i;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    points.push([x * radius, y * radius, z * radius * zSquash]);
  }
  return points;
}
