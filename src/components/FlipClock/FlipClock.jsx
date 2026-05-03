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
  const [displayMode, setDisplayMode] = useState(mode);
  const clockRef = useRef(null);
  const timersRef = useRef({ midpoint: null });
  const animRef = useRef(null);

  useEffect(() => {
    if (mode === displayMode) return;

    if (timersRef.current.midpoint) clearTimeout(timersRef.current.midpoint);
    if (animRef.current) animRef.current.cancel();

    const modeOrder = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];
    const fromIndex = modeOrder.indexOf(displayMode);
    const toIndex = modeOrder.indexOf(mode);

    const keyframes = [
      { transform: "scaleX(1)", opacity: 1 },
      { transform: "scaleX(0)", opacity: 0.6 },
      { transform: "scaleX(1)", opacity: 1 },
    ];

    const el = clockRef.current;
    if (el) {
      animRef.current = el.animate(keyframes, { duration: 300, easing: "ease-in-out" });
      animRef.current.onfinish = () => {
        animRef.current = null;
      };
    }

    timersRef.current.midpoint = setTimeout(() => {
      setDisplayMode(mode);
    }, 150);

    return () => {
      if (timersRef.current.midpoint) clearTimeout(timersRef.current.midpoint);
      // Don't cancel animRef here — the animation must survive the
      // re-render caused by setDisplayMode at midpoint. It's only
      // cancelled above when a *new* mode transition starts.
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

  const endAtLabel = (() => {
    if (displayMode !== MODES.TIMER || !timer.isEndAtMode || !timer.isRunning || !timer.endAtTarget) return null;
    const d = new Date(timer.endAtTarget);
    let h = d.getHours();
    const m = d.getMinutes();
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `until ${h}:${m.toString().padStart(2, "0")} ${period}`;
  })();

  return (
    <div
      ref={clockRef}
      className={`flip-clock ${mode === MODES.POMODORO ? "pomodoro-mode" : ""}`}
    >
      <PomodoroSessionHeader mode={displayMode} pomodoroTimer={pomodoroTimer} />
      {renderDisplay()}
      {endAtLabel && <div className="end-at-label">{endAtLabel}</div>}
      <PomodoroSessionIndicator mode={displayMode} pomodoroTimer={pomodoroTimer} />
    </div>
  );
}

export default FlipClock;
