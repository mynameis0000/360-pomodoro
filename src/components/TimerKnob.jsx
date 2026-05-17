export default function TimerKnob() {

  return (

    <mesh
      position={[0, 0, 1.15]}
      rotation={[Math.PI / 2, 0, 0]}
      castShadow
    >

      <cylinderGeometry
        args={[0.40, 0.62, 0.50, 64]}
      />

      <meshStandardMaterial
        color="#f7f7f7"
        roughness={0.4}
      />

    </mesh>

  );
}