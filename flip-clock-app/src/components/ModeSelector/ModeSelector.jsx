import { useState } from "react";
import "./ModeSelector.css";

function ModeSelector() {
  const [selectedMode, setSelectedMode] = useState("Clock");

  return (
    <div className="mode-selector">
      <div className="selector-background">
        <div 
          className={`selector-slider ${selectedMode === "Timer" ? "slider-right" : ""}`}
        ></div>
        <button 
          className={`selector-option ${selectedMode === "Clock" ? "active" : ""}`}
          onClick={() => setSelectedMode("Clock")}
        >
          Clock
        </button>
        <button 
          className={`selector-option ${selectedMode === "Timer" ? "active" : ""}`}
          onClick={() => setSelectedMode("Timer")}
        >
          Timer
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;