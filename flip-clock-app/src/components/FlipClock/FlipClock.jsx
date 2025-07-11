import { useState, useEffect } from "react";
import ClockDisplay from "./displays/ClockDisplay";
import TimerDisplay from "./displays/TimerDisplay";
import "./FlipClock.css";

function FlipClock({ mode, timerState, timerHours, timerMinutes, timerSeconds, onTimerComplete, onTimerUpdate }) {
  const [isFlippingMode, setIsFlippingMode] = useState(false);
  const [flipDirection, setFlipDirection] = useState("");
  const [displayMode, setDisplayMode] = useState(mode);

  // Handle mode changes with flip animation
  useEffect(() => {
    if (mode === displayMode) return;
    
    if (mode === "Clock") {
      setFlipDirection("left");
      setIsFlippingMode(true);
      setTimeout(() => setDisplayMode("Clock"), 150);
    } else {
      setFlipDirection("right");
      setIsFlippingMode(true);
      setTimeout(() => setDisplayMode("Timer"), 150);
    }
    
    const timer = setTimeout(() => {
      setIsFlippingMode(false);
      setFlipDirection("");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [mode, displayMode]);

  return (
    <div className={`flip-clock ${isFlippingMode ? `flipping-${flipDirection}` : ""}`}>
      {displayMode === "Clock" ? (
        <ClockDisplay />
      ) : (
        <TimerDisplay 
          timerState={timerState}
          timerHours={timerHours}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          onTimerComplete={onTimerComplete}
          onTimerUpdate={onTimerUpdate}
        />
      )}
    </div>
  );
}

export default FlipClock;