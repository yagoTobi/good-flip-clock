import { useTheme } from "../../contexts/ThemeContext";
import "./DisplaySettings.css";

const DisplaySettings = () => {
  const { showQuote, setShowQuote } = useTheme();

  return (
    <div className="display-settings">
      <div className="display-option">
        <div className="option-info">
          <span className="option-label">Inspiring Quote</span>
          <span className="option-hint">
            Show a motivational quote at the top of the screen
          </span>
        </div>
        <button
          className={`toggle-switch ${showQuote ? "on" : ""}`}
          onClick={() => setShowQuote(!showQuote)}
          role="switch"
          aria-checked={showQuote}
          aria-label="Toggle inspiring quote"
        >
          <span className="toggle-thumb" />
        </button>
      </div>
    </div>
  );
};

export default DisplaySettings;
