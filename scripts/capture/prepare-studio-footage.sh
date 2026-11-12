#!/bin/sh
set -eu

ffmpeg=${FFMPEG:-ffmpeg}
media=assets/footage/arthur-studio
normalize() {
  "$ffmpeg" -v error -n -ss "$2" -i "$media/raw/$1.mov" -t "$3" \
    -an -vf 'fps=30,scale=1920:1200:flags=lanczos' \
    -c:v libx264 -preset fast -crf 15 -pix_fmt yuv420p -movflags +faststart "$media/$4.mp4"
}

normalize capture-one 3.35 2.65 capture
normalize capture-one 7.90 4.60 distillation
normalize graph-infer 7.30 4.20 inference
normalize graph-add 3.05 5.20 dependency
normalize graph-add 7.90 2.65 dependency-detail
normalize conflict-final 2.35 6.20 conflict
normalize evolution-final 8.05 4.20 evolution

"$ffmpeg" -v error -n -i "$media/capture.mp4" -frames:v 1 "$media/home.png"
"$ffmpeg" -v error -n -i renders/previews/arthurlabs-opening-v4.mp4 \
  -vf 'select=eq(n\,599)' -frames:v 1 "$media/opening-end.png"
