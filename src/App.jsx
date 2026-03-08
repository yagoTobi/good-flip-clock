import { useState, useEffect, useRef } from "react";
import "./App.css";
import FlipClock from "./components/FlipClock";
import ModeSelector from "./components/ModeSelector";
import TimerControls from "./components/TimerControls";
import CustomizationPanel from "./components/CustomizationPanel";
import TimerSettings from "./components/TimerSettings";
import PomodoroSettings from "./components/PomodoroSettings";
import CoffeeButton from "./components/CoffeeButton";
import MusicPlayer from "./components/MusicPlayer";
import TaskList from "./components/TaskList";
import NotesPanel, { loadNotes } from "./components/NotesPanel";
import MobileBottomBar from "./components/MobileBottomBar/MobileBottomBar";
import InspirationalQuote from "./components/InspirationalQuote/InspirationalQuote";
import LiveRegion from "./components/LiveRegion";
import { useTimer } from "./hooks/useTimer";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODES } from "./constants";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { isLightColor } from "./utils/colorUtils";
import { applyPerformanceOptimizations } from "./utils/performanceUtils";
import {
  applyBrowserFixes,
  logCompatibilityInfo,
  checkCompatibilityIssues,
} from "./utils/browserDetection";


/**
 * BackgroundLayer - Smooth background transitions via GPU-accelerated opacity crossfade.
 *
 * Instead of transitioning `background` on the body (which triggers full-viewport repaints
 * every frame and is very expensive with image backgrounds), this component maintains two
 * stacked background divs and transitions the opacity of the incoming one.
 *
 * Opacity transitions are composited on the GPU — no layout or paint cost.
 * Image URLs are preloaded before the transition begins to prevent jank.
 */
function BackgroundLayer() {
  const { background } = useTheme();
  const [bottomBg, setBottomBg] = useState(background);
  const [topBg, setTopBg] = useState(null);
  const topRef = useRef(null);
  const bottomRef = useRef(background);
  const cleanupRef = useRef(null);

  const getBGStyle = (bg) => {
    if (!bg || bg === "default") return { backgroundColor: "#1a1a1a" };
    return { background: bg };
  };

  useEffect(() => {
    if (background === bottomRef.current && topRef.current === null) return;
    if (background === topRef.current) return;

    if (cleanupRef.current) clearTimeout(cleanupRef.current);

    const doTransition = () => {
      // If a transition is already in progress, promote its target to the bottom
      // layer first so we don't snap back to the original source background.
      if (topRef.current !== null) {
        setBottomBg(topRef.current);
        bottomRef.current = topRef.current;
      }

      topRef.current = background;
      setTopBg(background);

      cleanupRef.current = setTimeout(() => {
        bottomRef.current = background;
        topRef.current = null;
        setBottomBg(background);
        setTopBg(null);
      }, 600);
    };

    // For image backgrounds, preload AND decode before applying so the first
    // painted frame already has the image ready — no blank-flash on the fade-in.
    if (background.includes("url(")) {
      const match = background.match(/url\("([^"]+)"\)/);
      if (match) {
        let cancelled = false;
        const img = new Image();

        const onReady = () => {
          if (cancelled) return;
          if (typeof img.decode === "function") {
            img
              .decode()
              .then(() => { if (!cancelled) doTransition(); })
              .catch(() => { if (!cancelled) doTransition(); });
          } else {
            doTransition();
          }
        };

        img.onload = onReady;
        img.onerror = () => { if (!cancelled) doTransition(); };
        img.src = match[1];

        return () => {
          cancelled = true;
          if (cleanupRef.current) clearTimeout(cleanupRef.current);
        };
      }
    }

    doTransition();

    return () => {
      if (cleanupRef.current) clearTimeout(cleanupRef.current);
    };
  }, [background]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <div
        style={{ position: "absolute", inset: 0, ...getBGStyle(bottomBg) }}
      />
      {topBg && (
        <div
          key={topBg}
          style={{
            position: "absolute",
            inset: 0,
            ...getBGStyle(topBg),
            animation: "bgCrossfade 0.5s ease forwards",
            willChange: "opacity",
          }}
        />
      )}
    </div>
  );
}

/**
 * AppContent - Main application content component
 */
