/**
 * Organic Exposure Strobe / Shutter Flicker
 * 
 * Target: Exposure Property on an Exposure Effect (ADBE Exposure2)
 * Usage: Alt-click stopwatch on Exposure.
 */

// Controls frequency (flashes per second) and amplitude (EV brightness shift)
var freq = 10;   // Recommended: 8 - 12 for organic flicker, 18 - 24 for heavy strobe
var amp = 0.3;   // Recommended: 0.15 - 0.35 for subtle cinematic texture

wiggle(freq, amp);
