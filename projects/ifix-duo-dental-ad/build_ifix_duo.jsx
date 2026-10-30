// i-FIX Duo Automix — 9:16 Professional Reel Ad Builder (ExtendScript, ES3)
// Builds TWO compositions in the project:
//   1. i-FIX_Duo_Master_Reel_Ad_9x16   (63.5 s full narrated commercial, 100% IFU-compliant)
//   2. i-FIX_Duo_Reel_Short_18s_9x16   (18.0 s high-impact Instagram Reel cut of the strongest scenes)
// Unified flat-minimal editorial canvas + soft-vignetted 3D renders, Montserrat typography,
// smooth Bezier temporal easing, popups with leader lines & pulsing dots, and synced captions.

var W = 1080, H = 1920, FPS = 30, DUR = 63.5;
var INK = [0.090, 0.125, 0.153];       // Deep clinical slate-ink (#172027)
var GRAY = [0.380, 0.435, 0.478];      // Editorial medium slate
var ACC = [0.055, 0.478, 0.557];       // i-FIX Duo clinical teal (#0E7A8E)
var ACC_CYAN = [0.200, 0.690, 0.765];  // Bright cyan accent (#33B0C3)
var WHITE = [1, 1, 1];
var BG_C = [0.975, 0.980, 0.986];
var BG_E = [0.885, 0.900, 0.915];
var F_BOLD = "Montserrat-Bold", F_SEMI = "Montserrat-SemiBold", F_MED = "Montserrat-Medium", F_XB = "Montserrat-ExtraBold";

function findItem(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (it.name == name && !(it instanceof FolderItem)) return it;
    }
    throw new Error("Missing item " + name);
}

function getFolder(name) {
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (it.name == name && it instanceof FolderItem) return it;
    }
    return app.project.items.addFolder(name);
}

function ensureImported(filePath, folderName) {
    var f = new File(filePath);
    var fname = f.name;
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (it.name == fname && !(it instanceof FolderItem)) {
            try { it.replace(f); } catch (e) {}
            return it;
        }
    }
    var io = new ImportOptions(f);
    var item = app.project.importFile(io);
    if (folderName) item.parentFolder = getFolder(folderName);
    return item;
}

function easeAll(prop, infl) {
    infl = infl || 80;
    var t = prop.propertyValueType, n = 1;
    if (t == PropertyValueType.TwoD || t == PropertyValueType.TwoD_SPATIAL) n = 2;
    else if (t == PropertyValueType.ThreeD || t == PropertyValueType.ThreeD_SPATIAL) n = 3;
    var a = [];
    for (var i = 0; i < n; i++) a.push(new KeyframeEase(0, infl));
    for (var k = 1; k <= prop.numKeys; k++) {
        try { prop.setTemporalEaseAtKey(k, a, a); } catch (e) {}
    }
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
    td.resetCharStyle();
    td.resetParagraphStyle();
    td.font = o.font;
    td.fontSize = o.size;
    td.fillColor = o.color || INK;
    td.applyFill = true;
    td.applyStroke = false;
    td.justification = o.just || ParagraphJustification.CENTER_JUSTIFY;
    td.tracking = o.tracking || 0;
    p.setValue(td);
    if (o.hl) highlight(l, o.hl, o.hlColor || ACC);
    tr(l, "ADBE Position").setValue(o.pos || [W / 2, H / 2]);
    if (o.name) l.name = o.name;
    return l;
}

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

function setSpan(l, t0, t1, maxDur) {
    var lim = maxDur || DUR;
    l.inPoint = Math.max(0, t0);
    l.outPoint = Math.min(lim, t1);
}

// ---------- shape helpers ----------
function addRect(layer, name, size, pos, round, fillCol, fillOp, strokeCol, sw) {
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
        var s = c.addProperty("ADBE Vector Graphic - Stroke");
        s.property("ADBE Vector Stroke Color").setValue(strokeCol);
        s.property("ADBE Vector Stroke Width").setValue(sw || 3);
    }
    g.property("ADBE Vector Transform Group").property("ADBE Vector Position").setValue(pos);
    return g;
}

function addEllipse(layer, name, d, fillCol, strokeCol, sw) {
    var g = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = name;
    var c = g.property("ADBE Vectors Group");
    c.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([d, d]);
    if (fillCol) c.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(fillCol);
    if (strokeCol) {
        var s = c.addProperty("ADBE Vector Graphic - Stroke");
        s.property("ADBE Vector Stroke Color").setValue(strokeCol);
        s.property("ADBE Vector Stroke Width").setValue(sw || 2);
    }
    return g;
}

function softShadow(l, op, dist, soft) {
    var ds = l.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ds.property("ADBE Drop Shadow-0001").setValue(INK);
    ds.property("ADBE Drop Shadow-0002").setValue(op * 2.55);
    ds.property("ADBE Drop Shadow-0003").setValue(180);
    ds.property("ADBE Drop Shadow-0004").setValue(dist);
    ds.property("ADBE Drop Shadow-0005").setValue(soft);
    return ds;
}

// Harmonize 3D render with flat/minimal UI: soft feathered ellipse mask + subtle matte lift
function harmonize3DLayer(l, featherPx) {
    try {
        var bc = l.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2");
        bc.property(1).setValue(7);   // slight studio highlight lift to blend with flat canvas
        bc.property(2).setValue(-4);  // softer contrast so 3D shadows don't clash with minimal cards
        var m = l.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        var sh = new Shape();
        sh.vertices = [[540, 260], [1040, 960], [540, 1680], [40, 960]];
        sh.inTangents = [[-320, 0], [0, -420], [320, 0], [0, 420]];
        sh.outTangents = [[320, 0], [0, 420], [-320, 0], [0, -420]];
        sh.closed = true;
        m.property("ADBE Mask Shape").setValue(sh);
        m.property("ADBE Mask Feather").setValue([featherPx || 220, featherPx || 220]);
        m.property("ADBE Mask Offset").setValue(110);
    } catch (e) {}
}

