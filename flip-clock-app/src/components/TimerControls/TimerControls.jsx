import { useState } from "react";
import { FaPlay, FaPause, FaCog } from "react-icons/fa";
import "./TimerControls.css";

function TimerControls({ mode, timerState, onTimerStateChange }) {
  const handlePlayPause = () => {
    if (timerState === "stopped" || timerState === "paused") {
      onTimerStateChange("running");
    } else {
      onTimerStateChange("paused");
    }
  };

  const handleSettings = () => {
    console.log("Settings clicked");
  };

  if (mode !== "Timer") return null;

  return (
    <div className="timer-controls">
      <button
        className={`control-button play-button ${timerState}`}
        onClick={handlePlayPause}
      >
        {timerState === "running" ? <FaPause /> : <FaPlay />}
      </button>

      <button
        className="control-button settings-button"
        onClick={handleSettings}
      >
        <FaCog />
      </button>
    </div>
  );
}

export default TimerControls;
