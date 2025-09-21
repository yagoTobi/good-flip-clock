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

/**
 * Custom hook for Pomodoro timer functionality with session management
 *
 * Extends the basic timer functionality to support Pomodoro technique sessions including
 * focus periods, short breaks, and long breaks. Manages automatic session transitions,
 * cycle counting, and customizable durations. Compatible with useTimer interface while
 * adding Pomodoro-specific features like session types and auto-advancement.
 *
 * @returns {Object} Pomodoro timer state and control functions
 *
 * // Timer state (compatible with useTimer interface)
 * @returns {string} returns.timerState - Current timer state (TIMER_STATES)
 * @returns {number} returns.hours - Current hours (0-23)
 * @returns {number} returns.minutes - Current minutes (0-59)
 * @returns {number} returns.seconds - Current seconds (0-59)
 * @returns {number} returns.prevHours - Previous hours for flip animations
 * @returns {number} returns.prevMinutes - Previous minutes for flip animations
 * @returns {number} returns.prevSeconds - Previous seconds for flip animations
 * @returns {boolean} returns.isRunning - True when timer is actively running
 * @returns {boolean} returns.isPaused - True when timer is paused
 * @returns {boolean} returns.isStopped - True when timer is stopped
 * @returns {boolean} returns.hasHours - True if session duration includes hours
 * @returns {boolean} returns.isReverting - True during revert animation
 *
 * // Pomodoro-specific state
 * @returns {string} returns.sessionType - Current session type (FOCUS, SHORT_BREAK, LONG_BREAK)
 * @returns {number} returns.cycleCount - Number of completed focus sessions in current cycle
 * @returns {string} returns.currentTask - Current task name/description
 * @returns {boolean} returns.isAutoAdvancing - Whether sessions auto-advance when complete
 * @returns {string} returns.pomodoroState - Pomodoro-specific state (IDLE, ACTIVE, PAUSED, etc.)
 * @returns {Object} returns.pomodoroSettings - Current Pomodoro settings (durations, intervals)
 *
 * // Computed Pomodoro state
 * @returns {boolean} returns.isActive - True when Pomodoro session is actively running
 * @returns {boolean} returns.isTransitioning - True during session transition period
 * @returns {boolean} returns.isCompleted - True when session just completed
 * @returns {boolean} returns.isIdle - True when Pomodoro is idle/ready to start
 * @returns {boolean} returns.isFocusSession - True during focus sessions
 * @returns {boolean} returns.isBreakSession - True during any break session
 * @returns {boolean} returns.isLongBreak - True during long break sessions
 * @returns {number} returns.sessionsUntilLongBreak - Focus sessions remaining until long break
 *
 * // Timer controls (compatible with useTimer interface)
 * @returns {Function} returns.startTimer - Start or resume the current session
 * @returns {Function} returns.pauseTimer - Pause the running session
 * @returns {Function} returns.stopTimer - Stop the session (keeps current time)
 * @returns {Function} returns.resetTimer - Reset current session to full duration
 * @returns {Function} returns.revertToOriginalTime - Animate back to session start time
 *
 * // Pomodoro-specific controls
 * @returns {Function} returns.skipToNextSession - Skip current session and advance to next
 * @returns {Function} returns.switchToSessionType - Manually switch to specific session type
 * @returns {Function} returns.updatePomodoroSettings - Update session durations and settings
 * @returns {Function} returns.setTaskName - Set current task name/description
 * @returns {Function} returns.toggleAutoAdvance - Toggle automatic session advancement
 * @returns {Function} returns.resetCycle - Reset to beginning of Pomodoro cycle
 *
 * @example
 * const {
 *   sessionType, cycleCount, isActive,
 *   hours, minutes, seconds,
 *   startTimer, pauseTimer, skipToNextSession,
 *   updatePomodoroSettings, setTaskName
 * } = usePomodoroTimer();
 *
 * // Set task and start focus session
 * setTaskName("Write documentation");
 * startTimer();
 *
 * // Update session durations
 * updatePomodoroSettings({
 *   focusDuration: 25,
 *   shortBreakDuration: 5,
 *   longBreakDuration: 15
 * });
 */
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

  // Timer countdown logic - extends basic timer with Pomodoro session handling
  useEffect(() => {
    // Clean up any existing timer when not running
    if (timerState !== TIMER_STATES.RUNNING) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start countdown interval for active Pomodoro session
    timerRef.current = setInterval(() => {
      setTimerTime((currentTime) => {
        // Capture current time as previous for flip animation support
        setPrevTimerTime(currentTime);

        // Calculate new time by decrementing, handling rollovers
        const { hours, minutes, seconds } = currentTime;
        let newTime;

        if (seconds > 0) {
          newTime = { ...currentTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          newTime = { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          newTime = { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Pomodoro session completed (00:00:00 reached)
          setTimerState(TIMER_STATES.STOPPED);
          setPomodoroState(POMODORO_STATES.COMPLETED);

          // Trigger automatic session transition if auto-advance is enabled
          // This handles moving from focus->break or break->focus
          if (isAutoAdvancing) {
            handleSessionCompletion();
          }

          newTime = currentTime; // Keep at 00:00:00
        }

        return newTime;
      });
    }, 1000);

    // Cleanup interval on unmount or state change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerState, isAutoAdvancing]);

  // Session completion handler - manages Pomodoro session transitions
  // Automatically determines next session type based on current session and cycle count
  // This implements the core Pomodoro technique logic: work -> break -> work -> break...
  const handleSessionCompletion = useCallback(() => {
    if (sessionType === POMODORO_SESSION_TYPES.FOCUS) {
      // Completed a focus session - increment cycle count and determine break type
      // The cycle count tracks how many focus sessions have been completed
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);

      // Determine next session type based on cycle count and long break interval
      // Traditional Pomodoro: 4 focus sessions, then long break, then reset cycle
      if (newCycleCount >= pomodoroSettings.longBreakInterval) {
        // Reached long break interval - time for extended break and cycle reset
        // Example: After 4th focus session (25min each), take 15-30min long break
        setSessionType(POMODORO_SESSION_TYPES.LONG_BREAK);
        setCycleCount(0); // Reset cycle counter after long break
      } else {
        // Haven't reached long break interval - take short break
        // Example: After 1st, 2nd, 3rd focus session, take 5min short break
        setSessionType(POMODORO_SESSION_TYPES.SHORT_BREAK);
      }
    } else {
      // Completed any break session (short or long) - return to focus work
      // This handles both SHORT_BREAK and LONG_BREAK completion
      setSessionType(POMODORO_SESSION_TYPES.FOCUS);
    }

    // Set transitioning state to show completion message/animation
    // This gives user feedback that a session has completed before auto-advancing
    setPomodoroState(POMODORO_STATES.TRANSITIONING);

    // Auto-advance to next session after brief transition period (if enabled)
    // This allows users to see the completion state before automatically continuing
    if (isAutoAdvancing) {
      transitionTimeoutRef.current = setTimeout(() => {
        setPomodoroState(POMODORO_STATES.IDLE); // Ready to start next session
      }, 3000); // 3 second transition display allows user to see completion message
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
