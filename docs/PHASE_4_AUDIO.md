# Sentry and finale audio

The takes used `gpt-live-1` and the established `marin` voice. The two session windows were 32 and 12 seconds, about $0.037 at the published session rate. Actual billing is session-based. Both returned transcripts contain the exact spoken text in [Sentry](narration/sentry.txt) and [Finale](narration/finale.txt). [GPT-Live model and pricing](https://developers.openai.com/api/docs/models/gpt-live-1)

The Sentry edit aligns five measured gaps to changes in the story, and the finale moves the closing phrase to the wordmark reveal. All spoken samples retain their original speed. New music and effects retain the low D and open fifth, with three stereo accents for the review paths and a final harmonic release. Narration ducks the bed.

The raw takes and timed narration are in `assets/audio/narration/`. Separate `sentry` and `finale` scores and mixes are in `assets/audio/music/`, with effects in `assets/audio/sfx/`. Rebuild from the retained takes with `python3 scripts/audio/mix-finale.py`. The master copies the earlier audio and final mix AAC packets, with sample timing at the 136-second boundary and only the ending encoder padding trimmed. The first 136 seconds of decoded audio match the locked export exactly.
