/*  dental_product_ad_builder.jsx
 *  ---------------------------------------------------------------------------
 *  Config-driven builder for CLEAN / MINIMAL 9:16 dental product ads:
 *  alpha or studio-harmonized 3D product & clinical renders on a soft light
 *  gradient, white pop-up cards with a brand accent bar, word-timed caption
 *  pills, kinetic headlines, geometric brand motifs, and end card.
 *
 *  Battle-tested on:
 *    - i-LINER (i-dental / Syphax Medico Dentaire) ad, 2026-10
 *    - i-FIX® Duo Automix (i-dental / Syphax Medico Dentaire) 63.5s + 18s ads, 2026-10
 *  See docs/19-dental-product-ad-workflow.md & docs/21-clinical-dental-3d-and-ifu-compliance.md
 *
 *  USAGE (After Effects MCP, eval.run):
 *      $.evalFile(new File('<repo>/scripts/dental_product_ad_builder.jsx'));
 *      $.evalFile(new File('<repo>/projects/<product>/ad_config.jsx'));   // defines CFG
 *      IMPORT_ASSETS(CFG);          // optional – imports videos/images/VO into bins
 *      return BUILD_AD(CFG);        // (re)builds the comp, idempotent
 *
 *  ES3 only (no let/const/arrow/forEach). Do NOT open undo groups – MCP wraps it.
 *  Saved as UTF-8 so French accents survive $.evalFile.
 */

var W = 1080, H = 1920, FPS = 60, DUR = 58;
var INK = [0.106, 0.118, 0.149];
var GRAY = [0.42, 0.45, 0.50];
var ACC = [0.839, 0.090, 0.478];
var ACC2 = [0.220, 0.639, 0.722];
var WHITE = [1, 1, 1];
var BG_C = [0.975, 0.978, 0.985];
var BG_E = [0.855, 0.866, 0.886];
var F_BOLD = "Montserrat-Bold", F_SEMI = "Montserrat-SemiBold", F_MED = "Montserrat-Medium", F_XB = "Montserrat-ExtraBold";

function findItem(name) {
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it.name == name && !(it instanceof FolderItem)) return it; }
    throw new Error("Missing item " + name);
}
function getFolder(name) {
    for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it.name == name && it instanceof FolderItem) return it; }
    return app.project.items.addFolder(name);
}
function easeAll(prop, infl) {
    infl = infl || 80;
    var t = prop.propertyValueType, n = 1;
    if (t == PropertyValueType.TwoD) n = 2; else if (t == PropertyValueType.ThreeD) n = 3;
    var a = []; for (var i = 0; i < n; i++) a.push(new KeyframeEase(0, infl));
    for (var k = 1; k <= prop.numKeys; k++) prop.setTemporalEaseAtKey(k, a, a);
}
function keys(prop, times, vals, infl) {
    for (var i = 0; i < times.length; i++) prop.setValueAtTime(times[i], vals[i]);
    easeAll(prop, infl);
}
function tr(l, n) { return l.property("ADBE Transform Group").property(n); }

