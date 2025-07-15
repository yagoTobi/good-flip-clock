import { FaPlay, FaPause, FaCog } from "react-icons/fa";
import { TIMER_STATES, MODES } from "../../constants";
import "./TimerControls.css";

function TimerControls({ mode, timer }) {
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

  const handleSettings = () => {
    console.log("Settings clicked");
    // TODO: Implement timer settings modal
  };

  if (mode !== MODES.TIMER) return null;

  return (
    <div className="timer-controls">
      <button
        className={`control-button play-button ${timer.timerState}`}
        onClick={handlePlayPause}
      >
        {timer.isRunning ? <FaPause /> : <FaPlay />}
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
