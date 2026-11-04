import {Fragment} from 'react';
import {useCurrentFrame} from 'remotion';
import {theme} from '../styles/theme';

export function Pipeline({stages, activeFrames}: {stages: string[]; activeFrames: number[]}) {
  const frame = useCurrentFrame();
  return <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: theme.mono}}>
    {stages.map((stage, i) => <Fragment key={i}>
      {i > 0 && <span aria-hidden style={{color: theme.muted}}>→</span>}
      <span style={{padding: '12px 18px', border: `1px solid ${frame >= (activeFrames[i] ?? Infinity) ? theme.accent : '#36374A'}`}}>
        {stage}
      </span>
    </Fragment>)}
  </div>;
}
