"""Cue-log driven real-SFX mixer (reference implementation from the Shopili OVERHAUL2 ad; edit LIB / VO / DUR /
the sound table S and the OVR accents for a new film). Shopili OVERHAUL2 sound design: real CC0 recordings (Openverse/Freesound, audited with earshot) placed on the
animation's own cue log (cues/*.json, written by lib.jsx on every move).
Rules (real-sfx): real recordings only; one sound per significant picture event, thinned; contextual sound per action;
peaks land on the frame; SFX ducked under the voice; no long sub drops in a product film (bright short accents).
out: SFX_TRACK_OV2.wav (SFX only, goes into AE), PREVIEW_MIX_OV2.wav (VO + SFX, for listening/earshot), sfx_cues_resolved.json"""
import json, os, glob
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
import pyloudnorm as pyln

D = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(D, "..", "sfx_ov2")
VO = r"C:/Users/ma267/Downloads/shopiliVO2.wav"
SR, DUR = 48000, 117.0
AUD = json.load(open(os.path.join(LIB, "audit.json"), encoding="utf-8"))
TRIM = {r["file"]: (r.get("start"), r.get("end")) for rows in AUD.values() for r in rows}

def load(rel, trim=None, max_len=None):
    p = rel if os.path.isabs(rel) else os.path.join(LIB, rel)
    if not os.path.exists(p):                # names in S may be prefixes of the downloaded file names
        p = sorted(glob.glob(p[:-4] + "*.wav"))[0]; rel = os.path.relpath(p, LIB).replace(os.sep, "/")
    x, sr = sf.read(p, always_2d=True)
    if sr != SR: x = resample_poly(x, SR, sr, axis=0)
    if x.shape[1] == 1: x = np.repeat(x, 2, axis=1)
    x = x[:, :2]
    t = trim or TRIM.get(rel)
    if t and t[0] is not None:
        a, b = int(t[0] * SR), int(t[1] * SR); x = x[max(0, a - int(0.003 * SR)):b]
    else:                                    # auto trim: onset -3 ms .. decay to -40 dB
        env = np.abs(x).max(1); pk = env.max() + 1e-9
        on = np.argmax(env > pk * 10 ** (-30 / 20)); after = np.where(env[on:] > pk * 10 ** (-40 / 20))[0]
        x = x[max(0, on - int(0.003 * SR)): on + (after[-1] if len(after) else len(env))]
    if max_len: x = x[: int(max_len * SR)]
    x = x / (np.abs(x).max() + 1e-9)          # peak-normalise every source; levels come from the cue gains
    n_in, n_out = int(0.003 * SR), min(int(0.03 * SR), len(x) // 3)
    x[:n_in] *= np.linspace(0, 1, n_in)[:, None]; x[-n_out:] *= np.linspace(1, 0, n_out)[:, None]
    return x

def pitch(x, semi):
    """shift by resampling (real recording, varispeed): +semi = higher and shorter"""
    if not semi: return x
    return resample_poly(x, 100, int(round(100 * 2 ** (semi / 12))), axis=0)

S = {
 "wh_short": ["whoosh/whoosh_03_fast_whoosh_bamboo_swoosh_through_.wav"],
 "wh": ["whoosh/whoosh_02_whoosh_1.wav", "whoosh/whoosh_04_whoosh_bamboo_4.wav", "whoosh/whoosh_01_whoosh_wav.wav"],
 "wh_long": ["whoosh/whoosh_01_whoosh_wav.wav"],
 "hit": ["hit/hit_02_wood_plastic_hit_impact.wav", "hit/hit_04_body_hit_wav.wav", "hit/hit_01_thud_pint_glass_beer_down_on_table_wood_.wav"],
 "pop": ["pop/pop_02_mouth_pop.wav", "pop/pop_04_mouth_pop_2.wav"],
 "click": ["click/click_03_left_mouse_click.wav"],
 "coin": ["coin/coin_03_coin_dropped.wav", "coin/coin_02_real_coin_drop.wav"],
 "cash": ["cash/cash_01_cash_register.wav"],
 "bell": ["bell/bell_01_desk_bell_1_wav.wav"],
 "glass": ["glass/glass_02_glassbottle_mp3.wav"],
 "printer": ["printer/printer_01_receipt_printer_01_wav.wav"],
 "rip": ["paper/paper_04_short_ripping_sound.wav"],
 "marker": ["marker/marker_01_marker_whiteboard_short05.wav"],
 "riser": ["riser/riser_04_reverse_fx_3_wav.wav", "riser/riser_01_reverse_fx_9_wav.wav"],
 "tick": ["tick/tick_02_assymetric_tick_wav.wav"],
 "low": ["hit/hit_01_dull_decompression_punch_impact_explodes.wav"],
 "scan": [r"D:/Work/EDITS/Some assets/Beeps/Beep-05.wav"],
}
CACHE = {}
def snd(kind, i=0):
    rel = S[kind][i % len(S[kind])]
    if rel not in CACHE: CACHE[rel] = load(rel)
    return CACHE[rel], rel

# ---- cues from the animation
cues = []
for f in sorted(glob.glob(os.path.join(D, "cues", "*.json"))):
    cues += json.load(open(f, encoding="utf-8"))
seen, uniq = set(), []
for c in sorted(cues, key=lambda c: c["t"]):          # rebuilt scenes may log twice
    k = (round(c["t"], 2), c["kind"], c["info"])
    if k not in seen: seen.add(k); uniq.append(c)
cues = uniq

# fixed accents at story moments (time -> sound), win over whatever the log says at that moment
OVR = {33.70: ("glass", -9), 36.60: ("glass", -11), 43.22: ("glass", -10), 64.06: ("glass", -9), 76.70: ("glass", -9),
       112.86: ("bell", -7), 54.40: ("printer", -15), 60.46: ("wh", -12), 14.16: ("coin", -11), 15.22: ("wh_short", -13)}
PRI = {"override": 0, "logo": 0, "bell": 0, "crack": 0, "strike": 0, "wipe": 0, "scan": 1, "tap": 1, "suck": 1,
       "slam": 2, "device_in": 2, "count": 3, "drop": 3, "pop": 4, "fly": 4, "slide": 4, "device_out": 5, "exit": 6}

ev = []                                   # (time, kind_for_priority, sound, gain, anchor, extra)
rot = {}
def nxt(k): rot[k] = rot.get(k, -1) + 1; return rot[k]
for c in cues:
    t, k, info = c["t"], c["kind"], c["info"]
    if k == "slam":   ev.append((t, k, "hit", -11, "onset", nxt("hit")))
    elif k == "drop": ev.append((t + 0.20, k, "wh", -15, "peak", nxt("wh")))
    elif k == "pop":
        if info.startswith("ICO_coin") or info.startswith("ICO_glowing_star"): ev.append((t + 0.05, k, "coin", -15, "onset", nxt("coin")))
        else: ev.append((t + 0.02, k, "pop", -12, "onset", nxt("pop")))
    elif k == "fly":
        if info.startswith("ICO_coin"): ev.append((t + 0.30, k, "coin", -13, "onset", nxt("coin")))
        else: ev.append((t + 0.24, k, "wh_short", -14, "peak", 0))
    elif k == "exit": ev.append((t + 0.08, k, "wh_short", -20, "peak", 0))
    elif k == "count":
        to = info.split("|")[0]; t1 = float(info.split("|")[1])
        if "DT" in to and float(to.replace("DT", "").strip() or 0) > 1000: ev.append((t1, k, "cash", -10, "onset", 0))
        elif to in ("500",): ev.append((t1, k, "coin", -12, "onset", nxt("coin")))
        else: ev.append((t, k, "tick", -16, "onset", 0))
    elif k == "device_in":  ev.append((t + 0.42, k, "wh_long", -11, "peak", 0))
    elif k == "device_out": ev.append((t + 0.20, k, "wh", -16, "peak", nxt("wh")))
    elif k == "tap":    ev.append((t, k, "click", -8, "peak", 0))
    elif k == "scan":   ev.append((t + 0.05, k, "scan", -14, "onset", 0))
    elif k == "strike": ev.append((t, k, "marker", -8, "onset", 0))
    elif k == "crack":  ev.append((t, k, "rip", -7, "onset", 0))
    elif k == "wipe":   ev.append((t + 0.36, k, "riser", -12, "end", 0))
    elif k == "logo":   ev.append((t, k, "cash", -7, "onset", 0))
    elif k == "suck":   ev.append((t + 0.40, k, "riser", -15, "end", 1))
    elif k == "bell":   ev.append((t, k, "bell", -5, "onset", 0))
    elif k == "slide":  ev.append((t + 0.2, k, "wh_short", -15, "peak", 0))
ev.append((16.80, "logo", "low", -14, "onset", 0)); ev.append((112.86, "logo", "low", -14, "onset", 0))
for t, (s, g) in OVR.items():
    ev = [e for e in ev if not (abs(e[0] - t) < 0.12 and PRI[e[1]] > 0)]
    ev.append((t, "override", s, g, "end" if s == "riser" else "onset", 0))

# ---- thin: keep by priority, min gap 0.11 s, max 3 sounds per 0.6 s, exits only in quiet spots
ev.sort(key=lambda e: (PRI[e[1]], e[0]))
kept = []
for e in ev:
    near = [k for k in kept if abs(k[0] - e[0]) < 0.11]
    if near and e[2] != "low": continue
    if e[2] != "low" and len([k for k in kept if abs(k[0] - e[0]) < 0.3]) >= 2: continue
    if e[1] == "exit" and any(abs(k[0] - e[0]) < 0.45 for k in kept): continue
    kept.append(e)
kept.sort(key=lambda e: e[0])

# ---- render
n = int(DUR * SR); bus = np.zeros((n, 2))
res = []
for t, kind, s, g, anchor, i in kept:
    x, rel = snd(s, i)
    if s == "pop": x = pitch(x, [0, 2, -1, 1][i % 4])
    env = np.abs(x).max(1)
    off = {"onset": 0, "peak": int(np.argmax(env)), "end": len(x)}[anchor]
    st = int(t * SR) - off
    a, b = max(0, st), min(n, st + len(x))
    if b <= a: continue
    pan = 0.0 if kind in ("logo", "bell", "override", "wipe", "suck") else [-0.3, 0.25, -0.15, 0.35, 0.1, -0.35][len(res) % 6]
    gl, gr = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    seg = x[a - st:b - st] * 10 ** (g / 20); bus[a:b, 0] += seg[:, 0] * gl; bus[a:b, 1] += seg[:, 1] * gr
    res.append({"t": round(t, 3), "event": kind, "sound": rel, "gain_db": g, "anchor": anchor, "start": round(st / SR, 3)})

# voice-safe: dip the SFX 3.5 dB while the VO speaks (50 ms RMS, 80 ms smoothing)
vo, vsr = sf.read(VO, always_2d=True)
if vsr != SR: vo = resample_poly(vo, SR, vsr, axis=0)
if vo.shape[1] == 1: vo = np.repeat(vo, 2, axis=1)
vo = np.pad(vo[:n], ((0, max(0, n - len(vo))), (0, 0)))
hop = int(0.05 * SR); fr = np.sqrt(np.mean(vo[: len(vo) // hop * hop, 0].reshape(-1, hop) ** 2, axis=1))
speech = (20 * np.log10(fr + 1e-9) > 20 * np.log10(fr.max()) - 30).astype(float)
k = np.ones(3) / 3; speech = np.convolve(speech, k, "same")
duck = 10 ** (-3.5 * speech / 20); duck = np.repeat(duck, hop); duck = np.pad(duck, (0, n - len(duck)), constant_values=1)[:n]
bus *= duck[:, None]

# level: SFX bus 9 LU under the VO, then a -1 dBFS ceiling on the mix
meter = pyln.Meter(SR)
lv, ls = meter.integrated_loudness(vo), meter.integrated_loudness(bus)
bus *= 10 ** ((lv - 9 - ls) / 20)
mix = vo + bus
pk = np.abs(mix).max()
if pk > 10 ** (-1 / 20):
    gfix = 10 ** (-1 / 20) / pk; bus *= gfix; mix *= gfix
sf.write(os.path.join(D, "SFX_TRACK_OV2.wav"), bus.astype(np.float32), SR, subtype="PCM_24")
sf.write(os.path.join(D, "PREVIEW_MIX_OV2.wav"), mix.astype(np.float32), SR, subtype="PCM_24")
json.dump(res, open(os.path.join(D, "sfx_cues_resolved.json"), "w", encoding="utf-8"), indent=1)
print("cues in log", len(cues), "-> placed", len(res), "| VO %.1f LUFS, SFX bus %.1f LUFS, mix %.1f LUFS" % (lv, meter.integrated_loudness(bus), meter.integrated_loudness(mix)))
from collections import Counter; print(Counter(r["event"] for r in res)); print(Counter(os.path.basename(r["sound"])[:22] for r in res))
