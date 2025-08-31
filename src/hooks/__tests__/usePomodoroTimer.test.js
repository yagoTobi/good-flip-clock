import { renderHook, act } from "@testing-library/react";
import { usePomodoroTimer } from "../usePomodoroTimer";
import {
  TIMER_STATES,
  POMODORO_SESSION_TYPES,
  POMODORO_STATES,
  POMODORO_SETTINGS_DEFAULTS,
} from "../../constants/index.js";

// Mock timers
jest.useFakeTimers();

describe("usePomodoroTimer", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe("Initial State", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.timerState).toBe(TIMER_STATES.STOPPED);
      expect(result.current.sessionType).toBe(POMODORO_SESSION_TYPES.FOCUS);
      expect(result.current.cycleCount).toBe(0);
      expect(result.current.currentTask).toBe("");
      expect(result.current.isAutoAdvancing).toBe(true);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.IDLE);
      expect(result.current.minutes).toBe(25); // Default focus duration
      expect(result.current.seconds).toBe(0);
      expect(result.current.hours).toBe(0);
    });

    it("should initialize with default Pomodoro settings", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.pomodoroSettings).toEqual(
        POMODORO_SETTINGS_DEFAULTS
      );
    });
  });

  describe("Timer Controls", () => {
    it("should start timer and update state correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      expect(result.current.timerState).toBe(TIMER_STATES.RUNNING);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.ACTIVE);
      expect(result.current.isRunning).toBe(true);
      expect(result.current.isActive).toBe(true);
    });

    it("should pause timer correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        result.current.pauseTimer();
      });

      expect(result.current.timerState).toBe(TIMER_STATES.PAUSED);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.PAUSED);
      expect(result.current.isPaused).toBe(true);
    });

    it("should reset timer to session duration", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Start and let some time pass
      act(() => {
        result.current.startTimer();
      });

      // Simulate some countdown
      act(() => {
        jest.advanceTimersByTime(5000); // 5 seconds
      });

      act(() => {
        result.current.resetTimer();
      });

      expect(result.current.timerState).toBe(TIMER_STATES.STOPPED);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.IDLE);
      expect(result.current.minutes).toBe(25); // Back to focus duration
      expect(result.current.seconds).toBe(0);
    });

    it("should stop timer correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.timerState).toBe(TIMER_STATES.STOPPED);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.IDLE);
    });
  });

  describe("Session Type Management", () => {
    it("should switch session types correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.switchToSessionType(POMODORO_SESSION_TYPES.SHORT_BREAK);
      });

      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.SHORT_BREAK
      );
      expect(result.current.minutes).toBe(5); // Default short break duration
      expect(result.current.timerState).toBe(TIMER_STATES.STOPPED);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.IDLE);
    });

    it("should update timer duration when switching session types", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Switch to long break
      act(() => {
        result.current.switchToSessionType(POMODORO_SESSION_TYPES.LONG_BREAK);
      });

      expect(result.current.minutes).toBe(15); // Default long break duration

      // Switch back to focus
      act(() => {
        result.current.switchToSessionType(POMODORO_SESSION_TYPES.FOCUS);
      });

      expect(result.current.minutes).toBe(25); // Default focus duration
    });
  });

  describe("Cycle Counting Logic", () => {
    it("should increment cycle count after completing focus session", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Start focus session
      act(() => {
        result.current.startTimer();
      });

      // Fast forward to completion (25 minutes = 1500 seconds)
      act(() => {
        jest.advanceTimersByTime(1500 * 1000);
      });

      expect(result.current.cycleCount).toBe(1);
      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.SHORT_BREAK
      );
    });

    it("should trigger long break after 4 completed focus sessions", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Complete 4 focus sessions
      for (let i = 0; i < 4; i++) {
        // Start focus session
        act(() => {
          result.current.switchToSessionType(POMODORO_SESSION_TYPES.FOCUS);
          result.current.startTimer();
        });

        // Complete focus session
        act(() => {
          jest.advanceTimersByTime(1500 * 1000); // 25 minutes
        });

        if (i < 3) {
          expect(result.current.sessionType).toBe(
            POMODORO_SESSION_TYPES.SHORT_BREAK
          );
          // Complete break to continue cycle
          act(() => {
            result.current.switchToSessionType(POMODORO_SESSION_TYPES.FOCUS);
          });
        }
      }

      // After 4th focus session, should trigger long break
      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.LONG_BREAK
      );
      expect(result.current.cycleCount).toBe(0); // Reset after long break trigger
    });

    it("should reset cycle count after long break", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Manually set cycle count to trigger long break
      act(() => {
        // Simulate being at 4 focus sessions
        for (let i = 0; i < 4; i++) {
          result.current.skipToNextSession();
          if (
            result.current.sessionType === POMODORO_SESSION_TYPES.SHORT_BREAK
          ) {
            result.current.switchToSessionType(POMODORO_SESSION_TYPES.FOCUS);
          }
        }
      });

      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.LONG_BREAK
      );
      expect(result.current.cycleCount).toBe(0);
    });
  });

  describe("Session Transitions", () => {
    it("should skip to next session correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Start in focus session
      expect(result.current.sessionType).toBe(POMODORO_SESSION_TYPES.FOCUS);
      expect(result.current.cycleCount).toBe(0);

      act(() => {
        result.current.skipToNextSession();
      });

      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.SHORT_BREAK
      );
      expect(result.current.cycleCount).toBe(1);
    });

    it("should handle auto-advance correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Start focus session with auto-advance enabled
      act(() => {
        result.current.startTimer();
      });

      // Complete the session
      act(() => {
        jest.advanceTimersByTime(1500 * 1000); // 25 minutes
      });

      expect(result.current.pomodoroState).toBe(POMODORO_STATES.COMPLETED);
      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.SHORT_BREAK
      );

      // Should transition to idle after delay
      act(() => {
        jest.advanceTimersByTime(3000); // 3 second transition
      });

      expect(result.current.pomodoroState).toBe(POMODORO_STATES.IDLE);
    });

    it("should toggle auto-advance setting", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.isAutoAdvancing).toBe(true);

      act(() => {
        result.current.toggleAutoAdvance();
      });

      expect(result.current.isAutoAdvancing).toBe(false);

      act(() => {
        result.current.toggleAutoAdvance();
      });

      expect(result.current.isAutoAdvancing).toBe(true);
    });
  });

  describe("Task Management", () => {
    it("should set and update task name", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.setTaskName("Write unit tests");
      });

      expect(result.current.currentTask).toBe("Write unit tests");

      act(() => {
        result.current.setTaskName("Review code");
      });

      expect(result.current.currentTask).toBe("Review code");
    });
  });

  describe("Settings Management", () => {
    it("should update Pomodoro settings", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      const newSettings = {
        focusDuration: 30,
        shortBreakDuration: 10,
        longBreakDuration: 20,
      };

      act(() => {
        result.current.updatePomodoroSettings(newSettings);
      });

      expect(result.current.pomodoroSettings.focusDuration).toBe(30);
      expect(result.current.pomodoroSettings.shortBreakDuration).toBe(10);
      expect(result.current.pomodoroSettings.longBreakDuration).toBe(20);
    });

    it("should update timer duration when settings change and timer is idle", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.updatePomodoroSettings({ focusDuration: 30 });
      });

      expect(result.current.minutes).toBe(30);
    });
  });

  describe("Cycle Reset", () => {
    it("should reset cycle completely", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Set some state
      act(() => {
        result.current.setTaskName("Test task");
        result.current.skipToNextSession(); // Move to break
      });

      expect(result.current.sessionType).toBe(
        POMODORO_SESSION_TYPES.SHORT_BREAK
      );
      expect(result.current.cycleCount).toBe(1);

      act(() => {
        result.current.resetCycle();
      });

      expect(result.current.sessionType).toBe(POMODORO_SESSION_TYPES.FOCUS);
      expect(result.current.cycleCount).toBe(0);
      expect(result.current.timerState).toBe(TIMER_STATES.STOPPED);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.IDLE);
      expect(result.current.minutes).toBe(25); // Back to focus duration
    });
  });

  describe("Computed Properties", () => {
    it("should correctly identify session types", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Focus session
      expect(result.current.isFocusSession).toBe(true);
      expect(result.current.isBreakSession).toBe(false);
      expect(result.current.isLongBreak).toBe(false);

      // Short break
      act(() => {
        result.current.switchToSessionType(POMODORO_SESSION_TYPES.SHORT_BREAK);
      });

      expect(result.current.isFocusSession).toBe(false);
      expect(result.current.isBreakSession).toBe(true);
      expect(result.current.isLongBreak).toBe(false);

      // Long break
      act(() => {
        result.current.switchToSessionType(POMODORO_SESSION_TYPES.LONG_BREAK);
      });

      expect(result.current.isFocusSession).toBe(false);
      expect(result.current.isBreakSession).toBe(true);
      expect(result.current.isLongBreak).toBe(true);
    });

    it("should calculate sessions until long break correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.sessionsUntilLongBreak).toBe(4); // 4 - 0

      // Complete one session
      act(() => {
        result.current.skipToNextSession();
      });

      expect(result.current.sessionsUntilLongBreak).toBe(3); // 4 - 1
    });
  });

  describe("Timer Countdown", () => {
    it("should countdown correctly when running", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      // Initial state: 25:00
      expect(result.current.minutes).toBe(25);
      expect(result.current.seconds).toBe(0);

      // After 1 second: 24:59
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.minutes).toBe(24);
      expect(result.current.seconds).toBe(59);

      // After 1 minute total: 24:00
      act(() => {
        jest.advanceTimersByTime(59000);
      });

      expect(result.current.minutes).toBe(24);
      expect(result.current.seconds).toBe(0);
    });

    it("should handle session completion correctly", () => {
      const { result } = renderHook(() => usePomodoroTimer());

      // Set a very short duration for testing
      act(() => {
        result.current.updatePomodoroSettings({ focusDuration: 0 });
        result.current.switchToSessionType(POMODORO_SESSION_TYPES.FOCUS);
        result.current.startTimer();
      });

      // Should complete immediately and transition
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.timerState).toBe(TIMER_STATES.STOPPED);
      expect(result.current.pomodoroState).toBe(POMODORO_STATES.COMPLETED);
    });
  });
});
