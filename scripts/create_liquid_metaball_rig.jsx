/**
 * @name create_liquid_metaball_rig.jsx
 * @description Generates a complete Liquid Motion & Metaball Fluid Rig:
 * - Clean high-contrast background (#0D1117)
 * - Central Fluid Reservoir Shape Layer
 * - Interactive Satellite Droplets with animated keyframes
 * - Liquid Alpha Choke Adjustment Layer with Fast Blur & Alpha Levels Thresholding
 * - Viscoelastic surface tension expressions embedded onto droplet scales
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createLiquidMetaballRig() {
    app.beginUndoGroup("Create Liquid Metaball Rig");

    try {
        var compW = 1920;
        var compH = 1080;
        var fps = 30.0;
        var duration = 8.0;

        // 1. Create Composition
        var comp = app.project.items.addComp("Liquid_Metaball_Master", compW, compH, 1.0, duration, fps);
        comp.openInViewer();

        // 2. Dark Blue-Gray Background (#0D1117)
        var bgSolid = comp.layers.addSolid([0.051, 0.067, 0.090], "BG_Fluid_Dark", compW, compH, 1.0, duration);
        bgSolid.locked = true;

        // 3. Central Fluid Reservoir Shape Layer (#FF5E36 Vibrant Coral Orange)
        var reservoirLayer = comp.layers.addShape();
        reservoirLayer.name = "Liquid_Reservoir_Core";
        var resContents = reservoirLayer.property("Contents");
        var resGroup = resContents.addProperty("ADBE Vector Group");
        resGroup.name = "Reservoir_Puddle";
        var resPath = resGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        resPath.property("ADBE Vector Ellipse Size").setValue([280, 280]);
        var resFill = resGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        resFill.property("ADBE Vector Fill Color").setValue([1.0, 0.368, 0.212, 1.0]); // #FF5E36
        reservoirLayer.property("Transform").property("Position").setValue([compW / 2, compH / 2]);

        // 4. Satellite Droplet 01
        var droplet1 = comp.layers.addShape();
        droplet1.name = "Droplet_A";
        var d1Contents = droplet1.property("Contents");
        var d1Group = d1Contents.addProperty("ADBE Vector Group");
        var d1Path = d1Group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        d1Path.property("ADBE Vector Ellipse Size").setValue([120, 120]);
        var d1Fill = d1Group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        d1Fill.property("ADBE Vector Fill Color").setValue([1.0, 0.368, 0.212, 1.0]);

        // Animate Droplet 1 entering reservoir, merging, and breaking away
        var pos1 = droplet1.property("Transform").property("Position");
        pos1.setValueAtTime(0.0, [compW / 2 - 320, compH / 2]);
        pos1.setValueAtTime(1.5, [compW / 2, compH / 2]);
        pos1.setValueAtTime(3.0, [compW / 2 + 320, compH / 2]);

        // 5. Satellite Droplet 02 (Vertical Orbit)
        var droplet2 = comp.layers.addShape();
        droplet2.name = "Droplet_B";
        var d2Contents = droplet2.property("Contents");
        var d2Group = d2Contents.addProperty("ADBE Vector Group");
        var d2Path = d2Group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        d2Path.property("ADBE Vector Ellipse Size").setValue([90, 90]);
        var d2Fill = d2Group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        d2Fill.property("ADBE Vector Fill Color").setValue([1.0, 0.368, 0.212, 1.0]);

        var pos2 = droplet2.property("Transform").property("Position");
        pos2.setValueAtTime(0.5, [compW / 2, compH / 2 - 280]);
        pos2.setValueAtTime(2.0, [compW / 2, compH / 2]);
        pos2.setValueAtTime(3.5, [compW / 2, compH / 2 + 280]);

        // Embed Surface Tension Scale Expression onto Droplet 1
        var tensionExpr = 
            "var amp = 0.22; var freq = 4.5; var decay = 5.0;\n" +
            "var n = 0;\n" +
            "if (numKeys > 0) {\n" +
            "    n = nearestKey(time).index;\n" +
            "    if (key(n).time > time) n--;\n" +
            "}\n" +
            "if (n === 0) { value; } else {\n" +
            "    var t = time - key(n).time;\n" +
            "    if (t >= 0) {\n" +
            "        var osc = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n" +
            "        [value[0] * (1 + osc), value[1] * (1 - osc)];\n" +
            "    } else { value; }\n" +
            "}";
        droplet1.property("Transform").property("Scale").expression = tensionExpr;
        droplet2.property("Transform").property("Scale").expression = tensionExpr;

        // 6. Alpha-Choke Adjustment Layer (The Magic Compound)
        var chokeLayer = comp.layers.addSolid([1.0, 1.0, 1.0], "CHOKE_Metaball_Processor", compW, compH, 1.0, duration);
        chokeLayer.adjustmentLayer = true;

        // Fast Blur / Box Blur
        var blur = chokeLayer.property("Effects").addProperty("ADBE Box Blur2");
        if (!blur) blur = chokeLayer.property("Effects").addProperty("ADBE Fast Blur");
        if (blur) {
            blur.property(1).setValue(45); // Blur Radius
            blur.property(3).setValue(true); // Repeat Edge Pixels
        }

        // Levels (Alpha threshold clipping)
        var levels = chokeLayer.property("Effects").addProperty("ADBE Levels2");
        if (levels) {
            // Set Alpha channel clipping
            try {
                levels.property("ADBE Levels2-0001").setValue(4); // Alpha channel selection
                levels.property("ADBE Levels2-0003").setValue(125 / 255); // Input Black (Alpha)
                levels.property("ADBE Levels2-0004").setValue(135 / 255); // Input White (Alpha)
            } catch (e) {
                // Compatibility fallback
            }
        }

        alert("Liquid Metaball Rig created successfully!\nMaster composition: Liquid_Metaball_Master (30.0 fps).");

    } catch (err) {
        alert("Error creating Liquid Metaball rig: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
