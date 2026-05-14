import Manifold from "./Manifold";
import CameraRig from "./CameraRig";
import ProjectNodes from "./ProjectNodes";
import Worldline from "./Worldline";

// ════════════════════════════════════════════════════════════════
//  Scene
//  Everything inside the R3F canvas. The manifold is the persistent
//  background; project nodes and the worldline live at their own
//  coordinate anchors and only render when their section is in view
//  (a performance gate — no point ray-casting hidden nodes).
// ════════════════════════════════════════════════════════════════

export default function Scene({ cursor, T, sectionIndex, viewport }) {
  return (
    <>
      <CameraRig T={T} viewport={viewport} />

      {/* the manifold — always present, the spacetime fabric itself */}
      <Manifold cursor={cursor} warpStrength={1} />

      {/* project hypercube — render when near section 0x01 */}
      <ProjectNodes visible={T > 0.4 && T < 1.7} />

      {/* experience worldline — render when near section 0x02 */}
      <Worldline visible={T > 1.4 && T < 2.7} />
    </>
  );
}
