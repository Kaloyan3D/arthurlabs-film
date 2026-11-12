#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
root=$(pwd -P)
approved=$root/renders/previews/arthurlabs-first-136s.mp4
ending=$root/renders/previews/sentry-finale-v1.mp4
output=$root/renders/final/arthurlabs-hackathon-master-v1.mp4
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT HUP INT TERM
mkdir -p "$root/renders/final"

printf "ffconcat version 1.0\nfile '%s'\nduration 136\nfile '%s'\nduration 44\n" "$approved" "$ending" > "$scratch/video.ffconcat"

# At 48 kHz, 136 seconds is exactly 6,375 AAC frames. Keep the locked
# track's priming packet, and remove only the ending track's own priming.
"$ffmpeg" -v error -i "$approved" -map 0:a:0 -c:a copy -f adts "$scratch/locked.aac"
"$ffmpeg" -v error -i "$ending" -map 0:a:0 -c:a copy -bsf:a 'noise=drop=lt(pts\,0)' -f adts "$scratch/ending.aac"
cat "$scratch/locked.aac" "$scratch/ending.aac" > "$scratch/master.aac"

"$ffmpeg" -hide_banner -loglevel error -n -copyts -f concat -safe 0 -i "$scratch/video.ffconcat" \
  -itsoffset -0.021333333 -f aac -i "$scratch/master.aac" -map 0:v:0 -map 1:a:0 \
  -c copy -bsf:a 'setts=duration=min(DURATION\,180/TB-PTS)' -avoid_negative_ts disabled -use_editlist 1 -t 180 -movflags +faststart "$output"
