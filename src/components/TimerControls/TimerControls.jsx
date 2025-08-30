import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaCog } from "react-icons/fa";
import { TIMER_STATES, MODES } from "../../constants";
import "./TimerControls.css";

function TimerControls({ mode, timer, onSettingsClick }) {
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

  if (mode !== MODES.TIMER) return null;

  return (
    <>
      <div className="timer-controls">
        {/* Play/Stop buttons in horizontal container */}
        <div className="play-stop-container">
          <button
            className={`control-button play-button ${timer.timerState}`}
            onClick={handlePlayPause}
          >
            {timer.isRunning ? <FaPause /> : <FaPlay />}
          </button>

          {/* Show stop button with smooth horizontal animation */}
          {showStopButton && (
            <button
              className={`control-button stop-button ${
                isStopButtonExiting ? "exiting" : ""
              }`}
              onClick={handleStop}
            >
              <FaStop />
            </button>
          )}
        </div>

        {/* Settings button below */}
        <button
          className="control-button settings-button"
          onClick={handleSettings}
        >
          <FaCog />
        </button>
      </div>
    </>
  );
}

export default TimerControls;
