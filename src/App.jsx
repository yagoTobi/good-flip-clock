import { useState, useEffect } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock";
import ModeSelector from "./components/ModeSelector";
import TimerControls from "./components/TimerControls";
import CustomizationPanel from "./components/CustomizationPanel";
import TimerSettings from "./components/TimerSettings";
import PomodoroSettings from "./components/PomodoroSettings";
import CoffeeButton from "./components/CoffeeButton";
import LiveRegion from "./components/LiveRegion";
import { useTimer } from "./hooks/useTimer";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODES } from "./constants";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import {
  applyPerformanceOptimizations,
  optimizeWillChange,
  throttle,
} from "./utils/performanceUtils";
import {
  applyBrowserFixes,
  logCompatibilityInfo,
  checkCompatibilityIssues,
} from "./utils/browserDetection";
import {
  runMobileCompatibilityTests,
  exportTestResults,
} from "./utils/mobileCompatibilityTest";
import {
  runAccessibilityTests,
  exportAccessibilityResults,
} from "./utils/accessibilityTest";

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
  const [liveMessage, setLiveMessage] = useState("");
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
      setLiveMessage("Timer paused");
    }
    if (newMode !== MODES.POMODORO && pomodoroTimer.isRunning) {
      pomodoroTimer.pauseTimer();
      setLiveMessage("Pomodoro timer paused");
    }

    setSelectedMode(newMode);

    // Announce mode change
    const modeNames = {
      [MODES.CLOCK]: "Clock",
      [MODES.TIMER]: "Timer",
      [MODES.POMODORO]: "Pomodoro",
    };
    setLiveMessage(`Switched to ${modeNames[newMode]} mode`);
  };

  /**
   * Initialize performance optimizations and browser compatibility fixes on component mount
   */
  useEffect(() => {
    // Apply browser-specific fixes and optimizations
    const browserInfo = applyBrowserFixes();

    // Apply device-specific performance optimizations
    applyPerformanceOptimizations();

    // Set up keyboard vs touch user detection for accessibility
    const handleFirstTab = (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-user");
        document.body.classList.remove("touch-user");
      }
    };

    const handleFirstTouch = () => {
      document.body.classList.add("touch-user");
      document.body.classList.remove("keyboard-user");
    };

    const handleFirstMouse = () => {
      document.body.classList.remove("keyboard-user");
      document.body.classList.remove("touch-user");
    };

    // Add event listeners for input method detection
    document.addEventListener("keydown", handleFirstTab);
    document.addEventListener("touchstart", handleFirstTouch);
    document.addEventListener("mousedown", handleFirstMouse);

    // Log compatibility information in development
    if (process.env.NODE_ENV === "development") {
      logCompatibilityInfo();

      // Check for known compatibility issues
      const issues = checkCompatibilityIssues();
      if (issues.length > 0) {
        console.group("⚠️ Compatibility Issues Detected");
        issues.forEach((issue) => {
          console.log(`${issue.type.toUpperCase()}: ${issue.issue}`, issue);
        });
        console.groupEnd();
      }

      // Add global test functions for manual testing
      window.runMobileCompatibilityTests = async () => {
        const results = await runMobileCompatibilityTests();
        exportTestResults(results);
        return results;
      };

      window.runAccessibilityTests = () => {
        const results = runAccessibilityTests();
        exportAccessibilityResults(results);
        return results;
      };

      console.log(
        "🧪 Mobile compatibility tests available. Run window.runMobileCompatibilityTests() in console."
      );
      console.log(
        "♿ Accessibility tests available. Run window.runAccessibilityTests() in console."
      );
    }

    // Set up throttled will-change optimization
    const throttledOptimizeWillChange = throttle(optimizeWillChange, 1000);

    // Optimize will-change properties periodically
    const willChangeInterval = setInterval(throttledOptimizeWillChange, 5000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(willChangeInterval);
      document.removeEventListener("keydown", handleFirstTab);
      document.removeEventListener("touchstart", handleFirstTouch);
      document.removeEventListener("mousedown", handleFirstMouse);
    };
  }, []);

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
   * Monitor timer state changes for accessibility announcements
   */
  useEffect(() => {
    // Announce timer state changes
    if (selectedMode === MODES.TIMER) {
      if (timer.isRunning) {
        setLiveMessage("Timer started");
      } else if (timer.isPaused) {
        setLiveMessage("Timer paused");
      } else if (timer.timerState === "STOPPED") {
        setLiveMessage("Timer stopped");
      }
    }
  }, [timer.isRunning, timer.isPaused, timer.timerState, selectedMode]);

  useEffect(() => {
    // Announce pomodoro timer state changes
    if (selectedMode === MODES.POMODORO) {
      if (pomodoroTimer.isRunning) {
        const sessionType = pomodoroTimer.currentSession?.type || "focus";
        setLiveMessage(`${sessionType} session started`);
      } else if (pomodoroTimer.isPaused) {
        setLiveMessage("Pomodoro timer paused");
      } else if (pomodoroTimer.timerState === "STOPPED") {
        setLiveMessage("Pomodoro timer stopped");
      }
    }
  }, [
    pomodoroTimer.isRunning,
    pomodoroTimer.isPaused,
    pomodoroTimer.timerState,
    pomodoroTimer.currentSession,
    selectedMode,
  ]);

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
      {/* Skip links for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#mode-selector" className="skip-link">
        Skip to mode selector
      </a>

      <CoffeeButton />

      <main
        id="main-content"
        className="app-main"
        role="main"
        aria-label="Flip clock application"
      >
        <div
          className="clock-container"
          role="region"
          aria-label="Clock display and controls"
        >
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

        <div id="mode-selector">
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
            timer={timer}
            pomodoroTimer={pomodoroTimer}
            onCustomizationClick={() => setIsCustomizationOpen(true)}
          />
        </div>

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
            setLiveMessage("Pomodoro settings saved");
          }}
          currentSettings={pomodoroTimer.pomodoroSettings}
        />

        <LiveRegion message={liveMessage} />
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
