import {ThreeCanvas} from '@remotion/three';
import {ramp} from './ThoughtChamber';

export function FinaleSeed({t}: {t: number}) {
  const gather = ramp(t, 3.52, 5.31);
  const close = ramp(t, 5.03, 5.62);
  const strength = ramp(t, 3.42, 4.19) * (1 - ramp(t, 5.32, 5.77));
  const colors = ['#9d84f8', '#b5b2ff', '#efab97'];
  return <ThreeCanvas width={1920} height={1080} camera={{position: [0, 0, 7.9], fov: 37}} gl={{antialias: true, alpha: true}}>
    <ambientLight color="#9c87d9" intensity={.5} />
    <directionalLight position={[-3, 5, 4]} color="#f1e6ff" intensity={4.6} />
    <directionalLight position={[3, -1, -2]} color="#8865ff" intensity={3.5} />
    {colors.map((color, i) => {
      const spread = 1 - gather;
      const x = (i - 1) * 2.58 * spread;
      const y = Math.sin(gather * Math.PI) * (i === 1 ? -.31 : .23) + .40 * spread;
      const scale = .15 + .18 * gather;
      return <mesh key={color} position={[x, y, (i - 1) * .32 * spread]}
        scale={[scale, scale * (1 - .96 * close), scale]} rotation={[.38 + t * .29, .9 * i + t * .43, i * .42]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={.38} roughness={.22} flatShading
          emissive={color} emissiveIntensity={.25} transparent opacity={strength} depthWrite={false} />
      </mesh>;
    })}
  </ThreeCanvas>;
}
