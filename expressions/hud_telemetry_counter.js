/**
 * @name hud_telemetry_counter.js
 * @description Generates dynamic, computational telemetry streams for Cyberpunk / Sci-Fi HUDs.
 * Includes randomized hexadecimal pairs, fluctuating GPS coordinates, and lock status.
 *
 * Apply directly to the "Source Text" property of a Text Layer.
 * Recommended Fonts: "Share Tech Mono", "JetBrains Mono", or "Consolas".
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

var updateRate = 15; // Updates 15 times per second for clean computational cadence
var step = Math.floor(time * updateRate);
seedRandom(step, true);

var hexChars = "0123456789ABCDEF";
var blockA = "";
var blockB = "";

for (var i = 0; i < 4; i++) {
    blockA += hexChars[Math.floor(random(0, 16))];
    blockB += hexChars[Math.floor(random(0, 16))];
}

// Fluctuating latitude / longitude coordinates
var baseLat = 36.8065; // Tunis coordinate base
var baseLon = 10.1815;
var latJitter = random(-0.005, 0.005);
var lonJitter = random(-0.005, 0.005);
var lat = (baseLat + latJitter).toFixed(4);
var lon = (baseLon + lonJitter).toFixed(4);

// Dynamic altitude & radar lock
var altitude = Math.floor(1840 + random(-30, 45));
var lockStatus = (random(0, 100) > 15) ? "TRK_LOCKED" : "ACQ_SEARCH";

"STATUS: [" + lockStatus + "]\n" +
"GRID: " + lat + "°N / " + lon + "°E\n" +
"ALT : " + altitude + " M // VEL: " + Math.floor(820 + random(-10, 15)) + " KM/H\n" +
"HASH: 0x" + blockA + " :: 0x" + blockB;
