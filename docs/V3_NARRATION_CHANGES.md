# V3 narration changes

Positive onset shifts are later and negative shifts are earlier. Global onset measurements use the same isolated-stem detector for both versions.

| Phrase group | V2 onset | V3 onset | Shift |
| --- | ---: | ---: | ---: |
| What if intelligence could work differently? | 13.482 | 13.032 | −0.45 s |
| Then connect the ideas | 32.706 | 33.756 | +1.05 s |
| An offline requirement conflicts… | 41.073 | 39.773 | −1.30 s |
| Nexus DSH builds on DeepSeek’s harness | 59.134 | 59.794 | +0.66 s |
| Nexus Native takes a different approach | 72.350 | 71.870 | −0.48 s |
| Consider a command… | 83.224 | 82.604 | −0.62 s |
| Because a successful exit… | 94.437 | 93.597 | −0.84 s |
| One agent for simple work | 120.363 | 120.633 | +0.27 s |
| A primary and a supporting agent… | 123.736 | 123.336 | −0.40 s |
| And when work can be divided… | 128.758 | 128.338 | −0.42 s |
| Meet Sentry / independent reviewers | 141.419 | 141.719 | +0.30 s |
| Here, one review traced… | 150.346 | 149.986 | −0.36 s |
| A local replay tests… | 161.414 | 161.074 | −0.34 s |
| Because what we build… | 165.641 | 165.121 | −0.52 s |

The largest redistributed gap is Studio's graph-to-contradiction handoff, from **6.534 s to 4.184 s**. DSH to Native moved from **5.204 s to 4.064 s**, and the pause before the Native takeaway moved from **2.735 s to 1.895 s**. Sentry's independent-review-to-finding gap moved from **3.489 s to 2.829 s**. The [audit](V3_NARRATION_PACING_AUDIT.md) documents why some adjacent gaps grew or were retained.

No words were regenerated. Moves preserve the original samples between 8 ms quiet-handle blends. Original score and effects keep their placement, with sidechain ducking recalculated from the edited voice. V2 and all source stems remain intact. The labeled A/B preview uses the actual V2 and V3 mixes, first for Studio Graph (32.3–44.6 s), then DSH to Native (64.0–74.6 s).

Rebuild with `python3 scripts/audio/edit-narration-v3.py` using a fresh V3 master output path.
