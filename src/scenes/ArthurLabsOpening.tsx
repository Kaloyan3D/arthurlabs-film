import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp, ThoughtChamber} from '../three/ThoughtChamber';

function ApertureWordmark({t}: {t: number}) {
  const sweep = ramp(t, 17.22, 17.67);
  const open = ramp(t, 17.43, 18.19);
  const edge = sweep * (1 - ramp(t, 17.67, 18.12));
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    {[-1, 1].map((side) => <div key={side} style={{
      position: 'absolute', width: 832 * sweep, height: 1,
      translate: `0 ${side * 55 * open}px`,
      opacity: .72 * edge,
      background: 'linear-gradient(90deg, #e2d7ff, #7056f5 7%, #eee8ff 50%, #7056f5 93%, #e2d7ff)',
      boxShadow: '0 0 18px #8068e390',
    }} />)}
    <div style={{
      clipPath: `inset(${50 * (1 - open)}% ${50 * (1 - sweep)}% ${50 * (1 - open)}% ${50 * (1 - sweep)}%)`,
      color: '#f6f3ff', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: 500,
      fontSize: 101, letterSpacing: 18, paddingLeft: 18, opacity: ramp(t, 17.32, 17.84), textShadow: '0 0 45px #7056f548',
    }}>ARTHURLABS</div>
  </AbsoluteFill>;
}

export function ArthurLabsOpening({sound = true, cinematic = false}: {sound?: boolean; cinematic?: boolean}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const atmosphere = ramp(t, .15, 3.8);
  const convergence = ramp(t, 16.1, 17.45);
  const title = ramp(t, 17.30, 18.22);
  return <AbsoluteFill style={{background: '#030308', overflow: 'hidden'}}>
    <AbsoluteFill style={{
      opacity: atmosphere,
      background: 'radial-gradient(ellipse at 48% 43%, #211834 0%, #120f22 31%, #0c0e14 63%, #05060a 100%)',
    }} />
    <AbsoluteFill style={{
      opacity: .22 * atmosphere * (1 - convergence),
      background: `radial-gradient(ellipse at ${19 + 13 * ramp(t, 1, 16)}% 57%, #7056f5 0%, transparent 52%)`,
    }} />
    <AbsoluteFill style={{
      opacity: .26 * atmosphere * ramp(t, 3.4, 8.5) * (1 - convergence),
      background: 'radial-gradient(ellipse at 72% 24%, #514480 0%, transparent 38%), radial-gradient(ellipse at 52% 82%, #34306b 0%, transparent 42%)',
    }} />
    <ThoughtChamber cinematic={cinematic} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(2,2,7,.56) 100%)'}} />
    {cinematic ? <ApertureWordmark t={t} /> : <>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 960 * convergence, height: 2,
        transform: 'translate(-50%, -50%)',
        opacity: convergence * (1 - ramp(t, 17.39, 18.18)),
        background: 'linear-gradient(90deg, transparent, #7056f5 28%, #eee7ff 50%, #7056f5 72%, transparent)',
        filter: 'drop-shadow(0 0 16px #7056f5)',
      }} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{
          opacity: ramp(t, 17.25, 17.85),
          clipPath: `inset(0 ${50 * (1 - title)}% 0 ${50 * (1 - title)}% round 4px)`,
          translate: `0 ${7 * (1 - title)}px`, filter: `blur(${7 * (1 - title)}px)`,
          color: '#f6f3ff', fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: 500, fontSize: 101,
          letterSpacing: 22 - 4 * title, paddingLeft: 18, textShadow: '0 0 45px #7056f548',
        }}>ARTHURLABS</div>
      </AbsoluteFill>
    </>}
    {sound && <Audio src={staticFile('audio/music/opening-mix.wav')} />}
  </AbsoluteFill>;
}