function addFeatheredSolid(comp, name, col, yTop, yBot, featherY, opVal, t0, t1, maxDur) {
    var lim = maxDur || DUR;
    var s = comp.layers.addSolid(col, name, W, H, 1, lim);
    var m = s.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    var sh = new Shape();
    sh.vertices = [[-200, yTop], [W + 200, yTop], [W + 200, yBot], [-200, yBot]];
    sh.closed = true;
    m.property("ADBE Mask Shape").setValue(sh);
    m.property("ADBE Mask Feather").setValue([0, featherY]);
    tr(s, "ADBE Opacity").setValue(opVal);
    setSpan(s, t0, t1, lim);
    return s;
}

// ---------- POP-UP CARD ----------
var POPN = 0;
function popup(comp, o, maxDur) {
    POPN++;
    var id = "POP" + (POPN < 10 ? "0" : "") + POPN;
    var t0 = o.t0, t1 = o.t1;
    var nul = comp.layers.addNull(); nul.name = id + "_ctrl";
    tr(nul, "ADBE Anchor Point").setValue([0, 0]);
    tr(nul, "ADBE Position").setValue([o.x, o.y]);

    var title = addText(comp, o.title, {
        font: F_BOLD, size: o.titleSize || 38, color: INK,
        just: ParagraphJustification.LEFT_JUSTIFY, hl: o.hl, name: id + "_title"
    });
    var sub = null;
    if (o.sub) {
        sub = addText(comp, o.sub, {
            font: F_MED, size: o.subSize || 26, color: GRAY,
            just: ParagraphJustification.LEFT_JUSTIFY, name: id + "_sub"
        });
    }
    var w1 = title.sourceRectAtTime(t0 + 0.3, false).width;
    var w2 = sub ? sub.sourceRectAtTime(t0 + 0.3, false).width : 0;
    var padX = 38, accW = 7, gap = 24;
    var cw = Math.round(padX + accW + gap + Math.max(w1, w2) + padX + 20);
    var ch = sub ? 144 : 100;

    var card = comp.layers.addShape(); card.name = id + "_card";
    addRect(card, "accent", [accW, ch - 44], [-cw / 2 + padX + accW / 2, 0], 4, ACC);
    addRect(card, "bg", [cw, ch], [0, 0], 26, WHITE, 96);
    softShadow(card, 14, 14, 50);

    var lx = -cw / 2 + padX + accW + gap;
    var kids = [card, title]; if (sub) kids.push(sub);
    for (var i = 0; i < kids.length; i++) { kids[i].parent = nul; }
    tr(card, "ADBE Position").setValue([0, 0]);
    tr(title, "ADBE Position").setValue([lx, sub ? -4 : 14]);
    if (sub) tr(sub, "ADBE Position").setValue([lx, 38]);
    card.moveAfter(title);

    keys(tr(nul, "ADBE Position"), [t0, t0 + 0.45], [[o.x, o.y + 24], [o.x, o.y]], 85);
    keys(tr(nul, "ADBE Scale"), [t0, t0 + 0.45, t1 - 0.25, t1], [[94, 94, 100], [100, 100, 100], [100, 100, 100], [97, 97, 100]], 85);
    for (var j = 0; j < kids.length; j++) { fadeLayer(kids[j], t0, t1, 0.24, 0.24); setSpan(kids[j], t0, t1, maxDur); }
    setSpan(nul, t0, t1, maxDur);
    if (sub) revealText(sub, t0 + 0.06, 0.32, 12);

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
        keys(tp.property("ADBE Vector Trim End"), [t0, t0 + 0.38], [0, 100], 80);
        fadeLayer(ln, t0, t1, 0, 0.24); setSpan(ln, t0, t1, maxDur);

        var dot = comp.layers.addShape(); dot.name = id + "_dot";
        tr(dot, "ADBE Anchor Point").setValue([0, 0]); tr(dot, "ADBE Position").setValue([ax, ay]);
        var ring = addEllipse(dot, "ring", 40, null, ACC, 2);
        var rs = ring.property("ADBE Vector Transform Group").property("ADBE Vector Scale");
        var ro = ring.property("ADBE Vector Transform Group").property("ADBE Vector Group Opacity");
        rs.expression = "s = 60 + ((time - inPoint) % 1.4)/1.4*80; [s,s]";
        ro.expression = "70*(1 - ((time - inPoint) % 1.4)/1.4)";
        addEllipse(dot, "core", 18, ACC, WHITE, 4);
        keys(tr(dot, "ADBE Scale"), [t0 - 0.06, t0 + 0.22], [[0, 0, 100], [100, 100, 100]], 85);
        fadeLayer(dot, t0, t1, 0, 0.24); setSpan(dot, t0 - 0.06, t1, maxDur);
        ln.moveAfter(card); dot.moveAfter(card);
    }
    return nul;
}

// ---------- HEADLINE (top editorial zone) ----------
function headline(comp, o, maxDur) {
    var lay = [];
    if (o.label) {
        var lb = addText(comp, o.label, {
            font: F_SEMI, size: 26, color: ACC, tracking: 240,
            pos: [W / 2, o.y], name: "HL_label_" + o.label.substr(0, 12)
        });
        revealText(lb, o.t0, 0.38, 0); lay.push(lb);
    }
    if (o.big) {
        var bg = addText(comp, o.big, {
            font: F_XB, size: o.size || 80, color: INK, tracking: -10,
            pos: [W / 2, o.y + (o.label ? 92 : 0)], hl: o.hl, name: "HL_" + o.big.substr(0, 14)
        });
        revealText(bg, o.t0 + 0.08, 0.52, 44); lay.push(bg);
    }
    if (o.sub) {
        var sb = addText(comp, o.sub, {
            font: F_MED, size: 31, color: GRAY,
            pos: [W / 2, o.y + (o.label ? 92 : 0) + 62], name: "HL_sub_" + o.sub.substr(0, 12)
        });
        revealText(sb, o.t0 + 0.22, 0.45, 18); lay.push(sb);
    }
    for (var i = 0; i < lay.length; i++) {
        setSpan(lay[i], o.t0, o.t1, maxDur);
        fadeLayer(lay[i], o.t0, o.t1, 0, 0.26);
    }
    return lay;
}

