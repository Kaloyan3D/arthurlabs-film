# Product footage workflow

Use real recordings of Arthur Studio, Nexus DSH, Nexus Native and Sentry.
Before capture, match each shot and claim to the approved
`ARTHURLABS_VIDEO_TRUTH.md`. Record Nexus Native as the original Rust harness.
Treat Nexus Nova as planned. Label a roadmap reference explicitly if it is
approved for inclusion.

1. Prepare a clean demo account and fixture data. Close unrelated windows,
   mute notifications, and hide secrets, personal information and tokens.
2. On macOS, press Shift–Command–5 and choose Record Selected Portion.
   For a first capture, grant Screen & System Audio Recording permission
   if macOS asks. Leave the microphone off unless the shot needs live sound.
3. Capture a 16:9 region at 1920×1080 actual pixels or higher where practical.
   Check the resulting pixel dimensions with ffprobe. Use 60 fps for smooth
   cursor or scroll motion if a capture tool offers constant 60 fps, or
   30 fps for routine UI shots. macOS Screenshot may produce variable timing.
4. Keep window size and zoom consistent. Use a legible terminal font, keep
   the cursor out of titles, and pause briefly over intentional clicks.
   Leave two seconds of handles before and after each action.
5. Keep camera originals in `assets/footage/` with product, shot, take and
   capture date in the filename. Keep a shot log with version, source,
   frame rate, dimensions, approved claim and recording status.
6. Inspect time base and frame timestamps. A reported average alone does
   not establish constant frame rate. If the original is variable and
   needs a stable editing copy, preserve the original and make a separately
   named constant-rate mezzanine. Review cadence and recheck audio sync.
7. Import the media with `Footage`, trim with frame numbers and favor
   restrained crops that keep the relevant UI readable. Check every
   edit on the 30 fps output timeline.

```sh
ffprobe -v error -show_streams -show_format assets/footage/source.mov
ffprobe -v error -select_streams v:0 -show_entries frame=best_effort_timestamp_time -of csv assets/footage/source.mov
ffmpeg -n -i assets/footage/source.mov -vf fps=30 -c:v prores_ks -profile:v 2 -c:a pcm_s24le assets/footage/source-cfr30.mov
```

Before sharing any source recording, review frames and audio for credentials
and private data. The originals and renders are ignored by Git.
