"""Fetch real, openly licensed sound effects from the Openverse API (https://api.openverse.org/v1/).

Openverse indexes Freesound, Wikimedia Commons, Jamendo, ccMixter and more. No key is needed for light use
(anonymous rate limit), results carry their licence and attribution, and `license=cc0` returns sounds you can use
without credit. Every download is converted to 48 kHz stereo WAV (ffmpeg from imageio-ffmpeg if ffmpeg is not on
PATH) and written next to a manifest with the source URL, creator and licence of each file.

usage:
  python fetch_openverse_audio.py --out sfx_lib --plan plan.json
  python fetch_openverse_audio.py --out sfx_lib --role whoosh --query "whoosh swish" --n 6 --max-ms 1500

plan.json: [{"role": "whoosh", "query": "whoosh swish", "n": 6, "max_ms": 1500}, ...]
Files land in OUT/<role>/<role>_<n>_<slug>.wav, so folder names give the role (real-sfx style indexes read it).
"""
import argparse, json, os, re, shutil, subprocess, sys, time, urllib.error, urllib.parse, urllib.request

API = "https://api.openverse.org/v1/audio/"
UA = "ae-motion-workflows-sfx-fetch/1.0"
MAX_ANON_PAGE = 20  # anonymous requests get 401 above page_size 20


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("need ffmpeg on PATH or `pip install imageio-ffmpeg`")


def search(query, license_="cc0", page_size=20, min_ms=0, max_ms=4000):
    qs = urllib.parse.urlencode({"q": query, "license": license_, "page_size": min(page_size, MAX_ANON_PAGE)})
    req = urllib.request.Request(API + "?" + qs, headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.load(r)
            break
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(15 * (attempt + 1))
                continue
            raise
    else:
        return []
    out = []
    for it in data.get("results", []):
        d = it.get("duration") or 0
        if d and (d < min_ms or d > max_ms):
            continue
        out.append(it)
    return out


def slug(s):
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")[:40]


def fetch(role, query, n, out, ff, min_ms=0, max_ms=4000, license_="cc0", manifest=None):
    os.makedirs(os.path.join(out, role), exist_ok=True)
    got = 0
    for it in search(query, license_, 40, min_ms, max_ms):
        if got >= n:
            break
        name = "%s_%02d_%s" % (role, got + 1, slug(it["title"]))
        dst = os.path.join(out, role, name + ".wav")
        if any(m["id"] == it["id"] for m in manifest):
            continue
        tmp = dst + ".src"
        try:
            req = urllib.request.Request(it["url"], headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(tmp, "wb") as f:
                f.write(r.read())
            subprocess.run([ff, "-v", "error", "-y", "-i", tmp, "-ar", "48000", "-ac", "2", dst], check=True)
        except Exception as e:
            print("  skip", it["title"], e)
            continue
        finally:
            if os.path.exists(tmp):
                os.remove(tmp)
        manifest.append({"file": os.path.relpath(dst, out).replace("\\", "/"), "role": role, "query": query,
                         "id": it["id"], "title": it["title"], "creator": it.get("creator"),
                         "license": it["license"], "license_url": it.get("license_url"),
                         "source": it.get("source"), "landing": it.get("foreign_landing_url"),
                         "duration_ms": it.get("duration")})
        got += 1
        print("  +", dst)
    return got


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--plan")
    ap.add_argument("--role")
    ap.add_argument("--query")
    ap.add_argument("--n", type=int, default=5)
    ap.add_argument("--min-ms", type=int, default=0)
    ap.add_argument("--max-ms", type=int, default=4000)
    ap.add_argument("--license", default="cc0", help="cc0 (default), or e.g. by,cc0")
    a = ap.parse_args()
    ff = ffmpeg_exe()
    os.makedirs(a.out, exist_ok=True)
    mpath = os.path.join(a.out, "manifest.json")
    manifest = json.load(open(mpath, encoding="utf-8")) if os.path.exists(mpath) else []
    jobs = json.load(open(a.plan, encoding="utf-8")) if a.plan else [
        {"role": a.role, "query": a.query, "n": a.n, "min_ms": a.min_ms, "max_ms": a.max_ms}]
    for j in jobs:
        print("[%s] %s" % (j["role"], j["query"]))
        fetch(j["role"], j["query"], j.get("n", 5), a.out, ff, j.get("min_ms", 0), j.get("max_ms", 4000),
              j.get("license", a.license), manifest)
        json.dump(manifest, open(mpath, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        time.sleep(1.0)
    print("manifest:", mpath, len(manifest), "files")


if __name__ == "__main__":
    main()