// ---------- CAPTIONS ----------
var CAP_Y = 1545;
function caption(comp, c, next, maxDur) {
    var t0 = c[0], t1 = next, str = c[1];
    var l = addText(comp, str, {
        font: F_SEMI, size: 44, color: INK, pos: [W / 2, CAP_Y],
        hl: c[2], name: "CAP_" + str.substr(0, 18)
    });
    var r = l.sourceRectAtTime(t0 + 0.2, false);
    var sc = r.width > 900 ? 900 / r.width * 100 : 100;
    var pill = comp.layers.addShape(); pill.name = "CAPBG_" + str.substr(0, 14);
    tr(pill, "ADBE Anchor Point").setValue([0, 0]);
    var pw = r.width * sc / 100 + 64, ph = r.height * sc / 100 + 34;
    addRect(pill, "pill", [pw, ph], [0, 0], ph / 2, WHITE, 90);
    softShadow(pill, 10, 10, 36);
    tr(pill, "ADBE Position").setValue([W / 2, CAP_Y + (r.top + r.height / 2) * sc / 100]);
    pill.moveAfter(l);
    tr(l, "ADBE Scale").setValue([sc, sc, 100]);
    setSpan(l, t0, t1, maxDur); setSpan(pill, t0, t1, maxDur);
    keys(tr(l, "ADBE Position"), [t0, t0 + 0.20], [[W / 2, CAP_Y + 14], [W / 2, CAP_Y]], 80);
    tr(l, "ADBE Opacity").setValueAtTime(t0, 0); tr(l, "ADBE Opacity").setValueAtTime(t0 + 0.12, 100);
    tr(pill, "ADBE Opacity").setValueAtTime(t0, 0); tr(pill, "ADBE Opacity").setValueAtTime(t0 + 0.12, 100);
    if (c[3]) {
        tr(l, "ADBE Opacity").setValueAtTime(t1 - 0.18, 100); tr(l, "ADBE Opacity").setValueAtTime(t1, 0);
        tr(pill, "ADBE Opacity").setValueAtTime(t1 - 0.18, 100); tr(pill, "ADBE Opacity").setValueAtTime(t1, 0);
    }
}

