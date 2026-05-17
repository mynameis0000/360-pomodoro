import { RoundedBox, Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export default function TimerFace({ progress, timeLeft }) {
  // progress가 유효한 숫자인지 확인 (안전장치)
  const safeProgress = isNaN(progress) ? 0 : progress;

  // 1. 빨간 영역 Shape
  const sectorShape = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 1.05;
    const startAngle = Math.PI / 2; // 12시
    const endAngle = startAngle - (Math.PI * 2 * safeProgress);

    shape.moveTo(0, 0);
    shape.absarc(0, 0, radius, startAngle, endAngle, true);
    shape.lineTo(0, 0);

    return shape;
  }, [safeProgress]);

  const sectorGeometry = useMemo(() => new THREE.ShapeGeometry(sectorShape), [sectorShape]);

  // 2. 눈금 및 숫자
  const marks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isMajor = i % 5 === 0;
      const radius = 1.35;

      items.push(
        <group key={i} rotation={[0, 0, -angle]}>
          <mesh position={[0, radius, 1.13]}>
            <boxGeometry args={[0.015, isMajor ? 0.12 : 0.06, 0.005]} />
            <meshStandardMaterial color={isMajor ? "#333" : "#aaa"} />
          </mesh>
          
          {isMajor && (
            <Text
              position={[0, radius + 0.20, 1.2]}
              fontSize={0.18}
              color="#444"
              anchorX="center"
              anchorY="middle"
              rotation={[0, 0, angle]}
              // 폰트 경로 문제 방지를 위해 우선 기본 폰트 사용
            >
              {i}
            </Text>
          )}
        </group>
      );
    }
    return items;
  }, []);

  return (
    <group>
      {/* 배경 판넬 */}
      <RoundedBox args={[3.5, 3.5, 0.15]} radius={0.32} smoothness={6} position={[0, 0, 1.00]}>
        <meshStandardMaterial color="#ececec" roughness={0.9} />
      </RoundedBox>

      {/* 빨간 타이머 영역 */}
      <mesh geometry={sectorGeometry} position={[0, 0, 1.125]}>
        <meshStandardMaterial color="#d62828" roughness={0.35} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>

      {/* 눈금 및 숫자 */}
      <group position={[0, 0, 0.1]}>
        {marks}
      </group>

      {/* 유리 커버 */}
      <RoundedBox args={[3.7, 3.7, 0.04]} radius={0.35} smoothness={6} position={[0, 0, 1.22]}>
        <meshPhysicalMaterial transparent opacity={0.1} transmission={1} roughness={0} thickness={0.1} />
      </RoundedBox>
    </group>
  );
}