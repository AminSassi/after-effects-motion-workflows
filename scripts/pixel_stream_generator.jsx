/**
 * pixel_stream_generator.jsx
 * 
 * Generates an automated Kinetic Pixel Stream in After Effects.
 * Draws an animated stroke path with Trim Paths, Turbulent Displace, and Mosaic,
 * converting smooth vector lines into retro-futuristic digital pixel trails.
 * 
 * Usage:
 * Select an active composition, run this script via File -> Scripts -> Run Script File,
 * or execute via After Effects MCP / ExtendScript automation.
 */

(function createPixelStream() {
    app.beginUndoGroup("Generate Pixel Stream");

    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select or open an active composition first.");
        return;
    }

    var fps = comp.frameRate;
    var durationFrames = 18; // duration of the zip

    // 1. Create Shape Layer
    var shapeLayer = comp.layers.addShape();
    shapeLayer.name = "Kinetic_Pixel_Stream";

    // 2. Add Shape Path
    var contents = shapeLayer.property("ADBE Root Vectors Group");
    var shapeGroup = contents.addProperty("ADBE Vector Group");
    shapeGroup.name = "Pixel_Path_Group";
    
    var groupContents = shapeGroup.property("ADBE Vectors Group");
    var pathProp = groupContents.addProperty("ADBE Vector Shape - Group");
    
    // Draw default diagonal leading line (comp relative)
    var myShape = new Shape();
    var startPt = [-300, 200];
    var midPt = [0, -50];
    var endPt = [350, -250];
    myShape.vertices = [startPt, midPt, endPt];
    myShape.inTangents = [[0, 0], [-100, 80], [-80, 50]];
    myShape.outTangents = [[80, -50], [100, -80], [0, 0]];
    myShape.closed = false;
    pathProp.property("ADBE Vector Shape").setValue(myShape);

    // 3. Add Stroke (Brand Accent Color)
    var strokeProp = groupContents.addProperty("ADBE Vector Graphic - Stroke");
    strokeProp.property("ADBE Vector Stroke Color").setValue([1.0, 0.2, 0.2, 1.0]); // Accent Red / Coral
    strokeProp.property("ADBE Vector Stroke Width").setValue(12); // Pixel thickness
    strokeProp.property("ADBE Vector Stroke Line Cap").setValue(2); // Round Cap

    // 4. Add Trim Paths
    var trimProp = groupContents.addProperty("ADBE Vector Filter - Trim");
    var curTime = comp.time;
    var startTime = curTime;
    var endTime = curTime + (durationFrames / fps);

    // Animate End: 0% -> 100%
    var endVal = trimProp.property("ADBE Vector Trim End");
    endVal.setValueAtTime(startTime, 0);
    endVal.setValueAtTime(startTime + (14 / fps), 100);

    // Animate Start: 0% -> 100% (delayed by 4 frames)
    var startVal = trimProp.property("ADBE Vector Trim Start");
    startVal.setValueAtTime(startTime + (4 / fps), 0);
    startVal.setValueAtTime(endTime, 100);

    // Apply Easy Ease to Trim Paths
    var easeIn = new KeyframeEase(0, 75);
    var easeOut = new KeyframeEase(0, 75);
    for (var i = 1; i <= endVal.numKeys; i++) {
        endVal.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
    }
    for (var j = 1; j <= startVal.numKeys; j++) {
        startVal.setTemporalEaseAtKey(j, [easeIn], [easeOut]);
    }

    // 5. Add The Pixelizer Stack (Turbulent Displace + Mosaic)
    var effectsGroup = shapeLayer.property("ADBE Effect Parade");
    
    // Turbulent Displace
    var turbEffect = effectsGroup.addProperty("ADBE Turbulent Displace");
    turbEffect.property("ADBE Turbulent Displace-0002").setValue(25); // Amount
    turbEffect.property("ADBE Turbulent Displace-0003").setValue(15); // Size

    // Mosaic
    var mosaicEffect = effectsGroup.addProperty("ADBE Mosaic");
    mosaicEffect.property("ADBE Mosaic-0001").setValue(120); // Horizontal Blocks
    mosaicEffect.property("ADBE Mosaic-0002").setValue(80);  // Vertical Blocks
    mosaicEffect.property("ADBE Mosaic-0003").setValue(1);   // Sharp Colors = On

    // Enable Motion Blur
    shapeLayer.motionBlur = true;

    app.endUndoGroup();
})();
