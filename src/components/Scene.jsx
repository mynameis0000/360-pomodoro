  

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Environment, 
  OrbitControls, 
  ContactShadows, 
  Float, 
  PerspectiveCamera,
  useHelper
} from "@react-three/drei";
import * as THREE from "three";
import Clock3D from "./Clock3D";

// 셰이크 효과를 위한 내부 컴포넌트
function SceneContent({ progress, timeLeft, isFinished }) {
  const groupRef = useRef();

  // 종료 시 카메라 혹은 그룹을 흔드는 로직
  useFrame((state) => {
    if (isFinished) {
      const t = state.clock.getElapsedTime();
      // 매우 빠르고 미세한 진동 구현
      groupRef.current.position.x = Math.sin(t * 50) * 0.05;
      groupRef.current.position.y = Math.cos(t * 40) * 0.05;
      
      // 배경색을 붉은색으로 깜빡이게 조절 (선택 사항)
      state.scene.background = new THREE.Color(
        Math.floor(t * 10) % 2 === 0 ? "#ffffff" : "#ffcccc"
      );
    } else {
      groupRef.current.position.set(0, 0, 0);
      state.scene.background = new THREE.Color("#ffffff");
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={isFinished ? 10 : 2} // 종료 시 더 빠르게 일렁임
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
    <Canvas
      gl={{ 
        antialias: true, 
        alpha: true, 
        toneMappingExposure: 1.2 
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={35} />

      {/* 기본 조명 */}
      <ambientLight intensity={0.4} /> 
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={isFinished ? 5 : 2} // 종료 시 조명 강해짐
        color={isFinished ? "#ff0000" : "#ffffff"}
        castShadow 
      />
      
      <Environment preset="city" /> 

      {/* 실제 콘텐츠 레이어 */}
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

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}