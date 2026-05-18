import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera
} from "@react-three/drei";

import Clock3D from "./Clock3D";

function SceneContent({
  progress,
  timeLeft,
  isFinished
}) {

  const groupRef = useRef();

  useFrame((state) => {

    if (!groupRef.current) return;

    if (isFinished) {

      const t =
        state.clock.getElapsedTime();

      groupRef.current.position.x =
        Math.sin(t * 40) * 0.03;

      groupRef.current.position.y =
        Math.cos(t * 35) * 0.03;

    }

    else {

      groupRef.current.position.set(
        0,
        0,
        0
      );

    }

  });

  return (

    <group ref={groupRef}>

      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.25}
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



export default function Scene({
  progress,
  timeLeft,
  isFinished
}) {

  return (

    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative"
      }}
    >

      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
      >

        <PerspectiveCamera
          makeDefault
          position={[0, 0.5, 18]}
          fov={35}
          makeDefault

          position={
            window.innerWidth < 768
              ? [0, 0.3, 24]
              : [0, 0.5, 18]
          }

          fov={
            window.innerWidth < 768
              ? 42
              : 35
          }
        />



        <ambientLight intensity={0.9} />



        <directionalLight
          position={[6, 8, 4]}
          intensity={1.9}
        />



        <SceneContent
          progress={progress}
          timeLeft={timeLeft}
          isFinished={isFinished}
        />

      </Canvas>

    </div>

  );

}