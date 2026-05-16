import { Canvas } from "@react-three/fiber";

import {
  Environment,
  ContactShadows
} from "@react-three/drei";

import Clock3D from "./Clock3D";

export default function Scene() {

  return (
    <Canvas
      shadows
      camera={{
        position: [0, 1.5, 8],
        fov: 40
      }}
    >

      {/* 배경 */}
      <color
        attach="background"
        args={["#111111"]}
      />



      {/* 조명 */}
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2.5}
        castShadow
      />



      {/* 바닥 그림자 */}
      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.45}
        scale={20}
        blur={2}
        far={5}
      />



      {/* 3D 타이머 */}
      <Clock3D progress={0.75} />



      {/* 환경광 */}
      <Environment preset="studio" />

    </Canvas>
  );
}