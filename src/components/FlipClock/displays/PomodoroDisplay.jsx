import TimerDisplay from "./TimerDisplay";

function PomodoroDisplay({ pomodoroTimer }) {
  // Use the existing TimerDisplay with pomodoro timer data
  // This maintains the flip clock functionality while showing pomodoro time
  return <TimerDisplay timer={pomodoroTimer} />;
}

export default PomodoroDisplay;
