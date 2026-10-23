/**
 * @name create_tv_grid_texture.jsx
 * @description Automatically generates a procedural CRT micro-dot matrix overlay
 * in the active composition to give footage and UI a high-end textured look.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createTVGridTexture() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    app.beginUndoGroup("Create TV Grid Overlay");

    try {
        var compW = comp.width;
        var compH = comp.height;
        var duration = comp.duration;

        // 1. Create Adjustment Layer
        var adjLayer = comp.layers.addSolid([1, 1, 1], "FX_CRT_Micro_Grid", compW, compH, 1.0, duration);
        adjLayer.adjustmentLayer = true;
        adjLayer.blendingMode = BlendingMode.OVERLAY;
        adjLayer.property("Transform").property("Opacity").setValue(45);

        // 2. Add Grid Effect
        var grid = adjLayer.property("Effects").addProperty("ADBE Grid");
        if (grid) {
            // Size From: 2 = Width Slider (1 = Corner Point, 2 = Width Slider, 3 = Width & Height Sliders)
            try {
                grid.property("Size From").setValue(2);
            } catch(e) {
                try { grid.property(2).setValue(2); } catch(e2) {}
            }

            // Width: 6.0
            try {
                grid.property("Width").setValue(6.0);
            } catch(e) {
                try { grid.property(3).setValue(6.0); } catch(e2) {}
            }

            // Border: 6.2
            try {
                grid.property("Border").setValue(6.2);
            } catch(e) {
                try { grid.property(5).setValue(6.2); } catch(e2) {}
            }

            // Feather: 1.0, 1.0
            try {
                grid.property("Feather").setValue([1.0, 1.0]);
            } catch(e) {
                try { grid.property(6).setValue([1.0, 1.0]); } catch(e2) {}
            }

            // Invert Grid: true (1)
            try {
                grid.property("Invert Grid").setValue(1);
            } catch(e) {
                try { grid.property(7).setValue(1); } catch(e2) {}
            }

            // Color: Black [0, 0, 0]
            try {
                grid.property("Color").setValue([0, 0, 0, 1]);
            } catch(e) {
                try { grid.property(8).setValue([0, 0, 0, 1]); } catch(e2) {}
            }
        }

        // Move to top of layer hierarchy
        adjLayer.moveToBeginning();

    } catch(err) {
        alert("Error creating TV Grid: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
