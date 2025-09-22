import React from "react";
import { FaPlay, FaPause, FaStop, FaCog, FaForward } from "react-icons/fa";
import { TIMER_STATES, MODES } from "../../constants";
import "./PomodoroControls.css";

function PomodoroControls({ mode, pomodoroTimer, onSettingsClick }) {
  // Directly compute visibility - no state or transitions to avoid flash
  const showStopButton = pomodoroTimer.isRunning || pomodoroTimer.isPaused;

  const handlePlayPause = () => {
    if (
      pomodoroTimer.timerState === TIMER_STATES.STOPPED ||
      pomodoroTimer.timerState === TIMER_STATES.PAUSED
    ) {
      pomodoroTimer.startTimer();
    } else {
      pomodoroTimer.pauseTimer();
    }
  };

  const handleStop = () => {
    // Reset current session
    pomodoroTimer.resetTimer();
  };

  const handleSkip = () => {
    // Skip to next session
    pomodoroTimer.skipToNextSession();
  };

  const handleSettings = () => {
    onSettingsClick();
  };

  if (mode !== MODES.POMODORO) return null;

  return (
    <div
      className="pomodoro-controls"
      role="group"
      aria-label="Pomodoro timer controls"
    >
      {/* Play/Stop buttons in horizontal container */}
      <div className="play-stop-container">
        <button
          className={`control-button play-button ${pomodoroTimer.timerState}`}
          onClick={handlePlayPause}
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

        {showStopButton && (
          <button
            className="control-button stop-button"
            onClick={handleStop}
            aria-label="Stop pomodoro timer and reset current session"
          >
            <FaStop aria-hidden="true" />
            <span className="sr-only">Stop and reset current session</span>
          </button>
        )}
      </div>

      {/* Bottom row: Skip and Settings */}
      <div className="bottom-controls">
        <button
          className="control-button skip-button"
          onClick={handleSkip}
          disabled={!pomodoroTimer.isRunning && !pomodoroTimer.isPaused}
          aria-label="Skip to next pomodoro session"
        >
          <FaForward aria-hidden="true" />
          <span className="sr-only">Skip to next session</span>
        </button>

        <button
          className="control-button settings-button"
          onClick={handleSettings}
          aria-label="Open pomodoro settings"
          aria-haspopup="dialog"
        >
          <FaCog aria-hidden="true" />
          <span className="sr-only">Pomodoro settings</span>
        </button>
      </div>
    </div>
  );
}

export default PomodoroControls;
