import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function TimerFace({
  progress,
  timeLeft
}) {

  // 빨간 영역 Shape
  const sectorShape = useMemo(() => {

    const shape = new THREE.Shape();

    const radius = 1.05;

    const startAngle = Math.PI / 2;

    const endAngle =
      startAngle + (Math.PI * 2 * progress);

    shape.moveTo(0, 0);

    shape.absarc(
      0,
      0,
      radius,
      startAngle,
      endAngle,
      false
    );

    shape.lineTo(0, 0);

    return shape;

  }, [progress]);



  // 빨간 영역 Geometry
  const sectorGeometry = useMemo(() => {

    return new THREE.ShapeGeometry(
      sectorShape
    );

  }, [sectorShape]);



  // 시간 표시용 정수 처리
  const safeTime = Math.ceil(timeLeft);

  const minutes =
    String(
      Math.floor(safeTime / 60)
    ).padStart(2, "0");

  const seconds =
    String(
      safeTime % 60
    ).padStart(2, "0");



  return (
    <>

      {/* ========================= */}
      {/* INNER PANEL */}
      {/* ========================= */}

      <RoundedBox
        args={[3.5, 3.5, 0.15]}
        radius={0.32}
        smoothness={6}
        position={[0, 0, 1.00]}
      >
        <meshStandardMaterial
          color="#ececec"
          roughness={0.9}
        />
      </RoundedBox>



      {/* ========================= */}
      {/* RED TIMER AREA */}
      {/* ========================= */}

      <mesh
        geometry={sectorGeometry}
        position={[0, 0, 1.12]}
        rotation={[0, 0, Math.PI]}
      >
        <meshStandardMaterial
          color="#d62828"
          roughness={0.35}
          metalness={0.02}
        />
      </mesh>



      {/* ========================= */}
      {/* TOP MARK */}
      {/* ========================= */}

      <mesh position={[0, 1.52, 1.13]}>

        <boxGeometry
          args={[0.08, 0.32, 0.05]}
        />

        <meshStandardMaterial
          color="#b0b0b0"
        />

      </mesh>



      {/* ========================= */}
      {/* GLASS COVER */}
      {/* ========================= */}

      <RoundedBox
        args={[3.7, 3.7, 0.04]}
        radius={0.35}
        smoothness={6}
        position={[0, 0, 1.12]}
      >
        <meshPhysicalMaterial
          transparent
          opacity={0.08}
          transmission={1}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          ior={1.1}
        />
      </RoundedBox>

    </>
  );
}