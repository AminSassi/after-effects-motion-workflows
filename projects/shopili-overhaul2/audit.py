"""earshot audit of the Openverse downloads: rank per role, best clean trim, realness."""
import json, os, sys, glob
from earshot import api
D=os.path.dirname(os.path.abspath(__file__))
Q={"whoosh":"a fast clean air whoosh swish","pop":"a soft round bubble pop","hit":"a short punchy impact hit",
"click":"a single crisp mouse click","chime":"a bright short success chime ding","bell":"a single ring of a hotel service desk bell",
"coin":"coins clinking and dropping","cash":"a cash register cha-ching with coins","scan":"a short barcode scanner beep",
"printer":"a receipt printer printing","paper":"paper ripping and tearing","riser":"a rising whoosh swell riser",
"marker":"a marker pen drawing a quick stroke","tick":"a clock ticking","camera":"a camera shutter click","glass":"a bright glass ping"}
out={}
for role,q in Q.items():
    files=sorted(glob.glob(os.path.join(D,role,"*.wav")))
    if not files: continue
    r=api.rank(files,q)
    rows=[]
    for it in r.get("results",[])[:4]:
        p=it["path"]; row={"file":os.path.relpath(p,D).replace("\\","/"),"z":it.get("z"),"verdict":it.get("verdict")}
        try:
            f=api.find(p,q,top=1); seg=(f.get("segments") or f.get("results") or [{}])[0]
            row.update({k:seg.get(k) for k in ("start","end","kind","z","head","tail","note") if k in seg})
            row["trim_z"]=seg.get("z")
            rl=api.realness(p,start=seg.get("start"),end=seg.get("end"))
            row["p_real"]=rl.get("p_real"); row["real_verdict"]=rl.get("verdict")
        except Exception as e: row["err"]=str(e)[:120]
        rows.append(row)
    out[role]=rows; print(role, json.dumps(rows,ensure_ascii=False)[:600], flush=True)
json.dump(out,open(os.path.join(D,"audit.json"),"w",encoding="utf-8"),indent=1,ensure_ascii=False)
