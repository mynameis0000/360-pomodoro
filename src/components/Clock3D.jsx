import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import TimerBack from "./TimerBack";
import TimerBody from "./TimerBody";
import TimerFace from "./TimerFace";
import TimerKnob from "./TimerKnob";

export default function Clock3D({
  progress = 0.75,
  timeLeft = 1500
}) {
  const groupRef = useRef();

  const dragRef = useRef(false);

  const lastMouse = useRef([0, 0]);

  const velocity = useRef([0, 0]);

  // =========================
  // INTRO ANIMATION REFS
  // =========================

  const introRef = useRef(true);

  const currentY = useRef(15);

  const velocityY = useRef(0);

  const rotationY = useRef(-Math.PI);

  // =========================
  // PHYSICS
  // =========================

  const spring = {
    stiffness: 0.02,
    damping: 0.85
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 회전 순서 고정
    groupRef.current.rotation.order = "YXZ";

    // =========================
    // INTRO DROP ANIMATION
    // =========================

    if (introRef.current) {
      // 낙하
      const distY = 0 - currentY.current;

      velocityY.current +=
        distY * spring.stiffness;

      velocityY.current *= spring.damping;

      currentY.current += velocityY.current;

      // 회전
      rotationY.current =
        THREE.MathUtils.lerp(
          rotationY.current,
          0.6,
          0.16
        );

      // 적용
      groupRef.current.position.y =
        currentY.current;

      groupRef.current.rotation.y =
        rotationY.current;

      // 자연스럽게 숙여짐
      groupRef.current.rotation.x =
        THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          -0.2,
          0.02
        );

      // 종료 판정
      if (
        Math.abs(velocityY.current) < 0.001 &&
        Math.abs(distY) < 0.001
      ) {
        introRef.current = false;
      }
    }

    // =========================
    // FLOATING IDLE
    // =========================

    else {
      const time = state.clock.elapsedTime;

      // 둥둥 떠다님
      const floatY =
        Math.sin(time * 0.4) * 0.08 + 0.2;

      groupRef.current.position.y =
        THREE.MathUtils.damp(
          groupRef.current.position.y,
          floatY,
          1.5,
          delta
        );

      // 자동 흔들림 제거
      // 사용자가 자유롭게 회전 가능하도록 유지
    }

    // =========================
    // INERTIA ROTATION
    // =========================

    if (!dragRef.current && !introRef.current) {
      groupRef.current.rotation.y +=
        velocity.current[0];

      groupRef.current.rotation.x +=
        velocity.current[1];

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

        lastMouse.current = [
          e.clientX,
          e.clientY
        ];

        document.body.style.cursor =
          "grabbing";
      }}

      onPointerUp={() => {
        dragRef.current = false;

        document.body.style.cursor =
          "grab";
      }}

      onPointerLeave={() => {
        dragRef.current = false;

        document.body.style.cursor =
          "grab";
      }}

      onPointerMove={(e) => {
        if (!dragRef.current) return;

        const deltaX =
          e.clientX -
          lastMouse.current[0];

        const deltaY =
          e.clientY -
          lastMouse.current[1];

        lastMouse.current = [
          e.clientX,
          e.clientY
        ];

        // 회전 감도
        const rotX = deltaY * 0.009;

        const rotY = deltaX * 0.01;

        // 자유 회전
        groupRef.current.rotation.x +=
          rotX;

        groupRef.current.rotation.y +=
          rotY;

        // 관성 저장
        velocity.current = [
          rotY,
          rotX
        ];
      }}
    >
      {/* BODY */}
      <TimerBody />

      {/* FRONT */}
      <TimerFace
        progress={progress}
        timeLeft={timeLeft}
      />

      {/* BACK */}
      <TimerBack />

      {/* KNOB */}
      <TimerKnob />
    </group>
  );
}