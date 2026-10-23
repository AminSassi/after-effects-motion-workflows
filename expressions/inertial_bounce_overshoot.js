/**
 * Physics-Based Inertial Bounce / Overshoot Expression
 * 
 * Target: Position, Scale, or Rotation properties with 2+ keyframes.
 * Physics: Simulates mechanical or elastic spring recoil on the final resting keyframe.
 */

var amp = 0.05;   // Amplitude: Height / strength of the rebound bounce (0.03 - 0.08)
var freq = 4.0;   // Frequency: Speed of bouncing oscillations (3.0 - 5.0)
var decay = 7.0;  // Decay: Friction / dampening speed (higher = settles faster, 6.0 - 9.0)

var n = 0;
if (numKeys > 0) {
    n = nearestKey(time).index;
    if (key(n).time > time) {
        n--;
    }
}

if (n === 0) {
    value;
} else {
    var t = time - key(n).time;
    if (t > 0 && t < 1.5) {
        var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);
        value + v * (amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t));
    } else {
        value;
    }
}
