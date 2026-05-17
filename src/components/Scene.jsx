// src/components/Scene.jsx
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Clock3D from "./Clock3D";

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      // 원작의 느낌을 살리기 위해 카메라 거리와 화각(fov)을 조정합니다.
      camera={{ position: [0, 1.5, 18], fov: 35 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1, // UI(글자) 레이어보다 뒤에 배치
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 5]} intensity={2} />
      
      {/* 바닥 그림자는 제거하고 물체만 공중에 띄웁니다. */}
      <Clock3D />
      
      <Environment preset="studio" />
    </Canvas>
  );
}