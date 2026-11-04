#!/bin/sh
set -eu
asset=assets/audio/sfx/qa-sync.wav
if [ -f "$asset" ]; then
  exit 0
fi
"${FFMPEG:-ffmpeg}" -hide_banner -loglevel error -nostdin -n \
  -f lavfi -i 'sine=frequency=660:duration=0.25:sample_rate=48000' \
  -af 'afade=t=in:d=0.02,afade=t=out:st=0.17:d=0.08,volume=0.45' \
  -c:a pcm_s16le "$asset"
