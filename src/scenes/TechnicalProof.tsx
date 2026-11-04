import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {Reveal, FadeScene} from '../components/motion';
import {Pipeline} from '../components/Pipeline';
import {KnowledgeGraph, proofEdges, proofNodes} from '../three/KnowledgeGraph';
import {theme} from '../styles/theme';

export function TechnicalProof() {
  return <FadeScene>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 76% 50%, #21183B 0%, #0C0E14 59%)', color: theme.ink, fontFamily: theme.font}}>
      <div style={{position: 'absolute', left: 112, top: 190, width: 920}}>
        <Reveal>
          <div style={{fontFamily: theme.mono, letterSpacing: 8, color: '#B7A8FD', fontSize: 25}}>ARTHURLABS / PHASE 00</div>
          <h1 style={{fontSize: 118, lineHeight: 0.94, letterSpacing: -7, margin: '50px 0 32px'}}>Render pipeline<br />technical proof</h1>
          <p style={{fontSize: 32, color: theme.muted}}>Typography · 3D · synchronized audio</p>
        </Reveal>
        <Reveal start={30}><Pipeline stages={['FRAME', 'GRAPH', 'AUDIO']} activeFrames={[30, 48, 66]} /></Reveal>
      </div>
      <div style={{position: 'absolute', right: 48, top: 137}}>
        <KnowledgeGraph nodes={proofNodes} edges={proofEdges} />
      </div>
      <div style={{position: 'absolute', left: 115, right: 115, bottom: 85, borderTop: '1px solid #39304F', paddingTop: 20, color: theme.muted, fontFamily: theme.mono, fontSize: 22}}>
        1920 × 1080 &nbsp; / &nbsp; 30 FPS
      </div>
    </AbsoluteFill>
    <Sequence from={30} durationInFrames={12}>
      <Audio src={staticFile('audio/sfx/qa-sync.wav')} />
    </Sequence>
  </FadeScene>;
}