// =====================================================================
// 1. FULL 63.5s NARRATED COMMERCIAL (100% IFU-COMPLIANT)
// =====================================================================
function BUILD_MASTER_63S() {
    var proj = app.project;
    var comp = null;
    for (var i = 1; i <= proj.numItems; i++) {
        var it = proj.item(i);
        if (it instanceof CompItem && it.name == "i-FIX_Duo_Master_Reel_Ad_9x16") { comp = it; break; }
    }
    if (!comp) {
        comp = proj.items.addComp("i-FIX_Duo_Master_Reel_Ad_9x16", W, H, 1, DUR, FPS);
    } else {
        comp.duration = DUR; comp.frameRate = FPS;
        while (comp.numLayers > 0) { comp.layer(1).locked = false; comp.layer(1).remove(); }
    }
    comp.parentFolder = getFolder("00_COMPS");
    comp.bgColor = BG_E;

    var bg = comp.layers.addSolid(BG_E, "BG_gradient", W, H, 1, DUR);
    var rp = bg.property("ADBE Effect Parade").addProperty("ADBE Ramp");
    rp.property("ADBE Ramp-0001").setValue([W / 2, 820]);
    rp.property("ADBE Ramp-0002").setValue(BG_C);
    rp.property("ADBE Ramp-0003").setValue([W / 2, 2350]);
    rp.property("ADBE Ramp-0004").setValue(BG_E);
    rp.property("ADBE Ramp-0005").setValue(2);

    // 3D Footage Scenes — Scene 12 now uses Scene_12_v3 (IFU-compliant seating & excess removal, NO 2s tack-cure flash)
    var S = [
        ["Scene_02_Unboxing_Syringe_Reveal_9x16.mp4",                          0.00,  4.88, 100, [540, 1020], 0],
        ["Scene_01_Hero_Lineup_Reference_9x16.mp4",                            4.88, 10.00, 100, [540, 1000], 0],
        ["Scene_11_v2_Clinical_Step1_Loading_Crown_Automix_9x16.mp4",         10.00, 15.22, 100, [540,  990], 0],
        ["Scene_12_v3_Clinical_Step2_IFU_Seating_And_Excess_Removal_9x16.mp4",15.22, 20.50, 100, [540,  980], 0],
        ["Scene_13_Clinical_Step3_Full_Dual_Cure_Polymerization_9x16.mp4",    20.50, 25.28, 100, [540,  980], 0],
        ["Scene_10_Macro_Packaging_And_Tips_Sweep_9x16.mp4",                  25.28, 29.84, 100, [540,  980], 0],
        ["Scene_05_Syringe_360_Showcase_9x16.mp4",                            29.84, 34.40, 100, [540,  990], 0],
        ["Scene_08_Macro_Syringe_Branding_Glide_9x16.mp4",                    34.40, 39.76, 100, [540,  980], 0],
        ["Scene_03_Tip_Locking_Assembly_9x16.mp4",                            39.76, 43.60, 100, [540, 1000], 0],
        ["Scene_09_Macro_Helical_Mixer_CloseUp_9x16.mp4",                     43.60, 48.16, 100, [540,  980], 0],
        ["Scene_04_Automix_Dispensing_Macro_9x16.mp4",                        48.16, 54.10, 100, [540,  990], 0],
        ["Scene_06_Tips_Macro_Showcase_9x16.mp4",                             54.10, 58.94, 100, [540,  980], 0]
    ];
    var X = 0.25;
    for (var s = 0; s < S.length; s++) {
        var d = S[s], item = findItem(d[0]);
        var a = d[1], b = d[2];
        var outT = b + X;
        var need = outT - a, avail = item.duration - d[5];
        var L = comp.layers.add(item);
        L.name = "SC" + (s + 1 < 10 ? "0" : "") + (s + 1) + "_" + d[0].replace("_9x16.mp4", "");
        var st = need > avail ? Math.ceil(need / avail * 100) + 2 : 100;
        L.stretch = st;
        L.startTime = a - d[5] * st / 100;
        L.inPoint = a; L.outPoint = outT;
        var sc = d[3];
        tr(L, "ADBE Position").setValue(d[4]);
        keys(tr(L, "ADBE Scale"), [a, a + 0.8, outT], [[sc * 0.965, sc * 0.965, 100], [sc, sc, 100], [sc * 1.03, sc * 1.03, 100]], 70);
        var op = tr(L, "ADBE Opacity");
        if (s > 0) { op.setValueAtTime(a, 0); op.setValueAtTime(a + X, 100); }
        if (s == S.length - 1) { op.setValueAtTime(b - 0.1, 100); op.setValueAtTime(outT, 0); }
        easeAll(op, 55);
        harmonize3DLayer(L, 240);
    }

    var kitEnd = comp.layers.add(findItem("Scene_07_Full_Kit_Outro_9x16.mp4"));
    kitEnd.name = "END_SC07_Full_Kit";
    kitEnd.startTime = 58.94; kitEnd.inPoint = 58.94;
    kitEnd.timeRemapEnabled = true;
    kitEnd.property("ADBE Time Remapping").expression = "Math.min(time - inPoint, source.duration - thisComp.frameDuration)";
    kitEnd.outPoint = DUR;
    tr(kitEnd, "ADBE Position").setValue([540, 740]);
    keys(tr(kitEnd, "ADBE Scale"), [58.94, 60.2, DUR], [[98, 98, 100], [100, 100, 100], [102, 102, 100]], 75);
    keys(tr(kitEnd, "ADBE Opacity"), [58.94, 59.30], [0, 100], 60);
    harmonize3DLayer(kitEnd, 240);

    var endScrim = addFeatheredSolid(comp, "END_Bottom_Studio_Fade", BG_C, 1210, 2100, 140, 96, 58.94, DUR);
    fadeLayer(endScrim, 58.94, DUR, 0.35, 0);
    addFeatheredSolid(comp, "TOP_Headline_Studio_Scrim", BG_C, -200, 395, 150, 88, 0, DUR);

    // Subtle Storyboard Geometric Corner Squares
    var geo = comp.layers.addShape(); geo.name = "GEO_Storyboard_Squares";
    tr(geo, "ADBE Position").setValue([540, 960]);
    addRect(geo, "TL_1", [120, 120], [-455, -875], 10, null, 0, ACC, 3);
    addRect(geo, "TL_2", [82, 82],   [-405, -825], 8,  null, 0, ACC_CYAN, 3);
    addRect(geo, "BR_1", [120, 120], [455,  875],  10, null, 0, ACC, 3);
    addRect(geo, "BR_2", [82, 82],   [405,  825],  8,  null, 0, ACC_CYAN, 3);
    tr(geo, "ADBE Opacity").setValue(45);
    setSpan(geo, 0, DUR);

    // HEADLINES (100% IFU-aligned)
    headline(comp, { t0: 0.15, t1: 4.80, y: 220, label: "i-dental · TWO PARTS. ONE BOND.", big: "i-FIX® Duo", sub: "Ciment résine adhésif à double polymérisation", size: 102, hl: ["Duo"] });
    headline(comp, { t0: 5.00, t1: 9.90, y: 210, label: "INDICATIONS CLINIQUES", big: "Scellement", sub: "Inlays, onlays, couronnes, bridges & tenons", size: 86, hl: ["Scellement"] });
    headline(comp, { t0: 10.05, t1: 15.10, y: 210, label: "PROTOCOLE IFU · ÉTAPE 1", big: "Intrados", sub: "Application automix directe dans la couronne", size: 84, hl: ["Intrados"] });
    headline(comp, { t0: 15.25, t1: 20.40, y: 210, label: "PROTOCOLE IFU · ÉTAPE 2", big: "Insertion", sub: "Assise sous pression & retrait des excès", size: 84, hl: ["Insertion"] });
    headline(comp, { t0: 20.55, t1: 25.15, y: 210, label: "ÉTAPE 3 · DOUBLE POLYMÉRISATION", big: "Dual Cure", sub: "Photopolymérisation 20–30 s  ·  Auto 3–4 min", size: 84, hl: ["Dual"] });
    headline(comp, { t0: 25.30, t1: 29.75, y: 210, label: "ADHÉSION SUPÉRIEURE", big: "Strong bond.", sub: "Dent naturelle & surface de la restauration", size: 84, hl: ["bond."] });
    headline(comp, { t0: 29.85, t1: 34.30, y: 210, label: "RÉSISTANCE À LA FLEXION", big: "115,4 MPa", sub: "Stabilité mécanique sous charges occlusales", size: 96, hl: ["115,4"] });
    headline(comp, { t0: 34.45, t1: 39.65, y: 210, label: "ÉPAISSEUR DE FILM ULTRA-FINE", big: "8,8 µm", sub: "Joint marginal étanche anti-microinfiltrations", size: 96, hl: ["8,8"] });
    headline(comp, { t0: 39.80, t1: 43.50, y: 210, label: "CONSISTANCE LISSE & CRÉMEUSE", big: "Automix 1:1", sub: "Application précise et contrôlée sans bulles", size: 86, hl: ["1:1"] });
    headline(comp, { t0: 43.65, t1: 48.05, y: 210, label: "HÉLICE STATIQUE 14 ÉTAGES", big: "Homogène", sub: "Mélange automatique avec moins de perte", size: 84, hl: ["Homogène"] });
    headline(comp, { t0: 48.20, t1: 54.00, y: 210, label: "CONTRÔLE POST-OPÉRATOIRE", big: "Radio-opaque", sub: "Évaluation nette de l'intégrité sur radiographie", size: 80, hl: ["Radio-opaque"] });
    headline(comp, { t0: 54.15, t1: 58.85, y: 210, label: "CONTENU DU COFFRET", big: "Kit Complet", sub: "Seringue 8 g + 10 Automix + 10 Intra-oraux", size: 84, hl: ["Complet"] });
    headline(comp, { t0: 59.00, t1: DUR,   y: 185, label: "i-dental · RELIABLE CARE INSIDE", big: "i-FIX® Duo", sub: "Ciment résine adhésif Automix", size: 96, hl: ["Duo"] });
    headline(comp, { t0: 59.15, t1: DUR,   y: 1255, label: "DISPONIBLE CHEZ" });

    // POP-UP CARDS (100% IFU-aligned: Step 2 shows Seating & Excess Cleanup; Step 3 shows Light Cure 10-30s / 20-30s per surface & Self Cure 3-4 min)
    POPN = 0;
    popup(comp, { t0: 1.85,  t1: 4.75,  x: 540, y: 495,  title: "Double polymérisation", sub: "Photopolymérisation + Prise chimique", hl: ["Double"], anchor: [490, 740] });
    popup(comp, { t0: 5.35,  t1: 7.80,  x: 350, y: 490,  title: "Radio-opacité", sub: "Visibilité radiographique optimale", hl: ["Radio-opacité"], anchor: [420, 760] });
    popup(comp, { t0: 8.30,  t1: 9.90,  x: 700, y: 500,  title: "Multi-indications", sub: "Inlays · Onlays · Couronnes · Bridges", hl: ["Multi-indications"] });

    // Step 1 (Scene 11_v2): Loading Crown Intaglio & Flipping over Clean Tooth Prep
    popup(comp, { t0: 10.20, t1: 12.90, x: 355, y: 510,  title: "01  Intrados couronne", sub: "Céramique · Composite · Métal", hl: ["01"], anchor: [485, 800] });
    popup(comp, { t0: 12.95, t1: 15.10, x: 540, y: 1100, title: "02  Moignon préparé", sub: "Émail & dentine mordancés + adhésif", hl: ["02"], anchor: [540, 1340] });

    // Step 2 (Scene 12_v3): Seating Restoration & Removing Excess Cement (No tack-cure claim)
    popup(comp, { t0: 15.35, t1: 17.90, x: 340, y: 510,  title: "03  Mise en place", sub: "Assise ferme sous pression constante", hl: ["03"], anchor: [520, 960] });
    popup(comp, { t0: 17.95, t1: 20.40, x: 720, y: 510,  title: "04  Retrait des excès", sub: "Élimination nette au scaler dentaire", hl: ["04"], anchor: [610, 1020] });

    // Step 3 (Scene 13): Final Polymerization — Light Cure (10-30s / 20-30s per surface IFU) + Self Cure (3-4 min IFU)
    popup(comp, { t0: 20.65, t1: 22.90, x: 320, y: 510,  title: "Light cure  10–30 s", sub: "20–30 s par face selon notice IFU", hl: ["10–30 s"], anchor: [450, 860] });
    popup(comp, { t0: 22.95, t1: 25.15, x: 730, y: 510,  title: "Self cure  3–4 min", sub: "Prise chimique dans les zones profondes", hl: ["3–4 min"], anchor: [540, 1030] });

    // Beat 6: Strong Bond
    popup(comp, { t0: 25.40, t1: 27.90, x: 360, y: 510,  title: "01  Dentine & Émail", sub: "Adhésion mécanique et chimique", hl: ["01"] });
    popup(comp, { t0: 27.60, t1: 29.75, x: 690, y: 1120, title: "02  Intrados prothétique", sub: "Scellement définitif haute rétention", hl: ["02"] });

    // Beat 7: 115,4 MPa
    popup(comp, { t0: 30.20, t1: 34.25, x: 540, y: 500,  title: "115,4 MPa", sub: "Haute résistance à la flexion", hl: ["115,4 MPa"], anchor: [620, 860] });

    // Beat 8: Base + Catalyst & 8,8 µm
    popup(comp, { t0: 34.60, t1: 37.10, x: 360, y: 510,  title: "Base + Catalyst", sub: "Seringue double corps ratio 1:1", hl: ["Base", "Catalyst"], anchor: [535, 850] });
    popup(comp, { t0: 37.15, t1: 39.65, x: 700, y: 510,  title: "Joint étanche  8,8 µm", sub: "Barrière contre les micro-infiltrations", hl: ["8,8 µm"] });

    // Beat 9: Automix 1:1
    popup(comp, { t0: 40.00, t1: 43.45, x: 540, y: 500,  title: "Verrouillage 90°", sub: "Embout automix & canule intra-orale", hl: ["90°"], anchor: [500, 830] });

    // Beat 10: Helical Mixer
    popup(comp, { t0: 43.85, t1: 48.00, x: 360, y: 510,  title: "Mélange 1:1", sub: "Sans bulles d'air ni dosage manuel", hl: ["1:1"], anchor: [520, 820] });

    // Beat 11: Radiopacity
    popup(comp, { t0: 48.40, t1: 51.20, x: 370, y: 500,  title: "Restaurations indirectes", sub: "Large éventail d'indications cliniques", hl: ["indirectes"] });
    popup(comp, { t0: 51.25, t1: 53.95, x: 690, y: 500,  title: "Diagnostic RX", sub: "Contraste radio-opaque haute définition", hl: ["RX"] });

    // Beat 12: Kit Contents
    popup(comp, { t0: 54.20, t1: 55.60, x: 540, y: 490,  title: "1×  Seringue 8 g", sub: "Double corps Automix 1:1", hl: ["1×"] });
    popup(comp, { t0: 55.60, t1: 57.15, x: 320, y: 510,  title: "×10  Automix tips", sub: "Embouts de mélange", hl: ["×10"], anchor: [425, 960] });
    popup(comp, { t0: 57.00, t1: 58.85, x: 740, y: 510,  title: "×10  Intra-oral tips", sub: "Canules fines pour tenons", hl: ["×10"], anchor: [660, 1080] });

    // END CARD
    var logo = comp.layers.add(findItem("syphax_logo_crisp.png"));
    logo.name = "END_syphax_logo";
    tr(logo, "ADBE Position").setValue([540, 1445]);
    setSpan(logo, 59.15, DUR);
    keys(tr(logo, "ADBE Scale"), [59.15, 59.85], [[38, 38, 100], [42, 42, 100]], 85);
    keys(tr(logo, "ADBE Opacity"), [59.15, 59.55], [0, 100], 60);

    var ph = addText(comp, "+216 21 33 11 82   ·   +216 52 83 11 82", { font: F_SEMI, size: 32, color: INK, pos: [540, 1665], name: "END_phone" });
    setSpan(ph, 59.55, DUR); revealText(ph, 59.55, 0.55, 16);

    var disc = addText(comp, "for professional use in dentistry only", { font: F_MED, size: 23, color: GRAY, tracking: 60, pos: [540, 1735], name: "END_disclaimer" });
    setSpan(disc, 59.80, DUR); revealText(disc, 59.80, 0.55, 12);

    // CAPTIONS
    var C = [
        [0.00,  "i-FIX Duo de i-dental,",                 ["i-FIX Duo"], 0, 1],
        [1.88,  "le ciment résine adhésif",               ["résine adhésif"]],
        [3.56,  "à double polymérisation.",               ["double polymérisation"], 1],
        [5.42,  "Radio-opaque, il est conçu",             ["Radio-opaque"], 0, 1],
        [7.06,  "pour le scellement définitif",           ["scellement définitif"]],
        [8.50,  "des inlays, onlays,",                    ["inlays", "onlays"]],
        [10.04, "couronnes et bridges",                   ["couronnes", "bridges"]],
        [11.02, "en céramique, composite ou métal",       ["céramique", "composite", "métal"]],
        [13.24, "ainsi que des tenons.",                  ["tenons"], 1],
        [15.22, "Photopolymérisation rapide",             ["Photopolymérisation"], 0, 1],
        [16.44, "de 10 à 30 secondes",                    ["10 à 30 secondes"]],
        [18.22, "et prise chimique de 3 à 4 minutes",     ["3 à 4 minutes"]],
        [20.36, "pour les zones où la lumière",           null],
        [21.44, "accède difficilement,",                  ["difficilement"]],
        [22.90, "afin de garantir",                       null],
        [23.88, "une polymérisation fiable.",             ["polymérisation fiable"], 1],
        [25.28, "Excellente adhésion",                    ["Excellente adhésion"], 0, 1],
        [26.70, "à la structure dentaire",                ["structure dentaire"]],
        [27.82, "et à la surface de la restauration,",    ["restauration"]],
        [29.84, "résistance à la flexion",                ["flexion"]],
        [31.04, "de 115,4 MPa,",                          ["115,4 MPa"]],
        [33.50, "épaisseur de film de 8,8 µm",            ["8,8 µm"]],
        [36.00, "et joint marginal fiable",               ["joint marginal"]],
        [37.80, "contre les micro-infiltrations.",        ["micro-infiltrations"], 1],
        [39.76, "Sa consistance lisse et crémeuse",       ["lisse et crémeuse"], 0, 1],
        [41.46, "permet une application précise",         ["application précise"]],
        [43.26, "et ses embouts de mélange",              ["embouts de mélange"]],
        [44.62, "assurent un mélange homogène",           ["mélange homogène"]],
        [46.08, "avec moins de perte de matériau.",       ["moins de perte"], 1],
        [48.16, "Adapté à un large éventail",             null, 0, 1],
        [49.56, "de restaurations indirectes,",           ["restaurations indirectes"]],
        [51.30, "il facilite aussi l'évaluation",         ["évaluation"]],
        [52.56, "sur les radiographies.",                 ["radiographies"], 1],
        [54.10, "Seringue de 8 grammes,",                 ["8 grammes"], 0, 1],
        [55.58, "10 embouts automix",                     ["10 embouts automix"]],
        [56.98, "et 10 embouts intra-oraux pour tenons.", ["10 embouts intra-oraux"], 1]
    ];
    var ends = { 2: 4.88, 8: 14.55, 15: 25.15, 23: 39.40, 28: 47.90, 32: 53.95, 35: 58.85 };
    for (var k = 0; k < C.length; k++) {
        var nxt = ends[k] ? ends[k] : C[k + 1][0];
        caption(comp, C[k], nxt);
    }

    var vo = comp.layers.add(findItem("ElevenLabs_2026-10-29T11_21_23__s50_v4.mp3"));
    vo.name = "VO_FR_Master"; vo.startTime = 0.0; vo.moveToEnd();
    bg.moveToEnd(); bg.locked = true;
    return comp;
}

