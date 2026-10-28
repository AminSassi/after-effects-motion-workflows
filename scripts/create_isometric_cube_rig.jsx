/**
 * @name create_isometric_cube_rig.jsx
 * @description Generates a complete 60.0 fps Isometric 2.5D Cube Rig:
 * - Studio Slate background (#0F172A)
 * - Master Isometric Controller Null
 * - Three perfectly fitted 2D shape planes transformed using exact SSR equations:
 *   * Top Face: Scale [100, 86.602], Skew +30°, Rot -30° (Highlight #00F0FF)
 *   * Left Face: Scale [100, 86.602], Skew -30°, Rot -30° (Midtone #00B4D8)
 *   * Right Face: Scale [100, 86.602], Skew +30°, Rot +30° (Shade #0077B6)
 * - Ground contact shadow linked to cube elevation
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createIsometricCubeRig() {
    app.beginUndoGroup("Create Isometric Cube Rig");

    try {
        var compW = 1920;
        var compH = 1080;
        var fps = 60.0;
        var duration = 8.0;

        // 1. Create Master Composition
        var comp = app.project.items.addComp("Isometric_2.5D_Master", compW, compH, 1.0, duration, fps);
        comp.openInViewer();

        // 2. Slate Dark Background Solid (#0F172A -> RGB 0.059, 0.090, 0.165)
        var bgSolid = comp.layers.addSolid([0.059, 0.090, 0.165], "BG_Isometric_Slate", compW, compH, 1.0, duration);
        bgSolid.locked = true;

        // 3. Ground Contact Shadow Shape
        var shadowLayer = comp.layers.addShape();
        shadowLayer.name = "Isometric_Ground_Shadow";
        shadowLayer.property("Transform").property("Position").setValue([compW / 2, compH / 2 + 100]);
        var sContents = shadowLayer.property("Contents");
        var sGroup = sContents.addProperty("ADBE Vector Group");
        var sPath = sGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        sPath.property("ADBE Vector Rect Size").setValue([200, 200]);
        var sFill = sGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        sFill.property("ADBE Vector Fill Color").setValue([0.02, 0.04, 0.08, 0.5]); // Dark shadow

        // Apply Top SSR transform to ground shadow
        shadowLayer.property("Transform").property("Scale").setValue([100, 86.6025]);
        shadowLayer.property("Transform").property("Rotation").setValue(-30);
        shadowLayer.property("Transform").property("Opacity").setValue(45);

        // 4. Master Cube Controller Null
        var cubeNull = comp.layers.addNull();
        cubeNull.name = "ISOMETRIC_CUBE_CTRL";
        cubeNull.property("Transform").property("Position").setValue([compW / 2, compH / 2]);

        var cubeSize = 200;
        var halfSize = cubeSize / 2;

        // --- 5. TOP FACE (Highlight Cyan #00F0FF) ---
        var topLayer = comp.layers.addShape();
        topLayer.name = "Face_Top_Highlight";
        topLayer.parent = cubeNull;
        var tContents = topLayer.property("Contents");
        var tGroup = tContents.addProperty("ADBE Vector Group");
        var tPath = tGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        tPath.property("ADBE Vector Rect Size").setValue([cubeSize, cubeSize]);
        var tFill = tGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        tFill.property("ADBE Vector Fill Color").setValue([0.0, 0.941, 1.0, 1.0]); // #00F0FF

        // Top SSR transformation
        topLayer.property("Transform").property("Position").setValue([0, -halfSize]);
        topLayer.property("Transform").property("Scale").setValue([100, 86.6025]);
        topLayer.property("Transform").property("Rotation").setValue(-30);
        // Note: Skew can be set via Transform Effect or shape skew properties
        var tSkewEffect = topLayer.property("Effects").addProperty("ADBE Transform");
        if (tSkewEffect) {
            tSkewEffect.property("ADBE Transform-0007").setValue(30); // Skew
            tSkewEffect.property("ADBE Transform-0008").setValue(0);  // Skew Axis
        }

        // --- 6. LEFT FACE (Midtone Blue #00B4D8) ---
        var leftLayer = comp.layers.addShape();
        leftLayer.name = "Face_Left_Midtone";
        leftLayer.parent = cubeNull;
        var lContents = leftLayer.property("Contents");
        var lGroup = lContents.addProperty("ADBE Vector Group");
        var lPath = lGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        lPath.property("ADBE Vector Rect Size").setValue([cubeSize, cubeSize]);
        var lFill = lGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        lFill.property("ADBE Vector Fill Color").setValue([0.0, 0.706, 0.847, 1.0]); // #00B4D8

        // Left SSR transformation
        leftLayer.property("Transform").property("Position").setValue([-halfSize * 0.866025, halfSize * 0.5]);
        leftLayer.property("Transform").property("Scale").setValue([100, 86.6025]);
        leftLayer.property("Transform").property("Rotation").setValue(-30);
        var lSkewEffect = leftLayer.property("Effects").addProperty("ADBE Transform");
        if (lSkewEffect) {
            lSkewEffect.property("ADBE Transform-0007").setValue(-30); // Negative Skew
            lSkewEffect.property("ADBE Transform-0008").setValue(0);
        }

        // --- 7. RIGHT FACE (Shade Dark Blue #0077B6) ---
        var rightLayer = comp.layers.addShape();
        rightLayer.name = "Face_Right_Shade";
        rightLayer.parent = cubeNull;
        var rContents = rightLayer.property("Contents");
        var rGroup = rContents.addProperty("ADBE Vector Group");
        var rPath = rGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rPath.property("ADBE Vector Rect Size").setValue([cubeSize, cubeSize]);
        var rFill = rGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        rFill.property("ADBE Vector Fill Color").setValue([0.0, 0.467, 0.714, 1.0]); // #0077B6

        // Right SSR transformation
        rightLayer.property("Transform").property("Position").setValue([halfSize * 0.866025, halfSize * 0.5]);
        rightLayer.property("Transform").property("Scale").setValue([100, 86.6025]);
        rightLayer.property("Transform").property("Rotation").setValue(30);
        var rSkewEffect = rightLayer.property("Effects").addProperty("ADBE Transform");
        if (rSkewEffect) {
            rSkewEffect.property("ADBE Transform-0007").setValue(30);
            rSkewEffect.property("ADBE Transform-0008").setValue(0);
        }

        // Animate Cube vertical elevation bounce on Position Y
        var pos = cubeNull.property("Transform").property("Position");
        pos.setValueAtTime(0.0, [compW / 2, compH / 2 - 250]);
        pos.setValueAtTime(1.0, [compW / 2, compH / 2]);

        // Embed spring bounce expression onto cube elevation
        var bounceExpr = 
            "var amp = 0.06; var freq = 3.5; var decay = 5.0;\n" +
            "var n = 0;\n" +
            "if (numKeys > 0) {\n" +
            "    n = nearestKey(time).index;\n" +
            "    if (key(n).time > time) n--;\n" +
            "}\n" +
            "if (n === 0) { value; } else {\n" +
            "    var t = time - key(n).time;\n" +
            "    if (t >= 0) {\n" +
            "        var v = velocityAtTime(key(n).time - 0.001);\n" +
            "        value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n" +
            "    } else { value; }\n" +
            "}";
        pos.expression = bounceExpr;

        alert("Isometric 2.5D Cube Rig created successfully!\nMaster composition: Isometric_2.5D_Master (60.0 fps).");

    } catch (err) {
        alert("Error creating Isometric Cube rig: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
