import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaCog, FaForward } from "react-icons/fa";
import { MODES } from "../../constants";
import "./PomodoroControls.css";

function PomodoroControls({ mode, pomodoroTimer, onSettingsClick }) {
  const [showStopButton, setShowStopButton] = useState(() => pomodoroTimer.isRunning || pomodoroTimer.isPaused);

  useEffect(() => {
    setShowStopButton(pomodoroTimer.isRunning || pomodoroTimer.isPaused);
  }, [pomodoroTimer.isRunning, pomodoroTimer.isPaused]);

  if (mode !== MODES.POMODORO) return null;

  return (
    <div
      className="pomodoro-controls"
      role="group"
      aria-label="Pomodoro timer controls"
    >
      <button
        className={`control-button play-button ${pomodoroTimer.timerState}`}
        onClick={pomodoroTimer.togglePlayPause}
        aria-label={
          pomodoroTimer.isRunning
            ? "Pause pomodoro timer"
            : "Start pomodoro timer"
        }
        aria-pressed={pomodoroTimer.isRunning}
      >
        {pomodoroTimer.isRunning ? (
          <FaPause aria-hidden="true" />
        ) : (
          <FaPlay aria-hidden="true" />
        )}
        <span className="sr-only">
          {pomodoroTimer.isRunning
            ? "Pause pomodoro timer"
            : "Start pomodoro timer"}
        </span>
      </button>

      <button
        className={`control-button stop-button${showStopButton ? " visible" : ""}`}
        onClick={() => pomodoroTimer.resetTimer()}
        aria-label="Stop pomodoro timer and reset current session"
        aria-hidden={!showStopButton}
        tabIndex={showStopButton ? 0 : -1}
      >
        <FaStop aria-hidden="true" />
        <span className="sr-only">Stop and reset current session</span>
      </button>

      <button
        className="control-button skip-button"
        onClick={() => pomodoroTimer.skipToNextSession()}
        disabled={!pomodoroTimer.isRunning && !pomodoroTimer.isPaused}
        aria-label="Skip to next pomodoro session"
      >
        <FaForward aria-hidden="true" />
        <span className="sr-only">Skip to next session</span>
      </button>

      <button
        className="control-button settings-button"
        onClick={onSettingsClick}
        aria-label="Open pomodoro settings"
        aria-haspopup="dialog"
      >
        <FaCog aria-hidden="true" />
        <span className="sr-only">Pomodoro settings</span>
      </button>
    </div>
  );
}

export default PomodoroControls;
