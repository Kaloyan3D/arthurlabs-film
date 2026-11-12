"""Non-destructive dialogue edit and stem remix for the approved V2 picture."""
import csv
import os
import re
import subprocess
from array import array
from pathlib import Path

ffmpeg = os.environ.get("FFMPEG", "ffmpeg")
rate = 48000
assets = Path("assets/audio")
out = assets / "narration" / "v3"
out.mkdir(exist_ok=True)

# Local seconds in the approved dialogue stems. Each range includes quiet handles.
chapters = [
    ("opening", 20, "arthurlabs-opening-narration", .85, [(12.80, 15.95, -.45)]),
    ("studio", 32, "arthur-studio-narration", 0, [(12.44, 14.83, 1.05), (20.93, 24.64, -1.30)]),
    ("nexus-engineering", 47, "nexus-engineering-edit", 0, [(7.02, 15.46, .66), (20.18, 27.82, -.48), (31.05, 35.55, -.62), (42.25, 45.19, -.84)]),
    ("context-compaction", 17, "context-compaction-edit", 0, []),
    ("nexus-nova", 20, "nexus-nova-edit", 0, [(4.19, 5.98, .27), (7.56, 10.96, -.40), (12.56, 17.89, -.42)]),
    ("sentry", 34, "sentry-edit", 0, [(5.23, 11.15, .30), (14.17, 18.96, -.36), (25.25, 28.19, -.34), (29.47, 32.42, -.52)]),
    ("finale", 10, "finale-edit", 0, []),
]


def ff(*args, **kwargs):
    return subprocess.run([ffmpeg, "-hide_banner", *map(str, args)], check=True, **kwargs)


def pcm(path):
    data = ff("-loglevel", "error", "-i", path, "-ar", rate, "-ac", 1,
              "-f", "s32le", "-", stdout=subprocess.PIPE).stdout
    return array("i", data)


def silence(path):
    log = ff("-i", path, "-af", "silencedetect=n=-45dB:d=0.25",
             "-f", "null", "-", stderr=subprocess.PIPE, text=True).stderr
    starts = re.findall(r"silence_start: ([-\d.]+)", log)
    ends = re.findall(r"silence_end: ([-\d.]+)", log)
    assert len(starts) == len(ends)
    return [(float(a), float(b)) for a, b in zip(starts, ends)]


def save(samples, path):
    ff("-loglevel", "error", "-y", "-f", "s32le", "-ar", rate, "-ac", 1,
       "-i", "-", "-c:a", "pcm_s24le", path, input=samples.tobytes())


mixes = []
timeline = []
offset = 0
for name, duration, stem, delay, moves in chapters:
    source = array("i", [0]) * round(delay * rate) + pcm(assets / "narration" / f"{stem}.wav")
    source = (source + array("i", [0]) * (duration * rate))[:duration * rate]
    before = out / f"{name}-before.wav"
    after = out / f"{name}-after.wav"
    save(source, before)
    edited = source[:]
    for start, end, _ in moves:
        a, b = round(start * rate), round(end * rate)
        edited[a:b] = array("i", [0]) * (b-a)
    for start, end, shift in moves:
        a, b = round(start * rate), round(end * rate)
        dest = a + round(shift * rate)
        clip = source[a:b]
        assert 0 <= dest and dest + len(clip) <= len(edited)
        fade = round(.008 * rate)
        assert max(abs(sample) for sample in edited[dest:dest+len(clip)]) < 2**31 * 10**(-45/20), (name, start, "overlap")
        for i, sample in enumerate(clip):
            gain = min(1, i / fade, (len(clip)-1-i) / fade)
            edited[dest+i] = round(sample * gain + edited[dest+i] * (1 - gain))
        assert edited[dest+fade:dest+len(clip)-fade] == clip[fade:-fade], (name, start)
    save(edited, after)

    for version, file in (("V2", before), ("V3", after)):
        cursor = 0
        for start, end in silence(file):
            if cursor < start:
                timeline.append((version, name, "active", offset+cursor, offset+start, start-cursor))
            timeline.append((version, name, "gap", offset+start, offset+end, end-start))
            cursor = end
        if cursor < duration:
            timeline.append((version, name, "active", offset+cursor, offset+duration, duration-cursor))
    offset += duration
    mix = out / f"{name}-mix.wav"
    # Studio's approved chapter applied a separate −3.2 dB bus trim.
    studio_gain = ",volume=-3.2dB" if name == "studio" else ""
    ff("-loglevel", "error", "-y", "-i", after, "-i", assets / "music" / f"{name}-score.wav",
       "-i", assets / "sfx" / f"{name}-effects.wav", "-filter_complex",
       "[0:a]pan=stereo|FL=c0|FR=c0,asplit[voice][key];"
       "[1:a][2:a]amix=inputs=2:normalize=0[bed];"
       "[bed][key]sidechaincompress=threshold=0.035:ratio=3:attack=20:release=270[duck];"
       "[voice][duck]amix=inputs=2:normalize=0,alimiter=limit=0.84:level=false:latency=true"
       f"{studio_gain},apad=whole_dur={duration},atrim=end_sample={duration*rate}[mix]",
       "-map", "[mix]", "-ar", rate, "-c:a", "pcm_s24le", mix)
    mixes.append(mix)

with (out / "voice-activity.csv").open("w", newline="") as handle:
    writer = csv.writer(handle)
    writer.writerow(("version", "chapter", "classification", "global_start_s", "global_end_s", "duration_s"))
    writer.writerows((*row[:3], *(f"{value:.6f}" for value in row[3:])) for row in timeline)

with (out / "chapters.ffconcat").open("w") as handle:
    handle.write("ffconcat version 1.0\n" + "".join(f"file '{path.name}'\n" for path in mixes))
v2 = "renders/final/arthurlabs-hackathon-master-v2.mp4"
v3 = "renders/final/arthurlabs-hackathon-master-v3.mp4"
ff("-loglevel", "error", "-n", "-i", v2, "-f", "concat", "-safe", 0, "-i", out / "chapters.ffconcat",
   "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
   "-af", "volume=2.35dB,aresample=192000,alimiter=limit=0.84:attack=4:release=55:level=false:latency=true,aresample=48000,atrim=end_sample=8640000",
   "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", v3)
