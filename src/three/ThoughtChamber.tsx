import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useLayoutEffect} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Color, DataTexture, DoubleSide, LinearFilter, QuadraticBezierCurve3, Quaternion, RGBAFormat, Vector3} from 'three';

export function ramp(t: number, from: number, to: number) {
  const x = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return x * x * (3 - 2 * x);
}

const glowSize = 64;
const pixels = new Uint8Array(glowSize * glowSize * 4);
for (let y = 0; y < glowSize; y++) {
  for (let x = 0; x < glowSize; x++) {
    const r = Math.hypot((x + .5) / 32 - 1, (y + .5) / 32 - 1);
    pixels.set([255, 255, 255, Math.round(255 * Math.exp(-5 * r) * (1 - ramp(r, .45, 1)))], (y * glowSize + x) * 4);
  }
}
const glow = new DataTexture(pixels, glowSize, glowSize, RGBAFormat);
glow.magFilter = LinearFilter;
glow.minFilter = LinearFilter;
glow.needsUpdate = true;

const up = new Vector3(0, 1, 0);
const coldLight = new Color('#a894ff');
const conflictLight = new Color('#ff9d68');
const origins = [new Vector3(-2.68, .53, .69), new Vector3(2.45, 1.19, -1.62), new Vector3(1.33, -1.28, 1.04)];
const nodes = [
  {point: new Vector3(), cluster: -1, start: .3, parent: -1, scale: .16},
  ...origins.flatMap((origin, cluster) => Array.from({length: 8}, (_, i) => {
    const angle = i * 2.39996 + cluster * .7;
    const radius = i ? .7 + (i % 4) * .26 : 0;
    return {
      point: origin.clone().add(new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * .64, i ? Math.sin(angle + .8) * radius * .72 : 0)),
      cluster,
      start: 3.45 + cluster * .56 + i * .43,
      parent: i ? 1 + cluster * 8 + (i > 4 ? i - 4 : 0) : 0,
      scale: i ? .032 + (i % 3) * .012 : .10,
    };
  })),
];

function CameraMove({t, cinematic}: {t: number; cinematic: boolean}) {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    const angle = -.54 + .92 * ramp(t, 0, 12.7) - .38 * ramp(t, 14.2, 18);
    const distance = 12.8 - 3.0 * ramp(t, 0, 4.4) + 2.7 * ramp(t, 4, 8.5) - 1.15 * ramp(t, 10.5, 15);
    if (cinematic) {
      const macro = ramp(t, .48, 2.8) * (1 - ramp(t, 2.9, 5.9));
      const fracture = ramp(t, 9.75, 12.05) * (1 - ramp(t, 12.15, 14.7));
      const orbit = angle - .27 * macro + .21 * fracture;
      const radius = distance - 5.7 * macro - 1.95 * fracture + .7 * ramp(t, 11.9, 13.6) * (1 - ramp(t, 14.7, 16.3));
      camera.position.set(Math.sin(orbit) * radius, .57 + 1.1 * macro - 1.65 * ramp(t, 5, 13), Math.cos(orbit) * radius);
      camera.lookAt(-.24 * macro + .82 * fracture, .08 * (1 - ramp(t, 16.35, 17.15)) + .31 * fracture, -.42 * fracture);
    } else {
      camera.position.set(Math.sin(angle) * distance, .57 - 1.16 * ramp(t, 2, 15), Math.cos(angle) * distance);
      camera.lookAt(-.22 + .45 * ramp(t, 3, 9) - .23 * ramp(t, 14.5, 17), .03, 0);
    }
    camera.updateMatrixWorld();
  }, [camera, cinematic, t]);
  return null;
}

function Filament({a, b, strength, heat}: {a: Vector3; b: Vector3; strength: number; heat: number}) {
  if (strength <= .005) return null;
  const direction = b.clone().sub(a);
  return <mesh position={a.clone().lerp(b, .5)} quaternion={new Quaternion().setFromUnitVectors(up, direction.clone().normalize())}>
    <cylinderGeometry args={[.005, .009, direction.length(), 5, 1, true]} />
    <meshBasicMaterial color={coldLight.clone().lerp(conflictLight, heat)} transparent depthWrite={false} opacity={strength} />
  </mesh>;
}