function addText(comp, str, o) {
    var l = comp.layers.addText(str);
    var p = l.property("ADBE Text Properties").property("ADBE Text Document");
    var td = p.value;
    td.resetCharStyle(); td.resetParagraphStyle();
    td.font = o.font; td.fontSize = o.size; td.fillColor = o.color || INK;
    td.applyFill = true; td.applyStroke = false;
    td.justification = o.just || ParagraphJustification.CENTER_JUSTIFY;
    td.tracking = o.tracking || 0;
    p.setValue(td);
    if (o.hl) highlight(l, o.hl, o.hlColor || ACC);
    if (o.hl2) highlight(l, o.hl2, ACC2);
    tr(l, "ADBE Position").setValue(o.pos || [W / 2, H / 2]);
    if (o.name) l.name = o.name;
    return l;
}
// hl: array of substrings to colour
function highlight(l, subs, col) {
    try {
        var p = l.property("ADBE Text Properties").property("ADBE Text Document");
        var td = p.value, s = td.text;
        for (var i = 0; i < subs.length; i++) {
            var idx = s.indexOf(subs[i]);
            if (idx >= 0) { td.characterRange(idx, idx + subs[i].length).fillColor = col; }
        }
        p.setValue(td);
    } catch (e) {}
}
function revealText(l, t0, dur, dy) {
    var an = l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
    var pr = an.property("ADBE Text Animator Properties");
    pr.addProperty("ADBE Text Position 3D").setValue([0, dy === undefined ? 36 : dy, 0]);
    pr.addProperty("ADBE Text Opacity").setValue(0);
    var sel = an.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    sel.property("ADBE Text Range Advanced").property("ADBE Text Selector Smoothness").setValue(100);
    var off = sel.property("ADBE Text Percent Offset");
    keys(off, [t0, t0 + dur], [0, 100], 70);
}
function fadeLayer(l, t0, t1, fin, fout) {
    var op = tr(l, "ADBE Opacity");
    var ts = [], vs = [];
    if (fin > 0) { ts.push(t0, t0 + fin); vs.push(0, 100); }
    if (fout > 0) { ts.push(t1 - fout, t1); vs.push(100, 0); }
    if (ts.length) keys(op, ts, vs, 60);
}
function setSpan(l, t0, t1) { l.inPoint = Math.max(0, t0); l.outPoint = Math.min(DUR, t1); }

// ---------- shape & harmonization helpers ----------
function addRect(layer, name, size, pos, round, fillCol, fillOp, strokeCol, strokeW) {
    var g = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = name;
    var c = g.property("ADBE Vectors Group");
    var r = c.addProperty("ADBE Vector Shape - Rect");
    r.property("ADBE Vector Rect Size").setValue(size);
    r.property("ADBE Vector Rect Roundness").setValue(round);
    if (fillCol) {
        var f = c.addProperty("ADBE Vector Graphic - Fill");
        f.property("ADBE Vector Fill Color").setValue(fillCol);
        if (fillOp !== undefined) f.property("ADBE Vector Fill Opacity").setValue(fillOp);
    }
    if (strokeCol) {
        var st = c.addProperty("ADBE Vector Graphic - Stroke");
        st.property("ADBE Vector Stroke Color").setValue(strokeCol);
        st.property("ADBE Vector Stroke Width").setValue(strokeW || 2);
    }
    g.property("ADBE Vector Transform Group").property("ADBE Vector Position").setValue(pos);
    return g;
}
function addEllipse(layer, name, d, fillCol, strokeCol, sw) {
    var g = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = name;
    var c = g.property("ADBE Vectors Group");
    c.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([d, d]);
    if (fillCol) c.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(fillCol);
    if (strokeCol) { var s = c.addProperty("ADBE Vector Graphic - Stroke"); s.property("ADBE Vector Stroke Color").setValue(strokeCol); s.property("ADBE Vector Stroke Width").setValue(sw || 2); }
    return g;
}
function softShadow(l, op, dist, soft) {
    var ds = l.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ds.property("ADBE Drop Shadow-0001").setValue(INK);
    ds.property("ADBE Drop Shadow-0002").setValue(op * 2.55);  // 0..255 internal
    ds.property("ADBE Drop Shadow-0003").setValue(180);
    ds.property("ADBE Drop Shadow-0004").setValue(dist);
    ds.property("ADBE Drop Shadow-0005").setValue(soft);
    return ds;
}

// Harmonizes non-alpha 3D studio renders (.mp4) with the flat minimal #F9FAFB canvas
function harmonize3DLayer(L) {
    try {
        var bc = L.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2");
        bc.property(1).setValue(14);
        bc.property(2).setValue(-6);
    } catch (e) {}
    try {
        var m = L.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        m.name = "Soft_Studio_Vignette";
        var sh = new Shape();
        var mx = 70, my = 190, mw = W - mx * 2, mh = H - my * 2;
        var cx = W / 2, cy = H / 2, rx = mw / 2, ry = mh / 2;
        var k = 0.55228475;
        sh.vertices = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
        sh.inTangents = [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]];
        sh.outTangents = [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]];
        sh.closed = true;
        m.property("ADBE Mask Shape").setValue(sh);
        m.property("ADBE Mask Feather").setValue([180, 180]);
    } catch (e2) {}
}

