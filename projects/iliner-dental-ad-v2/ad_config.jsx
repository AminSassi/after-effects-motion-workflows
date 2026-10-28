// i-LINER (i-dental) – 58s 9:16 ad config. Reference example for BUILD_AD().
// Timings come from faster-whisper word timestamps of the ElevenLabs VO
// (scripts/transcribe_vo_words.py). Every popup/caption/cut is VO-synced.

var ROOT = "C:/Users/PC/Desktop/i-LINER_Project/";

var CFG = {
    compName: "iLINER_Ad_9x16",
    width: 1080, height: 1920, fps: 60, duration: 58,
    crossfade: 0.22,
    captionY: 1470,                       // above IG bottom UI zone (1536+)
    brand: {
        accent: [0.839, 0.090, 0.478],    // i-LINER magenta #D6177A
        ink: [0.106, 0.118, 0.149],
        gray: [0.42, 0.45, 0.50],
        bgCenter: [0.975, 0.978, 0.985],
        bgEdge: [0.855, 0.866, 0.886]
    },
    assets: {
        videosDir: ROOT + "ALL_VIDEOS",
        images: [ROOT + "ASSETS_AND_PROJECTS/syphax_logo_crisp.png"],
        vo: ROOT + "VO_AND_SCRIPT/ElevenLabs_2026-10-26T23_29_52_Anna - Audiobook Narrator_pvc_sp100_s50_sb75_v4.mp3",
        voName: "VO.mp3"
    },
    vo: "VO.mp3",

    // Script beat -> shot. Box/label shots for the intro, syringe shots for the
    // formulation, tooth cut-aways for properties / indications / usage modes.
    scenes: [
        { clip: "v3_01_box_hero_drift.mov", a: 0.00, b: 3.28, pos: [540, 1000] },
        { clip: "v3_02_box_label_macro.mov", a: 3.28, b: 6.44, pos: [540, 1000] },
        { clip: "v3_03_box_tray_slide_out.mov", a: 6.44, b: 9.48, pos: [540, 1000] },
        { clip: "04_tray_topdown_reveal.mov", a: 9.48, b: 13.88, scale: 90, pos: [540, 1010] },
        { clip: "v3_15_syringe_low_angle_hero.mov", a: 13.88, b: 17.04, pos: [540, 990] },
        { clip: "v3_06_barrel_label_slide.mov", a: 17.04, b: 20.16, pos: [540, 990] },
        { clip: "v3_25_syringe_orbit_float.mov", a: 20.16, b: 23.22, pos: [540, 1150] },
        { clip: "v3_23_tooth_layers_exploded.mov", a: 23.22, b: 27.34, pos: [540, 1000], noShadow: 1 },
        // 27.34–28.90 = typographic "Indications ?" interstitial (no footage)
        { clip: "v3_18_syringe_tip_down_application.mov", a: 28.90, b: 31.56, pos: [540, 1000], srcIn: 0.6, noShadow: 1 },
        { clip: "12a_tooth_composite.mov", a: 31.56, b: 34.56, pos: [540, 1000], noShadow: 1, brighten: 38 },
        { clip: "12b_tooth_amalgam.mov", a: 34.56, b: 36.00, pos: [540, 1000], noShadow: 1, brighten: 38 },
        { clip: "12c_tooth_porcelain.mov", a: 36.00, b: 39.78, pos: [540, 1000], noShadow: 1, brighten: 38 },
        { clip: "10_tooth_liner_floor.mov", a: 39.78, b: 45.30, pos: [540, 1000], noShadow: 1, brighten: 38 },
        { clip: "v3_11_tooth_liner_full.mov", a: 45.30, b: 51.24, pos: [540, 1000], noShadow: 1 }
    ],

    endCard: {
        a: 51.24, clip: "box_turn_30deg_60fps_alpha.mov", pos: [540, 700], scale: 42,
        label: "DISPONIBLE CHEZ", labelY: 1240,
        logo: "syphax_logo_crisp.png", logoPos: [540, 1450], logoScale: 42,
        contact: "+216 21 33 11 82   ·   +216 52 83 11 82", contactPos: [540, 1690]
    },

    headlines: [
        { t0: 0.25, t1: 3.2, y: 300, label: "i-dental", big: "i-LINER", sub: "Liner compomère photopolymérisable", size: 110 },
        { t0: 20.25, t1: 23.15, y: 300, label: "PROPRIÉTÉS", big: "Spécifiques" },
        { t0: 27.40, t1: 28.95, y: 900, label: "QUELLES SONT SES", big: "Indications ?", size: 104 }
    ],

    // y 300–440 = top zone (just under IG header). Numbered cards use hl to tint the number.
    popups: [
        { t0: 3.55, t1: 6.35, x: 540, y: 330, title: "Photopolymérisable", sub: "Matériau de fond de cavité" },
        { t0: 7.70, t1: 9.40, x: 540, y: 330, title: "Type compomère", sub: "Liner photopolymérisable" },
        { t0: 10.30, t1: 13.80, x: 540, y: 300, title: "Durabilité", sub: "Accompagne les restaurations dentaires" },
        { t0: 15.30, t1: 20.05, x: 380, y: 640, title: "Résines composites", sub: "modifiées par des polyacides" },
        { t0: 18.30, t1: 20.05, x: 700, y: 1180, title: "+ Verre ionomère", sub: "charges de verre ionomère", hl: ["+"] },
        { t0: 23.80, t1: 27.25, x: 330, y: 420, title: "Radio-opacité", sub: "Visible en radiographie" },
        { t0: 25.35, t1: 27.25, x: 730, y: 1200, title: "Dentine", sub: "Bonne interaction" },
        { t0: 29.10, t1: 31.50, x: 540, y: 330, title: "Matériau de revêtement", sub: "Sous la restauration" },
        { t0: 31.80, t1: 34.50, x: 540, y: 330, title: "01  Composites", sub: "Restaurations à base de polymères", hl: ["01"] },
        { t0: 34.62, t1: 35.98, x: 540, y: 330, title: "02  Amalgame", sub: "Sous l'amalgame", hl: ["02"] },
        { t0: 36.40, t1: 39.70, x: 540, y: 330, title: "03  Porcelaine", sub: "Selon la notice du fabricant", hl: ["03"] },
        { t0: 41.85, t1: 45.22, x: 330, y: 330, title: "1  Liner classique", sub: "Fond de la cavité uniquement", hl: ["1"] },
        { t0: 45.40, t1: 51.15, x: 540, y: 300, title: "2  Revêtement complet", sub: "Toute la cavité préparée", hl: ["2"] },
        { t0: 49.20, t1: 51.15, x: 540, y: 440, title: "Répartition des contraintes" }
    ],

    // [t0, text, highlights, endTime(only on last chunk of a run), startsRun]
    captions: [
        [0.00, "i-LINER de i-dental", ["i-LINER"], 0, 1],
        [1.88, "le liner compomère", ["compomère"]],
        [3.28, "photopolymérisable", null],
        [5.06, "un matériau de fond de cavité", ["fond de cavité"]],
        [6.44, "photopolymérisable de type compomère", ["compomère"]],
        [8.80, "développé pour accompagner", null],
        [10.20, "les restaurations dentaires", null],
        [11.44, "et contribuer à leur durabilité.", ["durabilité"]],
        [13.88, "Sa formulation associe", null],
        [15.22, "des résines composites", ["résines composites"]],
        [16.32, "modifiées par des polyacides", null],
        [17.96, "à des charges", null],
        [18.54, "de verre ionomère.", ["verre ionomère"]],
        [20.16, "Cette composition lui confère", null],
        [21.48, "des propriétés spécifiques,", null],
        [23.22, "notamment la radio-opacité", ["radio-opacité"]],
        [24.76, "et une bonne interaction", null],
        [25.86, "avec la dentine.", ["dentine"], 27.25],
        [28.90, "i-LINER est indiqué", ["i-LINER"], 0, 1],
        [30.10, "comme matériau de revêtement", null],
        [31.56, "sous les matériaux de restauration", null],
        [33.14, "à base de polymères,", ["polymères"]],
        [34.56, "sous l'amalgame", ["amalgame"]],
        [35.68, "et sous les restaurations en porcelaine,", ["porcelaine"]],
        [37.48, "conformément à la notice du fabricant.", null],
        [39.78, "Il peut être utilisé", null],
        [40.72, "de deux façons :", ["deux façons"]],
        [41.84, "comme liner classique,", ["liner classique"]],
        [43.08, "en recouvrant uniquement", null],
        [44.36, "le fond de la cavité", null],
        [45.30, "ou comme revêtement", ["revêtement"]],
        [46.54, "de l'ensemble de la cavité préparée,", null],
        [48.58, "afin de contribuer", null],
        [49.64, "à la répartition des contraintes.", ["répartition des contraintes"], 51.15]
    ]
};
