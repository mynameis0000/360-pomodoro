import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import TimerBody from "./TimerBody";
import TimerFace from "./TimerFace";
import TimerKnob from "./TimerKnob";

export default function Clock3D({ progress = 0.75, timeLeft = 1500 }) {
  const groupRef = useRef();
  const dragRef = useRef(false);
  const lastMouse = useRef([0, 0]);
  const velocity = useRef([0, 0]);

  // =========================
  // ANIMATION REFS (상태 관리)
  // =========================
  const introRef = useRef(true);
  const currentY = useRef(15);         // 시작 높이 (하늘 위)
  const velocityY = useRef(0);        // 수직 속도
  const rotationY = useRef(-Math.PI);   // 시작 각도 (반 바퀴 뒤집힌 상태)

  // [수정 포인트 1] 물리 상수: 수치를 낮출수록 동작이 묵직하고 느려집니다.
  const spring = { 
    stiffness: 0.02, // 0.02 정도로 낮추면 아주 천천히 목표 지점으로 끌어당깁니다.
    damping: 0.85     // 0.85 정도로 높이면 튕김 없이 쫀득하게 안착합니다.
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. [인트로] 반 회전하며 느리게 낙하하는 연출
    if (introRef.current) {
      // (1) 수직 이동 계산 (Spring Physics)
      const distY = 0 - currentY.current; // 목표는 바닥(0)
      velocityY.current += distY * spring.stiffness;
      velocityY.current *= spring.damping;
      currentY.current += velocityY.current;

      // (2) 반 회전 계산 (Lerp)
      // 마지막 인자인 0.02를 줄일수록 회전이 더 '스르륵' 느려집니다.
      rotationY.current = THREE.MathUtils.lerp(rotationY.current, 0.35, 0.02);

      // 위치와 회전값 적용
      groupRef.current.position.y = currentY.current;
      groupRef.current.rotation.y = rotationY.current;

      // (3) 숙여지는 각도 (X축) 연출
      // 떨어지는 동안 자연스럽게 정면 각도로 돌아옵니다.
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.08, 0.02);

      // 안착 판정 (움직임이 거의 없을 때 부유 모드로 전환)
      if (Math.abs(velocityY.current) < 0.001 && Math.abs(distY) < 0.001) {
        introRef.current = false;
      }
    } 
    
    // 2. [부유] 안착 후 아주 천천히 붕 뜨는 연출
    else {
      const time = state.clock.elapsedTime;
      
      // 상하 부유: 0.4를 곱해 주기를 아주 느리게 설정했습니다.
      const floatY = Math.sin(time * 0.4) * 0.08 + 0.2;
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y, 
        floatY, 
        1.5, // 댐핑 세기
        delta
      );

      // 미세한 좌우 흔들림 (Idle 애니메이션)
      const idleRotY = 0.35 + Math.sin(time * 0.3) * 0.03;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, idleRotY, 1.5, delta);
    }

    // 3. 관성 회전 (사용자 드래그 시)
    if (!dragRef.current && !introRef.current) {
      groupRef.current.rotation.x += velocity.current[1];
      groupRef.current.rotation.y += velocity.current[0];
      velocity.current[0] *= 0.98;
      velocity.current[1] *= 0.98;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        dragRef.current = true;
        lastMouse.current = [e.clientX, e.clientY];
      }}
      onPointerUp={() => (dragRef.current = false)}
      onPointerMove={(e) => {
        if (!dragRef.current) return;
        const deltaX = e.clientX - lastMouse.current[0];
        const deltaY = e.clientY - lastMouse.current[1];
        lastMouse.current = [e.clientX, e.clientY];
        const rotX = deltaY * 0.005;
        const rotY = deltaX * 0.005;
        groupRef.current.rotation.x += rotX;
        groupRef.current.rotation.y += rotY;
        velocity.current = [rotY, rotX];
      }}
    >
      <TimerBody />
      <TimerFace progress={progress} timeLeft={timeLeft} />
      <TimerKnob />
    </group>
  );
}