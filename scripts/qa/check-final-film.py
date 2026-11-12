"""Validate Phase 4 outputs and the lossless 136-second splice."""
import concurrent.futures
import json
import os
import subprocess
from fractions import Fraction
from pathlib import Path

ffmpeg = os.environ.get("FFMPEG", "ffmpeg")
ffprobe = os.environ.get("FFPROBE", "ffprobe")
media = Path("renders/previews")
expected = {
    "sentry-v1": 1020,
    "arthurlabs-finale-v1": 300,
    "sentry-finale-v1": 1320,
    "arthurlabs-hackathon-master-v1": 5400,
}


def file(name):
    directory = Path("renders/final") if name == "arthurlabs-hackathon-master-v1" else media
    return str(directory / f"{name}.mp4")



def inspect(name, count):
    command = [ffprobe, "-v", "error", "-count_frames", "-show_streams", "-of", "json", file(name)]
    video, audio = json.loads(subprocess.check_output(command))["streams"]
    assert (video["codec_name"], video["pix_fmt"], video["width"], video["height"]) == ("h264", "yuv420p", 1920, 1080), name
    assert Fraction(video["r_frame_rate"]) == 30 and int(video["nb_read_frames"]) == count, name
    assert Fraction(video["duration"]) == Fraction(count, 30), name
    assert (audio["codec_name"], audio["sample_rate"], audio["channels"]) == ("aac", "48000", 2), name
    assert float(video["start_time"]) == float(audio["start_time"]) == 0, name
    assert abs(float(audio["duration"]) - count / 30) < 0.025, name
    subprocess.run([ffmpeg, "-v", "error", "-xerror", "-i", file(name), "-f", "null", "-"], check=True)
    print(f"{name}: {count} frames, decoded cleanly")


def frames(name):
    data = subprocess.check_output([
        ffmpeg, "-v", "error", "-threads", "2", "-i", file(name), "-map", "0:v:0",
        "-fps_mode", "passthrough", "-f", "framemd5", "-",
    ], text=True)
    return [line.rsplit(",", 1)[1].strip() for line in data.splitlines() if not line.startswith("#")]


for name, count in expected.items():
    inspect(name, count)

with concurrent.futures.ThreadPoolExecutor() as pool:
    locked, ending, master = pool.map(frames, (
        "arthurlabs-first-136s", "sentry-finale-v1", "arthurlabs-hackathon-master-v1",
    ))
assert len(locked) == 4080 and len(ending) == 1320 and master == locked + ending
print("All 5,400 picture frames match their source exports in order.")


def audio_hash(name):
    return subprocess.check_output([
        ffmpeg, "-v", "error", "-i", file(name), "-map", "0:a:0", "-t", "136",
        "-f", "hash", "-hash", "sha256", "-",
    ], text=True).strip()


assert audio_hash("arthurlabs-first-136s") == audio_hash("arthurlabs-hackathon-master-v1")
print("First 136 seconds of decoded audio match the locked cut exactly.")