function OpposingLink({a, b, t, strength}: {a: Vector3; b: Vector3; t: number; strength: number}) {
  const pressure = ramp(t, 10.25, 11.38);
  const release = ramp(t, 11.38, 12.6);
  const settle = ramp(t, 13.55, 15.1);
  const pivot = a.clone().lerp(b, .52);
  const bend = .40 * pressure * (1 - release);
  const left = pivot.clone().lerp(a, .67 * release).add(new Vector3(0, bend + .12 * release, 0));
  const right = pivot.clone().lerp(b, .70 * release).add(new Vector3(0, bend - .14 * release, 0));
  const pulse = ramp(t, 10.25, 11.38);
  return <>
    <Filament a={a} b={left} strength={strength * (.73 - .34 * release)} heat={0} />
    <Filament a={right} b={b} strength={strength * (.82 - .32 * release)} heat={pressure * (1 - settle)} />
    {t < 11.65 && [a.clone().lerp(left, pulse), b.clone().lerp(right, pulse)].map((position, i) => (
      <sprite key={i} position={position} scale={.32 + .34 * pulse}>
        <spriteMaterial map={glow} color={i ? conflictLight : '#ded5ff'} transparent depthWrite={false}
          opacity={strength * ramp(t, 10.25, 10.55) * (1 - ramp(t, 11.38, 11.65))} />
      </sprite>
    ))}
  </>;
}

const bridges = [
  {a: 4, b: 11, start: 6.8, breakAt: 10.9, arch: .64},
  {a: 13, b: 22, start: 7.25, breakAt: 11.25, arch: -.36},
  {a: 7, b: 19, start: 7.6, breakAt: 12.45, arch: -.43},
];

function BranchWeave({t, points, vanish, convergence}: {t: number; points: Vector3[]; vanish: number; convergence: number}) {
  const activation = ramp(t, 6.4, 8.5) * (1 - ramp(t, 11.9, 15.1)) * vanish;
  return <>
    {bridges.map(({a, b, start, breakAt, arch}, i) => {
      const draw = ramp(t, start, start + 1.3);
      const fracture = ramp(t, breakAt, breakAt + 1.1);
      const opacity = draw * (1 - fracture) * (1 - convergence) * .42;
      if (opacity < .008) return null;
      const target = points[a].clone().lerp(points[b], draw);
      const control = points[a].clone().lerp(target, .5).add(new Vector3(0, arch, .72));
      const path = new QuadraticBezierCurve3(points[a], control, target);
      const conflict = i === 1 ? ramp(t, 10.42, 11.25) : 0;
      return <group key={a}>
        <mesh>
          <tubeGeometry args={[path, 20, .009, 4, false]} />
          <meshBasicMaterial color={coldLight.clone().lerp(conflictLight, conflict)} opacity={opacity}
            transparent depthWrite={false} />
        </mesh>
        {draw < 1 && <sprite position={target} scale={.36}>
          <spriteMaterial map={glow} color="#c4b2ff" transparent depthWrite={false} opacity={Math.sin(Math.PI * draw)} />
        </sprite>}
      </group>;
    })}
    {activation > .005 && origins.map((_, cluster) => {
      const root = 1 + cluster * 8;
      const facets = [0, 1, 3, 0, 3, 5, 0, 5, 7, 0, 7, 2, 0, 2, 4, 0, 4, 1];
      const positions = new Float32Array(facets.flatMap((offset) => points[root + offset].toArray()));
      return <mesh key={root}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <meshBasicMaterial color={cluster === 1 ? '#b59bff' : '#7464db'} side={DoubleSide}
          transparent depthWrite={false} opacity={activation * .11} />
      </mesh>;
    })}
  </>;
}

