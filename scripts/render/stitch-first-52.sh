#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
root=$(pwd -P)
media=$root/renders/previews
opening=$media/arthurlabs-opening-v4.mp4
studio=$media/arthur-studio-v1.mp4
list=$(mktemp)
trap 'rm -f "$list"' EXIT HUP INT TERM

# The video cut is defined by 600 frames, independently of AAC end padding.
printf "ffconcat version 1.0\nfile '%s'\nduration 20\nfile '%s'\nduration 32\n" "$opening" "$studio" > "$list"
"$ffmpeg" -hide_banner -loglevel error -n -copyts -f concat -safe 0 -i "$list" -i "$opening" -i "$studio" \
  -filter_complex '[1:a]atrim=end_sample=960000,asetpts=PTS-STARTPTS[a];[2:a]atrim=end_sample=1536000,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[out]' \
  -map 0:v:0 -map '[out]' -c:v copy -avoid_negative_ts disabled -use_editlist 1 -c:a aac -b:a 320k -movflags +faststart "$media/arthurlabs-first-52s.mp4"
