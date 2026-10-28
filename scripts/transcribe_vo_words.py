"""Word-level VO timestamps for caption/popup sync (faster-whisper, CPU).

Usage:
    python scripts/transcribe_vo_words.py <voice.mp3> [--lang fr] [--model small] [--out vo_words.json]

Prints segment lines and a compact `word@start` dump, writes JSON:
    [{"s": start, "e": end, "t": text, "w": [[start, end, word], ...]}, ...]

Gotchas solved here:
  * Some PyAV builds crash in faster_whisper.decode_audio
    ("open() got an unexpected keyword argument 'metadata_errors'").
    We decode with ffmpeg to 16 kHz mono float32 ourselves and pass the array.
  * Whisper mis-hears brand names (i-LINER -> "Highliner", Syphax -> "CIFACS").
    Use the timings, but always take caption TEXT from the client script.
"""
import argparse, json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("audio")
ap.add_argument("--lang", default="fr")
ap.add_argument("--model", default="small")
ap.add_argument("--out", default="vo_words.json")
a = ap.parse_args()

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", a.audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0

model = WhisperModel(a.model, device="cpu", compute_type="int8")
segs, info = model.transcribe(audio, language=a.lang, word_timestamps=True)

out = []
for s in segs:
    out.append({"s": round(s.start, 2), "e": round(s.end, 2), "t": s.text.strip(),
                "w": [[round(w.start, 2), round(w.end, 2), w.word.strip()] for w in s.words]})
    print(f"{s.start:6.2f}-{s.end:6.2f} {s.text}")

json.dump(out, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
words = " ".join(f"{w[2]}@{w[0]}" for s in out for w in s["w"])
sys.stdout.buffer.write(("\n" + words + "\n").encode("utf-8"))
print(f"\nduration ~{out[-1]['e'] if out else 0}s -> {a.out}")
