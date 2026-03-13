import { useEffect } from "react";

/**
 * Global keyboard shortcuts for the flip clock app.
 * Shortcuts are suppressed when an input or textarea is focused.
 */
export function useKeyboardShortcuts({
  selectedMode,
  onModeChange,
  timer,
  pomodoroTimer,
  togglePanel,
  closeAll,
  toggleFullscreen,
  modes,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't fire shortcuts when typing in inputs
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case " ": {
          // Space: toggle play/pause for active timer mode
          e.preventDefault();
          if (selectedMode === modes.TIMER) {
            timer.togglePlayPause();
          } else if (selectedMode === modes.POMODORO) {
            pomodoroTimer.togglePlayPause();
          }
          break;
        }

        case "r":
        case "R": {
          // R: reset/revert timer
          if (selectedMode === modes.TIMER) {
            timer.revertToOriginalTime();
          } else if (selectedMode === modes.POMODORO) {
            pomodoroTimer.resetTimer();
          }
          break;
        }

        case "1": {
          onModeChange(modes.CLOCK);
          break;
        }
        case "2": {
          onModeChange(modes.TIMER);
          break;
        }
        case "3": {
          onModeChange(modes.POMODORO);
          break;
        }

        case "f":
        case "F": {
          // F: toggle fullscreen
          if (toggleFullscreen) toggleFullscreen();
          break;
        }

        case "Escape": {
          // Escape: close all panels (handled by individual panels too, but this is a global fallback)
          closeAll();
          break;
        }

        case "c":
        case "C": {
          // C: open customization
          togglePanel("customization");
          break;
        }

        case "m":
        case "M": {
          // M: toggle music
          togglePanel("music");
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMode, onModeChange, timer, pomodoroTimer, togglePanel, closeAll, toggleFullscreen, modes]);
}
