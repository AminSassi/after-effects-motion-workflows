/**
 * Tactile Paper Curl & Synchronized Shadow Flutter
 * 
 * Based on the Ars Active 5 aesthetic.
 * 
 * Target 1: CC Page Turn -> Fold Position
 * Target 2: Bezier Warp -> Matching Corner Vertex (e.g. Bottom Right Vertex) on Shadow Layer
 */

// Synchronized Wiggle Parameter:
// Keep freq and amp identical between CC Page Turn and Bezier Warp so shadow tracks curl perfectly
var flutterFreq = 5.0;  // Oscillation speed (cycles per second)
var flutterAmp = 180.0; // Distance of corner curl variation in pixels

wiggle(flutterFreq, flutterAmp);

// -------------------------------------------------------------
// For the precomposed paper card (Anchor at opposite corner):
// Target: Transform -> Rotation
// -------------------------------------------------------------
// wiggle(2.0, 1.5); // Subtle organic floating drift
