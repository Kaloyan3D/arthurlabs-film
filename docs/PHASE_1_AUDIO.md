# Opening audio

## Final wording

> Every breakthrough begins with a thought.
>
> Then ideas drift apart. Context disappears.
>
> And even intelligent systems make mistakes.
>
> What if intelligence could work differently?

The exact text is in [PHASE_1_NARRATION.txt](PHASE_1_NARRATION.txt). This edit leaves time for the links to form and gives the title a clean hold. The raw GPT-Live transcript matched all five sentences after whitespace normalization.

## Narration edit

One authorized `gpt-live-1` session with the built-in `marin` voice ran with a 19-second capture window. The returned WAV was 18.20 seconds, with the last spoken material ending at about 13.54 seconds. At the published rate of $0.05 per session minute, 19 seconds is approximately $0.016. The precise charge comes from the project's billing records. There were no fallback calls or saved voices. The narration is AI-generated. [GPT-Live model and pricing](https://developers.openai.com/api/docs/models/gpt-live-1)

The edit inserts 1.45 seconds of silence before the last question and removes the unused capture tail. It applies a 72 Hz high-pass and 6 dB gain. The edited 48 kHz mono WAV starts at 0:00.85 in the mix. The final question lands at roughly 0:13.48–0:15.85. The voice plays at its original speed throughout.

## Score and mix

The original procedural score combines a low D fundamental and upper partials, a filtered stereo air layer, a detuned tension interval, and an open chord under the wordmark. The separate effects stem uses decaying struck partials and short stereo reflections. Connection strikes and the title impact are authored against picture. Sidechain compression ducks the combined score and effects bus under the narration.

| Asset | Workspace path |
| --- | --- |
| Selected narration | `assets/audio/narration/arthurlabs-opening-narration.wav` |
| Original session | `assets/audio/narration/opening-live-take.wav` and its transcript sidecar |
| Score stem | `assets/audio/music/opening-score.wav` |
| Effects stem | `assets/audio/sfx/opening-effects.wav` |
| 20-second stereo mix | `assets/audio/music/opening-mix.wav` |

Rebuild locally with `sh scripts/audio/mix-opening.sh` using the retained raw take. This rebuild makes no API calls.
