# Opening quality control

## Picture review

- Rendered four full-resolution development keyframes and inspected a contact sheet before exporting the full sequence.
- Reviewed decoded frames from v1. The translated haze layer produced a faint edge and the network read as three sparse, flat branches. V2 moved the gradient origin inside the frame, deepened camera parallax, and added curved inter-branch bridges and translucent facets.
- Reviewed decoded frames from v2. V3 strengthened the first seed, graded the warm conflict through the break, split the severed connection into visible stubs, and changed the title to an outward reveal. The selected v3 review included 12 decoded frames from initial darkness to the final held title.
- The four full-resolution master references are in `renders/previews/opening-master-keyframes/`, alongside `contact-sheet.jpg`. The chapter images correspond to frames 62, 231, 378, and 556. The first cluster, amber fracture, convergence, and final lettering stayed within the image area in the reviewed frames.

## Master checks

| Check | Result |
| --- | --- |
| Video | 1920 × 1080, H.264, yuv420p, 30 fps, 600 decoded frames, 20.000 seconds |
| Audio | Stereo AAC at 48 kHz, beginning at time zero. AAC stream includes 11 ms of end padding. |
| Alignment | Decoded AAC matched the source mix at zero measured lag in one-second windows starting at 1, 9, and 17 seconds, compared at 4 kHz. |
| Decode | FFmpeg decoded the full master with `-xerror`. Remotion encoded all 600 frames. |
| Dark frames | Black detection reported only the intentional low-light opening from 0.00 to 0.70 seconds. |
| Silence and levels | No below −55 dBFS interval of 0.45 seconds or longer. Integrated loudness −18.4 LUFS and true peak −2.9 dBTP. |
| Narration | GPT-Live transcript matches the approved text. A waveform-based silence pass confirmed phrase boundaries and the final question's placement. |
| TypeScript | `npm run typecheck` passed. |

The audio review used transcript, waveform, alignment and peak measurements. Direct listening was unavailable in this session, so pronunciation, vocal artifacts, and subjective mix balance were not evaluated by ear. Visual review used sampled frames from the decoded exports.

```sh
ffprobe -v error -count_frames -show_streams renders/previews/arthurlabs-opening-v3.mp4
ffmpeg -hide_banner -xerror -i renders/previews/arthurlabs-opening-v3.mp4 \
  -vf 'blackdetect=d=0.2:pix_th=0.10:pic_th=0.996' \
  -af 'silencedetect=n=-55dB:d=0.45,ebur128=peak=true' -f null -
```
