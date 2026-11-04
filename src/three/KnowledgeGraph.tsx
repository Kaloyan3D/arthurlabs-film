import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {BufferGeometry, Vector3} from 'three';
import {theme} from '../styles/theme';

export type Point = [number, number, number];
export const proofNodes: Point[] = [[0,0,0], [-1.5,1,0.2], [1.5,0.9,-0.3], [-1.3,-0.9,0.4], [1.2,-1,0.3], [0.4,0.2,1.4]];
export const proofEdges: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,3],[2,4]];

export function KnowledgeGraph({nodes, edges}: {nodes: Point[]; edges: [number, number][]}) {
  const frame = useCurrentFrame();
  const geometry = useMemo(() => new BufferGeometry().setFromPoints(
    edges.flatMap(([a, b]) => [new Vector3(...nodes[a]), new Vector3(...nodes[b])]),
  ), [nodes, edges]);

  return <ThreeCanvas width={850} height={740} camera={{position: [0, 0, 5.7], fov: 42}}>
    <ambientLight intensity={1.6} />
    <pointLight position={[3, 3, 5]} intensity={32} color="#C6B9FF" />
    <group rotation={[0.18 + Math.sin(frame / 55) * 0.16, -0.36 + frame / 120, -0.1]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#8776C8" transparent opacity={0.6} />
      </lineSegments>
      {nodes.map((position, i) => <mesh key={i} position={position}>
        <sphereGeometry args={[i === 0 ? 0.22 : 0.11, 24, 24]} />
        <meshStandardMaterial color={i === 0 ? '#D8CCFF' : theme.accent} emissive={theme.accent} emissiveIntensity={i === 0 ? 0.7 : 0.28} />
      </mesh>)}
    </group>
  </ThreeCanvas>;
}
