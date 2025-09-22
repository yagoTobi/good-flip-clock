import { useEffect } from "react";
import { MODES } from "../../constants";
import { FaClock, FaStopwatch } from "react-icons/fa";
import { GiTomato } from "react-icons/gi";
import "./ModeSelector.css";

function ModeSelector({
  selectedMode,
  onModeChange,
  onCustomizationClick,
  timer,
  pomodoroTimer,
}) {
  const modes = [
    { key: MODES.CLOCK, label: "Clock", icon: FaClock },
    { key: MODES.TIMER, label: "Timer", icon: FaStopwatch },
    { key: MODES.POMODORO, label: "Pomodoro", icon: GiTomato },
  ];

  const getSliderPosition = () => {
    switch (selectedMode) {
      case MODES.TIMER:
        return "slider-center";
      case MODES.POMODORO:
        return "slider-right";
      default:
        return "slider-left";
    }
  };

  // Handle keyboard navigation for tab list
  const handleKeyDown = (e, modeKey) => {
    const modes = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];
    const currentIndex = modes.indexOf(selectedMode);

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : modes.length - 1;
        onModeChange(modes[prevIndex]);
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        const nextIndex =
          currentIndex < modes.length - 1 ? currentIndex + 1 : 0;
        onModeChange(modes[nextIndex]);
        break;
      case "Home":
        e.preventDefault();
        onModeChange(modes[0]);
        break;
      case "End":
        e.preventDefault();
        onModeChange(modes[modes.length - 1]);
        break;
    }
  };

  // Focus management for tab navigation
  useEffect(() => {
    const activeTab = document.querySelector(
      '.selector-option[aria-selected="true"]'
    );
    if (activeTab && document.activeElement?.closest(".mode-selector")) {
      activeTab.focus();
    }
  }, [selectedMode]);

  return (
    <div className="mode-selector-container">
      <button
        className="customization-button"
        onClick={onCustomizationClick}
        aria-label="Open customization panel"
        aria-haspopup="dialog"
        title="Customize appearance"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.71,4.63L19.37,3.29C19,2.9 18.35,2.9 17.96,3.29L9,12.25L11.75,15L20.71,6.04C21.1,5.65 21.1,5 20.71,4.63M7,14A3,3 0 0,0 4,17C4,18.31 2.84,19 2,19C2.92,20.22 4.5,21 6,21A4,4 0 0,0 10,17A3,3 0 0,0 7,14Z" />
        </svg>
      </button>

      <div
        className="mode-selector"
        role="tablist"
        aria-label="Application modes"
      >
        <div className="selector-background">
          <div
            className={`selector-slider ${getSliderPosition()}`}
            aria-hidden="true"
          ></div>
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            const isActive = selectedMode === mode.key;
            const isRunning =
              (mode.key === MODES.TIMER && timer?.isRunning) ||
              (mode.key === MODES.POMODORO && pomodoroTimer?.isRunning);

            return (
              <button
                key={mode.key}
                className={`selector-option ${isActive ? "active" : ""}`}
                onClick={() => onModeChange(mode.key)}
                onKeyDown={(e) => handleKeyDown(e, mode.key)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${mode.key}-panel`}
                aria-label={`Switch to ${mode.label} mode${
                  isRunning ? " (currently running)" : ""
                }`}
                tabIndex={isActive ? 0 : -1}
              >
                <IconComponent className="mode-icon" aria-hidden="true" />
                <span className="mode-label">{mode.label}</span>
                {isRunning && (
                  <span
                    className="timer-indicator"
                    aria-label="Timer is running"
                  ></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModeSelector;
