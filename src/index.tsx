import {Composition, registerRoot} from 'remotion';
import {ArthurLabsFilm} from './compositions/ArthurLabsFilm';
import {ArthurStudioScene} from './scenes/ArthurStudioScene';
import {ContextCompactionScene, NexusEngineeringScene, NexusNovaScene, NexusSequence} from './scenes/NexusScenes';
import {ArthurLabsFinale, SentryFinaleSequence, SentryScene} from './scenes/SentryFinale';
import {PolishedChapters} from './compositions/PolishedChapters';
import {TechnicalProof} from './scenes/TechnicalProof';

import {ArthurLabsOpening} from './scenes/ArthurLabsOpening';

const format = {width: 1920, height: 1080, fps: 30};

function Root() {
  return <>
    <Composition id="ArthurLabsFilm" component={ArthurLabsFilm} durationInFrames={5400} {...format} />
    <Composition id="ArthurLabsOpening" component={ArthurLabsOpening} durationInFrames={600} defaultProps={{sound: true}} {...format} />
    <Composition id="ArthurLabsOpeningV4" component={ArthurLabsOpening} durationInFrames={600} defaultProps={{sound: true, cinematic: true}} {...format} />
    <Composition id="ArthurStudioScene" component={ArthurStudioScene} durationInFrames={960} {...format} />
    <Composition id="NexusEngineeringScene" component={NexusEngineeringScene} durationInFrames={1410} {...format} />
    <Composition id="ContextCompactionScene" component={ContextCompactionScene} durationInFrames={510} {...format} />
    <Composition id="NexusNovaScene" component={NexusNovaScene} durationInFrames={600} {...format} />
    <Composition id="NexusSequence" component={NexusSequence} durationInFrames={2520} {...format} />
    <Composition id="SentryScene" component={SentryScene} durationInFrames={1020} {...format} />
    <Composition id="ArthurLabsFinale" component={ArthurLabsFinale} durationInFrames={300} {...format} />
    <Composition id="SentryFinaleSequence" component={SentryFinaleSequence} durationInFrames={1320} {...format} />
    <Composition id="PolishedChapters" component={PolishedChapters} durationInFrames={4800} {...format} />
    <Composition id="TechnicalProof" component={TechnicalProof} durationInFrames={150} {...format} />
  </>;
}

registerRoot(Root);
