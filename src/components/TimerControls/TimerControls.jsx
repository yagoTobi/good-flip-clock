import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaCog } from "react-icons/fa";
import { TIMER_STATES, MODES } from "../../constants";
import PomodoroControls from "../PomodoroControls/PomodoroControls";
import "./TimerControls.css";

function TimerControls({ mode, timer, pomodoroTimer, onSettingsClick }) {
  const [showStopButton, setShowStopButton] = useState(false);
  const [isStopButtonExiting, setIsStopButtonExiting] = useState(false);

  // Initialize stop button state on mount without animation
  useEffect(() => {
    setShowStopButton(timer.isRunning || timer.isPaused);
    setIsStopButtonExiting(false);
  }, []); // Only run on mount

  // Handle stop button visibility - show when running OR paused, hide only when stopped
  useEffect(() => {
    const shouldShowStop = timer.isRunning || timer.isPaused;

    if (shouldShowStop && !showStopButton) {
      // Timer started or paused - show stop button with animation
      setShowStopButton(true);
      setIsStopButtonExiting(false);
    } else if (!shouldShowStop && showStopButton) {
      // Timer completely stopped - hide stop button with exit animation
      setIsStopButtonExiting(true);
      setTimeout(() => {
        setShowStopButton(false);
        setIsStopButtonExiting(false);
      }, 300); // Match animation duration
    }
  }, [timer.isRunning, timer.isPaused, showStopButton]);

  const handlePlayPause = () => {
    if (
      timer.timerState === TIMER_STATES.STOPPED ||
      timer.timerState === TIMER_STATES.PAUSED
    ) {
      timer.startTimer();
    } else {
      timer.pauseTimer();
    }
  };

  const handleStop = () => {
    // Revert to the original time set by the user (most user-friendly)
    timer.revertToOriginalTime();
  };

  const handleSettings = () => {
    onSettingsClick();
  };

  // Render Pomodoro controls if in Pomodoro mode
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

  return (
    <>
      <div className="timer-controls" role="group" aria-label="Timer controls">
        {/* Play/Stop buttons in horizontal container */}
        <div className="play-stop-container">
          <button
            className={`control-button play-button ${timer.timerState}`}
            onClick={handlePlayPause}
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

          {/* Show stop button with smooth horizontal animation */}
          {showStopButton && (
            <button
              className={`control-button stop-button ${
                isStopButtonExiting ? "exiting" : ""
              }`}
              onClick={handleStop}
              aria-label="Stop timer and reset to original time"
            >
              <FaStop aria-hidden="true" />
              <span className="sr-only">Stop timer and reset</span>
            </button>
          )}
        </div>

        {/* Settings button below */}
        <button
          className="control-button settings-button"
          onClick={handleSettings}
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
