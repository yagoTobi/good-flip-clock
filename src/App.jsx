import { useState, useEffect } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock";
import ModeSelector from "./components/ModeSelector";
import TimerControls from "./components/TimerControls";
import CustomizationPanel from "./components/CustomizationPanel";
import TimerSettings from "./components/TimerSettings";
import PomodoroSettings from "./components/PomodoroSettings";
import CoffeeButton from "./components/CoffeeButton";
import { useTimer } from "./hooks/useTimer";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODES } from "./constants";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

/**
 * AppContent - Main application content component that manages the flip clock interface
 *
 * This component handles the core application state including mode selection (Clock, Timer, Pomodoro),
 * settings panel visibility, and background theme application. It integrates with the theme system
 * to apply backgrounds to the document body for full-screen coverage and manages the interaction
 * between different timer modes and their respective controls.
 *
 * State Management:
 * - selectedMode: Current display mode (MODES.CLOCK, MODES.TIMER, MODES.POMODORO)
 * - Modal visibility states for customization and settings panels
 * - Timer and Pomodoro timer instances from custom hooks
 * - Theme integration through useTheme context
 *
 * @returns {JSX.Element} The main application interface
 */
function AppContent() {
  const [selectedMode, setSelectedMode] = useState(MODES.CLOCK);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [isPomodoroSettingsOpen, setIsPomodoroSettingsOpen] = useState(false);
  const timer = useTimer();
  const pomodoroTimer = usePomodoroTimer();
  const { background } = useTheme();

  /**
   * Handle mode changes with automatic timer pausing
   *
   * When switching modes, pause any running timers from other modes to prevent
   * conflicts and ensure smooth animations. This creates a clean single-timer
   * experience where only the active mode's timer can run.
   *
   * @param {string} newMode - The mode to switch to
   */
  const handleModeChange = (newMode) => {
    // Pause other timers when switching away from their modes
    if (newMode !== MODES.TIMER && timer.isRunning) {
      timer.pauseTimer();
    }
    if (newMode !== MODES.POMODORO && pomodoroTimer.isRunning) {
      pomodoroTimer.pauseTimer();
    }

    setSelectedMode(newMode);
  };

  /**
   * Apply background theme to document body for full screen coverage
   *
   * This effect handles different background types:
   * - "default": No background applied
   * - URL backgrounds: Applied as background property for images
   * - Gradient backgrounds: Applied as background property
   * - Solid colors: Applied as backgroundColor property
   *
   * Cleanup ensures background is reset when component unmounts.
   */
  useEffect(() => {
    const applyBackgroundToBody = () => {
      // Clear any existing background styles first
      document.body.style.background = "";
      document.body.style.backgroundColor = "";

      if (background === "default") {
        // Keep default (no background)
        return;
      } else if (background.includes("url(")) {
        document.body.style.background = background;
      } else if (
        background.includes("gradient") ||
        background.includes("linear-gradient")
      ) {
        document.body.style.background = background;
      } else {
        document.body.style.backgroundColor = background;
      }
    };

    applyBackgroundToBody();

    // Cleanup function to reset background when component unmounts
    return () => {
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
    };
  }, [background]);

  /**
   * Determine if the current background requires light text for proper contrast
   *
   * @returns {boolean} True if background is light and requires dark text
   */
  const isLightBackground = () => {
    if (background === "default" || background === "#f5f5f5") {
      return true;
    }
    return false;
  };

  return (
    <div className={`app ${isLightBackground() ? "light-bg" : "dark-bg"}`}>
      <CoffeeButton />

      <main className="app-main">
        <div className="clock-container">
          <FlipClock
            mode={selectedMode}
            timer={timer}
            pomodoroTimer={pomodoroTimer}
          />
          <TimerControls
            mode={selectedMode}
            timer={timer}
            pomodoroTimer={pomodoroTimer}
            onSettingsClick={() => {
              if (selectedMode === MODES.POMODORO) {
                setIsPomodoroSettingsOpen(true);
              } else {
                setIsTimerSettingsOpen(true);
              }
            }}
          />
        </div>

        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
          timer={timer}
          pomodoroTimer={pomodoroTimer}
          onCustomizationClick={() => setIsCustomizationOpen(true)}
        />

        <CustomizationPanel
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
        />

        <TimerSettings
          isOpen={isTimerSettingsOpen}
          onClose={() => setIsTimerSettingsOpen(false)}
          onSave={(hours, minutes, seconds) => {
            timer.setTimerTime(hours, minutes, seconds);
            setIsTimerSettingsOpen(false);
          }}
          currentTimer={timer}
        />

        <PomodoroSettings
          isOpen={isPomodoroSettingsOpen}
          onClose={() => setIsPomodoroSettingsOpen(false)}
          onSave={(settings) => {
            pomodoroTimer.updatePomodoroSettings(settings);
            setIsPomodoroSettingsOpen(false);
          }}
          currentSettings={pomodoroTimer.pomodoroSettings}
        />
      </main>
    </div>
  );
}

/**
 * App - Root application component that provides theme context
 *
 * This is the main entry point component that wraps the entire application
 * with the ThemeProvider context. The ThemeProvider manages global theme state
 * including background colors/images, font selections, and color schemes,
 * making theme data available to all child components through React Context.
 *
 * Architecture:
 * App (ThemeProvider) → AppContent → Feature Components
 *
 * @returns {JSX.Element} The root application with theme context
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
