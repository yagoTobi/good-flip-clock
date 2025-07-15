import { MODES } from "../../constants";
import "./ModeSelector.css";

function ModeSelector({ selectedMode, onModeChange, isTimerRunning }) {
  return (
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
  );
}

export default ModeSelector;
