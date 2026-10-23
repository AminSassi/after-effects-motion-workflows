/**
 * @name create_shockwave_displacement.jsx
 * @description Automatically sets up a complete Shockwave Refraction & Glass Rig:
 * 1. Creates a displacement map precomp with 50% neutral gray base and expanding blurred circle stroke.
 * 2. Adds an Adjustment Layer with Displacement Map and CC Glass for realistic refraction.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createShockwaveDisplacement() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    app.beginUndoGroup("Create Shockwave Displacement Rig");

    try {
        var compW = comp.width;
        var compH = comp.height;
        var duration = comp.duration;
        var fps = comp.frameRate;

        // 1. Create the Shockwave Map Precomp
        var mapComp = app.project.items.addComp("MAP_Shockwave", compW, compH, comp.pixelAspect, duration, fps);

        // Add 50% Neutral Gray solid (#808080 - 0 displacement base)
        var graySolid = mapComp.layers.addSolid([0.5, 0.5, 0.5], "Base_Neutral_Gray_50%", compW, compH, 1.0, duration);
        graySolid.moveToEnd();

        // Add Circle Shape Layer with White Stroke
        var circleShape = mapComp.layers.addShape();
        circleShape.name = "Shockwave_Circle_Stroke";

        var shapeGroup = circleShape.property("Contents").addProperty("ADBE Vector Group");
        var ellipsePath = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
        var stroke = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");

        stroke.property("ADBE Vector Stroke Color").setValue([1, 1, 1, 1]); // Pure White
        stroke.property("ADBE Vector Stroke Width").setValue(130);           // 130px stroke

        // Center shape position
        circleShape.property("Transform").property("Position").setValue([compW / 2, compH / 2]);

        // Keyframe Ellipse Size (0 to beyond screen in ~20 frames)
        var sizeProp = ellipsePath.property("ADBE Vector Ellipse Size");
        var startTime = comp.time;
        var endTime = startTime + (20 / fps);

        sizeProp.setValueAtTime(startTime, [0, 0]);
        sizeProp.setValueAtTime(endTime, [Math.max(compW, compH) * 1.8, Math.max(compW, compH) * 1.8]);

        // Add Fast Box Blur to soften displacement
        var blur = circleShape.property("Effects").addProperty("ADBE Fast Blur");
        if (blur) {
            try { blur.property(1).setValue(30); } catch(e) {}
        }

        // 2. Add Map Comp to Master Comp & Hide Visibility
        var mapLayer = comp.layers.add(mapComp);
        mapLayer.enabled = false; // Hidden from visual render

        // 3. Create Adjustment Layer with Displacement & CC Glass
        var adjLayer = comp.layers.addSolid([1, 1, 1], "FX_Shockwave_Refraction", compW, compH, 1.0, duration);
        adjLayer.adjustmentLayer = true;

        // Add Displacement Map
        var disp = adjLayer.property("Effects").addProperty("ADBE Displacement Map");
        if (disp) {
            try {
                disp.property("Displacement Map Layer").setValue(mapLayer.index);
                disp.property("Max Horizontal Displacement").setValue(45);
                disp.property("Max Vertical Displacement").setValue(45);
            } catch(e) {
                try {
                    disp.property(1).setValue(mapLayer.index);
                    disp.property(2).setValue(45);
                    disp.property(4).setValue(45);
                } catch(e2) {}
            }
        }

        // Add CC Glass
        var glass = adjLayer.property("Effects").addProperty("CC Glass");
        if (glass) {
            try {
                glass.property("Surface").property("Bump Map").setValue(mapLayer.index);
                glass.property("Shading").property("Specular").setValue(90);
            } catch(e) {}
        }

        adjLayer.moveToBeginning();

    } catch(err) {
        alert("Error creating shockwave rig: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
