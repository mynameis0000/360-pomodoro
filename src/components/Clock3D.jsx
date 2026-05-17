import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

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



  // 인트로
  const introRef = useRef(false);

  const introY = useRef(0);

  const introVelocity = useRef(-0.12);



  useFrame((state) => {

    if (!groupRef.current) return;



    // =========================
    // INTRO DROP
    // =========================

    if (introRef.current) {

      introY.current +=
        introVelocity.current;

      introVelocity.current += 0.008;



      if (introY.current <= 0) {

        introY.current = 0;

        introVelocity.current *= -0.35;



        if (
          Math.abs(introVelocity.current)
          < 0.02
        ) {

          introRef.current = false;

        }

      }

      groupRef.current.position.y =
        introY.current;

    }



    // =========================
    // FLOATING
    // =========================

    else {

      groupRef.current.position.y =
        Math.sin(
          state.clock.elapsedTime * 1.0
        ) * 0.025;

    }



    // =========================
    // INERTIA
    // =========================

    if (!dragRef.current) {

      groupRef.current.rotation.x +=
        velocity.current[1];

      groupRef.current.rotation.y +=
        velocity.current[0];



      velocity.current[0] *= 0.97;
      velocity.current[1] *= 0.97;

    }

  });



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



        const rotX =
          deltaY * 0.004;

        const rotY =
          deltaX * 0.004;



        groupRef.current.rotation.x +=
          rotX;

        groupRef.current.rotation.y +=
          rotY;



        velocity.current = [
          rotY,
          rotX
        ];

      }}
    >

      <TimerBody />

      <TimerFace
        progress={progress}
        timeLeft={timeLeft}
      />

      <TimerKnob />

    </group>
  );
}