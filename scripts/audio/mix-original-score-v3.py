"""Combine the timed V3 dialogue, new score, and retained picture effects."""
import os
import subprocess
from pathlib import Path

ffmpeg = os.environ.get("FFMPEG", "ffmpeg")
root = Path("assets/audio")
chapters = ("opening", "studio", "nexus-engineering", "context-compaction", "nexus-nova", "sentry", "finale")


def run(*args):
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", *map(str, args)], check=True)


def concatenate(paths, output, mono=False):
    inputs = [item for path in paths for item in ("-i", path)]
    labels = "".join(f"[{i}:a]" for i in range(len(paths)))
    run("-y", *inputs, "-filter_complex", f"{labels}concat=n={len(paths)}:v=0:a=1[a]",
        "-map", "[a]", "-ar", "48000", "-ac", "1" if mono else "2", "-c:a", "pcm_s24le", output)


dialogue = root / "narration" / "v3" / "arthurlabs-dialogue.wav"
effects = root / "sfx" / "arthurlabs-picture-effects.wav"
music = root / "music" / "arthurlabs-original-score.wav"
mix = root / "arthurlabs-final-mix-v3.wav"
concatenate([root / "narration" / "v3" / f"{name}-after.wav" for name in chapters], dialogue, mono=True)
concatenate([root / "sfx" / f"{name}-effects.wav" for name in chapters], effects)

run("-y", "-i", dialogue, "-i", music, "-i", effects, "-filter_complex",
    "[0:a]pan=stereo|FL=c0|FR=c0,asplit[voice][key];"
    "[1:a]highpass=f=28,equalizer=f=1900:t=q:w=0.8:g=-2.5,volume=2.0dB[score];"
    "[score][key]sidechaincompress=threshold=0.024:ratio=2.4:attack=38:release=480:knee=3[duck];"
    "[2:a]volume=-1.7dB[fx];"
    "[voice][duck][fx]amix=inputs=3:normalize=0,volume=1.70dB,aresample=192000,"
    "alimiter=limit=0.84:attack=4:release=65:level=false:latency=true,"
    "aresample=48000,atrim=end_sample=8640000[out]",
    "-map", "[out]", "-c:a", "pcm_s24le", mix)

# Render to a new path for QA. Promote only after checking the picture hash and audio.
run("-n", "-i", "renders/final/arthurlabs-hackathon-master-v2.mp4", "-i", mix,
    "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k",
    "-movflags", "+faststart", "renders/previews/arthurlabs-scored-v3-final-review.mp4")
