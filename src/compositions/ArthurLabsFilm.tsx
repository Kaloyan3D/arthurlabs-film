import {AbsoluteFill} from 'remotion';
import {theme} from '../styles/theme';

export function ArthurLabsFilm() {
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: theme.muted, background: theme.background, fontFamily: theme.font, fontSize: 32}}>
    ArthurLabs · Phase 0 production slate
  </AbsoluteFill>;
}
