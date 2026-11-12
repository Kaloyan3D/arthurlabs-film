"""Validate the Nexus deliverables and the locked-to-Nexus video splice."""
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
    "nexus-engineering-v1": 1410,
    "context-compaction-v1": 510,
    "nexus-nova-v1": 600,
    "nexus-sequence-v1": 2520,
    "arthurlabs-first-136s": 4080,
}


def file(name):
    return str(media / f"{name}.mp4")


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
    opening, nexus, stitched = pool.map(frames, ("arthurlabs-first-52s", "nexus-sequence-v1", "arthurlabs-first-136s"))
assert len(opening) == 1560 and len(nexus) == 2520 and stitched == opening + nexus
print("All 4,080 stitched video frames match the two source exports in order.")