// Feathered studio solid fade for top/bottom editorial zones
function addFeatheredSolid(comp, name, yPos, hSize, featherPx, dur) {
    var s = comp.layers.addSolid(BG_C, name, W, H, 1, dur || DUR);
    var m = s.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    var sh = new Shape();
    var top = yPos - hSize / 2, bot = yPos + hSize / 2;
    sh.vertices = [[-100, top], [W + 100, top], [W + 100, bot], [-100, bot]];
    sh.closed = true;
    m.property("ADBE Mask Shape").setValue(sh);
    m.property("ADBE Mask Feather").setValue([featherPx, featherPx]);
    return s;
}

// Subtle 3-square geometric brand motif (i-dental style)
function addBrandMotif(comp, x, y, scale, op, dur) {
    var sh = comp.layers.addShape();
    sh.name = "Brand_Geometric_Motif";
    tr(sh, "ADBE Position").setValue([x, y]);
    tr(sh, "ADBE Scale").setValue([scale, scale, 100]);
    tr(sh, "ADBE Opacity").setValue(op);
    addRect(sh, "sq1", [140, 140], [-55, -55], 8, null, 0, ACC2, 3);
    addRect(sh, "sq2", [110, 110], [35, 35], 8, null, 0, ACC, 3);
    addRect(sh, "sq3", [64, 64], [-10, -10], 4, ACC, 18, null, 0);
    setSpan(sh, 0, dur || DUR);
    return sh;
}

