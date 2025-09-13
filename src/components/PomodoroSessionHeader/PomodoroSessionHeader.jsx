import { MODES, POMODORO_SESSION_TYPES } from "../../constants";
import "./PomodoroSessionHeader.css";

function PomodoroSessionHeader({ mode, pomodoroTimer }) {
  // Get session type display name
  const getSessionTypeDisplay = () => {
    switch (pomodoroTimer.sessionType) {
      case POMODORO_SESSION_TYPES.FOCUS:
        return "Focus Session";
      case POMODORO_SESSION_TYPES.SHORT_BREAK:
        return "Short Break";
      case POMODORO_SESSION_TYPES.LONG_BREAK:
        return "Long Break";
      default:
        return "Pomodoro";
    }
  };

  if (mode !== MODES.POMODORO) return null;

  return (
    <div className="pomodoro-session-header">
      {/* Session type indicator */}
      <div className="session-type-display">
        <span className={`session-type ${pomodoroTimer.sessionType}`}>
          {getSessionTypeDisplay()}
        </span>
      </div>

      {/* Task input for focus sessions */}
      {pomodoroTimer.isFocusSession && (
        <div className="task-input-container">
          <input
            type="text"
            placeholder="What are you working on?"
            value={pomodoroTimer.currentTask}
            onChange={(e) => pomodoroTimer.setTaskName(e.target.value)}
            className="task-input"
            disabled={pomodoroTimer.isRunning}
          />
        </div>
      )}
    </div>
  );
}

export default PomodoroSessionHeader;
