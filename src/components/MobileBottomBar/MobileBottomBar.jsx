import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaStop, FaCog, FaForward, FaMusic, FaMugHot } from "react-icons/fa";
import { MODES } from "../../constants";
import "./MobileBottomBar.css";

const MODE_ORDER = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];

function MobileBottomBar({
  selectedMode,
  onModeChange,
  timer,
  pomodoroTimer,
  onSettingsClick,
  onCustomizationClick,
  isMusicOpen,
  onMusicToggle,
  isMusicPlaying,
}) {

  const handleCoffeeClick = () => {
    window.open("https://buymeacoffee.com/yagotobi", "_blank", "noopener,noreferrer");
  };

  const isTimerMode = selectedMode === MODES.TIMER;
  const isPomodoroMode = selectedMode === MODES.POMODORO;
  const hasControls = isTimerMode || isPomodoroMode;

  // Keep controls content mounted briefly after mode changes away so the
  // max-height CSS transition can animate closed before React removes the nodes.
  const [controlsDisplayMode, setControlsDisplayMode] = useState(selectedMode);
  const contentTimerRef = useRef(null);
  useEffect(() => {
    if (selectedMode === MODES.TIMER || selectedMode === MODES.POMODORO) {
      clearTimeout(contentTimerRef.current);
      setControlsDisplayMode(selectedMode);
    } else {
      contentTimerRef.current = setTimeout(
        () => setControlsDisplayMode(selectedMode),
        250
      );
    }
    return () => clearTimeout(contentTimerRef.current);
  }, [selectedMode]);
  const showTimerControls = controlsDisplayMode === MODES.TIMER;
  const showPomodoroControls = controlsDisplayMode === MODES.POMODORO;

  const showTimerStop = timer?.isRunning || timer?.isPaused;
  const showPomodoroStop = pomodoroTimer?.isRunning || pomodoroTimer?.isPaused;

  const isAnyRunning =
    (selectedMode === MODES.TIMER && timer?.isRunning) ||
    (selectedMode === MODES.POMODORO && pomodoroTimer?.isRunning);

  return (
    <div className={`mobile-bottom-bar${hasControls ? " has-controls" : ""}`}>
      {/* Mode dots — tappable to switch mode */}
      <div className="mb-mode-dots">
        {MODE_ORDER.map((mode) => {
          const label = { [MODES.CLOCK]: "Clock", [MODES.TIMER]: "Timer", [MODES.POMODORO]: "Pomodoro" }[mode];
          return (
            <button
              key={mode}
              className={`mb-mode-dot${selectedMode === mode ? " active" : ""}${selectedMode === mode && isAnyRunning ? " running" : ""}`}
              onClick={() => onModeChange(mode)}
              aria-label={`Switch to ${label} mode`}
              aria-current={selectedMode === mode ? "true" : undefined}
            />
          );
        })}
      </div>

      {/* Controls row — always in DOM; height animated by .has-controls CSS */}
      <div className="mb-controls-row-wrapper">
        <div className="mb-row mb-controls-row">
          {showTimerControls && (
            <>
              <button
                className="mb-btn"
                onClick={onSettingsClick}
                aria-label="Timer settings"
              >
                <FaCog aria-hidden="true" />
              </button>
              <button
                className="mb-btn"
                onClick={timer.togglePlayPause}
                aria-label={timer?.isRunning ? "Pause timer" : "Start timer"}
              >
                {timer?.isRunning ? (
                  <FaPause aria-hidden="true" />
                ) : (
                  <FaPlay aria-hidden="true" />
                )}
              </button>
              <button
                className={`mb-btn mb-stop-btn${!showTimerStop ? " mb-btn-dim" : ""}`}
                onClick={() => timer.revertToOriginalTime()}
                aria-label="Stop timer"
                disabled={!showTimerStop}
              >
                <FaStop aria-hidden="true" />
              </button>
            </>
          )}
          {showPomodoroControls && (
            <>
              <button
                className="mb-btn"
                onClick={onSettingsClick}
                aria-label="Pomodoro settings"
              >
                <FaCog aria-hidden="true" />
              </button>
              <button
                className="mb-btn"
                onClick={pomodoroTimer.togglePlayPause}
                aria-label={pomodoroTimer?.isRunning ? "Pause pomodoro" : "Start pomodoro"}
              >
                {pomodoroTimer?.isRunning ? (
                  <FaPause aria-hidden="true" />
                ) : (
                  <FaPlay aria-hidden="true" />
                )}
              </button>
              <button
                className={`mb-btn mb-stop-btn${!showPomodoroStop ? " mb-btn-dim" : ""}`}
                onClick={() => pomodoroTimer.resetTimer()}
                aria-label="Stop pomodoro"
                disabled={!showPomodoroStop}
              >
                <FaStop aria-hidden="true" />
              </button>
              <button
                className="mb-btn"
                onClick={() => pomodoroTimer.skipToNextSession()}
                disabled={!showPomodoroStop}
                aria-label="Skip to next session"
              >
                <FaForward aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Utility row */}
      <div className="mb-row mb-utils-row">
        <button
          className="mb-util-btn"
          onClick={onCustomizationClick}
          aria-label="Customize appearance"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
          </svg>
        </button>
        <button
          className={`mb-util-btn${isMusicPlaying ? " is-playing" : ""}`}
          onClick={onMusicToggle}
          aria-label={isMusicOpen ? "Close music player" : "Open music player"}
        >
          <FaMusic size={18} aria-hidden="true" />
        </button>
        <button
          className="mb-util-btn"
          onClick={handleCoffeeClick}
          aria-label="Buy me a coffee"
        >
          <FaMugHot size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default MobileBottomBar;
