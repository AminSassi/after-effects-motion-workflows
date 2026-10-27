/**
 * @name import_and_layout_asset.jsx
 * @description Imports an asset (SVG, PNG, JPG) into the project and active comp,
 *              centers the anchor point, enables continuous rasterization (for vectors),
 *              and fits the layer within mobile 9:16 safe zones.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 *
 * Can be run interactively in AE or called programmatically by passing an absolute filePath:
 *   importAndLayoutAsset("C:/path/to/icon.svg", 400);
 */

function importAndLayoutAsset(filePath, maxDimension) {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please open or select an active composition first.");
        return null;
    }

    // Default max dimension (in pixels) for hero icons / badges
    if (!maxDimension) {
        maxDimension = 360;
    }

    var targetFile = null;
    if (filePath) {
        targetFile = new File(filePath);
    } else {
        targetFile = File.openDialog("Select vector or raster asset to import", "Footage Files:*.svg;*.png;*.jpg;*.jpeg;*.ai;*.eps;*.*");
    }

    if (!targetFile || !targetFile.exists) {
        return null;
    }

    app.beginUndoGroup("Import & Layout Motion Asset");

    try {
        // 1. Import Footage Item
        var io = new ImportOptions(targetFile);
        if (!io.canImportAs(ImportAsType.FOOTAGE)) {
            alert("File cannot be imported as footage: " + targetFile.name);
            return null;
        }
        io.importAs = ImportAsType.FOOTAGE;
        var importedFootage = app.project.importFile(io);

        // 2. Add to active comp
        var layer = comp.layers.add(importedFootage);

        // 3. Enable Continuous Rasterization (Collapse Transformations) for crisp vectors
        var isVector = /\.(svg|ai|eps)$/i.test(targetFile.name);
        if (isVector) {
            try {
                layer.collapseTransformation = true;
            } catch (e) {
                // Not all layer types support collapseTransformation
            }
        }

        // 4. Center Anchor Point dynamically
        var rect = layer.sourceRectAtTime(comp.time, false);
        var centerAnchor = [rect.left + rect.width / 2, rect.top + rect.height / 2];
        layer.property("Transform").property("Anchor Point").setValue(centerAnchor);

        // 5. Position at optical vertical center (48% of comp height for 9:16 reels)
        var opticalPos = [comp.width / 2, comp.height * 0.48];
        layer.property("Transform").property("Position").setValue(opticalPos);

        // 6. Scale proportionally to fit maxDimension
        var largestSide = Math.max(rect.width, rect.height);
        if (largestSide > 0) {
            var targetScale = (maxDimension / largestSide) * 100;
            layer.property("Transform").property("Scale").setValue([targetScale, targetScale, 100]);
        }

        return layer;
    } catch (err) {
        alert("Error during asset layout: " + err.toString());
        return null;
    } finally {
        app.endUndoGroup();
    }
}

// Execute dialog if run standalone
if (typeof $ !== "undefined" && $.fileName === (new File($.fileName)).fsName) {
    importAndLayoutAsset();
}
