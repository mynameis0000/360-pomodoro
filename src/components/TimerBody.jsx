import { RoundedBox } from "@react-three/drei";

export default function TimerBody() {

  return (
    <>

      {/* BODY */}

      <RoundedBox
        args={[4.2, 4.2, 2.2]}
        radius={0.45}
        smoothness={3}
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.45}
        />
      </RoundedBox>



      {/* INNER BEZEL */}

      <RoundedBox
        args={[3.72, 3.72, 0.08]}
        radius={0.38}
        smoothness={2}
        position={[0, 0, 1.07]}
      >
        <meshStandardMaterial
          color="#d9d9d9"
          roughness={0.45}
        />
      </RoundedBox>



      {/* BACK PANEL */}

      <mesh position={[0, 0, -1.12]}>

        <boxGeometry
          args={[2.2, 2.2, 0.08]}
        />

        <meshStandardMaterial
          color="#dcdcdc"
        />

      </mesh>

    </>
  );
}