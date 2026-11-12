import {useContext} from 'react';
import {Polish} from '../components/Polish';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ReactNode} from 'react';
import {FinaleSeed} from '../three/FinaleSeed';
import {ramp} from '../three/ThoughtChamber';

const sans = 'Helvetica Neue, Arial, sans-serif';
const mono = 'Menlo, Consolas, monospace';
const ink = '#f6f2ff';
const muted = '#c2b9d6';
const coral = '#f4a78f';
const asset = (name: string) => staticFile(`footage/sentry/${name}`);

function Label({children, color = '#b8a3fa'}: {children: ReactNode; color?: string}) {
  return <div style={{color, font: `20px ${mono}`, letterSpacing: 2.5, textTransform: 'uppercase'}}>{children}</div>;
}

function Backdrop({children, heat = 0}: {children: ReactNode; heat?: number}) {
  return <AbsoluteFill style={{overflow: 'hidden', color: ink, fontFamily: sans, background: 'radial-gradient(ellipse at 51% 44%, #211735, #0c0e14 71%)'}}>
    <AbsoluteFill style={{opacity: heat, background: 'radial-gradient(ellipse at 69% 52%, #412337, transparent 64%)'}} />
    {children}
  </AbsoluteFill>;
}

const sourceRows = [
  'for await (const line of lines) {',
  '  if (line.trim().length === 0) continue;',
  '  let entry: { relativePath?: unknown; type?: unknown; sha256?: unknown };',
  '  try {',
  '    entry = JSON.parse(line) as { relativePath?: unknown; type?: unknown; sha256?: unknown };',
  '  } catch {',
  '    continue;',
  '  }',
];

function SourceCode({t, close}: {t: number; close?: boolean}) {
  const polished = useContext(Polish);
  const highlight = ramp(t, 2, 3.15);
  return <div style={{
    position: 'absolute', left: close ? 700 : 920, right: 100, top: close ? 302 : 380,
    padding: '31px 35px 35px', border: '1px solid #755e9d', background: '#101018', borderRadius: 14,
    boxShadow: '0 25px 70px #030309b0', transform: `translateY(${16 * (1 - ramp(t, 0, .68))}px) scale(${1 + (close ? .043 * ramp(t, 2.3, 9) : 0)})`,
    transformOrigin: '50% 58%',
    opacity: ramp(t, 0, .68), boxSizing: 'border-box',
  }}>
    <Label>{close ? 'Archived code reference' : 'Audited repository / Sentry'}</Label>
    <div style={{font: `20px ${mono}`, color: muted, margin: '18px 0 28px'}}>packages/snapshot-engine/src/index.ts</div>
    {sourceRows.slice(close && polished && t >= 2 ? 5 : close ? 3 : 1).map((line, i, rows) => {
      const hot = i === rows.length - 2;
      return <div key={line} style={{
        font: `${close ? (polished && t >= 2 ? 55 : 29) : 21}px/1.55 ${mono}`, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
        color: hot && close ? coral : ink, background: hot && close ? `rgba(201, 104, 92, ${.16 * highlight})` : undefined,
      }}>{line}</div>;
    })}
    {close && polished && t >= 2 && <div style={{color: coral, fontSize: 29, marginTop: 19}}>Parse error → row skipped</div>}
  </div>;
}

const routes = [
  {name: 'OpenCode', status: 'Completed', y: 407, color: '#baa4fb'},
  {name: 'DeepSeek', status: 'Completed', y: 565, color: '#a1b5f7'},
  {name: 'GLM via Claude Code', status: 'Failed', y: 724, color: coral},
];

