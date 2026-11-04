import {Composition, registerRoot} from 'remotion';
import {ArthurLabsFilm} from './compositions/ArthurLabsFilm';
import {TechnicalProof} from './scenes/TechnicalProof';

const format = {width: 1920, height: 1080, fps: 30};

function Root() {
  return <>
    <Composition id="ArthurLabsFilm" component={ArthurLabsFilm} durationInFrames={5400} {...format} />
    <Composition id="TechnicalProof" component={TechnicalProof} durationInFrames={150} {...format} />
  </>;
}

registerRoot(Root);
