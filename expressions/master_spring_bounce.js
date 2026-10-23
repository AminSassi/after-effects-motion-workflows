/**
 * Apple UI Master Spring Bounce & Inertia Expression
 * 
 * Target: Rectangle Path Size [X, Y], Layer Scale, Position, or Rotation.
 * Purpose: Provides authentic Apple-event mechanical spring rebound on resting keyframes.
 */

var amp = 0.055;  // Bounce amplitude (0.04 = tight/subtle, 0.08 = high elasticity)
var freq = 3.6;   // Oscillation speed (Apple style prefers snappy 3.5 - 4.2)
var decay = 5.2;  // Friction dampening (5.0 - 6.0 settles cleanly within 12 frames)

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
