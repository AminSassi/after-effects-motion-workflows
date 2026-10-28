/**
 * @name apply_cel_line_boil.jsx
 * @description Automatically applies the 4-stage procedural Cel Animation & Line Boil stack
 * to all currently selected layers in the active composition:
 * 1. Posterize Time (12.0 fps "on twos")
 * 2. Roughen Edges with randomized 12fps seed evolution
 * 3. Turbulent Displace with subtle contour variance
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function applyCelLineBoil() {
    app.beginUndoGroup("Apply Cel Line Boil Stack");

    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please open a composition and select one or more layers first.");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("No layers selected. Please select at least one layer to apply Line Boil.");
            return;
        }

        var count = 0;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];

            // 1. Posterize Time (12.0 fps)
            var postTime = layer.property("Effects").addProperty("ADBE Posterize Time");
            if (postTime) {
                postTime.property("ADBE Posterize Time-0001").setValue(12.0);
            }

            // 2. Roughen Edges
            var roughen = layer.property("Effects").addProperty("ADBE Roughen Edges");
            if (roughen) {
                roughen.property("ADBE Roughen Edges-0002").setValue(4.0);  // Border
                roughen.property("ADBE Roughen Edges-0003").setValue(0.75); // Sharpness
                roughen.property("ADBE Roughen Edges-0004").setValue(45.0); // Fractal Scale

                // 12fps randomized evolution expression
                var evolProp = roughen.property("ADBE Roughen Edges-0007");
                if (evolProp) {
                    evolProp.expression = "posterizeTime(12);\nrandom(0, 1000);";
                }
            }

            // 3. Turbulent Displace (Subtle contour drift)
            var turb = layer.property("Effects").addProperty("ADBE Turbulent Displace");
            if (turb) {
                turb.property("ADBE Turbulent Displace-0002").setValue(4.0);  // Amount
                turb.property("ADBE Turbulent Displace-0003").setValue(25.0); // Size

                var turbEvol = turb.property("ADBE Turbulent Displace-0006");
                if (turbEvol) {
                    turbEvol.expression = "posterizeTime(12);\ntime * 360;";
                }
            }

            count++;
        }

        alert("Procedural Cel Line Boil stack successfully applied to " + count + " layer(s) at 12.0 fps!");

    } catch (err) {
        alert("Error applying Cel Line Boil: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
