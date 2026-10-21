/**
 * @name animated_gradient_overlay.jsx
 * @description Automatically creates an organic, flowing animated gradient overlay in the active composition.
 * Based on the wiggle + gaussian blur + glow + noise recipe.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createAnimatedGradientOverlay() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    app.beginUndoGroup("Create Animated Gradient Overlay");

    try {
        var compW = comp.width;
        var compH = comp.height;
        var duration = comp.duration;

        // 1. Create Dark Background Solid
        var bgSolid = comp.layers.addSolid([0.05, 0.05, 0.08], "Gradient_Base_Dark", compW, compH, 1.0, duration);
        bgSolid.moveToEnd();

        // Palette colors (Normalized 0.0 - 1.0 RGB)
        var colors = [
            { name: "Orb_Indigo",  rgb: [0.31, 0.27, 0.96], pos: [compW * 0.3, compH * 0.3] },
            { name: "Orb_Purple",  rgb: [0.58, 0.20, 0.92], pos: [compW * 0.7, compH * 0.4] },
            { name: "Orb_Cyan",    rgb: [0.02, 0.71, 0.83], pos: [compW * 0.4, compH * 0.7] },
            { name: "Orb_Magenta", rgb: [0.93, 0.25, 0.60], pos: [compW * 0.6, compH * 0.8] }
        ];

        var circleLayers = [];

        // 2. Generate Emitter Circles with wiggle(1, 50)
        for (var i = 0; i < colors.length; i++) {
            var col = colors[i];
            var shapeLayer = comp.layers.addShape();
            shapeLayer.name = col.name;

            var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
            var shapePath = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
            shapePath.property("ADBE Vector Ellipse Size").setValue([650, 650]);

            var shapeFill = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
            shapeFill.property("ADBE Vector Fill Color").setValue(col.rgb);

            shapeLayer.property("Transform").property("Position").setValue(col.pos);
            shapeLayer.property("Transform").property("Position").expression = "wiggle(1, 50);";

            // Place above base solid
            shapeLayer.moveBefore(bgSolid);
            circleLayers.push(shapeLayer);
        }

        // 3. Create Adjustment Layer with Blur, Glow, and Noise
        var adjLayer = comp.layers.addSolid([1, 1, 1], "Gradient_Master_FX", compW, compH, 1.0, duration);
        adjLayer.adjustmentLayer = true;

        // Add Gaussian Blur
        var blur = adjLayer.property("Effects").addProperty("ADBE Gaussian Blur 2");
        if (blur) {
            blur.property("ADBE Gaussian Blur 2-0001").setValue(600); // Blurriness
            blur.property("ADBE Gaussian Blur 2-0003").setValue(1);   // Repeat Edge Pixels = true
        }

        // Add Glow
        var glow = adjLayer.property("Effects").addProperty("ADBE Glo2");
        if (glow) {
            glow.property("ADBE Glo2-0001").setValue(20);  // Glow Threshold %
            glow.property("ADBE Glo2-0002").setValue(400); // Glow Radius
            glow.property("ADBE Glo2-0003").setValue(2.0); // Glow Intensity
        }

        // Add Filmic Noise
        var noise = adjLayer.property("Effects").addProperty("ADBE Noise");
        if (noise) {
            noise.property("ADBE Noise-0001").setValue(3.5); // 3.5% Noise
            noise.property("ADBE Noise-0002").setValue(0);   // Monochromatic (No color noise)
        }

        adjLayer.moveBefore(circleLayers[0]);

    } catch(err) {
        alert("Error creating gradient: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
