import { useState } from "react";
import { FaPlay, FaPause, FaCog } from "react-icons/fa";
import "./TimerControls.css";

function TimerControls({ mode }) {
  const [timerState, setTimerState] = useState("stopped"); // stopped, running, paused

  const handlePlayPause = () => {
    if (timerState === "stopped" || timerState === "paused") {
      setTimerState("running");
    } else {
      setTimerState("paused");
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
