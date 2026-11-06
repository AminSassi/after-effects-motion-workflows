"""One-line karaoke subtitles, hidden where the same words are already written on screen.
reads subs_data.jsx (full sentences + per-word times) and the scene scripts s1-s5.jsx (on-screen text + times);
writes subs_data.jsx.new -> SUBS one-line chunks, and subs_report.txt (what was kept / hidden and why)."""
import json, re, os, sys
D = os.path.dirname(os.path.abspath(__file__))
MAXC = int(sys.argv[1]) if len(sys.argv) > 1 else 27      # max characters per line (Cairo Bold 50 px in ~900 px)

src = open(os.path.join(D, "subs_data.orig.jsx" if os.path.exists(os.path.join(D, "subs_data.orig.jsx")) else "subs_data.jsx"), encoding="utf-8").read()
SUBS = json.loads(src[src.index("["):src.rindex("]") + 1])

# ---- on-screen text with its life [a,b]
ON = []
num = r"([\d.]+)"
for fn in ["s1.jsx", "s2.jsx", "s3.jsx", "s4.jsx", "s5.jsx"]:
    s = open(os.path.join(D, fn), encoding="utf-8").read()
    for m in re.finditer(r'(?:txt|chip)\(c\w*,"([^"]+)",\{[^}]*?a:' + num + r',b:(' + r'[\d.]+|DUR)', s):
        ON.append((m.group(1), float(m.group(2)), 117.0 if m.group(3) == "DUR" else float(m.group(3))))
    for m in re.finditer(r'topWord\("([^"]+)",' + num + ',' + num, s):
        ON.append((m.group(1), float(m.group(2)), float(m.group(3)) + 0.16))
    for m in re.finditer(r'pair\("([^"]+)","[^"]+",' + num + ',' + num, s):
        ON.append((m.group(1), float(m.group(2)), float(m.group(3))))
    for m in re.finditer(r'tline\("([^"]+)",[-\d.]+,' + num, s):
        ON.append((m.group(1), float(m.group(2)), 61.0))
    for m in re.finditer(r'\["(في [^"]+)",' + num + ',' + num, s):          # K6 callback words
        ON.append((m.group(1), float(m.group(2)), float(m.group(3))))
    for m in re.finditer(r'\["([^"]+)",C\.\w+,\d+,[-\d.]+,' + num + r',"([^"]+)",C\.\w+,' + num, s):   # K2 stack
        ON.append((m.group(1), float(m.group(2)), 16.6)); ON.append((m.group(3), float(m.group(4)), 16.6))
# logos that "say" the word
ON += [("شوبيلي", 16.8, 20.4), ("ربحني", 72.58, 78.1), ("ربحني", 86.08, 87.82), ("شوبيلي", 104.72, 109.18), ("ربحني", 106.66, 109.18), ("شوبيلي", 113.7, 117)]

def norm(w):
    w = re.sub(r"[ً-ْـ]", "", w)            # diacritics, shadda, tatweel
    w = re.sub(r"[،,.?؟!:]", "", w)
    w = w.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ة", "ه").replace("ى", "ي")
    return w
def stem(w):
    for p in ("وال", "بال", "لل", "ال", "و", "ب", "ل"):
        if w.startswith(p) and len(w) - len(p) >= 3:
            return w[len(p):]
    return w
STOP = {"في", "من", "على", "اللي", "مع", "كي", "حتى", "باش", "و", "ولا", "والا", "الكل", "متاعك", "متاعها", "بين", "عليه", "اي"}

def match(w, screen_words):
    a = stem(norm(w))
    for s in screen_words:
        b = stem(norm(s))
        if a == b or (len(a) >= 3 and len(b) >= 3 and (a in b or b in a)):
            return True
    return False

out, rep = [], []
for s0, s1, text, times in SUBS:
    words = text.replace("\r", " ").split()
    assert len(words) == len(times)
    # greedy one-line chunks, prefer breaking after a comma
    chunks, cur = [], []
    for i, w in enumerate(words):
        if cur and len(" ".join([words[j] for j in cur] + [w])) > MAXC:
            chunks.append(cur); cur = []
        cur.append(i)
        if w.endswith("،") and len(" ".join(words[j] for j in cur)) >= 12 and i < len(words) - 1:
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    # merge a lone short tail into the previous chunk if it still fits
    k = 0
    while k < len(chunks):                      # no one-word lines: merge into a neighbour if it still fits
        if len(chunks) > 1 and len(chunks[k]) == 1:
            j = k - 1 if k > 0 else k + 1
            if len(" ".join(words[i] for i in sorted(chunks[j] + chunks[k]))) <= MAXC + 7:
                chunks[j] = sorted(chunks[j] + chunks[k]); chunks.pop(k); continue
        k += 1
    for k, ch in enumerate(chunks):
        a = times[ch[0]]
        b = times[chunks[k + 1][0]] if k + 1 < len(chunks) else s1
        ws = [words[j] for j in ch]
        line = " ".join(ws).rstrip("،,")
        scr = [x for (t, sa, sb) in ON if sa < b - 0.05 and sb > a + 0.05 for x in t.split()]
        content = [w for w in ws if norm(w) not in STOP and len(norm(w)) > 1]
        hit = [w for w in content if match(w, scr)]
        cov = len(hit) / max(1, len(content))
        hide = cov >= 0.5
        rep.append("%s %6.2f-%6.2f cov %.2f  %s   | screen: %s" % ("HIDE" if hide else "show", a, b, cov, line, " ".join(scr)[:80]))
        if not hide:
            out.append([round(a, 3), round(b, 3), line, [round(times[j] , 3) for j in ch]])
# a shown line ends where the next one starts only if they touch; otherwise give it 0.25 s of tail
for i in range(len(out) - 1):
    out[i][1] = min(out[i][1] + 0.25, out[i + 1][0]) if out[i][1] < out[i + 1][0] else out[i][1]
open(os.path.join(D, "subs_report.txt"), "w", encoding="utf-8").write("\n".join(rep))
open(os.path.join(D, "subs_data.new.jsx"), "w", encoding="utf-8").write("var SUBS=" + json.dumps(out, ensure_ascii=False) + ";")
print(len(out), "lines shown,", sum(r.startswith("HIDE") for r in rep), "hidden; longest", max(len(o[2]) for o in out))
