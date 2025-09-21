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
    <div className="pomodoro-controls">
      {/* Play/Stop buttons in horizontal container */}
      <div className="play-stop-container">
        <button
          className={`control-button play-button ${pomodoroTimer.timerState}`}
          onClick={handlePlayPause}
        >
          {pomodoroTimer.isRunning ? <FaPause /> : <FaPlay />}
        </button>

        {showStopButton && (
          <button className="control-button stop-button" onClick={handleStop}>
            <FaStop />
          </button>
        )}
      </div>

      {/* Bottom row: Skip and Settings */}
      <div className="bottom-controls">
        <button
          className="control-button skip-button"
          onClick={handleSkip}
          disabled={!pomodoroTimer.isRunning && !pomodoroTimer.isPaused}
        >
          <FaForward />
        </button>

        <button
          className="control-button settings-button"
          onClick={handleSettings}
        >
          <FaCog />
        </button>
      </div>
    </div>
  );
}

export default PomodoroControls;