// =====================================================================
// 2. FAST-PACED 18.0s INSTAGRAM REEL CUT (Strongest Scenes + Storyboard)
// =====================================================================
function BUILD_SHORT_REEL_18S() {
    var proj = app.project;
    var SDUR = 18.0;
    var comp = null;
    for (var i = 1; i <= proj.numItems; i++) {
        var it = proj.item(i);
        if (it instanceof CompItem && it.name == "i-FIX_Duo_Reel_Short_18s_9x16") { comp = it; break; }
    }
    if (!comp) {
        comp = proj.items.addComp("i-FIX_Duo_Reel_Short_18s_9x16", W, H, 1, SDUR, FPS);
    } else {
        comp.duration = SDUR; comp.frameRate = FPS;
        while (comp.numLayers > 0) { comp.layer(1).locked = false; comp.layer(1).remove(); }
    }
    comp.parentFolder = getFolder("00_COMPS");
    comp.bgColor = BG_E;

    var bg = comp.layers.addSolid(BG_E, "BG_gradient", W, H, 1, SDUR);
    var rp = bg.property("ADBE Effect Parade").addProperty("ADBE Ramp");
    rp.property("ADBE Ramp-0001").setValue([W / 2, 820]);
    rp.property("ADBE Ramp-0002").setValue(BG_C);
    rp.property("ADBE Ramp-0003").setValue([W / 2, 2350]);
    rp.property("ADBE Ramp-0004").setValue(BG_E);
    rp.property("ADBE Ramp-0005").setValue(2);

    // 6 High-Impact Beats across 18.0s:
    // 0.0 - 2.9s: Unboxing & Hook ("Two parts. One bond.")
    // 2.9 - 5.6s: Helical Mixer Macro ("Automix. 1:1.")
    // 5.6 - 8.6s: Clinical Step 1 IFU (Loading Crown Intaglio & Flip)
    // 8.6 - 11.6s: Clinical Step 2 IFU (Crown Seating & Scaler Excess Removal — "Strong bond.")
    // 11.6 - 14.8s: Clinical Step 3 IFU (Final Dual Cure — Light cure 20-30s | Self cure 3-4 min)
    // 14.8 - 18.0s: Full Kit & Syphax Medico Dentaire End Card
    var S18 = [
        ["Scene_02_Unboxing_Syringe_Reveal_9x16.mp4",                          0.00,  2.90, 100, [540, 1020], 0.4, 65],
        ["Scene_09_Macro_Helical_Mixer_CloseUp_9x16.mp4",                      2.90,  5.60, 100, [540,  980], 0.3, 62],
        ["Scene_11_v2_Clinical_Step1_Loading_Crown_Automix_9x16.mp4",          5.60,  8.60, 100, [540,  990], 0.2, 65],
        ["Scene_12_v3_Clinical_Step2_IFU_Seating_And_Excess_Removal_9x16.mp4", 8.60, 11.60, 100, [540,  980], 0.1, 65],
        ["Scene_13_Clinical_Step3_Full_Dual_Cure_Polymerization_9x16.mp4",    11.60, 14.80, 100, [540,  980], 0.1, 70]
    ];
    var X = 0.20;
    for (var s = 0; s < S18.length; s++) {
        var d = S18[s], item = findItem(d[0]);
        var a = d[1], b = d[2], outT = b + X;
        var L = comp.layers.add(item);
        L.name = "R18_SC0" + (s + 1) + "_" + d[0].replace("_9x16.mp4", "");
        L.stretch = d[6];
        L.startTime = a - d[5] * d[6] / 100;
        L.inPoint = a; L.outPoint = outT;
        var sc = d[3];
        tr(L, "ADBE Position").setValue(d[4]);
        keys(tr(L, "ADBE Scale"), [a, a + 0.5, outT], [[sc * 0.96, sc * 0.96, 100], [sc, sc, 100], [sc * 1.03, sc * 1.03, 100]], 75);
        var op = tr(L, "ADBE Opacity");
        if (s > 0) { op.setValueAtTime(a, 0); op.setValueAtTime(a + X, 100); }
        if (s == S18.length - 1) { op.setValueAtTime(b - 0.1, 100); op.setValueAtTime(outT, 0); }
        easeAll(op, 55);
        harmonize3DLayer(L, 240);
    }

    var kitEnd = comp.layers.add(findItem("Scene_07_Full_Kit_Outro_9x16.mp4"));
    kitEnd.name = "R18_END_SC07_Full_Kit";
    kitEnd.startTime = 14.80; kitEnd.inPoint = 14.80;
    kitEnd.timeRemapEnabled = true;
    kitEnd.property("ADBE Time Remapping").expression = "Math.min((time - inPoint)*1.5, source.duration - thisComp.frameDuration)";
    kitEnd.outPoint = SDUR;
    tr(kitEnd, "ADBE Position").setValue([540, 740]);
    keys(tr(kitEnd, "ADBE Scale"), [14.80, 15.6, SDUR], [[97, 97, 100], [100, 100, 100], [102, 102, 100]], 75);
    keys(tr(kitEnd, "ADBE Opacity"), [14.80, 15.05], [0, 100], 60);
    harmonize3DLayer(kitEnd, 240);

    var endScrim = addFeatheredSolid(comp, "R18_END_Bottom_Fade", BG_C, 1210, 2100, 140, 96, 14.80, SDUR, SDUR);
    fadeLayer(endScrim, 14.80, SDUR, 0.25, 0);
    addFeatheredSolid(comp, "R18_TOP_Scrim", BG_C, -200, 395, 150, 88, 0, SDUR, SDUR);

    var geo = comp.layers.addShape(); geo.name = "R18_GEO_Squares";
    tr(geo, "ADBE Position").setValue([540, 960]);
    addRect(geo, "TL_1", [120, 120], [-455, -875], 10, null, 0, ACC, 3);
    addRect(geo, "TL_2", [82, 82],   [-405, -825], 8,  null, 0, ACC_CYAN, 3);
    addRect(geo, "BR_1", [120, 120], [455,  875],  10, null, 0, ACC, 3);
    addRect(geo, "BR_2", [82, 82],   [405,  825],  8,  null, 0, ACC_CYAN, 3);
    tr(geo, "ADBE Opacity").setValue(45);
    setSpan(geo, 0, SDUR, SDUR);

    // Headlines for 18s Reel
    headline(comp, { t0: 0.10, t1: 2.85,  y: 210, label: "TWO PARTS. ONE BOND.", big: "i-FIX® Duo", sub: "Ciment résine adhésif double polymérisation", size: 100, hl: ["Duo"] }, SDUR);
    headline(comp, { t0: 2.95, t1: 5.55,  y: 210, label: "BASE + CATALYST · HÉLICE 14 ÉTAGES", big: "Automix 1:1", sub: "115,4 MPa  ·  Épaisseur de film 8,8 µm", size: 86, hl: ["1:1"] }, SDUR);
    headline(comp, { t0: 5.65, t1: 8.55,  y: 210, label: "PROTOCOLE IFU · ÉTAPE 1", big: "Intrados", sub: "Injection directe dans la couronne", size: 86, hl: ["Intrados"] }, SDUR);
    headline(comp, { t0: 8.65, t1: 11.55, y: 210, label: "PROTOCOLE IFU · ÉTAPE 2", big: "Strong bond.", sub: "Assise ferme & élimination des excès", size: 84, hl: ["bond."] }, SDUR);
    headline(comp, { t0: 11.65,t1: 14.75, y: 210, label: "PROTOCOLE IFU · ÉTAPE 3", big: "Dual Cure", sub: "Photopolymérisation 20–30 s  ·  Auto 3–4 min", size: 84, hl: ["Dual"] }, SDUR);
    headline(comp, { t0: 14.85,t1: SDUR,  y: 185, label: "8g SYRINGE · ×10 AUTOMIX · ×10 INTRA-ORAL", big: "i-FIX® Duo", sub: "Reliable care inside.", size: 94, hl: ["Duo"] }, SDUR);
    headline(comp, { t0: 14.95,t1: SDUR,  y: 1255, label: "DISPONIBLE CHEZ" }, SDUR);

    // Popups for 18s Reel
    POPN = 50;
    popup(comp, { t0: 0.35, t1: 2.80,  x: 540, y: 495, title: "Double polymérisation", sub: "Inlays · Onlays · Couronnes · Bridges · Tenons", hl: ["Double"], anchor: [490, 740] }, SDUR);
    popup(comp, { t0: 3.10, t1: 5.50,  x: 370, y: 505, title: "Mélange homogène 1:1", sub: "Sans bulles & moins de perte", hl: ["1:1"], anchor: [520, 820] }, SDUR);
    popup(comp, { t0: 5.80, t1: 8.50,  x: 360, y: 510, title: "01  Enduction intrados", sub: "Céramique · Composite · Métal", hl: ["01"], anchor: [485, 800] }, SDUR);
    popup(comp, { t0: 8.80, t1: 11.50, x: 700, y: 510, title: "02  Retrait des excès", sub: "Finition marginale nette au scaler", hl: ["02"], anchor: [610, 1020] }, SDUR);
    popup(comp, { t0: 11.75,t1: 14.70, x: 310, y: 510, title: "Light cure  20–30 s", sub: "Par face (notice IFU)", hl: ["20–30 s"], anchor: [450, 860] }, SDUR);
    popup(comp, { t0: 12.10,t1: 14.70, x: 755, y: 1120,title: "Self cure  3–4 min", sub: "Prise chimique profonde", hl: ["3–4 min"] }, SDUR);

    // End Card Branding on 18s Reel
    var logo = comp.layers.add(findItem("syphax_logo_crisp.png"));
    logo.name = "R18_END_syphax_logo";
    tr(logo, "ADBE Position").setValue([540, 1445]);
    setSpan(logo, 14.95, SDUR, SDUR);
    keys(tr(logo, "ADBE Scale"), [14.95, 15.45], [[38, 38, 100], [42, 42, 100]], 85);
    keys(tr(logo, "ADBE Opacity"), [14.95, 15.30], [0, 100], 60);

    var ph = addText(comp, "+216 21 33 11 82   ·   +216 52 83 11 82", { font: F_SEMI, size: 32, color: INK, pos: [540, 1665], name: "R18_END_phone" });
    setSpan(ph, 15.20, SDUR, SDUR); revealText(ph, 15.20, 0.45, 16);

    var disc = addText(comp, "for professional use in dentistry only", { font: F_MED, size: 23, color: GRAY, tracking: 60, pos: [540, 1735], name: "R18_END_disclaimer" });
    setSpan(disc, 15.35, SDUR, SDUR); revealText(disc, 15.35, 0.45, 12);

    // Synced Captions & Edited Voiceover Segments for 18s Reel:
    // Segment A (0.00 - 4.90s): VO 0.00 - 4.90s ("i-FIX Duo de i-dental, le ciment résine adhésif à double polymérisation.")
    // Segment B (5.00 - 14.80s): VO 15.22 - 25.02s ("Photopolymérisation rapide de 10 à 30 secondes et prise chimique de 3 à 4 minutes...")
    // Segment C (14.80 - 17.80s): VO 58.94 - 61.94s ("Disponible chez Syphax Medico Dentaire.")
    var voItem = findItem("ElevenLabs_2026-10-29T11_21_23__s50_v4.mp3");
    var vo1 = comp.layers.add(voItem); vo1.name = "VO_18s_Part1_Intro";
    vo1.startTime = 0.0; vo1.inPoint = 0.0; vo1.outPoint = 4.95; vo1.moveToEnd();

    var vo2 = comp.layers.add(voItem); vo2.name = "VO_18s_Part2_Clinical";
    vo2.startTime = 5.00 - 15.22; vo2.inPoint = 5.00; vo2.outPoint = 14.80; vo2.moveToEnd();

    var vo3 = comp.layers.add(voItem); vo3.name = "VO_18s_Part3_Outro";
    vo3.startTime = 14.85 - 58.94; vo3.inPoint = 14.85; vo3.outPoint = SDUR; vo3.moveToEnd();

    var C18 = [
        [0.00,  "i-FIX Duo de i-dental,",             ["i-FIX Duo"], 0],
        [1.88,  "le ciment résine adhésif",           ["résine adhésif"], 0],
        [3.56,  "à double polymérisation.",           ["double polymérisation"], 1],
        [5.00,  "Photopolymérisation rapide",         ["Photopolymérisation"], 0],
        [6.22,  "de 10 à 30 secondes",                ["10 à 30 secondes"], 0],
        [8.00,  "et prise chimique de 3 à 4 minutes", ["3 à 4 minutes"], 0],
        [10.14, "pour les zones où la lumière",       null, 0],
        [11.22, "accède difficilement,",              ["difficilement"], 0],
        [12.68, "afin de garantir",                   null, 0],
        [13.66, "une polymérisation fiable.",         ["polymérisation fiable"], 1]
    ];
    var ends18 = { 2: 4.90, 9: 14.75 };
    for (var k = 0; k < C18.length; k++) {
        var nxt = ends18[k] ? ends18[k] : C18[k + 1][0];
        caption(comp, C18[k], nxt, SDUR);
    }

    bg.moveToEnd(); bg.locked = true;
    return comp;
}

function BUILD() {
    var baseDir = "C:/Users/PC/Downloads/i-fix duo";
    var scDir = baseDir + "/01_SCENES_AFTER_EFFECTS_9x16";
    ensureImported(scDir + "/Scene_11_v2_Clinical_Step1_Loading_Crown_Automix_9x16.mp4", "01_3D_Scenes_9x16");
    ensureImported(scDir + "/Scene_12_v3_Clinical_Step2_IFU_Seating_And_Excess_Removal_9x16.mp4", "01_3D_Scenes_9x16");
    ensureImported(baseDir + "/syphax_logo_crisp.png", "03_Reference_Stills");

    var masterComp = BUILD_MASTER_63S();
    var shortComp = BUILD_SHORT_REEL_18S();
    shortComp.openInViewer();
    masterComp.openInViewer();
    return {
        masterCompId: masterComp.id,
        masterLayers: masterComp.numLayers,
        shortCompId: shortComp.id,
        shortLayers: shortComp.numLayers
    };
}
