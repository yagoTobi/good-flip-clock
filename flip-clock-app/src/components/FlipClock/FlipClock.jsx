import { useState, useEffect } from "react";
import ClockDisplay from "./displays/ClockDisplay";
import TimerDisplay from "./displays/TimerDisplay";
import { MODES } from "../../constants";
import "./FlipClock.css";

function FlipClock({ mode, timer }) {
  const [isFlippingMode, setIsFlippingMode] = useState(false);
  const [flipDirection, setFlipDirection] = useState("");
  const [displayMode, setDisplayMode] = useState(mode);

  // Handle mode changes with flip animation
  useEffect(() => {
    if (mode === displayMode) return;

    if (mode === MODES.CLOCK) {
      setFlipDirection("left");
      setIsFlippingMode(true);
      setTimeout(() => setDisplayMode(MODES.CLOCK), 150);
    } else {
      setFlipDirection("right");
      setIsFlippingMode(true);
      setTimeout(() => setDisplayMode(MODES.TIMER), 150);
    }

    const timer = setTimeout(() => {
      setIsFlippingMode(false);
      setFlipDirection("");
    }, 300);

    return () => clearTimeout(timer);
  }, [mode, displayMode]);

  return (
    <div
      className={`flip-clock ${
        isFlippingMode ? `flipping-${flipDirection}` : ""
      }`}
    >
      {displayMode === MODES.CLOCK ? (
        <ClockDisplay />
      ) : (
        <TimerDisplay timer={timer} />
      )}
    </div>
  );
}

export default FlipClock;
