import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import TimerBack from "./TimerBack";
import TimerBody from "./TimerBody";
import TimerFace from "./TimerFace";
import TimerKnob from "./TimerKnob";

export default function Clock3D({ progress = 0.75, timeLeft = 1500 }) {
  const groupRef = useRef();
  const dragRef = useRef(false);
  const lastMouse = useRef([0, 0]);
  const velocity = useRef([0, 0]);

  // 모바일 여부 체크
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 인트로 애니메이션 관련
  const introRef = useRef(true);
  const currentY = useRef(15);
  const velocityY = useRef(0);
  const rotationY = useRef(-Math.PI);

  // ==========================================
  // 🎛 물리 상수 튜닝 (모바일 '슥' 밀기 최적화)
  // ==========================================
  const spring = { stiffness: 0.02, damping: 0.85 };
  
  // 감쇠율: 1에 가까울수록 미끄러운 얼음판 위처럼 오래 돕니다.
  // 모바일은 손가락을 뗐을 때 시원하게 밀려야 하므로 0.965로 설정 (PC는 0.92)
  const DAMPING_FACTOR = isMobile ? 0.965 : 0.92; 

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.order = "YXZ";

    // 1. INTRO ANIMATION
    if (introRef.current) {
      const distY = 0 - currentY.current;
      velocityY.current += distY * spring.stiffness;
      velocityY.current *= spring.damping;
      currentY.current += velocityY.current;
      rotationY.current = THREE.MathUtils.lerp(rotationY.current, 0.6, 0.16);

      groupRef.current.position.y = currentY.current;
      groupRef.current.rotation.y = rotationY.current;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.24, 0.02);

      if (Math.abs(velocityY.current) < 0.001 && Math.abs(distY) < 0.001) {
        introRef.current = false;
      }
    }
    // 2. FLOATING IDLE
    else if (!dragRef.current) {
      const time = state.clock.elapsedTime;
      const floatY = Math.sin(time * 0.4) * 0.08 + 0.2;
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, floatY, 1.5, delta);
    }

    // ==========================================
    // 3. 관성 회전 처리 (Inertia)
    // ==========================================
    if (!introRef.current) {
      // 드래그 중이 아닐 때만 관성 속도를 회전각에 누적
      if (!dragRef.current) {
        groupRef.current.rotation.y += velocity.current[0];
        groupRef.current.rotation.x += velocity.current[1];

        // 속도 감쇠 (매 프레임마다 속도를 조금씩 줄임)
        velocity.current[0] *= DAMPING_FACTOR;
        velocity.current[1] *= DAMPING_FACTOR;

        // 멈춘 수준으로 속도가 떨어지면 완전히 0으로 세팅해 불필요한 연산 방지
        if (Math.abs(velocity.current[0]) < 0.0001) velocity.current[0] = 0;
        if (Math.abs(velocity.current[1]) < 0.0001) velocity.current[1] = 0;
      }

      // 모바일 화면 세로 회전 각도 제한
      if (isMobile) {
        groupRef.current.rotation.x = THREE.MathUtils.clamp(groupRef.current.rotation.x, -0.35, 0.35);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        dragRef.current = true;
        lastMouse.current = [e.clientX, e.clientY];
        // 드래그 시작할 때 이전 관성 속도 초기화
        velocity.current = [0, 0];
        document.body.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        dragRef.current = false;
        document.body.style.cursor = "grab";
      }}
      onPointerLeave={() => {
        dragRef.current = false;
        document.body.style.cursor = "grab";
      }}
      onPointerMove={(e) => {
        if (!dragRef.current || introRef.current) return;

        const deltaX = e.clientX - lastMouse.current[0];
        const deltaY = e.clientY - lastMouse.current[1];
        lastMouse.current = [e.clientX, e.clientY];

        // 모바일일 때 슥 밀면 확 돌아가도록 감도(Sensitivity)를 대폭 상향
        const sensitivity = isMobile ? 0.012 : 0.007;

        const rotY = deltaX * sensitivity;
        const rotX = deltaY * sensitivity;

        // 드래그하는 동안 즉각 반응
        groupRef.current.rotation.y += rotY;
        groupRef.current.rotation.x += rotX;

        // 중요: 모바일에서는 마지막 움직임의 가속도를 더 강하게 보존하기 위해 곱연산 적용
        // 손가락을 떼는 순간 이 속도로 휙 날아갑니다.
        velocity.current = [
          isMobile ? rotY * 1.5 : rotY,
          isMobile ? rotX * 1.5 : rotX
        ];
      }}
    >
      <TimerBody />
      <TimerFace progress={progress} timeLeft={timeLeft} />
      <TimerBack />
      <TimerKnob />
    </group>
  );
}