function ReviewPaths({t}: {t: number}) {
  const polished = useContext(Polish);
  return <>
    <div style={{position: 'absolute', left: 100, top: 93}}><Label>Sentry / Architecture diagram</Label></div>
    <div style={{position: 'absolute', left: 100, top: 170, fontSize: 92, letterSpacing: -4}}>Independent review.</div>
    <div style={{position: 'absolute', left: 108, top: 483}}>
      <Label>One frozen snapshot</Label>
      <div style={{marginTop: 16, color: muted, fontSize: 24}}>Archived run · 27 Oct 2026</div>
      <div style={{marginTop: 13, color: '#9b91af', font: `22px ${mono}`}}>SHA256 9aeea73a86ba…</div>
    </div>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      {routes.map(({y, color, name}, i) => {
        const reveal = ramp(t, .47 + .38 * i, 2.1 + .38 * i);
        const path = `M 472 552 C 682 552 703 ${y} 986 ${y}`;
        return <g key={name}>
          <path d={path} fill="none" stroke={color} strokeWidth="2.3" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - reveal} />
          <path d={path} fill="none" stroke={color} strokeWidth="4" pathLength={1} strokeLinecap="round"
            strokeDasharray=".035 1" strokeDashoffset={-reveal * .965}
            opacity={ramp(t, .47 + .38 * i, .79 + .38 * i) * (1 - ramp(t, 2.1 + .38 * i, 2.48 + .38 * i))} />
          <circle cx={986} cy={y} r={6 + 4 * reveal} fill={color} opacity={reveal} />
        </g>;
      })}
    </svg>
    {routes.map(({y, color, name, status}, i) => <div key={name} style={{
      position: 'absolute', left: 1040, right: 116, top: y - 32, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', opacity: ramp(t, 1 + .38 * i, 2.0 + .38 * i),
      borderBottom: '1px solid #483c60', paddingBottom: 19,
    }}>
      <div style={{fontSize: polished ? 51 : 41, letterSpacing: -1}}>{name}</div>
      {polished ? <div style={{font: `500 29px ${sans}`, color}}>{status}</div> : <Label color={color}>{status}</Label>}
    </div>)}
    <div style={{position: 'absolute', left: 1040, bottom: 172, opacity: ramp(t, 4.3, 5.2)}}>
      {polished ? <div style={{color: coral, fontSize: 33}}>Archived outcome · partial</div> : <Label color={coral}>Archived outcome · partial</Label>}
      <div style={{fontSize: 24, marginTop: 12, color: muted}}>Separate workspaces. Separate outcomes.</div>
    </div>
  </>;
}

function RunReplay({t}: {t: number}) {
  const polished = useContext(Polish);
  const rows = [
    'Input: 3 manifest rows',
    'Returned: 1 baseline entry (src/a.ts)',
    'Malformed rows: skipped without error',
    'PASS: reported behavior reproduced',
  ];
  return <>
    <div style={{position: 'absolute', left: 104, top: 96}}><Label>QA / Local replay of the audited source</Label></div>
    <div style={{position: 'absolute', left: 104, top: 274, width: 520}}>
      <div style={{fontSize: 86, lineHeight: .98, letterSpacing: -4}}>Challenge<br />the result.</div>
      <div style={{fontSize: 30, color: muted, lineHeight: 1.44, marginTop: 28}}>A targeted check of the snapshot loader’s behavior.</div>
    </div>
    <div style={{position: 'absolute', left: 711, right: 105, top: 278, padding: '35px 44px', borderRadius: 14,
      border: '1px solid #705b9b', background: '#101019', boxShadow: '0 32px 80px #05030abe'}}>
      <Label>Captured Node replay output</Label>
      <div style={{height: 1, background: '#403455', margin: '24px 0 32px'}} />
      {polished && <div style={{fontSize: 58, fontWeight: 500, letterSpacing: -2, marginBottom: 22,
        color: '#d2c1ff', opacity: ramp(t, .76, 1.4)}}>3 rows → 1 entry</div>}
      {rows.map((row, i) => <div key={row} style={{font: `30px/1.8 ${mono}`, opacity: ramp(t, .24 + i * .48, .85 + i * .48),
        color: i === 2 ? coral : i === 3 ? '#c6b2ff' : ink}}>{row}</div>)}
    </div>
  </>;
}

export function SentryScene() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const polished = useContext(Polish);
  const handoff = ramp(t, .14, polished ? 1.05 : 1.4);
  const closing = ramp(t, 31.5, 33.55);
  return <Backdrop heat={ramp(t, 13.5, 19) * (1 - ramp(t, 27.4, 33.5)) * .57}>
    {t < 5 ? <>
      <Img src={asset('nova-end.png')} style={{width: 1920, height: 1080, position: 'absolute', opacity: 1 - handoff}} />
      <div style={{position: 'absolute', left: 104, top: 306, opacity: polished ? ramp(t, 1.08, 1.86) : handoff, width: 805}}>
        <Label>ArthurLabs / Verification</Label>
        <div style={{fontSize: 83, lineHeight: .99, letterSpacing: -3.9, marginTop: 24}}>How do we<br />trust what we build?</div>
      </div>
      <SourceCode t={t - 1.5} />
    </> : t < 14 ? <ReviewPaths t={t - 5} /> : t < 25 ? <>
      <div style={{position: 'absolute', left: 104, top: 93}}><Label color={coral}>Archived OpenCode finding / Medium</Label></div>
      <div style={{position: 'absolute', left: 104, top: 300, width: 552}}>
        <div style={{fontSize: 73, lineHeight: 1.02, letterSpacing: -3}}>A corrupt<br />manifest slips<br />through.</div>
        <div style={{fontSize: 27, lineHeight: 1.42, color: muted, marginTop: 25}}>The finding points to the parser and the path that skips invalid rows.</div>
      </div>
      <SourceCode t={t - 14.1} close />
      <div style={{position: 'absolute', left: 703, right: 105, top: 778, opacity: ramp(t, 20.3, 21.3)}}>
        <Label color={coral}>Linked evidence</Label>
        <div style={{fontSize: 27, color: muted, marginTop: 15}}>Baseline code reference + reproduced behavior in a replica</div>
      </div>
    </> : <RunReplay t={t - 25} />}
    <AbsoluteFill style={{opacity: closing, background: 'radial-gradient(ellipse at center, #211832, #0c0e14 65%)',
      alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 84, height: 1, background: coral, marginBottom: 26}} />
      <Label color={coral}>Evidence you can inspect</Label>
    </AbsoluteFill>
    <Audio src={staticFile('audio/music/sentry-mix.wav')} />
  </Backdrop>;
}

