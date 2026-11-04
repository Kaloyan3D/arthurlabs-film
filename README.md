# ArthurLabs film production

`ArthurLabsFilm` is the 180-second, 1920×1080, 30 fps production composition.
`TechnicalProof` exercises the local render pipeline in 150 frames. The
production composition currently contains a setup slate.

```sh
npm ci
npm run typecheck
npm run studio
npm run compositions
npm run preview
npm run qa:preview
```

The preview command generates its synthetic audio fixture locally. Remotion
downloads its render browser on first use. To rerender to the same path,
archive the existing proof or pass `--overwrite` explicitly.
Run `npm run final` after the approved edit is in place.

After approval for a paid request or saved voice, copy `.env.example` to
`.env` and configure the local project. For script-driven WAV narration:

```sh
npm run audio:narration -- docs/approved-script.txt assets/audio/narration/take-01.wav --approved
npm run audio:timing -- assets/audio/narration/take-01.wav 30
npm run audio:normalize -- assets/audio/narration/take-01.wav assets/audio/narration/take-01-mix.wav
```

For a GPT-Live voice audition, set `ARTHURLABS_VOICE_PROMPT` and run
`npm run audio:voice -- --approved` only after voice creation is approved.
Set `ARTHURLABS_AUDIO_PROVIDER=live`, set `ARTHURLABS_LIVE_VOICE` to the
returned ID and use the same narration command with a new WAV filename.
Use short passages, set a capture duration long enough for the reading,
and compare the returned transcript and recording to the approved text.
Remotion reads WAV files through scene-relative frame cues regardless of
which provider generated them. Keep voice credentials outside Studio and
do not share its development server on an untrusted network.

See [setup and verification](SETUP_REPORT.md) and the
[recording workflow](docs/FOOTAGE-WORKFLOW.md).
