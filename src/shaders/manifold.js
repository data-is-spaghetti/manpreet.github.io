// ════════════════════════════════════════════════════════════════
//  MANIFOLD SHADERS
//  A particle grid perturbed by cursor proximity — simulating
//  gravitational lensing / spacetime curvature around a mass.
//  The "mass" is the cursor; the grid is the Lorentzian manifold.
// ════════════════════════════════════════════════════════════════

export const manifoldVertex = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCursor;        // cursor position projected into manifold space
  uniform float uCursorActive; // 0..1 — fades the effect in/out
  uniform float uWarpStrength;

  attribute float aIndex;      // per-particle index, for deterministic variation

  varying float vDepth;        // for fragment shading
  varying float vWarp;         // how much this vertex was displaced

  void main() {
    vec3 pos = position;

    // ── gravitational lensing ──
    // displacement falls off with distance from the cursor "mass",
    // like a 1/r potential well. The grid sinks toward the cursor
    // and warps around it.
    vec3 toCursor = uCursor - pos;
    float dist = length(toCursor);
    float falloff = 1.0 / (1.0 + dist * dist * 0.6);

    // pull along the gradient — toward the mass, then a slight
    // tangential swirl (frame-dragging flavour)
    vec3 pull = normalize(toCursor + vec3(0.0001)) * falloff;
    float swirl = falloff * 0.4;
    vec3 tangent = vec3(-toCursor.y, toCursor.x, 0.0) * swirl * 0.15;

    vec3 displaced = pos
      + pull * uWarpStrength * uCursorActive * 1.6
      + tangent * uCursorActive;

    // ── ambient breathing ──
    // a slow deterministic wave so the manifold is never fully static
    float wave = sin(uTime * 0.4 + aIndex * 0.0007) * 0.06
               + cos(uTime * 0.27 + pos.x * 0.5) * 0.04;
    displaced.z += wave;

    vWarp = falloff * uCursorActive;
    vDepth = displaced.z;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // particles shrink with distance, grow when warped
    float size = 2.2 + vWarp * 6.0;
    gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`;

export const manifoldFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uColorBase;   // white-ish
  uniform vec3 uColorWarp;   // amber — highlights the lensed region

  varying float vDepth;
  varying float vWarp;

  void main() {
    // round points with a soft edge
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);

    // base brightness from depth, boosted hard where the grid is warped
    float bright = 0.22 + vDepth * 0.12;
    vec3 color = mix(uColorBase * bright, uColorWarp, vWarp * 0.9);

    // warped particles glow
    alpha *= (0.5 + vWarp * 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ── connecting-line shader (the lattice edges) ──
export const latticeVertex = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCursor;
  uniform float uCursorActive;
  uniform float uWarpStrength;

  varying float vWarp;

  void main() {
    vec3 pos = position;
    vec3 toCursor = uCursor - pos;
    float dist = length(toCursor);
    float falloff = 1.0 / (1.0 + dist * dist * 0.6);
    vec3 pull = normalize(toCursor + vec3(0.0001)) * falloff;
    vec3 displaced = pos + pull * uWarpStrength * uCursorActive * 1.6;

    float wave = sin(uTime * 0.4) * 0.06;
    displaced.z += wave;

    vWarp = falloff * uCursorActive;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const latticeFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColorBase;
  uniform vec3 uColorWarp;
  varying float vWarp;

  void main() {
    vec3 color = mix(uColorBase, uColorWarp, vWarp);
    float alpha = 0.04 + vWarp * 0.35;
    gl_FragColor = vec4(color, alpha);
  }
`;
