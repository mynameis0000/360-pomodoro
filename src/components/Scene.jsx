// Scene.jsx
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Clock3D from "./Clock3D";

export default function Scene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }} // 배경 투명을 위해 alpha: true
      camera={{ position: [0, 1.5, 18], fov: 40 }}
      /* [핵심] CSS로 제어하기 위해 캔버스 자체 스타일 지정 */
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1, // UI 레이어(100)보다 낮은 숫자
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 5]} intensity={2} />
      
      {/* 바닥 그림자 제거 상태 유지 */}
      
      <Clock3D />
      <Environment preset="studio" />
    </Canvas>
  );
}