// ---------- POP-UP CARD ----------
// o: {t0,t1,x,y,title,sub,hl,hl2,anchor:[x,y]}
var POPN = 0;
function popup(comp, o) {
    POPN++;
    var id = "POP" + (POPN < 10 ? "0" : "") + POPN;
    var t0 = o.t0, t1 = o.t1;
    var nul = comp.layers.addNull(); nul.name = id + "_ctrl";
    tr(nul, "ADBE Anchor Point").setValue([0, 0]);
    tr(nul, "ADBE Position").setValue([o.x, o.y]);

    var title = addText(comp, o.title, { font: F_BOLD, size: 38, color: INK, just: ParagraphJustification.LEFT_JUSTIFY, hl: o.hl, hl2: o.hl2, name: id + "_title" });
    var sub = null;
    if (o.sub) sub = addText(comp, o.sub, { font: F_MED, size: 26, color: GRAY, just: ParagraphJustification.LEFT_JUSTIFY, name: id + "_sub" });
    var w1 = title.sourceRectAtTime(t0 + 0.5, false).width, w2 = sub ? sub.sourceRectAtTime(t0 + 0.5, false).width : 0;
    var padX = 36, accW = 7, gap = 22;
    var cw = Math.round(padX + accW + gap + Math.max(w1, w2) + padX + 6);
    var ch = sub ? 142 : 98;

    var card = comp.layers.addShape(); card.name = id + "_card";
    addRect(card, "accent", [accW, ch - 44], [-cw / 2 + padX + accW / 2, 0], 4, ACC);
    addRect(card, "bg", [cw, ch], [0, 0], 26, WHITE);
    softShadow(card, 14, 14, 50);

    var lx = -cw / 2 + padX + accW + gap;
    var kids = [card, title]; if (sub) kids.push(sub);
    for (var i = 0; i < kids.length; i++) { kids[i].parent = nul; }
    tr(card, "ADBE Position").setValue([0, 0]);
    tr(title, "ADBE Position").setValue([lx, sub ? -4 : 14]);
    if (sub) tr(sub, "ADBE Position").setValue([lx, 38]);
    // order: card under texts
    card.moveAfter(title);

    // animation
    keys(tr(nul, "ADBE Position"), [t0, t0 + 0.50], [[o.x, o.y + 26], [o.x, o.y]], 85);
    keys(tr(nul, "ADBE Scale"), [t0, t0 + 0.50, t1 - 0.28, t1], [[94, 94, 100], [100, 100, 100], [100, 100, 100], [97, 97, 100]], 85);
    for (var j = 0; j < kids.length; j++) { fadeLayer(kids[j], t0, t1, 0.26, 0.26); setSpan(kids[j], t0, t1); }
    setSpan(nul, t0, t1);
    if (sub) revealText(sub, t0 + 0.16, 0.50, 14);

    // leader line + dot to product anchor
    if (o.anchor) {
        var ax = o.anchor[0], ay = o.anchor[1];
        var ex, ey;
        if (ax < o.x - cw / 2) { ex = o.x - cw / 2; ey = o.y; }
        else if (ax > o.x + cw / 2) { ex = o.x + cw / 2; ey = o.y; }
        else if (ay < o.y) { ex = ax; ey = o.y - ch / 2; }
        else { ex = ax; ey = o.y + ch / 2; }
        var ln = comp.layers.addShape(); ln.name = id + "_leader";
        tr(ln, "ADBE Anchor Point").setValue([0, 0]); tr(ln, "ADBE Position").setValue([0, 0]);
        var g = ln.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var c = g.property("ADBE Vectors Group");
        var pth = c.addProperty("ADBE Vector Shape - Group");
        var sh = new Shape(); sh.vertices = [[ax, ay], [ex, ey]]; sh.closed = false;
        pth.property("ADBE Vector Shape").setValue(sh);
        var st = c.addProperty("ADBE Vector Graphic - Stroke");
        st.property("ADBE Vector Stroke Color").setValue(ACC); st.property("ADBE Vector Stroke Width").setValue(3);
        st.property("ADBE Vector Stroke Line Cap").setValue(2);
        var tp = c.addProperty("ADBE Vector Filter - Trim");
        keys(tp.property("ADBE Vector Trim End"), [t0, t0 + 0.42], [0, 100], 80);
        fadeLayer(ln, t0, t1, 0, 0.26); setSpan(ln, t0, t1);

        var dot = comp.layers.addShape(); dot.name = id + "_dot";
        tr(dot, "ADBE Anchor Point").setValue([0, 0]); tr(dot, "ADBE Position").setValue([ax, ay]);
        var ring = addEllipse(dot, "ring", 40, null, ACC, 2);
        // IMPORTANT: set ring expressions BEFORE adding "core", otherwise AE invalidates `ring` reference
        var rs = ring.property("ADBE Vector Transform Group").property("ADBE Vector Scale");
        var ro = ring.property("ADBE Vector Transform Group").property("ADBE Vector Group Opacity");
        rs.expression = "s = 60 + ((time - inPoint) % 1.4)/1.4*80; [s,s]";
        ro.expression = "70*(1 - ((time - inPoint) % 1.4)/1.4)";
        addEllipse(dot, "core", 18, ACC, WHITE, 4);
        keys(tr(dot, "ADBE Scale"), [t0 - 0.08, t0 + 0.24], [[0, 0, 100], [100, 100, 100]], 85);
        fadeLayer(dot, t0, t1, 0, 0.26); setSpan(dot, t0 - 0.08, t1);
        ln.moveAfter(card); dot.moveAfter(card);
    }
    return nul;
}

// ---------- HEADLINE (top zone) ----------
function headline(comp, o) {
    var lay = [];
    if (o.label) {
        var lb = addText(comp, o.label, { font: F_SEMI, size: 25, color: ACC, tracking: 240, pos: [W / 2, o.y], name: "HL_label_" + o.label.substr(0, 12) });
        revealText(lb, o.t0, 0.42, 0); lay.push(lb);
    }
    if (o.big) {
        var bg = addText(comp, o.big, { font: F_XB, size: o.size || 76, color: INK, tracking: -10, pos: [W / 2, o.y + (o.label ? 84 : 0)], hl: o.hl, hl2: o.hl2, name: "HL_" + o.big.substr(0, 14) });
        revealText(bg, o.t0 + 0.10, 0.55, 44); lay.push(bg);
    }
    if (o.sub) {
        var sb = addText(comp, o.sub, { font: F_MED, size: 31, color: GRAY, pos: [W / 2, o.y + (o.label ? 84 : 0) + 58], name: "HL_sub" });
        revealText(sb, o.t0 + 0.26, 0.50, 18); lay.push(sb);
    }
    for (var i = 0; i < lay.length; i++) { setSpan(lay[i], o.t0, o.t1); fadeLayer(lay[i], o.t0, o.t1, 0, 0.28); }
    return lay;
}

