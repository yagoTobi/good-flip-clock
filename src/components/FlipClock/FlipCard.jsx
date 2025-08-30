import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FLIP_ANIMATION_MIDPOINT } from "../../constants";
import "./FlipCard.css";

function FlipCard({ value, prevValue, isFlipping, size = "normal" }) {
  const { clockColor, panelColor, background } = useTheme();

  // Track the displayed bottom value separately - initialize with prevValue to avoid immediate change
  const [displayedBottomValue, setDisplayedBottomValue] = useState(
    prevValue || value
  );

  // Create style object for theme colors
  const cardStyle = {
    color: clockColor,
    backgroundColor: panelColor,
  };

  // Get background style for divider
  const getBackgroundStyle = () => {
    if (background === "default") {
      return "#1a1a1a";
    }

    // If it's already a CSS value (color, gradient, or image), use it directly
    if (
      background.startsWith("#") ||
      background.startsWith("linear-gradient") ||
      background.startsWith("url(")
    ) {
      return background;
    }

    // Fallback for any unrecognized values
    return "#1a1a1a";
  };

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
      <div className="flip-card-inner" style={cardStyle}>
        {/* Top half - always shows NEW value (gets revealed during flip) */}
        <div className="flip-card-top">
          <span className="digit" style={{ color: clockColor }}>
            {value}
          </span>
        </div>

        {/* Bottom half - shows OLD value until animation completes */}
        <div className="flip-card-bottom">
          <span className="digit" style={{ color: clockColor }}>
            {displayedBottomValue}
          </span>
        </div>

        {/* Central divider line */}
        <div
          className="flip-card-divider"
          style={{ background: getBackgroundStyle() }}
        ></div>

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
