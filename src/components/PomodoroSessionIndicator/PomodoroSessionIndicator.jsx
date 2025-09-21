import SessionProgress from "../SessionProgress/SessionProgress";
import { MODES } from "../../constants";
import "./PomodoroSessionIndicator.css";

function PomodoroSessionIndicator({ mode, pomodoroTimer }) {
  if (mode !== MODES.POMODORO) return null;

  return (
    <div className="pomodoro-session-indicator">
      {/* Session progress indicators */}
      <SessionProgress
        pomodoroTimer={pomodoroTimer}
        totalSessions={pomodoroTimer.pomodoroSettings.longBreakInterval}
      />
    </div>
  );
}

export default PomodoroSessionIndicator;
