import {Video} from '@remotion/media';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {clamp} from './motion';

export function Footage({asset, trimBefore = 0, focus = [50, 50], zoom = 1}: {
  asset: string; trimBefore?: number; focus?: [number, number]; zoom?: number;
}) {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [1, zoom], clamp);
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Video src={staticFile(asset)} trimBefore={trimBefore} style={{
      width: '100%', height: '100%', objectFit: 'contain',
      transformOrigin: `${focus[0]}% ${focus[1]}%`, transform: `scale(${scale})`,
    }} />
  </AbsoluteFill>;
}