const pillars = [
  {x: 412, name: 'Arthur Studio', verb: 'Think', color: '#c9b6ff', shape: 'M -88 37 L -24 -44 L 31 7 L 94 -28 M -24 -44 L -9 62 L 31 7'},
  {x: 960, name: 'Nexus', verb: 'Build', color: '#b5b5ff', shape: 'M -111 6 L -46 6 L -46 -41 L 33 -41 L 33 34 L 107 34'},
  {x: 1508, name: 'Sentry', verb: 'Verify', color: coral, shape: 'M -106 -38 L 0 6 L 99 6 M -106 6 L 0 6 M -106 50 L 0 6'},
];

export function ArthurLabsFinale() {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const emerge = ramp(t, .24, 1.02);
  const converge = ramp(t, 3.58, 5.42);
  const sweep = ramp(t, 5.02, 5.97);
  const open = ramp(t, 5.54, 6.52);
  const shine = sweep * (1 - ramp(t, 6.1, 6.85));
  return <Backdrop>
    <AbsoluteFill style={{opacity: 1 - emerge, background: 'radial-gradient(ellipse at center, #211832, #0c0e14 65%)',
      alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 84, height: 1, background: coral, marginBottom: 26}} />
      <Label color={coral}>Evidence you can inspect</Label>
    </AbsoluteFill>
    {t > 3.4 && t < 5.8 && <FinaleSeed t={t} />}
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="brand-seam"><stop stopColor="#7056f5" stopOpacity="0" /><stop offset=".5" stopColor="#ebdfff" /><stop offset="1" stopColor="#7056f5" stopOpacity="0" /></linearGradient>
      </defs>
      {pillars.map(({x, shape, name, color}, i) => {
        const draw = ramp(t, .4 + i * .49, 1.36 + i * .49);
        const shrink = 1 - .91 * converge;
        return <g key={name} opacity={draw * (1 - ramp(t, 4.92, 5.48))}
          transform={`translate(${x + (960 - x) * converge} ${448 + 92 * converge}) scale(${shrink} ${shrink * (1 - .71 * converge)})`}>
          <path d={shape} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} fill="none" stroke={color} strokeWidth="2.3" />
          <circle cx={i === 1 ? -46 : 0} cy={i === 1 ? 6 : 7} r="7" fill={color} />
        </g>;
      })}
      <line x1={960 - 590 * sweep} x2={960 + 590 * sweep} y1="540" y2="540" stroke="url(#brand-seam)" opacity={shine} strokeWidth={2 + 2 * shine} />
    </svg>
    {pillars.map(({x, verb, name, color}, i) => <div key={name} style={{
      position: 'absolute', left: x, top: 558, translate: '-50% 0', textAlign: 'center',
      opacity: ramp(t, .45 + .51 * i, 1.12 + .51 * i) * (1 - ramp(t, 3.35, 4.34)),
    }}>
      <div style={{fontSize: 69, letterSpacing: -2.8, marginBottom: 15}}>{verb}</div>
      <Label color={color}>{name}</Label>
    </div>)}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontSize: 105, fontWeight: 500, letterSpacing: 19, paddingLeft: 19, textShadow: '0 0 44px #7056f563',
        clipPath: `inset(${50 * (1 - open)}% ${50 * (1 - sweep)}% ${50 * (1 - open)}% ${50 * (1 - sweep)}%)`}}>
        ARTHURLABS
      </div>
      <div style={{position: 'absolute', top: 633, font: `24px ${mono}`, letterSpacing: 7, color: '#d5c7f5',
        opacity: ramp(t, 6.31, 7.2)}}>BEYOND GENERATION</div>
    </AbsoluteFill>
    <Audio src={staticFile('audio/music/finale-mix.wav')} />
  </Backdrop>;
}

export function SentryFinaleSequence() {
  return <AbsoluteFill>
    <Sequence from={0} durationInFrames={1020} name="Sentry"><SentryScene /></Sequence>
    <Sequence from={1020} durationInFrames={300} name="ArthurLabs finale"><ArthurLabsFinale /></Sequence>
  </AbsoluteFill>;
}
