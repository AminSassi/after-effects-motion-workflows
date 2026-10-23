/**
 * @name create_exposure_flicker.jsx
 * @description Creates an Adjustment Layer with an Exposure effect and a procedural wiggle flicker expression.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createExposureFlicker() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    app.beginUndoGroup("Create Exposure Flicker Layer");

    try {
        var compW = comp.width;
        var compH = comp.height;
        var duration = comp.duration;

        var adjLayer = comp.layers.addSolid([1, 1, 1], "FX_Exposure_Flicker", compW, compH, 1.0, duration);
        adjLayer.adjustmentLayer = true;

        var expEffect = adjLayer.property("Effects").addProperty("ADBE Exposure2");
        if (expEffect) {
            // Master Exposure property
            try {
                expEffect.property("ADBE Exposure2-0001").expression = "wiggle(10, 0.3);";
            } catch(e) {
                try {
                    expEffect.property("Master Exposure").expression = "wiggle(10, 0.3);";
                } catch(e2) {
                    try { expEffect.property(1).expression = "wiggle(10, 0.3);"; } catch(e3) {}
                }
            }
        }

        adjLayer.moveToBeginning();

    } catch(err) {
        alert("Error creating exposure flicker: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
