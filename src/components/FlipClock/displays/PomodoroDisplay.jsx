import TimerDisplay from "./TimerDisplay";

/**
 * PomodoroDisplay - Pomodoro timer display using TimerDisplay component
 *
 * This component serves as a wrapper around TimerDisplay specifically for Pomodoro mode.
 * It leverages the existing timer display functionality while working with Pomodoro timer
 * data, maintaining consistent flip clock animations and formatting.
 *
 * Design Pattern:
 * - Composition over duplication: reuses TimerDisplay instead of reimplementing
 * - Maintains consistent animation behavior across timer modes
 * - Allows Pomodoro-specific enhancements in the future while preserving core functionality
 *
 * @param {Object} props - Component props
 * @param {Object} props.pomodoroTimer - Pomodoro timer hook instance with timer interface
 * @returns {JSX.Element} Pomodoro timer display with flip animations
 */
function PomodoroDisplay({ pomodoroTimer }) {
  // Use the existing TimerDisplay with pomodoro timer data
  // This maintains the flip clock functionality while showing pomodoro time
  return <TimerDisplay timer={pomodoroTimer} />;
}

export default PomodoroDisplay;
