"""earshot without ffprobe (wav/flac only): patch the two ffprobe calls with soundfile, then run a command.
usage: python ears.py critique FILE | timeline FILE [cues.json] | describe FILE [start end]"""
import sys, json
import soundfile as sf
import earshot.audio as A

def _probe(path):
    i = sf.info(path)
    return {"codec": i.subtype, "sample_rate": i.samplerate, "channels": i.channels, "duration": i.duration,
            "has_video": False, "kbps": None}
A.probe = _probe
A._src_channels = lambda p: sf.info(p).channels
from earshot import api

cmd, path = sys.argv[1], sys.argv[2]
if cmd == "critique":
    from earshot.critique import critique_text
    r = api.critique(path, use_ast=False, use_realness=False)
    print(critique_text(r) if not isinstance(r, str) else r)
elif cmd == "timeline":
    r = api.timeline(path, cues=sys.argv[3] if len(sys.argv) > 3 else None)
    print(r.get("summary", "")[:4000])
elif cmd == "describe":
    s = float(sys.argv[3]) if len(sys.argv) > 3 else None; e = float(sys.argv[4]) if len(sys.argv) > 4 else None
    print(api.describe(path, start=s, end=e)["summary"])
