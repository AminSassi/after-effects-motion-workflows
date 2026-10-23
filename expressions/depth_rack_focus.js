/**
 * Dynamic Camera Auto-Focus / Rack Focus Tracking
 * 
 * Target: Camera Options -> Focus Distance (on a 3D Camera with Depth of Field enabled)
 * Purpose: Automatically keeps the 3D focus plane pinned to any moving subject layer
 *          regardless of camera movement or Z-depth shifts.
 */

var targetName = "Subject_Cutout"; // Name of target layer to keep in focus

try {
    var targetLayer = thisComp.layer(targetName);
    var camPos = toWorld([0, 0, 0]);
    var targetPos = targetLayer.toWorld(targetLayer.anchorPoint);
    length(camPos, targetPos);
} catch(e) {
    value; // Fallback to manual focus distance keyframes if layer not found
}
