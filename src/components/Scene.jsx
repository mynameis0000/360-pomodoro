// src/components/Scene.jsx
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls
} from "@react-three/drei";
import Clock3D from "./Clock3D";

export default function Scene({
  progress,
  timeLeft
}) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{
        position: [0, 1.5, 18],
        fov: 35
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
      />

      <Clock3D
        progress={progress}
        timeLeft={timeLeft}
      />

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}

        // 핵심
        minPolarAngle={0}
        maxPolarAngle={Math.PI}

        // 부드러운 관성
        enableDamping
        dampingFactor={0.08}

        rotateSpeed={1.2}
      />
    </Canvas>
  );
}