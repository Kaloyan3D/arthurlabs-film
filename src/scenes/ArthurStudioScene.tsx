import {useContext} from 'react';
import {Polish} from '../components/Polish';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProductFootage, type ProductCrop} from '../components/ProductFootage';
import {ramp} from '../three/ThoughtChamber';

const font = 'Helvetica Neue, Arial, sans-serif';
const home = {x: 220, y: 40, width: 1045, height: 640};
const graph = {x: 218, y: 35, width: 1055, height: 745};
const conflict = {x: 486, y: 35, width: 787, height: 610};
const history = {x: 510, y: 35, width: 758, height: 721};

function Editorial({index, title, detail, warm = false}: {index: string; title: string; detail: string; warm?: boolean}) {
  const frame = useCurrentFrame();
  const enter = ramp(frame, 0, 16);
  const accent = warm ? '#f4a287' : '#b7a7ff';
  return <div style={{
    position: 'absolute', left: 94, top: 400, width: 410, opacity: enter,
    transform: `translateY(${13 * (1 - enter)}px)`, fontFamily: font, color: '#f4f0ff',
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 15, fontSize: 17, letterSpacing: 3.1, color: accent}}>
      <span style={{width: 30, height: 1, background: accent}} />{index}
    </div>
    <div style={{fontSize: 56, fontWeight: 500, letterSpacing: -2.8, lineHeight: 1.01, margin: '21px 0 21px', whiteSpace: 'pre-line'}}>{title}</div>
    <div style={{fontSize: 24, lineHeight: 1.38, color: '#c3bed6', maxWidth: 334}}>{detail}</div>
  </div>;
}

function Arrival() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const polished = useContext(Polish);
  const bridge = ramp(t, .25, polished ? 1.36 : 1.88);
  const titleIn = ramp(t, polished ? 1.42 : 1.28, 2.28);
  const titleMove = ramp(t, 3.36, 4.87);
  const panel = ramp(t, 2.74, 4.95);
  return <>
    <Img src={staticFile('footage/arthur-studio/opening-end.png')} style={{
      position: 'absolute', width: '100%', height: '100%',
      opacity: 1 - bridge, transform: `scale(${1 + .17 * bridge})`,
    }} />
    <div style={{
      position: 'absolute', top: 540, left: '50%', translate: '-50% 0', width: 760 * bridge,
      height: 1, background: 'linear-gradient(90deg, transparent, #c4b1ff, transparent)',
      opacity: bridge * (1 - ramp(t, 2, 3.2)) * .54,
    }} />
    <ProductFootage asset="home.png" crop={home} left={609 - 79 * panel} top={266 - 127 * panel}
      width={1100 + 174 * panel} opacity={panel} />
    <div style={{
      position: 'absolute', left: 960 - 865 * titleMove, top: 538 - 71 * titleMove,
      transform: `translate(${-50 * (1 - titleMove)}%, -50%)`, color: '#f5f0ff',
      fontFamily: font, fontSize: 102 - 55 * titleMove, fontWeight: 500,
      letterSpacing: 9 - 9.5 * titleMove, lineHeight: 1.04, opacity: titleIn * (1 - ramp(t, 4.45, 5)),
      whiteSpace: 'nowrap',
    }}>ARTHUR STUDIO</div>
  </>;
}

const focusShots: Record<string, {crop: ProductCrop; top: number; width: number; title: string}> = {
  'capture.mp4': {crop: {x: 245, y: 55, width: 1000, height: 443}, top: 290, width: 1620, title: 'Start with a thought.'},
  'distillation.mp4': {crop: {x: 253, y: 316, width: 581, height: 168}, top: 387, width: 1590, title: 'The idea keeps its source.'},
  'inference.mp4': {crop: {x: 235, y: 49, width: 651, height: 650}, top: 103, width: 844, title: 'See the relationships.'},
  'dependency.mp4': {crop: {x: 244, y: 50, width: 1026, height: 610}, top: 165, width: 1455, title: 'What does it depend on?'},
  'dependency-detail.mp4': {crop: {x: 231, y: 46, width: 1039, height: 604}, top: 180, width: 1465, title: 'Offline depends on a local model.'},
  'conflict.mp4': {crop: {x: 505, y: 44, width: 765, height: 559}, top: 182, width: 1195, title: 'Spot the conflict.'},
};

