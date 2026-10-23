/**
 * @name create_documentary_camera_rig.jsx
 * @description Automatically generates a 15.0 fps Documentary 3D Parallax Master Setup:
 * - 15.0 fps composition for tactile archival cadence
 * - Two-node 35mm camera with Depth of Field enabled
 * - Chained 3D Camera Null Controllers (Cam_Ctrl_1 parented to Cam_Ctrl_2) for seamless multi-beat momentum
 * - Black base solid
 * - Top-level Lumetri Color grading adjustment layer
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

(function createDocumentaryCameraRig() {
    app.beginUndoGroup("Create Documentary Camera Rig");

    try {
        var compW = 1920;
        var compH = 1080;
        var fps = 15.0; // Archival documentary cadence
        var duration = 12.0;

        // 1. Create 15fps Master Composition
        var comp = app.project.items.addComp("Documentary_Parallax_Master", compW, compH, 1.0, duration, fps);
        comp.openInViewer();

        // 2. Base Black Solid (#000000)
        var bgSolid = comp.layers.addSolid([0.0, 0.0, 0.0], "BG_Solid_Black", compW, compH, 1.0, duration);
        bgSolid.locked = true;

        // 3. Create Chained 3D Camera Null Controllers
        // Parent chain: Camera -> Cam_Ctrl_1 -> Cam_Ctrl_2

        var ctrl2 = comp.layers.addNull();
        ctrl2.name = "Cam_Ctrl_2";
        ctrl2.threeDLayer = true;
        ctrl2.label = 9; // Cyan label
        ctrl2.property("Transform").property("Position").setValue([compW / 2, compH / 2, 0]);

        var ctrl1 = comp.layers.addNull();
        ctrl1.name = "Cam_Ctrl_1";
        ctrl1.threeDLayer = true;
        ctrl1.label = 9; // Cyan label
        ctrl1.property("Transform").property("Position").setValue([compW / 2, compH / 2, 0]);
        ctrl1.parent = ctrl2;

        // 4. Create Two-Node 35mm Camera
        var camera = comp.layers.addCamera("Doc_Camera_35mm", [compW / 2, compH / 2]);
        camera.property("Camera Options").property("Zoom").setValue(1777.78); // 35mm equivalent in 1080p
        camera.property("Camera Options").property("Depth of Field").setValue(1); // Enable DoF
        camera.property("Camera Options").property("Aperture").setValue(60);     // Subtle shallow DoF
        camera.parent = ctrl1;

        // 5. Create Top-level Lumetri Grading Adjustment Layer
        var gradeLayer = comp.layers.addSolid([1, 1, 1], "FX_Master_Color_Grade", compW, compH, 1.0, duration);
        gradeLayer.adjustmentLayer = true;

        var lumetri = gradeLayer.property("Effects").addProperty("ADBE Lumetri");

        // Move grade layer to top
        gradeLayer.moveToBeginning();

    } catch(err) {
        alert("Error creating documentary camera rig: " + err.toString());
    } finally {
        app.endUndoGroup();
    }
})();
