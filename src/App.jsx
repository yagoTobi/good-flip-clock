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
import NotesPanel from "./components/NotesPanel";
import MobileBottomBar from "./components/MobileBottomBar/MobileBottomBar";
import InspirationalQuote from "./components/InspirationalQuote/InspirationalQuote";
import LandscapeBar from "./components/LandscapeBar/LandscapeBar";
import LiveRegion from "./components/LiveRegion";
import { useTimer } from "./hooks/useTimer";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { usePanelManager } from "./hooks/usePanelManager";
import { useIdleMode } from "./hooks/useIdleMode";
import { useMobileChrome } from "./hooks/useMobileChrome";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useFullscreen } from "./hooks/useFullscreen";
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
  const [liveMessage, setLiveMessage] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const touchStartRef = useRef(null);

  const { panels, openPanel, closePanel, togglePanel, closeAll, isAnyModalOpen, isAnyFloatingOpen } = usePanelManager();
  const isIdle = useIdleMode(closeAll);
  const { mobileChromeVisible, setMobileChromeVisible } = useMobileChrome({ isAnyModalOpen, isAnyFloatingOpen });

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

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  useKeyboardShortcuts({
    selectedMode,
    onModeChange: handleModeChange,
    timer,
    pomodoroTimer,
    togglePanel,
    closeAll,
    toggleFullscreen,
    modes: MODES,
  });

  // Mobile gesture handlers — tap toggles chrome; swipe changes mode.
  // These are attached via JSX onTouchStart/onTouchEnd on <main> so they
  // only fire when touching the clock / background area, not desktop.
  const handleMobileTouchStart = (e) => {
    // Large modal panels are open — let them handle touches exclusively
    if (isAnyModalOpen) {
      touchStartRef.current = null;
      return;
    }
    // Touches that begin on an interactive element drive that element, not our gesture
    if (e.target.closest('button, a, input, select, [role="button"]')) {
      touchStartRef.current = null;
      return;
    }
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleMobileTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const { x: startX, y: startY, time: startTime } = touchStartRef.current;
    touchStartRef.current = null;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const duration = Date.now() - startTime;

    // Swipe: horizontal dominant + at least 50px travel → change mode (bounded, no wrap)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      const modeOrder = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];
      const currentIndex = modeOrder.indexOf(selectedMode);
      if (deltaX < 0 && currentIndex < modeOrder.length - 1) {
        handleModeChange(modeOrder[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        handleModeChange(modeOrder[currentIndex - 1]);
      }
      return;
    }

    // Tap: small movement + short duration → toggle chrome
    if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15 && duration < 400) {
      if (mobileChromeVisible) closePanel("music");
      setMobileChromeVisible(v => !v);
    }
  };

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

  // Dynamic document title — countdown when timer is active, default otherwise.
  useEffect(() => {
    if (selectedMode === MODES.TIMER && (timer.isRunning || timer.isPaused)) {
      const h = String(timer.hours).padStart(2, "0");
      const m = String(timer.minutes).padStart(2, "0");
      const s = String(timer.seconds).padStart(2, "0");
      document.title = timer.hours > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
      return;
    }

    if (selectedMode === MODES.POMODORO && (pomodoroTimer.isRunning || pomodoroTimer.isPaused)) {
      const m = String(pomodoroTimer.minutes).padStart(2, "0");
      const s = String(pomodoroTimer.seconds).padStart(2, "0");
      document.title = `${m}:${s}`;
      return;
    }

    document.title = "Good Flip Clock";
  }, [
    selectedMode,
    timer.isRunning, timer.isPaused, timer.hours, timer.minutes, timer.seconds,
    pomodoroTimer.isRunning, pomodoroTimer.isPaused, pomodoroTimer.minutes, pomodoroTimer.seconds,
  ]);

  const isLightBg = background !== "default" ? isLightColor(background) : false;

  return (
    <div className={`app ${isLightBg ? "light-bg" : "dark-bg"}${isIdle ? " focus-mode" : ""}${!mobileChromeVisible ? " mobile-chrome-hidden" : ""}`}>
      <InspirationalQuote />
      <CoffeeButton />
      <MusicPlayer
        isOpen={panels.music}
        onToggle={() => togglePanel("music")}
        onPlayingChange={setIsMusicPlaying}
        hasControls={selectedMode === MODES.TIMER || selectedMode === MODES.POMODORO}
      />
      <TaskList isOpen={panels.tasks} onToggle={() => togglePanel("tasks")} />
      <NotesPanel
        isOpen={panels.notes}
        onToggle={() => togglePanel("notes")}
      />

      <main
        id="main-content"
        className="app-main"
        role="main"
        aria-label="Flip clock application"
        onTouchStart={handleMobileTouchStart}
        onTouchEnd={handleMobileTouchEnd}
      >
        <div
          className="clock-container"
          role="region"
          aria-label="Clock display and controls"
        >
          {/* Mobile-only mode badge — fades out after 3s; key resets animation on every change */}
          <div key={`ml-${selectedMode}`} className="mobile-mode-label" aria-hidden="true">
            {{ [MODES.CLOCK]: "Clock", [MODES.TIMER]: "Timer", [MODES.POMODORO]: "Pomodoro" }[selectedMode]}
          </div>
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
                openPanel("pomodoroSettings");
              } else {
                openPanel("timerSettings");
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
            onCustomizationClick={() => openPanel("customization")}
          />
        </div>

        <CustomizationPanel
          isOpen={panels.customization}
          onClose={() => closePanel("customization")}
        />

        <TimerSettings
          isOpen={panels.timerSettings}
          onClose={() => closePanel("timerSettings")}
          onSave={(hours, minutes, seconds) => {
            timer.setTimerTime(hours, minutes, seconds);
            closePanel("timerSettings");
          }}
          currentTimer={timer}
        />

        <PomodoroSettings
          isOpen={panels.pomodoroSettings}
          onClose={() => closePanel("pomodoroSettings")}
          onSave={(settings) => {
            pomodoroTimer.updatePomodoroSettings(settings);
            closePanel("pomodoroSettings");
            setLiveMessage("Pomodoro settings saved");
          }}
          currentSettings={pomodoroTimer.pomodoroSettings}
        />

        <LandscapeBar
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
          timer={timer}
          pomodoroTimer={pomodoroTimer}
          onCustomizationClick={() => openPanel("customization")}
        />

        <MobileBottomBar
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
          timer={timer}
          pomodoroTimer={pomodoroTimer}
          onSettingsClick={() => {
            if (selectedMode === MODES.POMODORO) {
              openPanel("pomodoroSettings");
            } else {
              openPanel("timerSettings");
            }
          }}
          onCustomizationClick={() => openPanel("customization")}
          isMusicOpen={panels.music}
          onMusicToggle={() => togglePanel("music")}
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
