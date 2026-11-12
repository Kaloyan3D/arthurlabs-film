import {useContext} from 'react';
import {Polish} from '../components/Polish';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ReactNode} from 'react';
import {NexusStructure} from '../three/NexusStructure';
import {ramp} from '../three/ThoughtChamber';
import {nexusEvidence} from './nexus-evidence';

const font = 'Helvetica Neue, Arial, sans-serif';
const mono = 'Menlo, Consolas, monospace';
const ink = '#f4f0ff';
const violet = '#b8a8fa';
const dim = '#bbb6cb';

function time(frame: number, fps: number) {
  return frame / fps;
}

function Chamber({children, warm = 0}: {children: ReactNode; warm?: number}) {
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 63% 46%, #211837 0%, #131221 44%, #0c0e14 77%)', color: ink, fontFamily: font, overflow: 'hidden'}}>
    <AbsoluteFill style={{opacity: warm, background: 'radial-gradient(ellipse at 73% 49%, #362035, transparent 58%)'}} />
    {children}
  </AbsoluteFill>;
}

function Tag({children, color = violet}: {children: ReactNode; color?: string}) {
  return <div style={{fontFamily: mono, color, fontSize: 19, letterSpacing: 2.8, textTransform: 'uppercase'}}>{children}</div>;
}

function Editorial({kicker, title, body, t}: {kicker: string; title: ReactNode; body: string; t: number}) {
  const enter = ramp(t, 0, .74);
  return <div style={{position: 'absolute', left: 100, top: 294 + 22 * (1 - enter), width: 644, opacity: enter}}>
    <Tag>{kicker}</Tag>
    <div style={{fontSize: 88, fontWeight: 500, letterSpacing: -4, lineHeight: .99, margin: '27px 0 25px'}}>{title}</div>
    <div style={{fontSize: 30, color: dim, lineHeight: 1.43, maxWidth: 530}}>{body}</div>
  </div>;
}

function Proof({label, command, lines, t}: {label: string; command?: string; lines: string[]; t: number}) {
  return <div style={{position: 'absolute', left: 734, top: 280, width: 1081, minHeight: 390,
    border: '1px solid #9d8be158', borderRadius: 14, background: '#101019', boxShadow: '0 38px 95px #030309bb',
    padding: '34px 43px', boxSizing: 'border-box', transform: `translateY(${13 * (1 - ramp(t, 0, .7))}px)`,
    opacity: ramp(t, 0, .7),
  }}>
    <Tag>{label}</Tag>
    <div style={{height: 1, margin: '25px 0 28px', background: '#302849'}} />
    {command && <div style={{font: `21px ${mono}`, color: dim, marginBottom: 30}}>{command}</div>}
    {lines.map((line, i) => <div key={line} style={{
      font: `22px/1.55 ${mono}`, color: /PASS|passed|\bok\b/.test(line) ? '#c9bbff' : '#e2deef',
      whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginTop: 14, opacity: ramp(t, .38 + i * .2, .95 + i * .2),
    }}>{line}</div>)}
  </div>;
}

function Route({labels, t}: {labels: string[]; t: number}) {
  return <div style={{position: 'absolute', left: 734, right: 102, top: 813, display: 'flex', justifyContent: 'space-between'}}>
    {labels.map((label, i) => <div key={label} style={{flex: 1, opacity: ramp(t, i * .2, .65 + i * .2), borderTop: '1px solid #6d5caa',
      paddingTop: 15, marginRight: 18, color: '#d8cef6', font: `18px ${mono}`}}>{label}</div>)}
  </div>;
}

