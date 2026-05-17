import {
  Geometry,
  Base,
  Subtraction
} from "@react-three/csg";
import { Cylinder, RoundedBox } from "@react-three/drei";

export default function TimerBack() {
  const PLASTIC_BLACK = "#ddd6d6"; // 배터리 커버용 무광 검정

  return (
    <group
      position={[0, 0, -0.85]}
      rotation={[0, Math.PI, 0]}
    >
      {/* 1. 기존에 본체 판넬이 이미 있다면, 
          여기서는 '배터리 함 덮개'와 '나사' 등 추가 오브젝트만 렌더링합니다.
          만약 본체에 구멍을 뚫어야 한다면 CSG 로직을 본체 컴포넌트로 옮겨야 하지만,
          우선은 시각적으로 덧붙이는 방식을 제안드립니다.
      */}

      {/* =========================
          BATTERY COVER (실제 튀어나온 덮개 부분)
      ========================= */}
      <group position={[0, -0.2, 0.23]}>
        {/* 배터리 덮개 본체 */}
        <RoundedBox args={[1.9, 1.5, 0.05]} radius={0.05} smoothness={4}>
          <meshStandardMaterial 
            color={PLASTIC_BLACK} 
            roughness={0.8} 
            metalness={0.1}
          />
        </RoundedBox>

        {/* 하단 손가락 걸쇠 (Latch) */}
        <mesh position={[0, -0.75, -0.005]}>
          <boxGeometry args={[0.5, 0.1, 0.06]} />
          <meshStandardMaterial color={PLASTIC_BLACK} roughness={0.7} />
        </mesh>
        
      </group>
    </group>
  );
}