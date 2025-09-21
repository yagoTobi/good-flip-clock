import { useState, useEffect, useRef } from "react";
import ClockDisplay from "./displays/ClockDisplay";
import TimerDisplay from "./displays/TimerDisplay";
import PomodoroDisplay from "./displays/PomodoroDisplay";
import PomodoroSessionHeader from "../PomodoroSessionHeader/PomodoroSessionHeader";
import PomodoroSessionIndicator from "../PomodoroSessionIndicator/PomodoroSessionIndicator";
import { MODES } from "../../constants";
import "./FlipClock.css";

/**
 * FlipClock - Main clock display component with mode switching and flip animations
 *
 * This component serves as the central display for the flip clock application, handling
 * three different modes: Clock, Timer, and Pomodoro. It manages smooth flip animations
 * when switching between modes and renders the appropriate display component based on
 * the current mode.
 *
 * Animation Logic:
 * - Mode transitions trigger flip animations with directional movement (left/right)
 * - Animation timing is carefully managed with timeouts to ensure smooth transitions
 * - Flip direction is determined by the order of modes in the mode array
 *
 * Mode Switching:
 * - MODES.CLOCK: Real-time clock display
 * - MODES.TIMER: Countdown timer with controls
 * - MODES.POMODORO: Pomodoro timer with session management
 *
 * @param {Object} props - Component props
 * @param {string} props.mode - Current display mode (MODES.CLOCK, MODES.TIMER, MODES.POMODORO)
 * @param {Object} props.timer - Timer hook instance for timer mode functionality
 * @param {Object} props.pomodoroTimer - Pomodoro timer hook instance for Pomodoro mode
 * @returns {JSX.Element} Flip clock display with mode-specific content
 */
function FlipClock({ mode, timer, pomodoroTimer }) {
  const [isFlippingMode, setIsFlippingMode] = useState(false);
  const [flipDirection, setFlipDirection] = useState("");
  const [displayMode, setDisplayMode] = useState(mode);
  const timersRef = useRef({ reset: null, flip: null });

  /**
   * Handle mode changes with smooth flip animation
   *
   * This effect manages the complex animation sequence when switching between modes:
   * 1. Determines flip direction based on mode order (left for backward, right for forward)
   * 2. Clears any existing animation timers to prevent conflicts
   * 3. Triggers flip animation with proper timing sequence
   * 4. Updates display mode at the midpoint of the animation (150ms)
   * 5. Completes animation and resets state after 300ms total duration
   *
   * The animation uses CSS classes applied conditionally to create the flip effect.
   */
  useEffect(() => {
    if (mode === displayMode) return;

    // Clear any existing timers
    if (timersRef.current.reset) clearTimeout(timersRef.current.reset);
    if (timersRef.current.flip) clearTimeout(timersRef.current.flip);

    /**
     * Determine flip direction based on mode transition order
     * @param {string} fromMode - Current mode
     * @param {string} toMode - Target mode
     * @returns {string} "right" for forward transition, "left" for backward
     */
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

      // Switch display mode at animation midpoint for smooth transition
      setTimeout(() => setDisplayMode(mode), 150);

      // Complete animation and reset state
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

  /**
   * Render the appropriate display component based on current mode
   *
   * @returns {JSX.Element} The display component for the current mode
   */
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
      <PomodoroSessionHeader mode={mode} pomodoroTimer={pomodoroTimer} />
      {renderDisplay()}
      <PomodoroSessionIndicator mode={mode} pomodoroTimer={pomodoroTimer} />
    </div>
  );
}

export default FlipClock;