function VerificationFocus({t}: {t: number}) {
  const classified = t >= 5.4;
  const reveal = ramp(t, classified ? 5.4 : 0, classified ? 6 : .72);
  return <AbsoluteFill style={{padding: '115px 140px', alignItems: 'flex-start', background: 'radial-gradient(ellipse at 62% 58%, #271a37, transparent 66%)'}}>
    <Tag>{classified ? 'Nexus Native / Rust fixture test' : 'Shell counterexample / Captured output'}</Tag>
    <div style={{fontSize: 114, fontWeight: 500, letterSpacing: -6, lineHeight: 1.04, marginTop: 58}}>An exit code isn’t proof.</div>
    <div style={{height: 1, width: `${100 * ramp(t, .12, 1.9)}%`, background: '#806bc9', margin: '54px 0 40px'}} />
    <div style={{opacity: reveal, transform: `translateY(${19 * (1 - reveal)}px)`}}>
      <div style={{font: `32px ${mono}`, color: dim}}>{classified ? 'Broker classification · shell composition' : "sh -c 'false || true'"}</div>
      <div style={{fontSize: 82, color: classified ? '#f4b39f' : '#cdbbff', fontWeight: 500, letterSpacing: -3, marginTop: 26}}>
        {classified ? 'Inconclusive' : nexusEvidence.shell[0]}
      </div>
      <div style={{fontSize: 29, color: dim, marginTop: 25}}>
        {classified ? 'The test passed. The simulated check was never accepted as proof.' : 'The fallback hides the failed command.'}
      </div>
      {classified && <div style={{font: `21px/1.6 ${mono}`, color: '#c5b7df', marginTop: 27}}>
        {nexusEvidence.native[0]}<br />{nexusEvidence.native[1]}
      </div>}
    </div>
  </AbsoluteFill>;
}

export function NexusEngineeringScene() {
  const t = time(useCurrentFrame(), useVideoConfig().fps);
  const polished = useContext(Polish);
  const arrival = ramp(t, .38, polished ? 1.61 : 2.3);
  const closing = ramp(t, 44.25, 46.82);
  const proofTime = t - 31;
  return <Chamber warm={.7 * ramp(t, 34.5, 38) * (1 - ramp(t, 41.7, 46))}>
    {t < 7 ? <>
      <Img src={staticFile('footage/nexus/studio-end.png')} style={{position: 'absolute', width: '100%', height: '100%', opacity: 1 - arrival}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: polished ? ramp(t, 1.63, 2.52) : arrival}}>
        <Tag>Conceptual transition</Tag>
        <div style={{fontSize: 109, fontWeight: 500, letterSpacing: -4, marginTop: 29}}>Meet Nexus.</div>
        <div style={{width: 630 * ramp(t, 1.5, 4.5), height: 1, background: '#9f8bdf', margin: '35px 0 24px'}} />
        <Tag>Thought &nbsp; → &nbsp; Task &nbsp; → &nbsp; Execution</Tag>
      </AbsoluteFill>
    </> : t < 20 ? <>
      <Editorial kicker="01 / DeepSeek DSH foundation" title="Nexus DSH" body="A controller for task binding, structured execution and independent review." t={t - 7} />
      {t < 11.7 ? <div style={{position: 'absolute', left: 710, top: 142, opacity: ramp(t, 7, 8)}}>
        <NexusStructure variant="routes" t={t - 7} />
      </div> : t < 16 ?
        <Proof label="Captured controller test output" command="node tests/AihController.Tests.cjs" lines={nexusEvidence.dsh} t={t - 11.7} /> :
        <Proof label="Source excerpt · controller review classification" lines={nexusEvidence.review} t={t - 16} />}
      <Route labels={['Task binding', 'Execution route', 'Independent review']} t={t - 7} />
    </> : t < 25 ? <>
      <Editorial kicker="02 / Original Rust harness" title={<>Nexus<br />Native</>} body="Its own broker, execution kernel and evidence ledger." t={t - 20} />
      <div style={{position: 'absolute', left: 710, top: 136, opacity: ramp(t, 20, 21.2)}}>
        <NexusStructure variant="routes" t={t - 20} />
      </div>
      <Route labels={['Broker', 'Execution kernel', 'Evidence ledger']} t={t - 20} />
    </> : t < 31 ? <>
      <div style={{position: 'absolute', left: 122, top: 79}}><Tag>Native desktop / Recorded acceptance run</Tag></div>
      <div style={{position: 'absolute', left: 196, top: 144, width: 1528, height: 725, overflow: 'hidden',
        borderRadius: 15, border: '1px solid #6c609c', background: '#0b0b10', boxShadow: '0 26px 94px #050409bb'}}>
        <Img src={staticFile(`footage/nexus/native-taskboard-${t < 27.65 ? 'running' : 'done'}.png`)} style={{
          position: 'absolute', left: -43, top: -20, width: 1614, transform: `scale(${1 + (polished ? .24 : .034) * ramp(t, 25, 30.8)})`,
          transformOrigin: '55% 38%', filter: polished ? 'brightness(1.09) contrast(1.025)' : undefined,
        }} />
      </div>
      <div style={{position: 'absolute', left: 122, bottom: 110, color: dim, fontSize: 26}}>
        Taskboard acceptance case · Muse Spark 1.3 Contributor via OpenCode Go
      </div>
    </> : polished ? <VerificationFocus t={proofTime} /> : <>
      <Editorial kicker={t < 36.4 ? '03 / Shell counterexample' : '03 / Native verification test'} title={<>An exit code<br />isn’t proof.</>}
        body={t < 36.4 ? 'A fallback can make a failed command look successful.' : 'The broker marks a composed shell check inconclusive.'}
        t={proofTime} />
      {t < 36.4 ?
        <Proof label="Captured shell output" command="sh -c 'false || true'" lines={nexusEvidence.shell} t={proofTime} /> :
        <Proof label="Captured Rust fixture test output" command="cargo test -p nexus-broker --lib verification::tests::"
          lines={nexusEvidence.native} t={t - 36.4} />}
      {t >= 40.4 && <div style={{position: 'absolute', left: 772, top: 695, right: 102, opacity: ramp(t, 40.4, 41.1)}}>
        <Tag>Source excerpt · verification/tests.rs</Tag>
        <div style={{font: `22px/1.35 ${mono}`, color: '#eee2fa', marginTop: 14}}>
          CheckOutcome::Inconclusive {'{'} reason: "shell-composition" {'}'}
        </div>
      </div>}
      <Route labels={['Receipt', 'Check classification', 'Evidence']} t={proofTime} />
    </>}
    <AbsoluteFill style={{opacity: closing, alignItems: 'center', justifyContent: 'center', background: '#0c0e14'}}>
      <Tag>Nexus Native</Tag>
      <div style={{fontSize: 65, marginTop: 25, letterSpacing: -1.8}}>Engineering with evidence.</div>
    </AbsoluteFill>
    <Audio src={staticFile('audio/music/nexus-engineering-mix.wav')} />
  </Chamber>;
}

