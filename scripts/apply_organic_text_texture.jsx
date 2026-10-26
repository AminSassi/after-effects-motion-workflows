/**
 * apply_organic_text_texture.jsx
 * 
 * Applies the 4-effect organic ink & paper texture blending stack to selected text layers.
 * 1. Micro Edge Bleed (Turbulent Displace, Amount = 2)
 * 2. Conformal Warping (Displacement Map referencing background)
 * 3. Monochrome Surface Noise (Noise HLS, Lightness only)
 * 4. Stop-Motion Jitter (Posterize Time, 6-12 fps)
 * 
 * Usage:
 * Select one or more Text layers in After Effects, then run this script.
 */

(function applyOrganicTextTexture() {
    app.beginUndoGroup("Apply Organic Text Texture");

    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please open a composition and select a text layer.");
        return;
    }

    var sel = comp.selectedLayers;
    if (sel.length === 0) {
        alert("Please select at least one text layer.");
        return;
    }

    for (var i = 0; i < sel.length; i++) {
        var layer = sel[i];
        var effects = layer.property("ADBE Effect Parade");

        // 1. Turbulent Displace (Micro Bleed)
        var turb = effects.addProperty("ADBE Turbulent Displace");
        turb.name = "Micro_Ink_Bleed";
        turb.property("ADBE Turbulent Displace-0002").setValue(2.0); // Minimal Amount
        turb.property("ADBE Turbulent Displace-0003").setValue(15.0); // Size

        // 2. Noise HLS2 (Grain Matching)
        var noise = effects.addProperty("ADBE Noise HLS2");
        noise.name = "Paper_Fiber_Grain";
        noise.property("ADBE Noise HLS2-0002").setValue(6.0); // Lightness Noise (6%)
        noise.property("ADBE Noise HLS2-0001").setValue(1);   // Uniform
        
        // Add kinetic boiling expression to Phase
        var phaseProp = noise.property("ADBE Noise HLS2-0005");
        if (phaseProp && phaseProp.canSetExpression) {
            phaseProp.expression = "time * 100;";
        }

        // 3. Posterize Time (Decouple to stop-motion framerate)
        var posterize = effects.addProperty("ADBE Posterize Time");
        posterize.name = "Texture_FPS_Decoupler";
        posterize.property("ADBE Posterize Time-0001").setValue(8); // 8 fps analog feel
    }

    app.endUndoGroup();
})();
