import { useState, useEffect } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock/FlipClock";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import TimerControls from "./components/TimerControls/TimerControls";
import CustomizationPanel from "./components/CustomizationPanel/CustomizationPanel";
import TimerSettings from "./components/TimerSettings/TimerSettings";
import { useTimer } from "./hooks/useTimer";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODES } from "./constants";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

function AppContent() {
  const [selectedMode, setSelectedMode] = useState(MODES.CLOCK);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const timer = useTimer();
  const pomodoroTimer = usePomodoroTimer();
  const { background } = useTheme();

  // Apply background to document body for full screen coverage
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

  // Determine if we need light text based on background
  const isLightBackground = () => {
    if (background === "default" || background === "#f5f5f5") {
      return true;
    }
    return false;
  };

  return (
    <div className={`app ${isLightBackground() ? "light-bg" : "dark-bg"}`}>
      <header className="app-header">
        <h1>Flip Clock</h1>
      </header>

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
            onSettingsClick={() => setIsTimerSettingsOpen(true)}
          />
        </div>

        <ModeSelector
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          isTimerRunning={timer.isRunning || pomodoroTimer.isRunning}
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
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