function AppContent() {
  const [selectedMode, setSelectedMode] = useState(MODES.CLOCK);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isTimerSettingsOpen, setIsTimerSettingsOpen] = useState(false);
  const [isPomodoroSettingsOpen, setIsPomodoroSettingsOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState(loadNotes);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);

  const handleMusicToggle = () => {
    const next = !isMusicOpen;
    setIsMusicOpen(next);
    if (next) { setIsTasksOpen(false); setIsNotesOpen(false); }
  };

  const handleTasksToggle = () => {
    const next = !isTasksOpen;
    setIsTasksOpen(next);
    if (next) { setIsMusicOpen(false); setIsNotesOpen(false); }
  };

  const handleNotesToggle = () => {
    const next = !isNotesOpen;
    setIsNotesOpen(next);
    if (next) { setIsMusicOpen(false); setIsTasksOpen(false); }
  };

  const handleNotesChange = (value) => {
    setNotes(value);
    try {
      localStorage.setItem("flip-clock-notes", value);
    } catch {
      // storage unavailable
    }
  };
  const timer = useTimer();
  const pomodoroTimer = usePomodoroTimer();
  const { background } = useTheme();

  const handleModeChange = (newMode) => {
    if (newMode !== MODES.TIMER && timer.isRunning) {
      timer.pauseTimer();
      setLiveMessage("Timer paused");
    }
    if (newMode !== MODES.POMODORO && pomodoroTimer.isRunning) {
      pomodoroTimer.pauseTimer();
      setLiveMessage("Pomodoro timer paused");
    }

    setSelectedMode(newMode);

    const modeNames = {
      [MODES.CLOCK]: "Clock",
      [MODES.TIMER]: "Timer",
      [MODES.POMODORO]: "Pomodoro",
    };
    setLiveMessage(`Switched to ${modeNames[newMode]} mode`);
  };

  // Idle / focus-mode detection — desktop only
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const enterFocusMode = () => {
      setIsIdle(true);
      setIsCustomizationOpen(false);
      setIsTimerSettingsOpen(false);
      setIsPomodoroSettingsOpen(false);
      setIsMusicOpen(false);
      setIsTasksOpen(false);
      setIsNotesOpen(false);
    };

    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      idleTimerRef.current = setTimeout(enterFocusMode, 10000);
    };

    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("mousedown", resetIdle);
    window.addEventListener("keydown", resetIdle);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("mousedown", resetIdle);
      window.removeEventListener("keydown", resetIdle);
    };
  }, []);

  useEffect(() => {
    applyBrowserFixes();
    applyPerformanceOptimizations();

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

    document.addEventListener("keydown", handleFirstTab);
    document.addEventListener("touchstart", handleFirstTouch);
    document.addEventListener("mousedown", handleFirstMouse);

    if (process.env.NODE_ENV === "development") {
      logCompatibilityInfo();

      const issues = checkCompatibilityIssues();
      if (issues.length > 0) {
        console.group("Compatibility Issues Detected");
        issues.forEach((issue) => {
          console.log(`${issue.type.toUpperCase()}: ${issue.issue}`, issue);
        });
        console.groupEnd();
      }

      window.runMobileCompatibilityTests = async () => {
        const { runMobileCompatibilityTests, exportTestResults } = await import("./utils/mobileCompatibilityTest");
        const results = await runMobileCompatibilityTests();
        exportTestResults(results);
        return results;
      };

      window.runAccessibilityTests = async () => {
        const { runAccessibilityTests, exportAccessibilityResults } = await import("./utils/accessibilityTest");
        const results = runAccessibilityTests();
        exportAccessibilityResults(results);
        return results;
      };
    }

    return () => {
      document.removeEventListener("keydown", handleFirstTab);
      document.removeEventListener("touchstart", handleFirstTouch);
      document.removeEventListener("mousedown", handleFirstMouse);
    };
  }, []);

  useEffect(() => {
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

  const isLightBg = background !== "default" ? isLightColor(background) : false;

  return (
    <div className={`app ${isLightBg ? "light-bg" : "dark-bg"}${isIdle ? " focus-mode" : ""}`}>
      <InspirationalQuote />
      <CoffeeButton />
      <MusicPlayer
        isOpen={isMusicOpen}
        onToggle={handleMusicToggle}
        onPlayingChange={setIsMusicPlaying}
        hasControls={selectedMode === MODES.TIMER || selectedMode === MODES.POMODORO}
      />
      <TaskList isOpen={isTasksOpen} onToggle={handleTasksToggle} />
      <NotesPanel
        isOpen={isNotesOpen}
        onToggle={handleNotesToggle}
        notes={notes}
        onNotesChange={handleNotesChange}
      />

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

        <MobileBottomBar
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
          timer={timer}
          pomodoroTimer={pomodoroTimer}
          onSettingsClick={() => {
            if (selectedMode === MODES.POMODORO) {
              setIsPomodoroSettingsOpen(true);
            } else {
              setIsTimerSettingsOpen(true);
            }
          }}
          onCustomizationClick={() => setIsCustomizationOpen(true)}
          isMusicOpen={isMusicOpen}
          onMusicToggle={handleMusicToggle}
          isMusicPlaying={isMusicPlaying}
        />

        <LiveRegion message={liveMessage} />
      </main>
    </div>
  );
}

/**
 * App - Root component with theme context and background layer
 */
function App() {
  return (
    <ThemeProvider>
      <BackgroundLayer />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
