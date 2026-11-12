# V3 narration pacing audit

Audited the seven isolated dialogue stems used by V2 against the original GPT-Live transcripts, the existing edit instructions, and the approved picture timing. Opening's 0.85 s placement delay is included. Detection uses FFmpeg's amplitude-based `silencedetect` at −45 dBFS with a 0.25 s minimum span. The full [V2 and V3 voice-activity timeline](../assets/audio/narration/v3/voice-activity.csv) gives every detected gap and intervening activity window in global seconds. Short breaths can fall on either side of the threshold. This is waveform-based activity detection, without word-level forced alignment or a listening pass.

The table lists V2 gaps near 1.2 s or longer, including the principal chapter handoffs. Times are elapsed seconds from the start of the film. Phrase descriptions refer to the retained transcripts.

| V2 gap | Length | Previous → next spoken phrase | Picture and editorial decision |
| --- | ---: | --- | --- |
| 11.059–13.482 | 2.423 s | “make mistakes” → “What if intelligence…” | Fracturing graph. Tighten 0.45 s so the question leads the convergence. |
| 15.849–20.956 | 5.107 s | “work differently?” → “What if your thoughts…” | Wordmark reveal and hold, then Studio handoff. Keep the reveal music-led; the earlier question adds 0.45 s to the hold. |
| 30.013–32.706 | 2.694 s | “where it came from” → “Then connect the ideas” | Distilled result and map arrival. Allow 1.05 s more for the source and map to register. |
| 34.539–41.073 | 6.534 s | “connect the ideas” → “An offline requirement conflicts…” | Dependency inspection into the contradiction. Redistribute this gap, with the graph line later and the contradiction earlier. |
| 44.364–46.399 | 2.035 s | “cloud dependency” → “When you rethink the plan” | Inspect the contradiction before Lineage. The earlier contradiction line increases this evidence hold while keeping the Lineage lead-in. |
| 67.146–72.350 | 5.204 s | “route for review” → “Nexus Native takes…” | DSH assertions into the original Rust reveal. Move the DSH group 0.66 s later and lead into Native 0.48 s earlier. |
| 79.537–83.224 | 3.687 s | “evidence ledger” → “Consider a command…” | Taskboard result needs a reading hold. Lead the shell counterexample slightly; retain most of the hold. |
| 87.245–88.595 | 1.350 s | “hides the failure” → “In this test…” | Keep the broker line on the change from exit status to Inconclusive. Earlier setup adds a short anticipation beat. |
| 91.702–94.437 | 2.735 s | “inconclusive” → “Because a successful exit…” | Give the result a beat, then advance the takeaway by 0.84 s. |
| 96.891–99.000 | 2.109 s | “same as proof” → CCv2 context introduction | Engineering-with-evidence hold before the new subject. Keep it score-led. |
| 121.758–123.736 | 1.977 s | “simple work” → “A primary and a supporting agent” | Simple into Complex. Move the lines closer to the mode changes. |
| 126.710–128.758 | 2.049 s | “complex tasks” → “And when work can be divided” | Branch setup before the Parallel diagram. Keep its anticipation beat with both lines advancing by a similar amount. |
| 133.594–136.851 | 3.257 s | “for verification” → “Building software…” | Parallel branches converge, then recede under Sentry. Preserve the music-led handoff. |
| 139.940–141.419 | 1.479 s | “Trusting it is another” → “Meet Sentry” | Let the three review routes begin opening before the introduction lands. |
| 146.857–150.346 | 3.489 s | “its own workspace” → “Here, one review…” | Archived partial outcome then the specific finding. Tighten 0.66 s. |
| 154.753–155.946 | 1.192 s | “snapshot manifest” → “The evidence stays attached” | Parser close-up and linked evidence. Keep the evidence cue while the first phrase moves earlier. |
| 159.275–161.414 | 2.138 s | “overall run is partial” → “A local replay…” | Evidence to replay. Advance the line 0.34 s, close to the cut. |
| 163.945–165.641 | 1.696 s | “that specific behavior” → “Because what we build…” | Result readout and conclusion. Tighten 0.18 s. |
| 168.131–170.448 | 2.318 s | “challenged” → “Think” | Evidence title resolves into the finale. Keep the visual handoff free of speech. |
| 172.876–175.634 | 2.758 s | “Verify” → “Arthur Labs” | Three motifs converge into the wordmark. Intentional dramatic pause, retained. |
| 177.756–180.000 | 2.244 s | “Beyond generation” → end | Final brand and music tail. Intentional hold, retained. |

CCv2's HOT / WARM / COLD phrasing is already closely spaced and aligned to the tiers. No timing moves were applied there. The measured gaps in the finale's Think / Build / Verify triplet were also retained.
