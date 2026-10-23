/**
 * @name create_curved_paper_cylinder.jsx
 * @description Generates a 3D Curved Paper / Currency Rig utilizing the CC Cylinder
 * expanded-width workflow to prevent edge clipping.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createCurvedPaperCylinder() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    app.beginUndoGroup("Create Curved Paper Cylinder Rig");

    try {
        var compW = comp.width;
        var compH = comp.height;
        var duration = comp.duration;
        var fps = comp.frameRate;

        // 1. Create Inner Flat Precomp with Expanded Width (2600px) to prevent cylinder edge trimming
        var flatW = Math.round(compW * 1.35); // Expanded width
        var flatComp = app.project.items.addComp("Paper_Flat_Asset_Precomp", flatW, compH, 1.0, duration, fps);

        // Add a placeholder card shape inside flat precomp
        var shapeLayer = flatComp.layers.addShape();
        shapeLayer.name = "Placeholder_Paper_Card";

        var grp = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
        var rect = grp.property("Contents").addProperty("ADBE Vector Shape - Rect");
        var fill = grp.property("Contents").addProperty("ADBE Vector Graphic - Fill");

        rect.property("ADBE Vector Rect Size").setValue([1100, 700]);
        rect.property("ADBE Vector Rect Roundness").setValue(24);
        fill.property("ADBE Vector Fill Color").setValue([0.94, 0.94, 0.96, 1.0]);

        shapeLayer.property("Transform").property("Position").setValue([flatW / 2, compH / 2]);

        // 2. Create Outer Cylinder Precomp
        var cylComp = app.project.items.addComp("Paper_Cylinder_Rig", compW, compH, 1.0, duration, fps);
        var flatLayer = cylComp.layers.add(flatComp);

        // Apply CC Cylinder
        var ccCyl = flatLayer.property("Effects").addProperty("CC Cylinder");
        if (ccCyl) {
            try {
                ccCyl.property("Radius").setValue(95);

                var rotProp = ccCyl.property("Rotation");
                var rx = rotProp.property("Rotation X");
                var ry = rotProp.property("Rotation Y");
                var rz = rotProp.property("Rotation Z");

                var tStart = 0;
                var tEnd = 25 / fps; // 25 frames ease

                // Keyframe Rotation X
                rx.setValueAtTime(tStart, 90);
                rx.setValueAtTime(tEnd, 15);

                // Keyframe Rotation Y
                ry.setValueAtTime(tStart, 140);
                ry.setValueAtTime(tEnd, 25);

                // Keyframe Rotation Z
                rz.setValueAtTime(tStart, 25);
                rz.setValueAtTime(tEnd, -10);

            } catch(e) {}
        }

        // 3. Add Cylinder Rig to Active Master Comp as a 3D Layer
        var cylLayer = comp.layers.add(cylComp);
        cylLayer.threeDLayer = true;
        cylLayer.property("Transform").property("Position").setValue([compW / 2, compH / 2, 400]); // Placed at Z = +400 for parallax

        cylLayer.moveToBeginning();

    } catch(err) {
        alert("Error creating curved paper cylinder: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
