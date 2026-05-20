import Manifold from "./Manifold";
import CameraRig from "./CameraRig";
import ProjectNodes from "./ProjectNodes";

// ════════════════════════════════════════════════════════════════
//  Scene
//  Everything inside the R3F canvas. Manifold is the persistent
//  background; project nodes live at their own coordinate anchor
//  and only render when their section is in view.
//  Experience (0x02) is rendered as a 2D overlay (WorldlineOverlay),
//  not as 3D content here — dense text is unreadable in 3D space.
// ════════════════════════════════════════════════════════════════

export default function Scene({ cursor, T, sectionIndex, viewport }) {
  return (
    <>
      <CameraRig T={T} viewport={viewport} />

      {/* the manifold — always present, the spacetime fabric itself */}
      <Manifold cursor={cursor} warpStrength={1} />

      {/* project hypercube — render when near section 0x01 */}
      <ProjectNodes visible={T > 0.4 && T < 1.7} />
    </>
  );
}
