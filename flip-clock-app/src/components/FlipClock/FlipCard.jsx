import { useState, useEffect } from "react";
import "./FlipCard.css";

function FlipCard({ value, prevValue, isFlipping, size = "normal" }) {
  // Track the displayed bottom value separately
  const [displayedBottomValue, setDisplayedBottomValue] = useState(value);

  useEffect(() => {
    if (isFlipping) {
      // When flipping starts, keep showing the old value
      // Wait for animation to complete before updating
      const timer = setTimeout(() => {
        setDisplayedBottomValue(value);
      }, 600); // Match the animation duration

      return () => clearTimeout(timer);
    } else {
      // When not flipping, immediately show current value
      setDisplayedBottomValue(value);
    }
  }, [value, isFlipping]);

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
