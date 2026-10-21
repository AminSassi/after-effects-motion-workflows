/**
 * @name center_and_fit_asset.jsx
 * @description Centers selected layer(s) accurately using sourceRectAtTime and scales them within mobile safe zones.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function centerAndFitSelectedLayers() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select at least one layer to center.");
        return;
    }

    app.beginUndoGroup("Center and Fit Assets to Safe Zone");

    try {
        var compW = comp.width;
        var compH = comp.height;

        // Optical center for 9:16 mobile reels is slightly above geometric center
        var targetCenter = [compW / 2, compH * 0.48]; // approx 920px on 1920px height
        var maxAllowedWidth = compW * 0.78;           // 78% width to respect side margins

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];

            // 1. Calculate true bounding box
            var rect = layer.sourceRectAtTime(comp.time, false);
            var centerAnchor = [rect.left + rect.width / 2, rect.top + rect.height / 2];

            // 2. Set Anchor Point to true bounding center
            layer.property("Transform").property("Anchor Point").setValue(centerAnchor);

            // 3. Move to optical center
            layer.property("Transform").property("Position").setValue(targetCenter);

            // 4. Auto-scale if layer exceeds safe margins
            if (rect.width > maxAllowedWidth) {
                var currentScale = layer.property("Transform").property("Scale").value;
                var fitRatio = (maxAllowedWidth / rect.width);
                layer.property("Transform").property("Scale").setValue([
                    currentScale[0] * fitRatio,
                    currentScale[1] * fitRatio,
                    currentScale[2] || 100
                ]);
            }
        }
    } catch(err) {
        alert("Error fitting layer: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
