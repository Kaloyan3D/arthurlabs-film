#!/bin/sh
set -eu
exec remotion render src/index.tsx ArthurLabsFilm renders/final/arthurlabs-film.mp4 \
  --codec=h264 --gl=angle --concurrency=2 "$@"
