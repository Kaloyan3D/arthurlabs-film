#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
narration=assets/audio/narration
music=assets/audio/music
effects=assets/audio/sfx

node scripts/audio/build-opening-score.mjs

# Add space before the final question in the existing inter-phrase silence.
"$ffmpeg" -hide_banner -loglevel error -y -i "$narration/opening-live-take.wav" \
  -filter_complex "[0:a]asplit[first][last];[first]atrim=end=10.65[a];[last]atrim=start=10.65:end=13.80,asetpts=PTS-STARTPTS,adelay=1450[b];[a][b]concat=n=2:v=0:a=1,highpass=f=72,volume=6dB[out]" \
  -map '[out]' -ar 48000 -c:a pcm_s24le "$narration/arthurlabs-opening-narration.wav"

# Place the narration at 0.85 s and duck the stereo effects bus under speech.
"$ffmpeg" -hide_banner -loglevel error -y \
  -i "$narration/arthurlabs-opening-narration.wav" -i "$music/opening-score.wav" -i "$effects/opening-effects.wav" \
  -filter_complex "[0:a]pan=stereo|FL=c0|FR=c0,adelay=850:all=1,apad=whole_dur=20,asplit[voice][side];[1:a][2:a]amix=inputs=2:normalize=0[bed];[bed][side]sidechaincompress=threshold=0.035:ratio=3:attack=20:release=270[duck];[voice][duck]amix=inputs=2:normalize=0,alimiter=limit=0.84:level=false:latency=true[out]" \
  -map '[out]' -t 20 -ar 48000 -c:a pcm_s24le "$music/opening-mix.wav"
