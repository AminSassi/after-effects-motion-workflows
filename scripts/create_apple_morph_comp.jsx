/**
 * @name create_apple_morph_comp.jsx
 * @description Generates a complete 60.0 fps Apple-Style Morphing Composition:
 * - Off-white clean background (#F5F5F7)
 * - Decoupled rounded rectangle morphing frame with embedded spring bounce expression
 * - Blue action button (#0071E3) with optical centering
 * - Master Assembly Null for organic rotation tilt
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createAppleMorphComp() {
    app.beginUndoGroup("Create Apple Style Morph Comp");

    try {
        var compW = 1920;
        var compH = 1080;
        var fps = 60.0;
        var duration = 10.0;

        // 1. Create 60fps Master Composition
        var comp = app.project.items.addComp("Apple_Style_Morph_Master", compW, compH, 1.0, duration, fps);
        comp.openInViewer();

        // 2. Off-White Clean Background Solid (#F5F5F7 -> RGB 0.961, 0.961, 0.969)
        var bgSolid = comp.layers.addSolid([0.961, 0.961, 0.969], "BG_Clean_Apple", compW, compH, 1.0, duration);
        bgSolid.locked = true;

        // 3. Master Assembly Controller Null
        var masterNull = comp.layers.addNull();
        masterNull.name = "ALL_ASSEMBLY_CTRL";
        masterNull.property("Transform").property("Position").setValue([compW / 2, compH / 2]);

        // 4. Morphing Card Frame (Rounded Rectangle)
        var frameLayer = comp.layers.addShape();
        frameLayer.name = "Frame_Card";

        var frameGroup = frameLayer.property("Contents").addProperty("ADBE Vector Group");
        var rectPath = frameGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        var rectFill = frameGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");

        // Pure white card (#FFFFFF)
        rectFill.property("ADBE Vector Fill Color").setValue([1.0, 1.0, 1.0, 1.0]);

        // Decoupled initial size and 60px corner radius
        rectPath.property("ADBE Vector Rect Roundness").setValue(60);
        rectPath.property("ADBE Vector Rect Size").setValue([520, 120]);

        // Position Frame at center
        frameLayer.property("Transform").property("Position").setValue([compW / 2, compH / 2]);

        // Embed Apple Spring Bounce Expression onto Rectangle Size
        var springExpr = 
            "var amp = 0.055; var freq = 3.6; var decay = 5.2;\n" +
            "var n = 0;\n" +
            "if (numKeys > 0) {\n" +
            "    n = nearestKey(time).index;\n" +
            "    if (key(n).time > time) n--;\n" +
            "}\n" +
            "if (n === 0) { value; } else {\n" +
            "    var t = time - key(n).time;\n" +
            "    if (t > 0 && t < 1.5) {\n" +
            "        var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n" +
            "        value + v * (amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t));\n" +
            "    } else { value; }\n" +
            "}";

        try {
            rectPath.property("ADBE Vector Rect Size").expression = springExpr;
        } catch(e) {}

        // Add Soft Ambient Drop Shadow to Card
        var dropShadow = frameLayer.property("Effects").addProperty("ADBE Drop Shadow");
        if (dropShadow) {
            try {
                dropShadow.property("Shadow Color").setValue([0, 0, 0, 1]);
                dropShadow.property("Opacity").setValue(12);       // 12% subtle shadow
                dropShadow.property("Direction").setValue(90);     // Straight down
                dropShadow.property("Distance").setValue(15);
                dropShadow.property("Softness").setValue(45);
            } catch(e) {}
        }

        // 5. Apple Blue Action Button (#0071E3 -> RGB 0.0, 0.443, 0.890)
        var buttonLayer = comp.layers.addShape();
        buttonLayer.name = "Circle_Button_Blue";

        var btnGroup = buttonLayer.property("Contents").addProperty("ADBE Vector Group");
        var btnPath = btnGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        var btnFill = btnGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");

        btnFill.property("ADBE Vector Fill Color").setValue([0.0, 0.443, 0.890, 1.0]);
        btnPath.property("ADBE Vector Rect Roundness").setValue(50);
        btnPath.property("ADBE Vector Rect Size").setValue([90, 90]);

        buttonLayer.property("Transform").property("Position").setValue([compW / 2 + 190, compH / 2]);

        // Embed Spring Bounce Expression onto Button Position
        try {
            buttonLayer.property("Transform").property("Position").expression = springExpr;
        } catch(e) {}

        // 6. Parent layers to Master Assembly Controller
        frameLayer.parent = masterNull;
        buttonLayer.parent = masterNull;

        // Move layers into clean hierarchy
        buttonLayer.moveBefore(frameLayer);
        frameLayer.moveBefore(bgSolid);

    } catch(err) {
        alert("Error creating Apple Morph Comp: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