const tiers = [
  ['HOT', 'Active execution'],
  ['WARM', 'Relevant prior decisions'],
  ['COLD', 'Recoverable detail'],
];

export function ContextCompactionScene() {
  const polished = useContext(Polish);
  const t = time(useCurrentFrame(), useVideoConfig().fps);
  const checkpoint = ramp(t, 12.7, 13.7);
  const rc = ramp(t, 12.6, 13.25);
  return <Chamber>
    <div style={{position: 'absolute', left: 98, top: 96}}><Tag>Nexus DSH / Architecture and RC evidence</Tag></div>
    <div style={{position: 'absolute', left: 98, top: 245, width: 590}}>
      <div style={{fontSize: 70, lineHeight: .99, letterSpacing: -3.5}}>Context<br />Compaction V2</div>
      <div style={{marginTop: 52}}>
        {tiers.map(([name, desc], i) => <div key={name} style={{
          display: 'grid', gridTemplateColumns: '124px 1fr', alignItems: 'center', padding: '17px 0',
          borderTop: '1px solid #3c315d', opacity: ramp(t, 3 + i * 1.22, 4 + i * 1.22),
        }}><Tag>{name}</Tag><span style={{fontSize: 25, color: dim}}>{desc}</span></div>)}
      </div>
    </div>
    <div style={{position: 'absolute', left: 700, top: 95, opacity: ramp(t, .1, 1.3)}}><NexusStructure variant="context" t={t} /></div>
    <div style={{position: 'absolute', left: 805, bottom: 179, opacity: ramp(t, 2.5, 3.45)}}>
      <Tag>Canonical history</Tag>
      <div style={{fontSize: 23, marginTop: 10, color: dim}}>Append-only record</div>
    </div>
    <div style={{position: 'absolute', left: 1352, bottom: 179, opacity: checkpoint}}>
      <Tag color="#e8b388">Safe-point checkpoint</Tag>
      <div style={{fontSize: 23, marginTop: 10, color: dim}}>References to original history</div>
    </div>
    <div style={{position: 'absolute', left: 98, right: 104, bottom: 77, paddingTop: 21, borderTop: '1px solid #50436f', opacity: rc}}>
      <Tag>Documented RC1 live validation · Muse Spark 1.3 Contributor via OpenCode Go</Tag>
    </div>
    {polished && t < .85 && <Img src={staticFile('footage/polish/engineering-end.png')}
      style={{position: 'absolute', width: 1920, height: 1080, opacity: 1 - ramp(t, .03, .85)}} />}
    <Audio src={staticFile('audio/music/context-compaction-mix.wav')} />
  </Chamber>;
}

