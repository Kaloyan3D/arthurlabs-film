#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
root=$(pwd -P)
opening=$root/renders/previews/arthurlabs-opening-v4.mp4
picture=$root/renders/previews/arthurlabs-polished-chapters-v2.mp4
approved=$root/renders/final/arthurlabs-hackathon-master-v1.mp4
output=$root/renders/final/arthurlabs-hackathon-master-v2.mp4
list=$(mktemp)
trap 'rm -f "$list"' EXIT HUP INT TERM

printf "ffconcat version 1.0\nfile '%s'\nduration 20\nfile '%s'\nduration 160\n" "$opening" "$picture" > "$list"
"$ffmpeg" -hide_banner -loglevel error -n -copyts -f concat -safe 0 -i "$list" -i "$approved" \
  -map 0:v:0 -map 1:a:0 -c:v copy \
  -af 'volume=2.35dB,aresample=192000,alimiter=limit=0.84:attack=4:release=55:level=false:latency=true,aresample=48000,atrim=end_sample=8640000' \
  -c:a aac -b:a 320k -avoid_negative_ts disabled -use_editlist 1 -movflags +faststart "$output"
