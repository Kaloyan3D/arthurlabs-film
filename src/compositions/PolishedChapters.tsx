import {AbsoluteFill, Sequence} from 'remotion';
import {Polish} from '../components/Polish';
import {ArthurStudioScene} from '../scenes/ArthurStudioScene';
import {NexusSequence} from '../scenes/NexusScenes';
import {SentryFinaleSequence} from '../scenes/SentryFinale';

export function PolishedChapters() {
  return <Polish.Provider value>
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={960} name="Arthur Studio"><ArthurStudioScene /></Sequence>
      <Sequence from={960} durationInFrames={2520} name="Nexus"><NexusSequence /></Sequence>
      <Sequence from={3480} durationInFrames={1320} name="Sentry and finale"><SentryFinaleSequence /></Sequence>
    </AbsoluteFill>
  </Polish.Provider>;
}
