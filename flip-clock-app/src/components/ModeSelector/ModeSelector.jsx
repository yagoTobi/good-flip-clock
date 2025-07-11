import "./ModeSelector.css";

function ModeSelector({ selectedMode, onModeChange, isTimerRunning }) {
  return (
    <div className="mode-selector">
      <div className="selector-background">
        <div 
          className={`selector-slider ${selectedMode === "Timer" ? "slider-right" : ""}`}
        ></div>
        <button 
          className={`selector-option ${selectedMode === "Clock" ? "active" : ""}`}
          onClick={() => onModeChange("Clock")}
        >
          Clock
        </button>
        <button 
          className={`selector-option ${selectedMode === "Timer" ? "active" : ""}`}
          onClick={() => onModeChange("Timer")}
        >
          Timer
          {isTimerRunning && <span className="timer-indicator"></span>}
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;