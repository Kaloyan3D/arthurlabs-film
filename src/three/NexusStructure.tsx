import {ThreeCanvas} from '@remotion/three';
import {Vector3, Quaternion} from 'three';
import {ramp} from './ThoughtChamber';

type Point = [number, number, number];
const up = new Vector3(0, 1, 0);

function Rail({from, to, reveal = 1, color = '#ad9aff'}: {from: Point; to: Point; reveal?: number; color?: string}) {
  if (reveal <= 0) return null;
  const a = new Vector3(...from);
  const direction = new Vector3(...to).sub(a).multiplyScalar(reveal);
  return <mesh position={a.addScaledVector(direction, .5)} quaternion={new Quaternion().setFromUnitVectors(up, direction.clone().normalize())}>
    <cylinderGeometry args={[.016, .016, direction.length(), 8]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.4} />
  </mesh>;
}

function Core({at, size, turn, color = '#a994ff'}: {at: Point; size: number; turn: number; color?: string}) {
  return <group position={at} rotation={[.17, turn, .18]} scale={size}>
    <mesh>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} metalness={.48} roughness={.24} emissive={color} emissiveIntensity={.16} flatShading />
    </mesh>
    <mesh scale={1.27}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={.39} />
    </mesh>
  </group>;
}

function Layers({t}: {t: number}) {
  const tiers = ['#8174de', '#9283ef', '#c4adff'];
  return <group>
    {tiers.map((color, tier) => {
      const lift = ramp(t, 2.4 + tier * .8, 5.5 + tier * .8);
      const focus = ramp(t, 5.6 + (2 - tier) * 1.8, 6.2 + (2 - tier) * 1.8) *
        (1 - ramp(t, 7.3 + (2 - tier) * 1.8, 8.15 + (2 - tier) * 1.8));
      return <group key={color} position={[.16 * tier, -.86 + (tier + 1) * .72 * lift, -.12 * tier]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.6, .045, 2.46]} />
          <meshStandardMaterial color={color} transparent opacity={.12 + focus * .24} depthWrite={false}
            emissive={color} emissiveIntensity={.10 + focus * .45} roughness={.38} />
        </mesh>
        {Array.from({length: 7}, (_, i) => {
          const fade = ramp(t, .52 + i * .22, 1.42 + i * .22);
          return <mesh key={i} position={[-1.85 + i * .61, .10, ((i % 3) - 1) * .39]}
            scale={[.19 + (i % 2) * .13, .07 + focus * .11, .51 * fade]}>
            <boxGeometry />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.17 + .36 * focus}
              transparent opacity={fade * (i % 3 === tier ? .96 : .26)} />
          </mesh>;
        })}
      </group>;
    })}
    <Rail from={[-2.5, -1.55, .87]} to={[2.5, -1.55, .87]} reveal={ramp(t, .4, 2.4)} color="#8076ae" />
    {Array.from({length: 9}, (_, i) => <Core key={i} at={[-2.1 + i * .52, -1.55, .87]} size={.071}
      turn={0} color={i === 6 ? '#e8b388' : '#9485cc'} />)}
    <Rail from={[1.02, -1.55, .87]} to={[1.02, .80, .87]} reveal={ramp(t, 12.5, 14.1)} color="#e8b388" />
  </group>;
}

function Branches({t, mode}: {t: number; mode: number}) {
  const stage = ramp(t, .18, 1.27);
  const integrate = ramp(t, 2.3, 3.4);
  const origin: Point = [-2.55, 0, 0];
  const end: Point = [2.64, 0, 0];
  const workers: Point[] = mode === 1 ? [[.20, 0, 0]] : mode === 2 ?
    [[.04, .66, -.35], [.33, -.62, .34]] : [[.10, 1.16, -.50], [.03, 0, 0], [.19, -1.12, .44]];
  return <>
    <Core at={origin} size={.23} turn={t * .30} color="#d0bfff" />
    {workers.map((point, i) => <group key={i}>
      <Rail from={origin} to={point} reveal={stage} />
      {stage > .4 && <Core at={point} size={.27 + (i === 0 && mode === 2 ? .12 : 0)} turn={.5 + t * .35} />}
      <Rail from={point} to={end} reveal={integrate} color="#b3a6ef" />
      {t > 1.2 + .16 * i && t < 3.9 + .16 * i && <Core
        at={new Vector3(...origin).lerp(new Vector3(...point), ramp(t, 1.2 + .16 * i, 2.18 + .16 * i))
          .lerp(new Vector3(...end), ramp(t, 2.46 + .16 * i, 3.9 + .16 * i)).toArray()}
        size={.084} turn={t} color="#e5d6ff" />}

    </group>)}
    {integrate > .25 && <Core at={end} size={.31 * integrate} turn={.4 + t * .26} color="#e0c9ff" />}
  </>;
}

export function NexusStructure({t, variant, mode = 1}: {t: number; variant: 'context' | 'routes'; mode?: number}) {
  return <ThreeCanvas width={1120} height={760} camera={{position: [0, 1.2, 9], fov: 38}} gl={{antialias: true, alpha: true}}>
    <ambientLight color="#9f8aff" intensity={.65} />
    <directionalLight position={[-4, 6, 4]} color="#e6ddff" intensity={4.3} />
    <directionalLight position={[4, -2, -3]} color="#7156ef" intensity={3.3} />
    <group rotation={[variant === 'context' ? .28 : -.12, -.37 + .16 * Math.sin(t * .25), -.035]}
      position={[.06, variant === 'context' ? .15 : 0, .25 + .55 * ramp(t, 0, 4)]}>
      {variant === 'context' ? <Layers t={t} /> : <Branches t={t} mode={mode} />}
    </group>
  </ThreeCanvas>;
}
