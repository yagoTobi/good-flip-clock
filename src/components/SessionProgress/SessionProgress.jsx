import { useMemo } from "react";
import { POMODORO_SESSION_TYPES } from "../../constants";
import "./SessionProgress.css";

function SessionProgress({ pomodoroTimer, totalSessions = 4 }) {
  const {
    sessionType,
    cycleCount,
    pomodoroSettings,
    minutes,
    seconds,
    isRunning,
    isPaused,
  } = pomodoroTimer;

  // Calculate progress percentage for current session
  const progressPercentage = useMemo(() => {
    if (!isRunning && !isPaused) return 0;

    let totalDuration;
    switch (sessionType) {
      case POMODORO_SESSION_TYPES.FOCUS:
        totalDuration = pomodoroSettings.focusDuration * 60;
        break;
      case POMODORO_SESSION_TYPES.SHORT_BREAK:
        totalDuration = pomodoroSettings.shortBreakDuration * 60;
        break;
      case POMODORO_SESSION_TYPES.LONG_BREAK:
        totalDuration = pomodoroSettings.longBreakDuration * 60;
        break;
      default:
        return 0;
    }

    const currentTime = minutes * 60 + seconds;
    const elapsed = totalDuration - currentTime;
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  }, [sessionType, pomodoroSettings, minutes, seconds, isRunning, isPaused]);

  // Generate session indicators
  const sessionIndicators = useMemo(() => {
    const indicators = [];

    for (let i = 0; i < totalSessions; i++) {
      const isCurrentSession = i === cycleCount;
      const isCompleted = i < cycleCount;
      const isActive = isCurrentSession && (isRunning || isPaused);

      indicators.push({
        index: i,
        isCurrentSession,
        isCompleted,
        isActive,
        progressPercentage: isCurrentSession ? progressPercentage : 0,
      });
    }

    return indicators;
  }, [cycleCount, totalSessions, progressPercentage, isRunning, isPaused]);

  return (
    <div className="session-progress">
      <div className="session-indicators">
        {sessionIndicators.map((indicator) => (
          <div
            key={indicator.index}
            className={`session-indicator ${
              indicator.isCompleted ? "completed" : ""
            } ${indicator.isCurrentSession ? "current" : ""} ${
              indicator.isActive ? "active" : ""
            }`}
          >
            {indicator.isActive ? (
              <div className={`progress-bar ${sessionType}`}>
                <div
                  className={`progress-fill ${sessionType}`}
                  style={{ width: `${indicator.progressPercentage}%` }}
                />
              </div>
            ) : (
              <div className="session-dot" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionProgress;
