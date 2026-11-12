#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
media=$(pwd -P)/renders/previews
approved=$media/arthurlabs-first-52s.mp4
nexus=$media/nexus-sequence-v1.mp4
list=$(mktemp)
trap 'rm -f "$list"' EXIT HUP INT TERM

printf "ffconcat version 1.0\nfile '%s'\nduration 52\nfile '%s'\nduration 84\n" "$approved" "$nexus" > "$list"
"$ffmpeg" -hide_banner -loglevel error -n -copyts -f concat -safe 0 -i "$list" -i "$approved" -i "$nexus" \
  -filter_complex '[1:a]atrim=end_sample=2496000,asetpts=PTS-STARTPTS[a];[2:a]atrim=end_sample=4032000,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1[out]' \
  -map 0:v:0 -map '[out]' -c:v copy -avoid_negative_ts disabled -use_editlist 1 -c:a aac -b:a 320k -movflags +faststart "$media/arthurlabs-first-136s.mp4"
