import { FaMugHot } from "react-icons/fa";
import { MODES } from "../../constants";
import "./LandscapeBar.css";

const MODE_ORDER = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];

function LandscapeBar({
  selectedMode,
  onModeChange,
  timer,
  pomodoroTimer,
  onCustomizationClick,
}) {
  const isAnyRunning =
    (selectedMode === MODES.TIMER && timer?.isRunning) ||
    (selectedMode === MODES.POMODORO && pomodoroTimer?.isRunning);

  return (
    <>
      <div className="lb-dots">
        {MODE_ORDER.map((mode) => {
          const label = { [MODES.CLOCK]: "Clock", [MODES.TIMER]: "Timer", [MODES.POMODORO]: "Pomodoro" }[mode];
          return (
            <button
              key={mode}
              className={`lb-dot${selectedMode === mode ? " active" : ""}${selectedMode === mode && isAnyRunning ? " running" : ""}`}
              onClick={() => onModeChange(mode)}
              aria-label={`Switch to ${label} mode`}
              aria-current={selectedMode === mode ? "true" : undefined}
            />
          );
        })}
      </div>

      <div className="lb-utils">
        <button
          className="lb-btn"
          onClick={onCustomizationClick}
          aria-label="Customize appearance"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
          </svg>
        </button>
        <button
          className="lb-btn"
          onClick={() => window.open("https://buymeacoffee.com/yagotobi", "_blank", "noopener,noreferrer")}
          aria-label="Buy me a coffee"
        >
          <FaMugHot size={14} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

export default LandscapeBar;
