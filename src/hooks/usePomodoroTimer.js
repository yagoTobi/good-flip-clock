import { useState, useEffect, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import {
  TIMER_STATES,
  POMODORO_SESSION_TYPES,
  POMODORO_STATES,
  POMODORO_SETTINGS_DEFAULTS,
  POMODORO_DEFAULTS,
} from "../constants/index.js";

const DEFAULT_POMODORO_TIME = {
  hours: 0,
  minutes: POMODORO_DEFAULTS.FOCUS_DURATION,
  seconds: 0,
};

export function usePomodoroTimer() {
  // Core timer state (extending useTimer patterns)
  const [timerState, setTimerState] = useState(TIMER_STATES.STOPPED);
  const [timerTime, setTimerTime] = useState(DEFAULT_POMODORO_TIME);
  const [prevTimerTime, setPrevTimerTime] = useState(DEFAULT_POMODORO_TIME);
  const [originalTimerTime, setOriginalTimerTime] = useState(
    DEFAULT_POMODORO_TIME
  );
  const [isReverting, setIsReverting] = useState(false);

  // Pomodoro-specific state
  const [sessionType, setSessionType] = useState(POMODORO_SESSION_TYPES.FOCUS);
  const [cycleCount, setCycleCount] = useState(0); // Completed focus sessions in current cycle
  const [currentTask, setCurrentTask] = useState("");
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(true);
  const [pomodoroState, setPomodoroState] = useState(POMODORO_STATES.IDLE);

  // Settings state
  const [pomodoroSettings, setPomodoroSettings] = useState(
    POMODORO_SETTINGS_DEFAULTS
  );

  // Refs for cleanup
  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Helper function to get session duration based on type
  const getSessionDuration = useCallback(
    (type) => {
      switch (type) {
        case POMODORO_SESSION_TYPES.FOCUS:
          return {
            hours: 0,
            minutes: pomodoroSettings.focusDuration,
            seconds: 0,
          };
        case POMODORO_SESSION_TYPES.SHORT_BREAK:
          return {
            hours: 0,
            minutes: pomodoroSettings.shortBreakDuration,
            seconds: 0,
          };
        case POMODORO_SESSION_TYPES.LONG_BREAK:
          return {
            hours: 0,
            minutes: pomodoroSettings.longBreakDuration,
            seconds: 0,
          };
        default:
          return DEFAULT_POMODORO_TIME;
      }
    },
    [pomodoroSettings]
  );

  // Initialize timer with current session duration
  useEffect(() => {
    const duration = getSessionDuration(sessionType);
    setTimerTime(duration);
    setPrevTimerTime(duration);
    setOriginalTimerTime(duration);
  }, [sessionType, getSessionDuration]);

  // Timer countdown logic - runs continuously when active
  useEffect(() => {
    if (timerState !== TIMER_STATES.RUNNING) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerTime((currentTime) => {
        // Set this as previous time
        setPrevTimerTime(currentTime);

        // Calculate new time
        const { hours, minutes, seconds } = currentTime;
        let newTime;

        if (seconds > 0) {
          newTime = { ...currentTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          newTime = { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          newTime = { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Session completed
          setTimerState(TIMER_STATES.STOPPED);
          setPomodoroState(POMODORO_STATES.COMPLETED);

          // Trigger session completion logic
          if (isAutoAdvancing) {
            handleSessionCompletion();
          }

          newTime = currentTime;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerState, isAutoAdvancing]);

  // Session completion handler
  const handleSessionCompletion = useCallback(() => {
    if (sessionType === POMODORO_SESSION_TYPES.FOCUS) {
      // Completed a focus session
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);

      // Determine next session type based on cycle count
      if (newCycleCount >= pomodoroSettings.longBreakInterval) {
        // Time for long break, reset cycle
        setSessionType(POMODORO_SESSION_TYPES.LONG_BREAK);
        setCycleCount(0);
      } else {
        // Short break
        setSessionType(POMODORO_SESSION_TYPES.SHORT_BREAK);
      }
    } else {
      // Completed a break session, return to focus
      setSessionType(POMODORO_SESSION_TYPES.FOCUS);
    }

    setPomodoroState(POMODORO_STATES.TRANSITIONING);

    // Auto-advance to next session after a brief delay
    if (isAutoAdvancing) {
      transitionTimeoutRef.current = setTimeout(() => {
        setPomodoroState(POMODORO_STATES.IDLE);
      }, 3000); // 3 second transition display
    }
  }, [
    sessionType,
    cycleCount,
    pomodoroSettings.longBreakInterval,
    isAutoAdvancing,
  ]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Control functions - extending useTimer patterns
  const startTimer = useCallback(() => {
    // If timer is at 00:00, reset to session duration
    if (
      timerState === TIMER_STATES.STOPPED &&
      timerTime.hours === 0 &&
      timerTime.minutes === 0 &&
      timerTime.seconds === 0
    ) {
      const duration = getSessionDuration(sessionType);
      setTimerTime(duration);
      setOriginalTimerTime(duration);
    }

    setTimerState(TIMER_STATES.RUNNING);
    setPomodoroState(POMODORO_STATES.ACTIVE);
  }, [timerState, timerTime, sessionType, getSessionDuration]);

  const pauseTimer = useCallback(() => {
    setTimerState(TIMER_STATES.PAUSED);
    setPomodoroState(POMODORO_STATES.PAUSED);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(TIMER_STATES.STOPPED);
    setPomodoroState(POMODORO_STATES.IDLE);

    const duration = getSessionDuration(sessionType);
    setTimerTime(duration);
    setPrevTimerTime(duration);
    setOriginalTimerTime(duration);
  }, [sessionType, getSessionDuration]);

  const stopTimer = useCallback(() => {
    setTimerState(TIMER_STATES.STOPPED);
    setPomodoroState(POMODORO_STATES.IDLE);
  }, []);

  // Pomodoro-specific session management
  const skipToNextSession = useCallback(() => {
    // Stop current timer
    setTimerState(TIMER_STATES.STOPPED);

    // Trigger session completion logic
    handleSessionCompletion();
  }, [handleSessionCompletion]);

  const switchToSessionType = useCallback(
    (newSessionType) => {
      // Stop current timer
      setTimerState(TIMER_STATES.STOPPED);
      setPomodoroState(POMODORO_STATES.IDLE);

      // Switch session type
      setSessionType(newSessionType);

      // Reset timer to new session duration
      const duration = getSessionDuration(newSessionType);
      setTimerTime(duration);
      setPrevTimerTime(duration);
      setOriginalTimerTime(duration);
    },
    [getSessionDuration]
  );

  const updatePomodoroSettings = useCallback(
    (newSettings) => {
      setPomodoroSettings((prev) => ({ ...prev, ...newSettings }));

      // If currently idle, update timer to reflect new duration
      if (pomodoroState === POMODORO_STATES.IDLE) {
        const duration = getSessionDuration(sessionType);
        setTimerTime(duration);
        setPrevTimerTime(duration);
        setOriginalTimerTime(duration);
      }
    },
    [pomodoroState, sessionType, getSessionDuration]
  );

  const setTaskName = useCallback((task) => {
    setCurrentTask(task);
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setIsAutoAdvancing((prev) => !prev);
  }, []);

  // Reset cycle (useful for starting fresh)
  const resetCycle = useCallback(() => {
    setCycleCount(0);
    setSessionType(POMODORO_SESSION_TYPES.FOCUS);
    setTimerState(TIMER_STATES.STOPPED);
    setPomodoroState(POMODORO_STATES.IDLE);

    const duration = getSessionDuration(POMODORO_SESSION_TYPES.FOCUS);
    setTimerTime(duration);
    setPrevTimerTime(duration);
    setOriginalTimerTime(duration);
  }, [getSessionDuration]);

  const revertToOriginalTime = useCallback(() => {
    flushSync(() => {
      setPrevTimerTime(timerTime);
      setIsReverting(true);
      setTimerState(TIMER_STATES.STOPPED);
      setPomodoroState(POMODORO_STATES.IDLE);
      setTimerTime(originalTimerTime);
    });

    setTimeout(() => {
      setIsReverting(false);
      setPrevTimerTime(originalTimerTime);
    }, 600);
  }, [originalTimerTime, timerTime]);

  return {
    // Timer state (compatible with useTimer interface)
    timerState,
    hours: timerTime.hours,
    minutes: timerTime.minutes,
    seconds: timerTime.seconds,
    prevHours: prevTimerTime.hours,
    prevMinutes: prevTimerTime.minutes,
    prevSeconds: prevTimerTime.seconds,

    // Computed timer state
    isRunning: timerState === TIMER_STATES.RUNNING,
    isPaused: timerState === TIMER_STATES.PAUSED,
    isStopped: timerState === TIMER_STATES.STOPPED,
    hasHours: originalTimerTime.hours > 0,
    isReverting,

    // Pomodoro-specific state
    sessionType,
    cycleCount,
    currentTask,
    isAutoAdvancing,
    pomodoroState,
    pomodoroSettings,

    // Computed Pomodoro state
    isActive: pomodoroState === POMODORO_STATES.ACTIVE,
    isTransitioning: pomodoroState === POMODORO_STATES.TRANSITIONING,
    isCompleted: pomodoroState === POMODORO_STATES.COMPLETED,
    isIdle: pomodoroState === POMODORO_STATES.IDLE,
    isFocusSession: sessionType === POMODORO_SESSION_TYPES.FOCUS,
    isBreakSession:
      sessionType === POMODORO_SESSION_TYPES.SHORT_BREAK ||
      sessionType === POMODORO_SESSION_TYPES.LONG_BREAK,
    isLongBreak: sessionType === POMODORO_SESSION_TYPES.LONG_BREAK,
    sessionsUntilLongBreak: pomodoroSettings.longBreakInterval - cycleCount,

    // Timer controls (compatible with useTimer interface)
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    revertToOriginalTime,

    // Pomodoro-specific controls
    skipToNextSession,
    switchToSessionType,
    updatePomodoroSettings,
    setTaskName,
    toggleAutoAdvance,
    resetCycle,
  };
}