// ---------- CAPTIONS ----------
var CAP_Y = 1470;
function caption(comp, c, next) {
    var t0 = c[0], t1 = next, str = c[1];
    var l = addText(comp, str, { font: F_SEMI, size: 44, color: INK, pos: [W / 2, CAP_Y], hl: c[2], hl2: c[5], name: "CAP_" + str.substr(0, 18) });
    var r = l.sourceRectAtTime(t0 + 0.2, false);
    var sc = r.width > 900 ? 900 / r.width * 100 : 100;
    var pill = comp.layers.addShape(); pill.name = "CAPBG_" + str.substr(0, 14);
    tr(pill, "ADBE Anchor Point").setValue([0, 0]);
    var pw = r.width * sc / 100 + 64, ph = r.height * sc / 100 + 34;
    addRect(pill, "pill", [pw, ph], [0, 0], ph / 2, WHITE, 92);
    softShadow(pill, 8, 8, 28);
    tr(pill, "ADBE Position").setValue([W / 2, CAP_Y + (r.top + r.height / 2) * sc / 100]);
    pill.moveAfter(l);
    tr(l, "ADBE Scale").setValue([sc, sc, 100]);
    setSpan(l, t0, t1); setSpan(pill, t0, t1);
    keys(tr(l, "ADBE Position"), [t0, t0 + 0.20], [[W / 2, CAP_Y + 14], [W / 2, CAP_Y]], 80);
    tr(l, "ADBE Opacity").setValueAtTime(t0, 0); tr(l, "ADBE Opacity").setValueAtTime(t0 + 0.12, 100);
    if (c[3]) { // last of a run -> fade out
        tr(l, "ADBE Opacity").setValueAtTime(t1 - 0.18, 100); tr(l, "ADBE Opacity").setValueAtTime(t1, 0);
        tr(pill, "ADBE Opacity").setValueAtTime(t1 - 0.18, 100); tr(pill, "ADBE Opacity").setValueAtTime(t1, 0);
    }
    if (c[4]) { tr(pill, "ADBE Opacity").setValueAtTime(t0, 0); tr(pill, "ADBE Opacity").setValueAtTime(t0 + 0.15, 100); }
}


// =====================================================================
// IMPORT_ASSETS: imports every .mov and .mp4 in cfg.assets.videosDir, the listed
// images and the VO into bins. Skips already-imported names. Corrupt files are
// reported, not fatal.
function IMPORT_ASSETS(cfg) {
    var proj = app.project, A = cfg.assets, bad = [], have = {};
    for (var i = 1; i <= proj.numItems; i++) have[proj.item(i).name] = 1;
    var fV = getFolder("01_VIDEOS"), fI = getFolder("02_IMAGES"), fA = getFolder("03_AUDIO");
    function imp(path, folder) {
        try { var it = proj.importFile(new ImportOptions(new File(path))); it.parentFolder = folder; return it; }
        catch (e) { bad.push(path + ": " + e.toString()); return null; }
    }
    var movs = new Folder(A.videosDir).getFiles("*.mov");
    for (var v = 0; v < movs.length; v++) if (!have[decodeURI(movs[v].name)]) imp(movs[v].fsName, fV);
    var mp4s = new Folder(A.videosDir).getFiles("*.mp4");
    for (var v2 = 0; v2 < mp4s.length; v2++) if (!have[decodeURI(mp4s[v2].name)]) imp(mp4s[v2].fsName, fV);
    for (var m = 0; m < (A.images || []).length; m++) {
        var nm = A.images[m].split("/").pop();
        if (!have[nm]) imp(A.images[m], fI);
    }
    if (A.vo && !have[A.voName || "VO.mp3"]) { var a = imp(A.vo, fA); if (a) a.name = A.voName || "VO.mp3"; }
    return { bad: bad, numItems: proj.numItems };
}

