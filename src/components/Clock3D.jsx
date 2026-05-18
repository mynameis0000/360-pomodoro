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

  // 터치/마우스 시작점 및 기준 각도 스냅샷
  const startMouse = useRef([0, 0]);
  const startRotation = useRef([0, 0]);

  // 실제 물리 회전 및 가속도 기록 데이터
  const velocity = useRef([0, 0]);       
  const currentRotation = useRef([0, 0]); 

  // ==========================================
  // 📱 환경 반응형 체크 (PC / 휴대폰 분리)
  // ==========================================
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (isMobile !== mobile) {
        setIsMobile(mobile);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // 인트로 애니메이션 설정 변수
  const introRef = useRef(true);
  const currentY = useRef(15);
  const velocityY = useRef(0);
  const rotationY = useRef(-Math.PI);
  const spring = { stiffness: 0.02, damping: 0.85 };

  // ==========================================
  // 🎛️ 환경별 관성 감쇠율 (DAMPING_FACTOR)
  // ==========================================
   const DAMPING_FACTOR = isMobile ? 0.99 : 0.985;
  // ==========================================
  // 🔄 매 프레임 애니메이션 루프 (useFrame)
  // ==========================================
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.order = "YXZ";

    // 1. 인트로 애니메이션
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
        currentRotation.current = [groupRef.current.rotation.y, groupRef.current.rotation.x];
      }
      return; 
    }

    // 2. FLOATING IDLE (조작 안 할 때 공중 부유)
    if (!dragRef.current) {
      const time = state.clock.elapsedTime;
      const floatY = Math.sin(time * 0.4) * 0.08 + 0.2;
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, floatY, 1.5, delta);
    }

    // 3. 관성 애니메이션 효과
    if (!dragRef.current) {
      currentRotation.current[0] += velocity.current[0];
      currentRotation.current[1] += velocity.current[1];

      // 마찰력 적용
      velocity.current[0] *= DAMPING_FACTOR;
      velocity.current[1] *= DAMPING_FACTOR;

      if (Math.abs(velocity.current[0]) < 0.00005) velocity.current[0] = 0;
      if (Math.abs(velocity.current[1]) < 0.00005) velocity.current[1] = 0;
    } else {
      // 드래그/터치 중 가속도 완충 처리
      velocity.current[0] *= isMobile ? 0.85 : 0.6;
      velocity.current[1] *= isMobile ? 0.85 : 0.6;
    }

    // 휴대폰(모바일) 기기 세로(X축) 회전 각도 제한
    if (isMobile) {
      currentRotation.current[1] = THREE.MathUtils.clamp(currentRotation.current[1], -0.35, 0.35);
    }

    // 최종 회전값을 매시에 투영 (PC는 원래의 15 속도로 쫀득하게 추적)
    const dampSpeed = isMobile ? 10 : 15;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, currentRotation.current[0], dampSpeed, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, currentRotation.current[1], dampSpeed, delta);
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);

        dragRef.current = true;
        
        startMouse.current = [e.clientX, e.clientY];
        startRotation.current = [currentRotation.current[0], currentRotation.current[1]];
        
        velocity.current = [0, 0]; 
        document.body.style.cursor = "grabbing";
      }}

      onPointerUp={(e) => {
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
        dragRef.current = false;
        document.body.style.cursor = "grab";
      }}

      onPointerLeave={(e) => {
        if (dragRef.current) {
          dragRef.current = false;
          document.body.style.cursor = "grab";
        }
      }}

      onPointerMove={(e) => {
        if (!dragRef.current) return;

        const totalDeltaX = e.clientX - startMouse.current[0];
        const totalDeltaY = e.clientY - startMouse.current[1];

        let targetY, targetX;

        if (isMobile) {
          // 📱 휴대폰: 기본 배율을 Math.PI * 6.0 -> 8.0으로 상향 (조금만 밀어도 한 바퀴 반 회전)
          const touchRatioX = totalDeltaX / window.innerWidth;
          const touchRatioY = totalDeltaY / window.innerHeight;

          targetY = startRotation.current[0] + touchRatioX * (Math.PI * 8.0); // 👈 숫자 업!
          const flipFactor = Math.cos(startRotation.current[0]);
          targetX = startRotation.current[1] + touchRatioY * 4.0 * flipFactor;   // 👈 숫자 업!

          // 튕길 때 힘 전달률도 0.85 -> 1.2로 증폭
          velocity.current = [
            (targetY - currentRotation.current[0]) * 1.2,
            (targetX - currentRotation.current[1]) * 1.2
          ];
        } else {
          // 💻 PC 마우스: 정밀도를 버리고 시원하게 돌도록 배율 상향
          // 0.0015 -> 0.006으로 4배 상향 (마우스를 조금만 움직여도 휙 돌아감)
          targetY = startRotation.current[0] + totalDeltaX * 0.006; 
          
          const flipFactor = Math.cos(startRotation.current[0]);
          targetX = startRotation.current[1] + totalDeltaY * 0.006 * flipFactor;

          // 마우스를 놓을 때 생기는 관성 가속도 제한을 풀어서 던지는 맛 추가
          const pcVelocityY = (e.movementX || 0) * 0.0015;
          const pcVelocityX = (e.movementY || 0) * 0.0015 * flipFactor;

          velocity.current = [pcVelocityY, pcVelocityX];
        }

        currentRotation.current[0] = targetY;
        currentRotation.current[1] = targetX;
      }}
    >
      <TimerBody />
      <TimerFace progress={progress} timeLeft={timeLeft} />
      <TimerBack />
      <TimerKnob />
    </group>
  );
}