function Lattice({t, cinematic}: {t: number; cinematic: boolean}) {
  const convergence = ramp(t, 15.05, 17.2);
  const dissociation = ramp(t, 9.15, 13.8);
  const vanish = 1 - ramp(t, 16.9, 17.55);
  const points = nodes.map(({point, cluster}, i) => {
    const p = point.clone();
    if (i > 0) {
      p.addScaledVector(origins[cluster], dissociation * (.22 + .025 * (i % 4)));
      p.y += .09 * Math.sin(t * 1.1 + i) * (1 + dissociation);
      p.z += .11 * Math.cos(t * .8 + i);
      if (cinematic && cluster === 1) {
        const strain = ramp(t, 10.25, 11.38) * (1 - ramp(t, 11.38, 11.70));
        const recoil = ramp(t, 11.38, 11.72) * (1 - ramp(t, 11.72, 12.9));
        p.addScaledVector(origins[cluster], .095 * recoil - .078 * strain);
      }
      const twist = convergence * (cluster === 1 ? -.62 : .58);
      p.applyAxisAngle(up, twist);
      p.multiplyScalar(1 - convergence);
    }
    return p;
  });
  return <>
    <BranchWeave t={t} points={points} vanish={vanish} convergence={convergence} />
    {nodes.map(({parent, start, scale, cluster}, i) => {
      const reveal = ramp(t, start, start + .64);
      if (!reveal || !vanish) return null;
      const point = points[i];
      const breakage = i === 9 ? ramp(t, 11.25, 12.6) : i === 1 || i === 17 ? ramp(t, 10.15 + cluster * .34, 13.65) : 0;
      const heat = i === 9 ? ramp(t, 10.25, 11.15) * (1 - ramp(t, 13.55, 15.1)) : 0;
      const light = i === 0 ? '#d3c9ff' : coldLight.clone().lerp(conflictLight, heat);
      const strength = reveal * vanish;
      const recover = ramp(t, 15.15, 16.2);
      const gap = breakage * (1 - recover);
      const driftTail = point.clone().lerp(points[parent] ?? point, .13 + .13 * (1 - gap));
      const parentPoint = points[parent];
      const draw = ramp(t, start + .05, start + .83);
      const tip = parentPoint?.clone().lerp(point, draw * (1 - gap * .61));
      const pulse = Math.sin(Math.PI * ramp(t, start + .08, start + .85));
      const seedBloom = ramp(t, .7, 2.15) * (1 - ramp(t, 2.7, 4.4));
      const coreSize = scale * (.7 + .3 * reveal) * (i === 0 ? 1 + .37 * seedBloom + .8 * convergence : 1 - .76 * convergence);
      const opposing = cinematic && i === 9 && t >= 10.25 && t < 16.2;
      const lensClosure = cinematic && i === 0 ? ramp(t, 16.91, 17.35) : 0;
      return <group key={i}>
        {opposing && <OpposingLink a={parentPoint} b={point} t={t} strength={strength * (1 - ramp(t, 15.55, 16.2))} />}
        {tip && !opposing && <Filament a={parentPoint} b={tip} strength={strength * (.74 - .40 * gap)} heat={heat} />}
        {i === 9 && !opposing && <Filament a={point} b={driftTail} strength={strength * gap * (1 - convergence) * .62} heat={heat} />}
        {tip && pulse > .01 && <sprite position={tip} scale={.42}>
          <spriteMaterial map={glow} color={light} transparent opacity={pulse * .95} depthWrite={false} />
        </sprite>}
        <group position={point} scale={[1, 1 - .95 * lensClosure, 1]}>
          <sprite scale={coreSize * (i === 0 ? 16 : 17)}>
            <spriteMaterial map={glow} color={light} transparent opacity={strength * (i === 0 ? .57 : .43) * (1 - lensClosure)} depthWrite={false} />
          </sprite>
          <mesh rotation={[.28 + t * .12, i * .51 + t * .22, -.4]} scale={coreSize}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={new Color("#6555a4").lerp(new Color("#7f341d"), heat)} flatShading roughness={.28} metalness={.46}
              emissive={light} emissiveIntensity={(cinematic ? (i === 0 ? .12 : .10) + heat * .17 : i === 0 ? .29 : .16) * reveal} transparent opacity={strength} />
          </mesh>
          {i === 0 && <mesh rotation={[t * .15, t * .25, -.22]} scale={coreSize * 1.48}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial wireframe color="#c4b5ff" transparent depthWrite={false}
              opacity={.32 * strength * ramp(t, 1.1, 2.7) * (1 - convergence)} />
          </mesh>}
          {(i === 0 || i === 1 || i === 9 || i === 17) && <mesh rotation={[1.04, .22 + i * .1, t * .22]} scale={coreSize}>
            <torusGeometry args={[3.8, .023, 5, 48, Math.PI * 1.65]} />
            <meshBasicMaterial color={light} transparent opacity={strength * .44 * (1 - convergence)} depthWrite={false} />
          </mesh>}
        </group>
      </group>;
    })}
  </>;
}

export function ThoughtChamber({cinematic = false}: {cinematic?: boolean}) {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = frame / fps;
  return <ThreeCanvas width={width} height={height} camera={{fov: 31, near: .1, far: 60}} gl={{antialias: true, alpha: true}}>
    <CameraMove t={t} cinematic={cinematic} />
    <ambientLight intensity={cinematic ? .25 : .58} color="#9a91ff" />
    <directionalLight position={[-3, 5, 3]} intensity={3.1} color="#e0d9ff" />
    <directionalLight position={[3, -2, -4]} intensity={2.8} color="#7056f5" />
    {cinematic && <pointLight position={[-1.45 + 3.8 * ramp(t, 3.2, 10.7), 1.85, 1.6]}
      intensity={20 + 17 * ramp(t, 4, 9.6)} distance={8} decay={2} color="#e9ddff" />}
    <Lattice t={t} cinematic={cinematic} />
  </ThreeCanvas>;
}