const nova = [
  {from: 4.0, name: 'Simple', description: 'One medium-cost agent.', roles: ['Task', 'Medium-cost agent', 'Verification']},
  {from: 7.6, name: 'Complex', description: 'A higher-cost primary with a medium- or lower-cost supporting agent.', roles: ['Task', 'Primary + support', 'Verification']},
  {from: 12.6, name: 'Parallel', description: 'A higher-cost coordinator divides work among medium- or lower-cost agents.', roles: ['Coordinator', 'Parallel work', 'Integrate + verify']},
];

export function NexusNovaScene() {
  const polished = useContext(Polish);
  const t = time(useCurrentFrame(), useVideoConfig().fps);
  const mode = t < nova[1].from ? 0 : t < nova[2].from ? 1 : 2;
  const shot = nova[mode];
  const local = t - shot.from;
  const settle = ramp(t, 18.8, 19.8);
  return <Chamber>
    <div style={{position: 'absolute', left: 100, right: 100, top: 94, paddingBottom: 22, borderBottom: '1px solid #3e3559'}}>
      <Tag>Nexus Nova / Planned architecture · extension of Nexus Native</Tag>
    </div>
    {t < nova[0].from ? <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: polished ? ramp(t, .78, 1.52) : ramp(t, .18, .95)}}>
      <div style={{fontSize: 130, letterSpacing: -4, fontWeight: 500}}>Nexus Nova</div>
      <div style={{fontSize: 29, color: dim, marginTop: 18}}>Match the execution to the task.</div>
    </AbsoluteFill> : <AbsoluteFill style={{opacity: 1 - .3 * settle}}>
      <Editorial kicker={`Mode 0${mode + 1}`} title={shot.name} body={shot.description} t={local} />
      <div style={{position: 'absolute', left: 704, top: 140, opacity: ramp(local, 0, .52)}}>
        <NexusStructure variant="routes" t={local} mode={mode + 1} />
      </div>
      <Route labels={shot.roles} t={local} />
    </AbsoluteFill>}
    {polished && t < .78 && <Img src={staticFile('footage/polish/compaction-end.png')}
      style={{position: 'absolute', width: 1920, height: 1080, opacity: 1 - ramp(t, .03, .78)}} />}
    <Audio src={staticFile('audio/music/nexus-nova-mix.wav')} />
  </Chamber>;
}

export function NexusSequence() {
  return <AbsoluteFill>
    <Sequence from={0} durationInFrames={1410} name="Nexus engineering"><NexusEngineeringScene /></Sequence>
    <Sequence from={1410} durationInFrames={510} name="Context Compaction V2"><ContextCompactionScene /></Sequence>
    <Sequence from={1920} durationInFrames={600} name="Nexus Nova"><NexusNovaScene /></Sequence>
  </AbsoluteFill>;
}
