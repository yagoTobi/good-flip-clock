import { MODES } from "../../constants";
import "./ModeSelector.css";

function ModeSelector({
  selectedMode,
  onModeChange,
  isTimerRunning,
  onCustomizationClick,
}) {
  return (
    <div className="mode-selector-container">
      <button
        className="customization-button"
        onClick={onCustomizationClick}
        aria-label="Open customization panel"
        title="Customize appearance"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
        </svg>
      </button>

      <div className="mode-selector">
        <div className="selector-background">
          <div
            className={`selector-slider ${
              selectedMode === MODES.TIMER ? "slider-right" : ""
            }`}
          ></div>
          <button
            className={`selector-option ${
              selectedMode === MODES.CLOCK ? "active" : ""
            }`}
            onClick={() => onModeChange(MODES.CLOCK)}
          >
            Clock
          </button>
          <button
            className={`selector-option ${
              selectedMode === MODES.TIMER ? "active" : ""
            }`}
            onClick={() => onModeChange(MODES.TIMER)}
          >
            Timer
            {isTimerRunning && <span className="timer-indicator"></span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeSelector;
