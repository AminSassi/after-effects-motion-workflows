/**
 * @name create_cyberpunk_hud_rig.jsx
 * @description Generates a complete 60.0 fps Cyberpunk / FUI Holographic HUD Rig:
 * - Ultra-dark void background (#05070D)
 * - Central HUD Controller Null
 * - Multi-stage concentric reticle with opposing continuous rotation & dashed dials
 * - Center targeting crosshairs
 * - Monospace live telemetry stream text layer with procedural hex/GPS expressions
 * - Hologram post-processing adjustment layer with dual glow & CRT scanlines
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createCyberpunkHudRig() {
    app.beginUndoGroup("Create Cyberpunk HUD Rig");

    try {
        var compW = 1920;
        var compH = 1080;
        var fps = 60.0;
        var duration = 10.0;

        // 1. Create Composition
        var comp = app.project.items.addComp("Cyberpunk_HUD_Master", compW, compH, 1.0, duration, fps);
        comp.openInViewer();

        // 2. Void Background (#05070D -> RGB 0.020, 0.027, 0.051)
        var bgSolid = comp.layers.addSolid([0.020, 0.027, 0.051], "BG_Void", compW, compH, 1.0, duration);
        bgSolid.locked = true;

        // 3. Master Controller Null
        var masterNull = comp.layers.addNull();
        masterNull.name = "HUD_MASTER_CTRL";
        masterNull.property("Transform").property("Position").setValue([compW / 2, compH / 2]);

        // 4. Concentric HUD Reticle Shape Layer
        var hudLayer = comp.layers.addShape();
        hudLayer.name = "HUD_Concentric_Rings";
        hudLayer.parent = masterNull;

        var contents = hudLayer.property("Contents");

        // --- Ring 1: Outer Brackets (Cyan #00F0FF) ---
        var outerGroup = contents.addProperty("ADBE Vector Group");
        outerGroup.name = "Outer_Bracket_Ring";
        var outerPath = outerGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        outerPath.property("ADBE Vector Ellipse Size").setValue([720, 720]);
        var outerStroke = outerGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        outerStroke.property("ADBE Vector Stroke Color").setValue([0.0, 0.941, 1.0, 1.0]); // #00F0FF
        outerStroke.property("ADBE Vector Stroke Width").setValue(1.5);
        var outerTrim = outerGroup.property("Contents").addProperty("ADBE Vector Filter - Trim");
        outerTrim.property("ADBE Vector Trim End").setValue(75);
        outerTrim.property("ADBE Vector Trim Offset").setValue(45);
        outerGroup.property("Transform").property("Rotation").expression = "time * 12;";

        // --- Ring 2: Precision Metric Dials (White #FFFFFF Dashes) ---
        var dialGroup = contents.addProperty("ADBE Vector Group");
        dialGroup.name = "Inner_Dashed_Dial";
        var dialPath = dialGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        dialPath.property("ADBE Vector Ellipse Size").setValue([620, 620]);
        var dialStroke = dialGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        dialStroke.property("ADBE Vector Stroke Color").setValue([1.0, 1.0, 1.0, 0.7]);
        dialStroke.property("ADBE Vector Stroke Width").setValue(1.0);
        // Add dashes
        var dialDashes = dialStroke.property("ADBE Vector Stroke Dashes");
        dialDashes.addProperty("ADBE Vector Stroke Dash 1").setValue(3);
        dialDashes.addProperty("ADBE Vector Stroke Gap 1").setValue(14);
        dialGroup.property("Transform").property("Rotation").expression = "time * -18;";

        // --- Ring 3: Segmented Warning Ring (Amber #FFB300) ---
        var amberGroup = contents.addProperty("ADBE Vector Group");
        amberGroup.name = "Segmented_Amber_Ring";
        var amberPath = amberGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        amberPath.property("ADBE Vector Ellipse Size").setValue([520, 520]);
        var amberStroke = amberGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        amberStroke.property("ADBE Vector Stroke Color").setValue([1.0, 0.702, 0.0, 1.0]); // #FFB300
        amberStroke.property("ADBE Vector Stroke Width").setValue(3.0);
        var amberDashes = amberStroke.property("ADBE Vector Stroke Dashes");
        amberDashes.addProperty("ADBE Vector Stroke Dash 1").setValue(45);
        amberDashes.addProperty("ADBE Vector Stroke Gap 1").setValue(45);
        amberGroup.property("Transform").property("Rotation").expression = "time * 28;";

        // 5. Center Targeting Crosshair Shape Layer
        var crosshairLayer = comp.layers.addShape();
        crosshairLayer.name = "HUD_Center_Crosshair";
        crosshairLayer.parent = masterNull;
        var chContents = crosshairLayer.property("Contents");
        var chGroup = chContents.addProperty("ADBE Vector Group");
        chGroup.name = "Crosshair_Lines";

        var chCenter = chGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        chCenter.property("ADBE Vector Ellipse Size").setValue([24, 24]);
        var chStroke = chGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
        chStroke.property("ADBE Vector Stroke Color").setValue([0.0, 0.941, 1.0, 1.0]);
        chStroke.property("ADBE Vector Stroke Width").setValue(1.5);

        // Center reticle breathing scale expression
        crosshairLayer.property("Transform").property("Scale").expression = 
            "var s = 100 + Math.sin(time * 6) * 4;\n[s, s];";

        // 6. Monospace Telemetry Text Layer
        var telemetryLayer = comp.layers.addText("SYS_INITIALIZING...");
        telemetryLayer.name = "HUD_Live_Telemetry";
        telemetryLayer.parent = masterNull;
        telemetryLayer.property("Transform").property("Position").setValue([180, 80]);

        var telemetryExpr = 
            "var updateRate = 15;\n" +
            "var step = Math.floor(time * updateRate);\n" +
            "seedRandom(step, true);\n" +
            "var hexChars = '0123456789ABCDEF';\n" +
            "var bA = ''; var bB = '';\n" +
            "for (var i = 0; i < 4; i++) {\n" +
            "    bA += hexChars[Math.floor(random(0, 16))];\n" +
            "    bB += hexChars[Math.floor(random(0, 16))];\n" +
            "}\n" +
            "var lat = (36.8065 + random(-0.005, 0.005)).toFixed(4);\n" +
            "var lon = (10.1815 + random(-0.005, 0.005)).toFixed(4);\n" +
            "var alt = Math.floor(1840 + random(-30, 45));\n" +
            "'STATUS: [TARGET_LOCKED]\\n' +\n" +
            "'GRID: ' + lat + '°N / ' + lon + '°E\\n' +\n" +
            "'ALT : ' + alt + ' M // RAD_SEC\\n' +\n" +
            "'HASH: 0x' + bA + ' :: 0x' + bB;";
        telemetryLayer.property("Source Text").expression = telemetryExpr;

        // 7. Hologram Optical Grade Adjustment Layer
        var gradeAdj = comp.layers.addSolid([1.0, 1.0, 1.0], "GRADE_Hologram_Optics", compW, compH, 1.0, duration);
        gradeAdj.adjustmentLayer = true;

        // Add Glow effect if available
        var glow = gradeAdj.property("Effects").addProperty("ADBE Glo2");
        if (glow) {
            glow.property("ADBE Glo2-0001").setValue(65); // Threshold
            glow.property("ADBE Glo2-0002").setValue(35); // Radius
            glow.property("ADBE Glo2-0003").setValue(0.7); // Intensity
        }

        // Add Venetian Blinds for scanlines
        var blinds = gradeAdj.property("Effects").addProperty("ADBE Venetian Blinds");
        if (blinds) {
            blinds.property("ADBE Venetian Blinds-0001").setValue(15); // Transition %
            blinds.property("ADBE Venetian Blinds-0002").setValue(90); // Direction (Horizontal)
            blinds.property("ADBE Venetian Blinds-0003").setValue(4);  // Width
            blinds.property("ADBE Venetian Blinds-0004").setValue(1);  // Feather
        }

        alert("Cyberpunk HUD Rig created successfully!\nMaster composition: Cyberpunk_HUD_Master (60.0 fps).");

    } catch (err) {
        alert("Error creating Cyberpunk HUD rig: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
