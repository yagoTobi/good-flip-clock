import { useState, useEffect } from "react";
import { FLIP_ANIMATION_MIDPOINT } from "../../constants";
import "./FlipCard.css";

function FlipCard({ value, prevValue, isFlipping, size = "normal" }) {
  // Track the displayed bottom value separately - initialize with prevValue to avoid immediate change
  const [displayedBottomValue, setDisplayedBottomValue] = useState(
    prevValue || value
  );

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
      <div className="flip-card-inner">
        {/* Top half - always shows NEW value (gets revealed during flip) */}
        <div className="flip-card-top">
          <span className="digit">{value}</span>
        </div>

        {/* Bottom half - shows OLD value until animation completes */}
        <div className="flip-card-bottom">
          <span className="digit">{displayedBottomValue}</span>
        </div>

        {/* Central divider line */}
        <div className="flip-card-divider"></div>

        {/* Animated flip card - only visible during animation */}
        {isFlipping && (
          <div className="flip-animation">
            {/* Front face - shows OLD number's top half */}
            <div className="flip-animation-front">
              <span className="digit">{prevValue}</span>
            </div>

            {/* Back face - shows NEW number's bottom half */}
            <div className="flip-animation-back">
              <span className="digit">{value}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlipCard;
