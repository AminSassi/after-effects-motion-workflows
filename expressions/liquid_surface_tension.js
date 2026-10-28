/**
 * @name liquid_surface_tension.js
 * @description Simulates viscoelastic volume-conserving surface tension oscillation for liquid droplets.
 * When keyframed (e.g. on impact, detachment, or scale-up), it squashes horizontally while stretching vertically.
 *
 * Apply to the "Scale" property of any fluid droplet shape layer.
 *
 * Authored for After Effects Motion Workflows by Amin Sassi.
 */

var amp = 0.22;       // Amplitude of oscillation (22% deformation)
var freq = 4.5;       // Oscillation speed (4.5 cycles per sec)
var decay = 5.0;      // Damping decay rate

var n = 0;
if (numKeys > 0) {
    n = nearestKey(time).index;
    if (key(n).time > time) n--;
}

if (n === 0) {
    value;
} else {
    var t = time - key(n).time;
    if (t >= 0) {
        // Asymmetric harmonic oscillation: X expands while Y compresses
        var oscillation = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);
        var scaleX = value[0] * (1 + oscillation);
        var scaleY = value[1] * (1 - oscillation);
        [scaleX, scaleY];
    } else {
        value;
    }
}
