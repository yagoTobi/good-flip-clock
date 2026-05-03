import { useState, useLayoutEffect, useRef, memo } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FLIP_ANIMATION_MIDPOINT } from "../../constants";
import "./FlipCard.css";

function FlipCardInner({ value, prevValue, isFlipping, size = "normal" }) {
  const { clockColor, panelColor } = useTheme();
  const [displayedBottomValue, setDisplayedBottomValue] = useState(
    prevValue || value
  );
  const flipRef = useRef(null);
  const animRef = useRef(null);
  const [animVisible, setAnimVisible] = useState(false);

  useLayoutEffect(() => {
    if (isFlipping) {
      setDisplayedBottomValue(prevValue);
      setAnimVisible(true);

      const el = flipRef.current;
      if (el) {
        if (animRef.current) animRef.current.cancel();

        animRef.current = el.animate(
          [
            { transform: "rotateX(0deg)" },
            { transform: "rotateX(-180deg)" },
          ],
          { duration: 600, easing: "ease-in-out", fill: "forwards" }
        );

        animRef.current.onfinish = () => {
          setAnimVisible(false);
          animRef.current = null;
        };
      }

      const timer = setTimeout(() => {
        setDisplayedBottomValue(value);
      }, FLIP_ANIMATION_MIDPOINT);

      return () => clearTimeout(timer);
    } else {
      setDisplayedBottomValue(value);
    }
  }, [isFlipping, prevValue, value]);

  const cardStyle = { color: clockColor, backgroundColor: panelColor };
  const panelStyle = { backgroundColor: panelColor };

  return (
    <div className={`flip-card ${size}`}>
      <div className="flip-card-inner" style={{ color: clockColor, perspective: "1000px" }}>
        <div className="flip-card-top" style={panelStyle}>
          <span className="digit" style={{ color: clockColor }}>
            {value}
          </span>
        </div>

        <div className="flip-card-bottom" style={panelStyle}>
          <span className="digit" style={{ color: clockColor }}>
            {displayedBottomValue}
          </span>
        </div>

        <div ref={flipRef} className="flip-animation" style={{ visibility: animVisible ? "visible" : "hidden" }}>
          <div className="flip-animation-front" style={cardStyle}>
            <span className="digit" style={{ color: clockColor }}>
              {prevValue}
            </span>
          </div>
          <div className="flip-animation-back" style={cardStyle}>
            <span className="digit" style={{ color: clockColor }}>
              {value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const FlipCard = memo(FlipCardInner);
export default FlipCard;
