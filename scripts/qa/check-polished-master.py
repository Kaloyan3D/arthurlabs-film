"""Verify the V2 master and compare its opening picture and soundtrack timing."""
import json
import os
import subprocess
from array import array
from fractions import Fraction
from math import sqrt

ffmpeg = os.environ.get("FFMPEG", "ffmpeg")
ffprobe = os.environ.get("FFPROBE", "ffprobe")
v1 = "renders/final/arthurlabs-hackathon-master-v1.mp4"
v2 = "renders/final/arthurlabs-hackathon-master-v2.mp4"

data = json.loads(subprocess.check_output([
    ffprobe, "-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", v2,
]))
video, audio = data["streams"]
assert (video["codec_name"], video["pix_fmt"], video["width"], video["height"]) == ("h264", "yuv420p", 1920, 1080)
assert Fraction(video["r_frame_rate"]) == 30 and int(video["nb_read_frames"]) == 5400
assert (audio["codec_name"], audio["sample_rate"], audio["channels"]) == ("aac", "48000", 2)
assert all(Fraction(s["duration"]) == 180 for s in (video, audio, data["format"]))
assert Fraction(video["start_time"]) == Fraction(audio["start_time"]) == 0
subprocess.run([ffmpeg, "-v", "error", "-xerror", "-i", v2, "-f", "null", "-"], check=True)


def opening(path):
    return subprocess.check_output([
        ffmpeg, "-v", "error", "-i", path, "-map", "0:v:0", "-frames:v", "600", "-f", "framemd5", "-",
    ])


assert opening(v1) == opening(v2), "Opening frames or timestamps changed"
print("V2 decodes, lasts exactly 180 seconds and retains all 600 opening frames.")


def mono(path):
    return array("h", subprocess.check_output([
        ffmpeg, "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "4000", "-f", "s16le", "-",
    ]))


original, polished = mono(v1), mono(v2)
for second in (2, 21, 53, 99, 116, 137, 171, 177):
    start = second * 4000
    ref = original[start:start + 4000:4]
    ref_energy = sum(x*x for x in ref)

    def correlation(lag):
        take = polished[start + lag:start + 4000 + lag:4]
        return sum(a*b for a, b in zip(ref, take)) / sqrt(ref_energy * sum(x*x for x in take))

    lag = max(range(-160, 161), key=correlation)
    assert abs(lag) <= 1 and correlation(lag) > .98, (second, lag, correlation(lag))
    print(f"Audio at {second:3} s: {lag / 4:+.2f} ms lag, correlation {correlation(lag):.5f}")
