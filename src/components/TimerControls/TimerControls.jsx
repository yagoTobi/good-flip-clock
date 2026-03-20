import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaCog } from "react-icons/fa";
import { MODES } from "../../constants";
import PomodoroControls from "../PomodoroControls/PomodoroControls";
import "./TimerControls.css";

function TimerControls({ mode, timer, pomodoroTimer, onSettingsClick }) {
  const [showStopButton, setShowStopButton] = useState(() => timer.isRunning || timer.isPaused);

  useEffect(() => {
    setShowStopButton(timer.isRunning || timer.isPaused);
  }, [timer.isRunning, timer.isPaused]);

  if (mode === MODES.POMODORO) {
    return (
      <PomodoroControls
        mode={mode}
        pomodoroTimer={pomodoroTimer}
        onSettingsClick={onSettingsClick}
      />
    );
  }

  if (mode !== MODES.TIMER) return null;

  const isEndAt = timer.isEndAtMode;
  const showStop = isEndAt ? timer.isRunning : showStopButton;

  return (
    <>
      <div className={`timer-controls${isEndAt && timer.isRunning ? " end-at-active" : ""}`} role="group" aria-label="Timer controls">
        {!isEndAt && (
          <button
            className={`control-button play-button ${timer.timerState}`}
            onClick={timer.togglePlayPause}
            aria-label={timer.isRunning ? "Pause timer" : "Start timer"}
            aria-pressed={timer.isRunning}
          >
            {timer.isRunning ? (
              <FaPause aria-hidden="true" />
            ) : (
              <FaPlay aria-hidden="true" />
            )}
            <span className="sr-only">
              {timer.isRunning ? "Pause timer" : "Start timer"}
            </span>
          </button>
        )}

        <button
          className={`control-button stop-button${showStop ? " visible" : ""}`}
          onClick={() => timer.revertToOriginalTime()}
          aria-label={isEndAt ? "Cancel countdown" : "Stop timer and reset to original time"}
          aria-hidden={!showStop}
          tabIndex={showStop ? 0 : -1}
        >
          <FaStop aria-hidden="true" />
          <span className="sr-only">{isEndAt ? "Cancel countdown" : "Stop timer and reset"}</span>
        </button>

        <button
          className="control-button settings-button"
          onClick={onSettingsClick}
          aria-label="Open timer settings"
          aria-haspopup="dialog"
        >
          <FaCog aria-hidden="true" />
          <span className="sr-only">Timer settings</span>
        </button>
      </div>
    </>
  );
}

export default TimerControls;
