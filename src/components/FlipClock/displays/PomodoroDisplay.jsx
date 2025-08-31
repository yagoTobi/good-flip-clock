import TimerDisplay from "./TimerDisplay";

function PomodoroDisplay({ pomodoroTimer }) {
  // For now, use the TimerDisplay as a placeholder
  // This will be properly implemented in a future task
  return <TimerDisplay timer={pomodoroTimer || { minutes: 25, seconds: 0 }} />;
}

export default PomodoroDisplay;