function StudioFocus({asset, index, title, detail, warm = false, ...footage}: {
  asset: string; index: string; title: string; detail: string; warm?: boolean;
  crop: ProductCrop; left: number; top: number; width: number; drift: number;
}) {
  const polished = useContext(Polish);
  const t = useCurrentFrame() / useVideoConfig().fps;
  if (!polished) return <>
    <ProductFootage asset={asset} {...footage} />
    <Editorial index={index} title={title} detail={detail} warm={warm} />
  </>;
  const lineage = asset === 'evolution.mp4';
  const reveal = ramp(t, 1.61, 2.54);
  const selected = lineage ? {
    crop: {x: 517 + 17 * reveal, y: 41 + 119 * reveal, width: 746 - 186 * reveal, height: 713 - 180 * reveal},
    top: 95 - 38 * reveal, width: 905 + 102 * reveal, title: 'Keep the history.',
  } : focusShots[asset];
  const side = lineage || asset === 'inference.mp4' || warm;
  const left = side ? (warm ? 608 : 847 - 62 * reveal) : (1920 - selected.width) / 2;
  return <>
    <ProductFootage asset={asset} crop={selected.crop} width={selected.width}
      left={left} top={selected.top} drift={.011} />
    <div style={{position: 'absolute', left: side ? 100 : left, top: side ? 305 : 77,
      width: side ? (warm ? 488 : 665) : 1620, opacity: ramp(t, 0, .38), fontFamily: font}}>
      <div style={{fontSize: 20, letterSpacing: 3, color: warm ? '#ffc2ad' : '#cbbaff'}}>{index}</div>
      <div style={{fontSize: side ? 76 : 52, letterSpacing: side ? -3.8 : -1.6, lineHeight: 1,
        color: '#f5f1ff', fontWeight: 500, marginTop: 14}}>{selected.title}</div>
      {side && <div style={{fontSize: 31, color: '#dad2e8', lineHeight: 1.38, maxWidth: 450, marginTop: 25}}>{detail}</div>}
    </div>
  </>;
}

export function ArthurStudioScene() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const warm = ramp(t, 21, 22.6) * (1 - ramp(t, 25.7, 27.4));
  const close = ramp(t, 30.22, 30.98);
  const closingTitle = ramp(t, 30.62, 31.35);
  return <AbsoluteFill style={{background: '#0c0e14', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 65% 44%, #221936 0%, #131222 43%, #0c0e14 74%)'}} />
    <AbsoluteFill style={{opacity: warm * .49, background: 'radial-gradient(ellipse at 70% 62%, #52283c, transparent 58%)'}} />
    <Sequence from={0} durationInFrames={5 * fps} name="From the opening to Arthur Studio"><Arrival /></Sequence>
    <Sequence from={5 * fps} durationInFrames={78} name="Capture an offline requirement">
      <StudioFocus asset="capture.mp4" crop={home} left={530} top={139} width={1274} drift={.016} index="01   CAPTURE" title={'Start with\na thought.'} detail="The app must work completely offline." />
    </Sequence>
    <Sequence from={228} durationInFrames={132} name="Validated thought distillation">
      <StudioFocus asset="distillation.mp4" crop={{x: 250, y: 308, width: 597, height: 190}} left={530} top={335} width={1274} drift={.012} index="01   DISTILL" title={'Give it\nstructure.'} detail="The original capture stays with the idea." />
    </Sequence>
    <Sequence from={12 * fps} durationInFrames={120} name="Run Cognitive Graph inference">
      <StudioFocus asset="inference.mp4" crop={graph} left={530} top={82} width={1274} drift={.011} index="02   CONNECTIONS" title={'See the\nrelationships.'} detail="Three ideas enter the Cognitive Graph." />
    </Sequence>
    <Sequence from={16 * fps} durationInFrames={78} name="Save a real dependency">
      <StudioFocus asset="dependency.mp4" crop={graph} left={530} top={82} width={1274} drift={.014} index="02   DEPENDENCY" title={'What does it\ndepend on?'} detail="Offline processing needs a model on the device." />
    </Sequence>
    <Sequence from={558} durationInFrames={72} name="Inspect the user-authored dependency">
      <StudioFocus asset="dependency-detail.mp4" crop={{x: 230, y: 43, width: 1042, height: 660}}
        left={530} top={132} width={1274} drift={.012} index="02   DEPENDENCY" title={'What does it\ndepend on?'} detail="Offline processing needs a model on the device." />
    </Sequence>
    <Sequence from={21 * fps} durationInFrames={180} name="Inspect Arthur’s proposed contradiction">
      <StudioFocus asset="conflict.mp4" crop={conflict} left={614} top={106} width={1117} drift={.021} index="03   CONTRADICTION" title={'Spot the\nconflict.'} detail="An offline requirement conflicts with a cloud dependency." warm />
    </Sequence>
    <Sequence from={27 * fps} durationInFrames={120} name="Save a revision in Thought Lineage">
      <StudioFocus asset="evolution.mp4" crop={history} left={722} top={66} width={990} drift={.011} index="04   THOUGHT LINEAGE" title={'Keep the\nhistory.'} detail="A new revision keeps the earlier thinking in view." />
    </Sequence>
    <AbsoluteFill style={{
      pointerEvents: 'none', alignItems: 'center', justifyContent: 'center',
      opacity: close, background: 'radial-gradient(ellipse at 50% 47%, #1b1630, #0c0e14 70%)',
      color: '#f4f0ff', font: `500 48px ${font}`, letterSpacing: 8,
    }}>
      <div style={{width: 76 * closingTitle, height: 1, background: '#a28cf5', marginBottom: 33}} />
      <div style={{opacity: closingTitle}}>FROM THOUGHT TO UNDERSTANDING</div>
    </AbsoluteFill>
    <Audio src={staticFile('audio/music/studio-mix.wav')} />
  </AbsoluteFill>;
}