// =====================================================================
// BUILD_AD(cfg) – see projects/iliner-dental-ad-v2/ad_config.jsx and
// projects/ifix-duo-dental-ad/build_ifix_duo.jsx for full examples.
function BUILD_AD(cfg) {
    var proj = app.project;
    W = cfg.width || 1080; H = cfg.height || 1920; FPS = cfg.fps || 60; DUR = cfg.duration;
    var B = cfg.brand || {};
    if (B.accent) ACC = B.accent; if (B.accent2) ACC2 = B.accent2;
    if (B.ink) INK = B.ink; if (B.gray) GRAY = B.gray;
    if (B.bgCenter) BG_C = B.bgCenter; if (B.bgEdge) BG_E = B.bgEdge;
    if (cfg.captionY) CAP_Y = cfg.captionY;
    POPN = 0;

    for (var i = proj.numItems; i >= 1; i--) {
        var it = proj.item(i);
        if (it instanceof CompItem && it.name == cfg.compName) {
            while (it.numLayers > 0) { it.layer(1).locked = false; it.layer(1).remove(); }
            it.remove();
        }
    }
    var comp = proj.items.addComp(cfg.compName, W, H, 1, DUR, FPS);
    comp.parentFolder = getFolder("00_COMPS");
    comp.bgColor = BG_E;

    // ---- background: soft radial gradient ----
    var bg = comp.layers.addSolid(BG_E, "BG_gradient", W, H, 1, DUR);
    var rp = bg.property("ADBE Effect Parade").addProperty("ADBE Ramp");
    rp.property("ADBE Ramp-0001").setValue([W / 2, H * 0.43]);
    rp.property("ADBE Ramp-0002").setValue(BG_C);
    rp.property("ADBE Ramp-0003").setValue([W / 2, H * 1.22]);
    rp.property("ADBE Ramp-0004").setValue(BG_E);
    rp.property("ADBE Ramp-0005").setValue(2);   // radial

    var topFade = null, botFade = null;
    if (cfg.studioFades) {
        topFade = addFeatheredSolid(comp, "BG_top_editorial_fade", 210, 420, 160, DUR);
        botFade = addFeatheredSolid(comp, "BG_bottom_editorial_fade", H - 210, 420, 160, DUR);
    }

    var motif1 = null, motif2 = null;
    if (cfg.brandMotif) {
        motif1 = addBrandMotif(comp, 110, 110, 58, 16, DUR);
        motif2 = addBrandMotif(comp, W - 110, H - 110, 58, 16, DUR);
    }

    // ---- footage scenes ----
    // {clip, a, b, scale, pos, srcIn, noShadow, brighten, harmonize3D}
    var S = cfg.scenes, X = cfg.crossfade || 0.22;
    for (var s = 0; s < S.length; s++) {
        var d = S[s], item = findItem(d.clip);
        var a = d.a, b = d.b, srcIn = d.srcIn || 0, sc = d.scale || 100;
        var nextA = (s + 1 < S.length) ? S[s + 1].a : 999;
        var contiguous = Math.abs(nextA - b) < 0.01;
        var outT = contiguous ? b + X : b;
        var need = outT - a, avail = item.duration - srcIn;
        var L = comp.layers.add(item);
        L.name = "SC" + (s + 1 < 10 ? "0" : "") + (s + 1) + "_" + d.clip.replace(/\.[^.]+$/, "");
        var st = need > avail ? Math.ceil(need / avail * 100) + 1 : 100;   // gentle slow-mo if clip too short
        L.stretch = st;
        L.startTime = a - srcIn * st / 100;
        L.inPoint = a; L.outPoint = outT;
        tr(L, "ADBE Position").setValue(d.pos || [W / 2, H * 0.52]);
        keys(tr(L, "ADBE Scale"), [a, a + 0.7, outT], [[sc * 0.965, sc * 0.965, 100], [sc, sc, 100], [sc * 1.03, sc * 1.03, 100]], 70);
        var op = tr(L, "ADBE Opacity");
        if (s > 0) { op.setValueAtTime(a, 0); op.setValueAtTime(a + X, 100); }
        op.setValueAtTime(outT - X, 100); op.setValueAtTime(outT, 0);
        easeAll(op, 50);
        if (d.harmonize3D || cfg.harmonize3D) harmonize3DLayer(L);
        if (!d.noShadow && !d.harmonize3D && !cfg.harmonize3D) softShadow(L, 22, 34, 90); // never on translucent teeth or studio MP4s
        if (d.brighten) { var bc = L.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2"); bc.property(1).setValue(d.brighten); bc.property(2).setValue(12); }
    }

    // ---- end card ----
    var E = cfg.endCard;
    if (E) {
        if (E.clip) {
            var box = comp.layers.add(findItem(E.clip));
            box.name = "END_" + E.clip.replace(/\.[^.]+$/, "");
            box.startTime = E.a; box.inPoint = E.a;
            box.timeRemapEnabled = true;     // hold last frame
            box.property("ADBE Time Remapping").expression = "Math.min(time - inPoint, source.duration - thisComp.frameDuration)";
            box.outPoint = DUR;
            tr(box, "ADBE Position").setValue(E.pos || [W / 2, 700]);
            var es = E.scale || 42;
            keys(tr(box, "ADBE Scale"), [E.a, E.a + 1.2, DUR], [[es * 0.9, es * 0.9, 100], [es, es, 100], [es * 1.035, es * 1.035, 100]], 75);
            keys(tr(box, "ADBE Opacity"), [E.a, E.a + 0.36], [0, 100], 60);
            if (E.harmonize3D || cfg.harmonize3D) harmonize3DLayer(box);
            else softShadow(box, 22, 34, 90);
        }
        if (E.label) headline(comp, { t0: E.a + 0.65, t1: DUR, y: E.labelY || 1240, label: E.label });
        if (E.logo) {
            var logo = comp.layers.add(findItem(E.logo));
            logo.name = "END_logo";
            var lt = E.a + 0.85, ls = E.logoScale || 42;
            tr(logo, "ADBE Position").setValue(E.logoPos || [W / 2, 1450]);
            setSpan(logo, lt, DUR);
            keys(tr(logo, "ADBE Scale"), [lt, lt + 0.7], [[ls * 0.9, ls * 0.9, 100], [ls, ls, 100]], 85);
            keys(tr(logo, "ADBE Opacity"), [lt, lt + 0.4], [0, 100], 60);
        }
        if (E.contact) {
            var ph = addText(comp, E.contact, { font: F_SEMI, size: 32, color: INK, pos: E.contactPos || [W / 2, 1690], name: "END_contact" });
            setSpan(ph, E.a + 1.55, DUR); revealText(ph, E.a + 1.55, 0.6, 16);
        }
    }

    if (topFade) topFade.moveToBeginning();
    if (botFade) botFade.moveToBeginning();
    if (motif1) motif1.moveToBeginning();
    if (motif2) motif2.moveToBeginning();

    // ---- headlines / pop-ups ----
    var HL = cfg.headlines || [];
    for (var h = 0; h < HL.length; h++) headline(comp, HL[h]);
    var P = cfg.popups || [];
    for (var p = 0; p < P.length; p++) popup(comp, P[p]);

    // ---- captions: [t0, text, highlights[], endTime(optional => fade out), startsRun(fade pill in), hl2[]] ----
    var C = cfg.captions || [];
    for (var k = 0; k < C.length; k++) {
        var c = C[k], endT = c[3] ? c[3] : C[k + 1][0];
        caption(comp, [c[0], c[1], c[2], c[3] ? 1 : 0, c[4], c[5]], endT);
    }

    // ---- audio ----
    if (cfg.vo) { var vo = comp.layers.add(findItem(cfg.vo)); vo.name = "VO"; vo.startTime = cfg.voOffset || 0; vo.moveToEnd(); }
    bg.moveToEnd(); bg.locked = true;

    comp.openInViewer();
    return { comp: comp.name, layers: comp.numLayers };
}
