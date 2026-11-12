#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
voice=assets/audio/narration
music=assets/audio/music
sfx=assets/audio/sfx
node scripts/audio/build-studio-score.mjs

# Place natural phrase groups on the edit. Cuts fall in measured gaps.
"$ffmpeg" -hide_banner -loglevel error -y -i "$voice/studio-live-take.wav" \
  -filter_complex "[0:a]asplit=5[p0][p1][p2][p3][p4];
  [p0]atrim=end=9.29,asetpts=PTS-STARTPTS,adelay=850[a];
  [p1]atrim=start=9.29:end=11.36,asetpts=PTS-STARTPTS,adelay=12550[b];
  [p2]atrim=start=11.36:end=14.95,asetpts=PTS-STARTPTS,adelay=21000[c];
  [p3]atrim=start=14.95:end=18.82,asetpts=PTS-STARTPTS,adelay=26150[d];
  [p4]atrim=start=18.82:end=20.88,asetpts=PTS-STARTPTS,adelay=29820[e];
  [a][b][c][d][e]amix=inputs=5:normalize=0,highpass=f=72,volume=6dB,alimiter=limit=0.84:level=false:latency=true,apad=whole_dur=32[out]" \
  -map '[out]' -t 32 -ar 48000 -c:a pcm_s24le "$voice/arthur-studio-narration.wav"

"$ffmpeg" -hide_banner -loglevel error -y \
  -i "$voice/arthur-studio-narration.wav" -i "$music/studio-score.wav" -i "$sfx/studio-effects.wav" \
  -filter_complex "[0:a]pan=stereo|FL=c0|FR=c0,asplit[voice][side];[1:a][2:a]amix=inputs=2:normalize=0[bed];[bed][side]sidechaincompress=threshold=0.035:ratio=3:attack=20:release=270[duck];[voice][duck]amix=inputs=2:normalize=0,alimiter=limit=0.84:level=false:latency=true,volume=-3.2dB[out]" \
  -map '[out]' -t 32 -ar 48000 -c:a pcm_s24le "$music/studio-mix.wav"
