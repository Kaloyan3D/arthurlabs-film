import {useContext} from 'react';
import {Polish} from './Polish';
import {Video} from '@remotion/media';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp} from '../three/ThoughtChamber';

export type ProductCrop = {x: number; y: number; width: number; height: number};

/** Reframe a real 1280 × 800 logical-pixel capture without altering its UI. */
export function ProductFootage({asset, crop, left, top, width, drift = 0, opacity = 1}: {
  asset: string;
  crop: ProductCrop;
  left: number;
  top: number;
  width: number;
  drift?: number;
  opacity?: number;
}) {
  const polished = useContext(Polish);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = width / crop.width;
  const push = 1 + drift * ramp(frame / fps, 0, 5.4);
  const image = {
    position: 'absolute' as const,
    left: -crop.x * scale, top: -crop.y * scale,
    width: 1280 * scale, height: 800 * scale,
    filter: polished ? 'brightness(1.13) contrast(1.035)' : undefined,
  };
  const src = staticFile(`footage/arthur-studio/${asset}`);
  return <div style={{
    position: 'absolute', left, top, width, height: crop.height * scale, opacity,
    overflow: 'hidden', borderRadius: 16, background: '#101514',
    boxShadow: '0 35px 85px #020208ae, 0 0 0 1px #a298cf45',
  }}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`}}>
      {asset.endsWith('.png') ? <Img src={src} style={image} /> : <Video src={src} muted style={image} />}
    </div>
  </div>;
}
