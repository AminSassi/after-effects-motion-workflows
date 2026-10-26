/**
 * 3d_camera_null_chain.jsx
 * 
 * Sets up the L.A.R.P. 3D Camera & Nested 3D Null Controller hierarchy in After Effects.
 * Creates a cinematic 3D Camera with Depth of Field enabled, along with a chained sequence
 * of 3D Null Controllers for multi-stop fly-throughs without spatial gimbal lock.
 * 
 * Hierarchy generated:
 *   [Camera 1] (Unkeyed, pristine focal baseline)
 *   [Null_Stop_03] (Third camera destination)
 *      └── [Null_Stop_02] (Second camera destination)
 *             └── [Null_Stop_01] (First camera destination & Content Parent)
 */

(function setup3DCameraNullChain() {
    app.beginUndoGroup("Setup 3D Camera LARP Null Chain");

    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    var w = comp.width;
    var h = comp.height;

    // 1. Create 3D Camera with Depth of Field
    var cam = comp.layers.addCamera("Cinema_Camera_3D", [w / 2, h / 2]);
    var camOptions = cam.property("ADBE Camera Options Group");
    
    // Enable Depth of Field
    var dofProp = camOptions.property("ADBE Camera Depth of Field");
    if (dofProp) dofProp.setValue(1); // On

    // Set cinematic aperture and low f-stop
    var apertureProp = camOptions.property("ADBE Camera Aperture");
    if (apertureProp) apertureProp.setValue(90); // pixels

    var blurLevelProp = camOptions.property("ADBE Camera Blur Level");
    if (blurLevelProp) blurLevelProp.setValue(100);

    // 2. Create the Chained 3D Nulls
    var null3 = comp.layers.addNull();
    null3.name = "Null_Stop_03";
    null3.threeDLayer = true;
    null3.label = 11; // Orange

    var null2 = comp.layers.addNull();
    null2.name = "Null_Stop_02";
    null2.threeDLayer = true;
    null2.label = 11;

    var null1 = comp.layers.addNull();
    null1.name = "Null_Stop_01";
    null1.threeDLayer = true;
    null1.label = 11;

    // 3. Establish the Parenting Chain
    null1.parent = null2;
    null2.parent = null3;

    // Enable Motion Blur on Comp & Nulls
    comp.motionBlur = true;
    null1.motionBlur = true;
    null2.motionBlur = true;
    null3.motionBlur = true;

    // Center Anchor Points
    var centerPos = [w / 2, h / 2, 0];
    null1.property("ADBE Transform Group").property("ADBE Position").setValue(centerPos);
    null2.property("ADBE Transform Group").property("ADBE Position").setValue(centerPos);
    null3.property("ADBE Transform Group").property("ADBE Position").setValue(centerPos);

    app.endUndoGroup();
})();
