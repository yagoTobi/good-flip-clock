import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FLIP_ANIMATION_MIDPOINT } from "../../constants";
import "./FlipCard.css";

/**
 * FlipCard - Individual flip card component with smooth animation transitions
 *
 * This component creates the iconic flip card animation effect for displaying changing
 * time values. It manages the complex animation sequence that shows the old value
 * flipping away to reveal the new value, creating a realistic mechanical flip effect.
 *
 * Animation Mechanics:
 * - Top half always shows the new value (gets revealed during flip)
 * - Bottom half shows old value until animation midpoint, then switches to new value
 * - Animated flip element handles the 3D rotation effect
 * - Animation timing is synchronized with FLIP_ANIMATION_MIDPOINT constant
 *
 * Theme Integration:
 * - Applies theme colors for text, background, and divider
 * - Handles different background types (solid colors, gradients, images)
 * - Maintains visual consistency across different theme configurations
 *
 * @param {Object} props - Component props
 * @param {string|number} props.value - Current value to display (new value)
 * @param {string|number} props.prevValue - Previous value for animation transition
 * @param {boolean} props.isFlipping - Whether the card is currently animating
 * @param {string} [props.size="normal"] - Card size variant ("normal", "large", etc.)
 * @returns {JSX.Element} Animated flip card displaying the time value
 */
function FlipCard({ value, prevValue, isFlipping, size = "normal" }) {
  const { clockColor, panelColor } = useTheme();

  /**
   * Track the displayed bottom value separately to control animation timing
   * Initialize with prevValue to avoid immediate change on first render
   */
  const [displayedBottomValue, setDisplayedBottomValue] = useState(
    prevValue || value
  );

  /**
   * Style for elements that need the full card appearance (animation faces)
   */
  const cardStyle = {
    color: clockColor,
    backgroundColor: panelColor,
  };

  /**
   * Background-only style applied to the static top/bottom halves.
   * The inner container is transparent so the app background shows
   * through the 4px gap between the two halves.
   */
  const panelStyle = { backgroundColor: panelColor };

  /**
   * Manage the bottom value display timing for smooth flip animation
   *
   * Animation sequence:
   * 1. When flip starts: bottom shows OLD value (prevValue)
   * 2. At animation midpoint (90°): bottom switches to NEW value
   * 3. When not flipping: immediately show current value
   *
   * This creates the illusion that the bottom half "catches up" to the top half
   * at the perfect moment during the flip animation.
   */
  useEffect(() => {
    if (isFlipping) {
      // When flip starts, ensure bottom shows the OLD value (prevValue)
      setDisplayedBottomValue(prevValue);

      // Then update to NEW value at the 90° point of the animation
      const timer = setTimeout(() => {
        setDisplayedBottomValue(value);
      }, FLIP_ANIMATION_MIDPOINT);

      return () => clearTimeout(timer);
    } else {
      // When not flipping, immediately show current value
      setDisplayedBottomValue(value);
    }
  }, [isFlipping, prevValue, value]); // Only depend on isFlipping to prevent race conditions

  return (
    <div className={`flip-card ${size} ${isFlipping ? "flipping" : ""}`}>
      {/* flip-card-inner is transparent — the 4px gap between halves reveals the app background */}
      <div className="flip-card-inner" style={{ color: clockColor }}>
        {/* Top half - always shows the NEW value.
            The animation front face covers it for the first half of the flip.
            When the front face passes 90° it disappears, naturally revealing
            the new top — no state management required. */}
        <div className="flip-card-top" style={panelStyle}>
          <span className="digit" style={{ color: clockColor }}>
            {value}
          </span>
        </div>

        {/* Bottom half - shows OLD value until animation completes */}
        <div className="flip-card-bottom" style={panelStyle}>
          <span className="digit" style={{ color: clockColor }}>
            {displayedBottomValue}
          </span>
        </div>

        {/* Animated flip card - only visible during animation */}
        {isFlipping && (
          <div className="flip-animation">
            {/* Front face - shows OLD number's top half */}
            <div className="flip-animation-front" style={cardStyle}>
              <span className="digit" style={{ color: clockColor }}>
                {prevValue}
              </span>
            </div>

            {/* Back face - shows NEW number's bottom half */}
            <div className="flip-animation-back" style={cardStyle}>
              <span className="digit" style={{ color: clockColor }}>
                {value}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlipCard;
