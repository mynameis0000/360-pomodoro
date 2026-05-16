import { RoundedBox } from "@react-three/drei";
import {
  useMemo,
  useRef,
  useState
} from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Clock3D({
  progress = 0.75,
  timeLeft = 1500
}) {

  const groupRef = useRef();
  
  const dragRef = useRef(false);
  const lastMouse = useRef([0, 0]);
  const velocity = useRef([0, 0]);

  // 부드러운 떠있는 움직임
  useFrame((state) => {

    if (!groupRef.current) return;



    // 떠있는 효과
    groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.05;



    // 관성 회전
    if (!dragRef.current) {

        groupRef.current.rotation.x +=
        velocity.current[1];

        groupRef.current.rotation.y +=
        velocity.current[0];



        // 감속
        velocity.current[0] *= 0.95;
        velocity.current[1] *= 0.95;

    }

    });



  // 빨간 영역 Shape
  


  return (
    <group
  ref={groupRef}
  rotation={[0.08, 0.35, 0]}



  onPointerDown={(e) => {

  dragRef.current = true;

  lastMouse.current = [
    e.clientX,
    e.clientY
  ];

}}



  onPointerUp={() => {
    dragRef.current = false;
  }}



  onPointerMove={(e) => {

  if (!dragRef.current) return;

  const deltaX =
    e.clientX - lastMouse.current[0];

  const deltaY =
    e.clientY - lastMouse.current[1];

  lastMouse.current = [
    e.clientX,
    e.clientY
  ];

  const rotX = deltaY * 0.005;
    const rotY = deltaX * 0.005;

    groupRef.current.rotation.x += rotX;
    groupRef.current.rotation.y += rotY;



    // 관성 저장
    velocity.current = [
    rotY,
    rotX
    ];

}}
>

      {/* ========================= */}
      {/* TIME TEXT */}
      {/* ========================= */}

      <mesh position={[0, -3.1, 0]}>
        <planeGeometry args={[2, 0.5]} />

        <meshBasicMaterial
          transparent
          opacity={0}
        />
      </mesh>

    </group>
  );
}