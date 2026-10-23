/**
 * Secondary Follower Delay using valueAtTime()
 * 
 * Target: Any Transform property (Position, Scale, Rotation) on a child or secondary layer.
 * Purpose: Makes child assets (e.g. icon inside a button, badge on a card) dynamically
 *          lag behind their parent with organic physical inertia without keyframing.
 */

// Target layer to follow
var leaderLayer = thisComp.layer("Circle_Button"); // Replace with leader layer name

// Offset duration in seconds (0.05s to 0.1s is ideal for 60fps)
var delaySeconds = 0.08;

// Follow the leader property with time lag
leaderLayer.transform.scale.valueAtTime(time - delaySeconds);
