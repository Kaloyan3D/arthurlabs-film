import type {ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../styles/theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export function Reveal({children, start = 0}: {children: ReactNode; start?: number}) {
  const frame = useCurrentFrame();
  const alpha = interpolate(frame, [start, start + 24], [0, 1], clamp);
  return <div style={{opacity: alpha, transform: `translateY(${20 * (1 - alpha)}px)`}}>{children}</div>;
}

export function FadeScene({children}: {children: ReactNode}) {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fade = Math.min(18, Math.floor((durationInFrames - 1) / 2));
  const opacity = fade > 0 ? interpolate(frame, [0, fade, durationInFrames - 1 - fade, durationInFrames - 1], [0, 1, 1, 0], clamp) : 1;
  return <AbsoluteFill style={{background: theme.background, opacity}}>{children}</AbsoluteFill>;
}
