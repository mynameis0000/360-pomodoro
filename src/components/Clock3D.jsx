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
  // [휴대폰] 브레이크를 늦게 밟아 휙 날아가게 처리 (0.98)
  // [PC] 초기 버전의 묵직하고 안정적인 감쇠율로 복원 (0.94)
  const DAMPING_FACTOR = isMobile ? 3 : 0.94; 

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
  if (!dragRef.current || introRef.current) return;

  // 1. 터치/마우스 시작점으로부터 움직인 총 픽셀 거리
  const totalDeltaX = e.clientX - startMouse.current[0];
  const totalDeltaY = e.clientY - startMouse.current[1];

  let targetY, targetX;

  if (isMobile) {
    // 📱 휴대폰 버전: 기존의 시원한 화면 비율 스케일 유지
    const touchRatioX = totalDeltaX / window.innerWidth;
    const touchRatioY = totalDeltaY / window.innerHeight;

    targetY = startRotation.current[0] + touchRatioX * (Math.PI * 5.0);
    const flipFactor = Math.cos(startRotation.current[0]);
    targetX = startRotation.current[1] + touchRatioY * 2.5 * flipFactor;

    // 휴대폰 튕김 힘 계산 (기존 유지)
    velocity.current = [
      (targetY - currentRotation.current[0]) * 0.75,
      (targetX - currentRotation.current[1]) * 0.75
    ];
  } else {
    // 💻 PC 마우스 버전: [완벽 교정]
    // 드래그 중인 최종 절대 목표 각도 계산 (0.002 수준으로 묵직하게 제어)
    targetY = startRotation.current[0] + totalDeltaX * 0.002;
    
    const flipFactor = Math.cos(startRotation.current[0]);
    targetX = startRotation.current[1] + totalDeltaY * 0.002 * flipFactor;

    // [버그 수정 핵심] 간격(Gap) 분기를 쓰지 않고, 
    // 마우스가 매 프레임 움직이는 순수 변화량에 아주 미세한 가중치만 주어 관성으로 넘깁니다.
    // 이 공식 덕분에 마우스를 아무리 세게 휘둘러도 속도가 일정 선 위로 튀지 않습니다.
    const pcVelocityY = (e.movementX || 0) * 0.0008;
    const pcVelocityX = (e.movementY || 0) * 0.0008 * flipFactor;

    velocity.current = [pcVelocityY, pcVelocityX];
  }

  // 실제 회전 데이터 업데이트
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