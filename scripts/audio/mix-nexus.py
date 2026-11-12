"""Place verified GPT-Live takes in the edit without retiming spoken material."""
import os
import subprocess

ffmpeg = os.environ.get("FFMPEG", "ffmpeg")
chapters = {
    "nexus-engineering": (47, [(0, 6.7, 250), (6.7, 15.18, 7000), (15.18, 22.92, 20000),
                               (22.92, 27.38, 31000), (27.38, 30.95, 36350), (30.95, 33.9, 42200)]),
    "context-compaction": (17, [(0, 16.98, 0)]),
    "nexus-nova": (20, [(0, 3.65, 180), (3.65, 5.54, 4050), (5.54, 9.02, 7550), (9.02, 14.55, 12380)]),
}


def ff(*args):
    subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


subprocess.run(["node", "scripts/audio/build-nexus-score.mjs"], check=True)
for name, (seconds, cuts) in chapters.items():
    voice = f"assets/audio/narration/{name}"
    bed = f"assets/audio/music/{name}"
    effects = f"assets/audio/sfx/{name}-effects.wav"
    inputs = "".join(f"[p{i}]" for i in range(len(cuts)))
    outputs = "".join(f"[c{i}]" for i in range(len(cuts)))
    split = [f"[0:a]asplit={len(cuts)}{inputs}"] if len(cuts) > 1 else ["[0:a]anull[p0]"]
    for i, (start, end, delay) in enumerate(cuts):
        split.append(f"[p{i}]atrim=start={start}:end={end},asetpts=PTS-STARTPTS,adelay={delay}[c{i}]")
    split.append(f"{outputs}amix=inputs={len(cuts)}:normalize=0,highpass=f=72,volume=3.6dB,apad=whole_dur={seconds}[v]")
    narration = f"{voice}-edit.wav"
    ff("-i", f"{voice}-take.wav", "-filter_complex", ";".join(split), "-map", "[v]",
       "-t", str(seconds), "-ar", "48000", "-c:a", "pcm_s24le", narration)
    ff("-i", narration, "-i", f"{bed}-score.wav", "-i", effects, "-filter_complex",
       "[0:a]pan=stereo|FL=c0|FR=c0,asplit[voice][side];[1:a][2:a]amix=inputs=2:normalize=0[bed];"
       "[bed][side]sidechaincompress=threshold=0.035:ratio=3:attack=20:release=270[duck];"
       "[voice][duck]amix=inputs=2:normalize=0,alimiter=limit=0.84:level=false:latency=true[out]",
       "-map", "[out]", "-t", str(seconds), "-ar", "48000", "-c:a", "pcm_s24le", f"{bed}-mix.wav")
