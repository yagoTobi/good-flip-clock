import { useState, useEffect, useRef } from "react";
import ClockDisplay from "./displays/ClockDisplay";
import TimerDisplay from "./displays/TimerDisplay";
import PomodoroDisplay from "./displays/PomodoroDisplay";
import { MODES } from "../../constants";
import "./FlipClock.css";

function FlipClock({ mode, timer, pomodoroTimer }) {
  const [isFlippingMode, setIsFlippingMode] = useState(false);
  const [flipDirection, setFlipDirection] = useState("");
  const [displayMode, setDisplayMode] = useState(mode);
  const timersRef = useRef({ reset: null, flip: null });

  // Handle mode changes with flip animation
  useEffect(() => {
    if (mode === displayMode) return;

    // Clear any existing timers
    if (timersRef.current.reset) clearTimeout(timersRef.current.reset);
    if (timersRef.current.flip) clearTimeout(timersRef.current.flip);

    // Determine flip direction based on mode transition
    const getFlipDirection = (fromMode, toMode) => {
      const modeOrder = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];
      const fromIndex = modeOrder.indexOf(fromMode);
      const toIndex = modeOrder.indexOf(toMode);
      return toIndex > fromIndex ? "right" : "left";
    };

    const newDirection = getFlipDirection(displayMode, mode);

    // Force animation retrigger by clearing state first
    setIsFlippingMode(false);
    setFlipDirection("");

    // Use a small timeout to ensure the state change is applied before starting animation
    timersRef.current.reset = setTimeout(() => {
      setFlipDirection(newDirection);
      setIsFlippingMode(true);

      setTimeout(() => setDisplayMode(mode), 150);

      timersRef.current.flip = setTimeout(() => {
        setIsFlippingMode(false);
        setFlipDirection("");
      }, 300);
    }, 10);

    return () => {
      if (timersRef.current.reset) clearTimeout(timersRef.current.reset);
      if (timersRef.current.flip) clearTimeout(timersRef.current.flip);
    };
  }, [mode, displayMode]);

  const renderDisplay = () => {
    switch (displayMode) {
      case MODES.CLOCK:
        return <ClockDisplay />;
      case MODES.TIMER:
        return <TimerDisplay timer={timer} />;
      case MODES.POMODORO:
        return <PomodoroDisplay pomodoroTimer={pomodoroTimer} />;
      default:
        return <ClockDisplay />;
    }
  };

  return (
    <div
      className={`flip-clock ${
        isFlippingMode ? `flipping-${flipDirection}` : ""
      }`}
    >
      {renderDisplay()}
    </div>
  );
}

export default FlipClock;
