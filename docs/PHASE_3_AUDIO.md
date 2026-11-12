# Nexus audio

The final wording is retained in [Engineering](narration/nexus-engineering.txt), [CCv2](narration/context-compaction.txt) and [Nova](narration/nexus-nova.txt). Three GPT-Live sessions used the established `marin` voice, with capture windows of 44, 18 and 20 seconds. Returned transcripts matched the spoken wording, with normal punctuation and DSH initials normalized. The 82 seconds of requested session time equate to approximately $0.068 at the published rate. Actual billing follows session duration. The voice is AI-generated. [GPT-Live pricing](https://developers.openai.com/api/docs/models/gpt-live-1)

`python3 scripts/audio/mix-nexus.py` edits the three retained takes using measured phrase gaps. The samples keep their original speech speed. The music carries the low D, open fifth and stereo resonances from Studio into a single 84-second synthesis timeline. Mechanical accents give way to layered harmonics for CCv2 and converge again in Nova. Voice sidechains the bed and effects.

Stems use the chapter prefixes `nexus-engineering`, `context-compaction` and `nexus-nova`. Narration edits are under `assets/audio/narration/`, original scores and final stereo mixes under `assets/audio/music/`, and effects under `assets/audio/sfx/`.
