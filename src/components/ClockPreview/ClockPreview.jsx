import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getFontValue } from "../../utils/fontUtils";
import "./ClockPreview.css";

const ClockPreview = () => {
  const { background, font, clockColor } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);
  const fontFamily = getFontValue(font);

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

  // Get proper flip clock colors (flip cards are always dark with white text by default)
  const getCardStyle = () => {
    return {
      fontFamily,
      color: "#ffffff", // Flip cards always have white text
      backgroundColor: "#2a2a2a", // Flip cards always have dark background
    };
  };

  return (
    <div className="clock-preview">
      <h3>Preview</h3>
      <div
        className="preview-container"
        style={{ background: getBackgroundStyle() }}
      >
        <div className="preview-clock">
          <div className="preview-card-group">
            <div className="preview-card" style={getCardStyle()}>
              {hours}
            </div>
            <div className="preview-separator">:</div>
            <div className="preview-card" style={getCardStyle()}>
              {minutes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockPreview;
