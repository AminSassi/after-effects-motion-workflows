/**
 * Apple-Style Kinetic Text Drop / Rise Expression Selector
 * 
 * Target: Text Layer -> Animator -> Expression Selector -> Amount
 * Animator Properties: Position ([0, -100] or [0, 100]), Opacity (0%)
 * Selection Mode: Based On -> Words (for titles) or Characters (for numbers/prices)
 */

var freq = 3.2;                // Spring oscillation frequency (cycles/sec)
var decay = 5.0;               // Settling friction (higher = less bounce, 4.0 - 6.5)
var staggerDelay = 0.04;       // Delay in seconds per word or character

var t = time - inPoint - (textIndex * staggerDelay);

if (t > 0) {
    100 * Math.cos(freq * t * 2 * Math.PI) / Math.exp(decay * t);
} else {
    100;
}
