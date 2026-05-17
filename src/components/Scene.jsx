import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Environment, 
  ContactShadows, 
  Float, 
  PerspectiveCamera 
} from "@react-three/drei";
import * as THREE from "three";
import Clock3D from "./Clock3D";

function SceneContent({ progress, timeLeft, isFinished }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    if (isFinished) {
      const t = state.clock.getElapsedTime();
      // 종료 시 진동 효과
      groupRef.current.position.x = Math.sin(t * 50) * 0.05;
      groupRef.current.position.y = Math.cos(t * 40) * 0.05;
      
      // 배경색 변경이 필요하다면 state.scene을 사용하세요
      // state.scene.background = new THREE.Color('#ff0000'); 
    } else {
      groupRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={isFinished ? 10 : 2}
        rotationIntensity={isFinished ? 2 : 0.5} 
        floatIntensity={isFinished ? 3 : 0.5}
      >
        <Clock3D 
          progress={progress} 
          timeLeft={timeLeft} 
          isFinished={isFinished} 
        />
      </Float>
    </group>
  );
}

export default function Scene({ progress, timeLeft, isFinished }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true, 
          toneMappingExposure: 1.2 
        }}
        shadows
      >
        {/* 카메라 위치를 15로 설정 (Clock3D의 intro 위치와 맞춤) */}
        <PerspectiveCamera makeDefault position={[0, 0.5, 18]} fov={35} />

        <ambientLight intensity={0.4} /> 
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={isFinished ? 5 : 2}
          color={isFinished ? "#ff0000" : "#ffffff"}
          castShadow 
        />
        
        <Environment preset="city" /> 

        <SceneContent 
          progress={progress} 
          timeLeft={timeLeft} 
          isFinished={isFinished} 
        />

        <ContactShadows
          position={[0, -4.5, 0]}
          opacity={0.4}
          scale={15}
          blur={2.5}
          far={4.5}
        />
      </Canvas>
    </div>
  );
}