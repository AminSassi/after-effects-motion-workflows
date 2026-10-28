/**
 * i-LINER Dental Product Ad - Instagram Reel (9:16)
 * Built for Syphax Medico Dentaire
 * Workflow standard: after-effects-motion-workflows (60fps, Apple Spring Physics)
 */

(function buildILinerReel() {
    app.beginUndoGroup("Build i-LINER Dental Reel");

    try {
        var compW = 1080;
        var compH = 1920;
        var fps = 60.0;
        var duration = 45.0;

        // Create Master Composition
        var comp = app.project.items.addComp("i-LINER_Reel_Instagram_Master", compW, compH, 1.0, duration, fps);
        comp.openInViewer();

        // 1. Clean Medical Background Solid (#F8FAFC)
        var bgSolid = comp.layers.addSolid([0.972, 0.980, 0.988], "BG_Medical_Slate", compW, compH, 1.0, duration);
        bgSolid.locked = true;

        // Radial Cyan Glow on Background
        var bgGlow = comp.layers.addSolid([0.008, 0.518, 0.780], "BG_Cyan_Aura", compW, compH, 1.0, duration);
        bgGlow.property("Transform").property("Opacity").setValue(14);
        var mask = bgGlow.Masks.addProperty("Mask");
        mask.property("maskFeather").setValue([350, 350]);

        // Helper: Spring bounce expression
        var springBounceExpr = 
            "var amp = 0.06; var freq = 3.5; var decay = 5.0;\n" +
            "var n = 0;\n" +
            "if (numKeys > 0) {\n" +
            "    n = nearestKey(time).index;\n" +
            "    if (key(n).time > time) n--;\n" +
            "}\n" +
            "if (n === 0) { value; } else {\n" +
            "    var t = time - key(n).time;\n" +
            "    if (t > 0 && t < 1.2) {\n" +
            "        var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n" +
            "        value + v * (amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t));\n" +
            "    } else { value; }\n" +
            "}";

        // Asset paths
        var assetsDir = "C:/Users/PC/Downloads/Syphax Abida/assets_ready/";
        var logoFile = new File(assetsDir + "syphax_logo.png");
        var syringeFile = new File(assetsDir + "syringe_with_tip.png");
        var boxFile = new File(assetsDir + "box_packaging.png");
        var audioFile = new File(assetsDir + "voiceover_anna_32s.mp3");

        // Import Assets
        var logoItem = logoFile.exists ? app.project.importFile(new ImportOptions(logoFile)) : null;
        var syringeItem = syringeFile.exists ? app.project.importFile(new ImportOptions(syringeFile)) : null;
        var boxItem = boxFile.exists ? app.project.importFile(new ImportOptions(boxFile)) : null;
        var audioItem = audioFile.exists ? app.project.importFile(new ImportOptions(audioFile)) : null;

        // Add Voiceover if available
        if (audioItem) {
            var audioLayer = comp.layers.add(audioItem);
            audioLayer.name = "VO_Audio_Anna";
        }

        // --- SCENE 1 : Hook & Hero Reveal (0s - 7s) ---
        var title1 = comp.layers.addText("i-LINER");
        var textProp1 = title1.property("Source Text");
        var textDoc1 = textProp1.value;
        textDoc1.fontSize = 96;
        textDoc1.fillColor = [0.059, 0.090, 0.165]; // #0F172A
        textDoc1.font = "Arial-BoldMT";
        textDoc1.justification = ParagraphJustification.CENTER_JUSTIFY;
        textProp1.setValue(textDoc1);
        title1.property("Transform").property("Position").setValue([compW / 2, 420]);
        title1.inPoint = 0;
        title1.outPoint = 7;

        var sub1 = comp.layers.addText("COMPOMÈRE PHOTOPOLYMÉRISABLE");
        var textDocSub1 = sub1.property("Source Text").value;
        textDocSub1.fontSize = 32;
        textDocSub1.fillColor = [0.008, 0.518, 0.780]; // Cyan Medical #0284C7
        textDocSub1.font = "Arial-BoldMT";
        textDocSub1.justification = ParagraphJustification.CENTER_JUSTIFY;
        sub1.property("Source Text").setValue(textDocSub1);
        sub1.property("Transform").property("Position").setValue([compW / 2, 500]);
        sub1.inPoint = 0.2;
        sub1.outPoint = 7;

        if (syringeItem) {
            var syringeLayer = comp.layers.add(syringeItem);
            syringeLayer.name = "Hero_Syringe_Scene1";
            syringeLayer.property("Transform").property("Position").setValue([compW / 2, 980]);
            syringeLayer.property("Transform").property("Scale").setValue([70, 70]);
            syringeLayer.property("Transform").property("Rotation").setValue(-20);
            syringeLayer.inPoint = 0.3;
            syringeLayer.outPoint = 7;

            var posProp = syringeLayer.property("Transform").property("Position");
            posProp.setValueAtTime(0.3, [compW / 2, 1400]);
            posProp.setValueAtTime(1.0, [compW / 2, 980]);
            try { posProp.expression = springBounceExpr; } catch(e){}
        }

        // --- SCENE 2 : Rôle & Fond de Cavité (7s - 14s) ---
        var title2 = comp.layers.addText("FOND DE CAVITÉ");
        var textDoc2 = title2.property("Source Text").value;
        textDoc2.fontSize = 68;
        textDoc2.fillColor = [0.059, 0.090, 0.165];
        textDoc2.font = "Arial-BoldMT";
        textDoc2.justification = ParagraphJustification.CENTER_JUSTIFY;
        title2.property("Source Text").setValue(textDoc2);
        title2.property("Transform").property("Position").setValue([compW / 2, 420]);
        title2.inPoint = 7;
        title2.outPoint = 14;

        var sub2 = comp.layers.addText("Protection & Durabilité des Restaurations");
        var textDocSub2 = sub2.property("Source Text").value;
        textDocSub2.fontSize = 34;
        textDocSub2.fillColor = [0.008, 0.518, 0.780];
        textDocSub2.justification = ParagraphJustification.CENTER_JUSTIFY;
        sub2.property("Source Text").setValue(textDocSub2);
        sub2.property("Transform").property("Position").setValue([compW / 2, 500]);
        sub2.inPoint = 7.2;
        sub2.outPoint = 14;

        // --- SCENE 3 : Formulation & Propriétés (14s - 22s) ---
        var title3 = comp.layers.addText("FORMULATION HYBRIDE");
        var textDoc3 = title3.property("Source Text").value;
        textDoc3.fontSize = 62;
        textDoc3.fillColor = [0.059, 0.090, 0.165];
        textDoc3.font = "Arial-BoldMT";
        textDoc3.justification = ParagraphJustification.CENTER_JUSTIFY;
        title3.property("Source Text").setValue(textDoc3);
        title3.property("Transform").property("Position").setValue([compW / 2, 400]);
        title3.inPoint = 14;
        title3.outPoint = 22;

        var badge3_1 = comp.layers.addText("• Résines Composites + Polyacides");
        var badgeDoc1 = badge3_1.property("Source Text").value;
        badgeDoc1.fontSize = 38;
        badgeDoc1.fillColor = [0.15, 0.20, 0.25];
        badgeDoc1.justification = ParagraphJustification.CENTER_JUSTIFY;
        badge3_1.property("Source Text").setValue(badgeDoc1);
        badge3_1.property("Transform").property("Position").setValue([compW / 2, 750]);
        badge3_1.inPoint = 14.5;
        badge3_1.outPoint = 22;

        var badge3_2 = comp.layers.addText("• Charges de Verre Ionomère");
        var badgeDoc2 = badge3_2.property("Source Text").value;
        badgeDoc2.fontSize = 38;
        badgeDoc2.fillColor = [0.15, 0.20, 0.25];
        badgeDoc2.justification = ParagraphJustification.CENTER_JUSTIFY;
        badge3_2.property("Source Text").setValue(badgeDoc2);
        badge3_2.property("Transform").property("Position").setValue([compW / 2, 860]);
        badge3_2.inPoint = 15.2;
        badge3_2.outPoint = 22;

        var badge3_3 = comp.layers.addText("✓ Radio-Opacité & Interaction Dentine");
        var badgeDoc3 = badge3_3.property("Source Text").value;
        badgeDoc3.fontSize = 40;
        badgeDoc3.fillColor = [0.008, 0.518, 0.780];
        badgeDoc3.font = "Arial-BoldMT";
        badgeDoc3.justification = ParagraphJustification.CENTER_JUSTIFY;
        badge3_3.property("Source Text").setValue(badgeDoc3);
        badge3_3.property("Transform").property("Position").setValue([compW / 2, 1020]);
        badge3_3.inPoint = 16.0;
        badge3_3.outPoint = 22;

        // --- SCENE 4 : Indications Cliniques (22s - 31s) ---
        var title4 = comp.layers.addText("INDICATIONS CLINIQUES");
        var textDoc4 = title4.property("Source Text").value;
        textDoc4.fontSize = 62;
        textDoc4.fillColor = [0.059, 0.090, 0.165];
        textDoc4.font = "Arial-BoldMT";
        textDoc4.justification = ParagraphJustification.CENTER_JUSTIFY;
        title4.property("Source Text").setValue(textDoc4);
        title4.property("Transform").property("Position").setValue([compW / 2, 400]);
        title4.inPoint = 22;
        title4.outPoint = 31;

        var ind1 = comp.layers.addText("1. Sous Composites & Résines");
        var docInd1 = ind1.property("Source Text").value;
        docInd1.fontSize = 36;
        docInd1.fillColor = [0.15, 0.20, 0.25];
        docInd1.justification = ParagraphJustification.CENTER_JUSTIFY;
        ind1.property("Source Text").setValue(docInd1);
        ind1.property("Transform").property("Position").setValue([compW / 2, 720]);
        ind1.inPoint = 22.5;
        ind1.outPoint = 31;

        var ind2 = comp.layers.addText("2. Sous Amalgames");
        var docInd2 = ind2.property("Source Text").value;
        docInd2.fontSize = 36;
        docInd2.fillColor = [0.15, 0.20, 0.25];
        docInd2.justification = ParagraphJustification.CENTER_JUSTIFY;
        ind2.property("Source Text").setValue(docInd2);
        ind2.property("Transform").property("Position").setValue([compW / 2, 840]);
        ind2.inPoint = 23.5;
        ind2.outPoint = 31;

        var ind3 = comp.layers.addText("3. Sous Porcelaine & Céramiques");
        var docInd3 = ind3.property("Source Text").value;
        docInd3.fontSize = 36;
        docInd3.fillColor = [0.15, 0.20, 0.25];
        docInd3.justification = ParagraphJustification.CENTER_JUSTIFY;
        ind3.property("Source Text").setValue(docInd3);
        ind3.property("Transform").property("Position").setValue([compW / 2, 960]);
        ind3.inPoint = 24.5;
        ind3.outPoint = 31;

        // --- SCENE 5 : 2 Modes d'Application (31s - 38s) ---
        var title5 = comp.layers.addText("2 MODES D'APPLICATION");
        var textDoc5 = title5.property("Source Text").value;
        textDoc5.fontSize = 62;
        textDoc5.fillColor = [0.059, 0.090, 0.165];
        textDoc5.font = "Arial-BoldMT";
        textDoc5.justification = ParagraphJustification.CENTER_JUSTIFY;
        title5.property("Source Text").setValue(textDoc5);
        title5.property("Transform").property("Position").setValue([compW / 2, 400]);
        title5.inPoint = 31;
        title5.outPoint = 38;

        var mode1 = comp.layers.addText("MODE 1 : LINER CLASSIQUE\n(Fond de cavité uniquement)");
        var docM1 = mode1.property("Source Text").value;
        docM1.fontSize = 36;
        docM1.fillColor = [0.008, 0.518, 0.780];
        docM1.font = "Arial-BoldMT";
        docM1.justification = ParagraphJustification.CENTER_JUSTIFY;
        mode1.property("Source Text").setValue(docM1);
        mode1.property("Transform").property("Position").setValue([compW / 2, 750]);
        mode1.inPoint = 31.5;
        mode1.outPoint = 38;

        var mode2 = comp.layers.addText("MODE 2 : REVÊTEMENT TOTAL\n(Répartition optimale des contraintes)");
        var docM2 = mode2.property("Source Text").value;
        docM2.fontSize = 36;
        docM2.fillColor = [0.059, 0.090, 0.165];
        docM2.font = "Arial-BoldMT";
        docM2.justification = ParagraphJustification.CENTER_JUSTIFY;
        mode2.property("Source Text").setValue(docM2);
        mode2.property("Transform").property("Position").setValue([compW / 2, 980]);
        mode2.inPoint = 33.0;
        mode2.outPoint = 38;

        // --- SCENE 6 : Outro & Syphax Medico Dentaire (38s - 45s) ---
        if (logoItem) {
            var logoLayer = comp.layers.add(logoItem);
            logoLayer.name = "Logo_Syphax";
            logoLayer.property("Transform").property("Position").setValue([compW / 2, 850]);
            logoLayer.property("Transform").property("Scale").setValue([65, 65]);
            logoLayer.inPoint = 38;
            logoLayer.outPoint = 45;

            var logoScale = logoLayer.property("Transform").property("Scale");
            logoScale.setValueAtTime(38.0, [20, 20]);
            logoScale.setValueAtTime(38.8, [65, 65]);
            try { logoScale.expression = springBounceExpr; } catch(e){}
        }

        var ctaTitle = comp.layers.addText("Disponible chez");
        var docCtaT = ctaTitle.property("Source Text").value;
        docCtaT.fontSize = 44;
        docCtaT.fillColor = [0.15, 0.20, 0.25];
        docCtaT.justification = ParagraphJustification.CENTER_JUSTIFY;
        ctaTitle.property("Source Text").setValue(docCtaT);
        ctaTitle.property("Transform").property("Position").setValue([compW / 2, 580]);
        ctaTitle.inPoint = 38;
        ctaTitle.outPoint = 45;

        var ctaSub = comp.layers.addText("Syphax Medico Dentaire");
        var docCtaS = ctaSub.property("Source Text").value;
        docCtaS.fontSize = 58;
        docCtaS.fillColor = [0.008, 0.518, 0.780];
        docCtaS.font = "Arial-BoldMT";
        docCtaS.justification = ParagraphJustification.CENTER_JUSTIFY;
        ctaSub.property("Source Text").setValue(docCtaS);
        ctaSub.property("Transform").property("Position").setValue([compW / 2, 1180]);
        ctaSub.inPoint = 38.3;
        ctaSub.outPoint = 45;

    } catch (e) {
        alert("Erreur de génération : " + e.toString());
    } finally {
        app.endUndoGroup();
    }
})();
