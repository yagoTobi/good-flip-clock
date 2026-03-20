import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import {
  TIMER_STATES,
  TIMER_MODES,
  DEFAULT_TIMER_HOURS,
  DEFAULT_TIMER_MINUTES,
  DEFAULT_TIMER_SECONDS,
} from "../constants";
import { playCompletionSound } from "../utils/sounds";

const DEFAULT_TIME = {
  hours: DEFAULT_TIMER_HOURS,
  minutes: DEFAULT_TIMER_MINUTES,
  seconds: DEFAULT_TIMER_SECONDS,
};

const loadSavedTime = () => {
  try {
    const saved = localStorage.getItem("timerOriginalTime");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.hours === "number" && typeof parsed.minutes === "number" && typeof parsed.seconds === "number") {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_TIME;
};

/**
 * Custom hook for countdown timer functionality with flip animation support
 *
 * Provides comprehensive timer state management including start, pause, stop, and reset controls.
 * Includes support for flip card animations by tracking previous time values and revert operations.
 * The timer automatically stops when reaching 00:00:00 and can be configured with custom durations.
 *
 * @returns {Object} Timer state and control functions
 * @returns {string} returns.timerState - Current timer state (TIMER_STATES.RUNNING, PAUSED, or STOPPED)
 * @returns {number} returns.hours - Current hours (0-23)
 * @returns {number} returns.minutes - Current minutes (0-59)
 * @returns {number} returns.seconds - Current seconds (0-59)
 * @returns {number} returns.prevHours - Previous hours value for flip animations
 * @returns {number} returns.prevMinutes - Previous minutes value for flip animations
 * @returns {number} returns.prevSeconds - Previous seconds value for flip animations
 * @returns {boolean} returns.isRunning - True when timer is actively counting down
 * @returns {boolean} returns.isPaused - True when timer is paused
 * @returns {boolean} returns.isStopped - True when timer is stopped
 * @returns {boolean} returns.hasHours - True if original timer duration includes hours
 * @returns {boolean} returns.isReverting - True during revert animation to original time
 * @returns {Function} returns.startTimer - Start or resume the countdown timer
 * @returns {Function} returns.pauseTimer - Pause the running timer
 * @returns {Function} returns.stopTimer - Stop the timer (keeps current time)
 * @returns {Function} returns.resetTimer - Reset timer to default time and stop
 * @returns {Function} returns.revertToOriginalTime - Animate back to original timer duration
 * @returns {Function} returns.setTimerTime - Set custom timer duration (hours, minutes, seconds)
 *
 * @example
 * const {
 *   hours, minutes, seconds,
 *   isRunning, isPaused,
 *   startTimer, pauseTimer, resetTimer,
 *   setTimerTime
 * } = useTimer();
 *
 * Set custom timer duration
 * setTimerTime(0, 25, 0); // 25 minutes
 *
 * Control timer
 * startTimer(); // Begin countdown
 * pauseTimer(); // Pause countdown
 * resetTimer(); // Reset to default time
 */
export function useTimer() {
  const [timerState, setTimerState] = useState(TIMER_STATES.STOPPED);
  const [timerTime, setTimerTime] = useState(loadSavedTime);
  const [prevTimerTime, setPrevTimerTime] = useState(loadSavedTime);
  const [originalTimerTime, setOriginalTimerTime] = useState(loadSavedTime); // Remember original time
  const [isReverting, setIsReverting] = useState(false); // Track revert animation
  const [timerMode, setTimerMode] = useState(TIMER_MODES.DURATION);
  const [endAtTarget, setEndAtTarget] = useState(null); // Timestamp for endAt mode
  const [endAtHasHours, setEndAtHasHours] = useState(false); // Lock format when endAt starts

  // Persist original timer time to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("timerOriginalTime", JSON.stringify(originalTimerTime));
    } catch {}
  }, [originalTimerTime]);

  // Timer countdown logic - runs continuously when active
  useEffect(() => {
    if (timerState !== TIMER_STATES.RUNNING) return;

    // End At mode: wall-clock based countdown (immune to drift)
    if (timerMode === TIMER_MODES.END_AT && endAtTarget) {
      const interval = setInterval(() => {
        const remainingMs = endAtTarget - Date.now();

        if (remainingMs <= 0) {
          setTimerState(TIMER_STATES.STOPPED);
          setTimerMode(TIMER_MODES.DURATION);
          setEndAtTarget(null);
          playCompletionSound();
          setTimerTime((prev) => {
            setPrevTimerTime(prev);
            return { hours: 0, minutes: 0, seconds: 0 };
          });
          return;
        }

        const totalSeconds = Math.ceil(remainingMs / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        setTimerTime((prev) => {
          setPrevTimerTime(prev);
          return { hours: h, minutes: m, seconds: s };
        });
      }, 1000);

      return () => clearInterval(interval);
    }

    // Duration mode: decrement-based countdown
    const timer = setInterval(() => {
      setTimerTime((currentTime) => {
        setPrevTimerTime(currentTime);

        const { hours, minutes, seconds } = currentTime;
        let newTime;

        if (seconds > 0) {
          newTime = { ...currentTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          newTime = { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          newTime = { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          setTimerState(TIMER_STATES.STOPPED);
          playCompletionSound();
          newTime = currentTime;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerState, timerMode, endAtTarget]);

  // Control functions - memoized for performance
  const startTimer = useCallback(() => {
    // If timer is at 00:00, reset to default time
    if (
      timerState === TIMER_STATES.STOPPED &&
      timerTime.hours === 0 &&
      timerTime.minutes === 0 &&
      timerTime.seconds === 0
    ) {
      setTimerTime(DEFAULT_TIME);
    }

    setTimerState(TIMER_STATES.RUNNING);
  }, [timerState, timerTime]);

  const pauseTimer = useCallback(() => {
    setTimerState(TIMER_STATES.PAUSED);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(TIMER_STATES.STOPPED);
    setTimerTime(DEFAULT_TIME);
    setPrevTimerTime(DEFAULT_TIME);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState(TIMER_STATES.STOPPED);
    // Keep current time values, just stop the countdown
  }, []);

  const togglePlayPause = useCallback(() => {
    if (timerState === TIMER_STATES.STOPPED || timerState === TIMER_STATES.PAUSED) {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [timerState, startTimer, pauseTimer]);

  const setTimerTimeValues = useCallback((newHours, newMinutes, newSeconds) => {
    const newTime = {
      hours: newHours,
      minutes: newMinutes,
      seconds: newSeconds,
    };
    // Cancel endAt mode if active
    if (timerMode === TIMER_MODES.END_AT) {
      setTimerMode(TIMER_MODES.DURATION);
      setEndAtTarget(null);
      setTimerState(TIMER_STATES.STOPPED);
    }
    setTimerTime(newTime);
    setPrevTimerTime(newTime);
    setOriginalTimerTime(newTime);
  }, [timerMode]);

  const revertToOriginalTime = useCallback(() => {
    if (timerMode === TIMER_MODES.END_AT) {
      // Cancel endAt mode and revert to saved duration
      flushSync(() => {
        setTimerMode(TIMER_MODES.DURATION);
        setEndAtTarget(null);
        setPrevTimerTime(timerTime);
        setIsReverting(true);
        setTimerState(TIMER_STATES.STOPPED);
        setTimerTime(originalTimerTime);
      });
      setTimeout(() => {
        setIsReverting(false);
        setPrevTimerTime(originalTimerTime);
      }, 600);
      return;
    }

    flushSync(() => {
      setPrevTimerTime(timerTime);
      setIsReverting(true);
      setTimerState(TIMER_STATES.STOPPED);
      setTimerTime(originalTimerTime);
    });

    setTimeout(() => {
      setIsReverting(false);
      setPrevTimerTime(originalTimerTime);
    }, 600);
  }, [originalTimerTime, timerTime, timerMode]);

  const startEndAtTimer = useCallback((targetTimestamp) => {
    const remainingMs = targetTimestamp - Date.now();
    if (remainingMs <= 0) return;

    const totalSeconds = Math.ceil(remainingMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const initialTime = { hours: h, minutes: m, seconds: s };

    setEndAtTarget(targetTimestamp);
    setEndAtHasHours(h > 0);
    setTimerMode(TIMER_MODES.END_AT);
    setTimerTime(initialTime);
    setPrevTimerTime(initialTime);
    setTimerState(TIMER_STATES.RUNNING);
  }, []);

  return {
    // State
    timerState,
    hours: timerTime.hours,
    minutes: timerTime.minutes,
    seconds: timerTime.seconds,
    prevHours: prevTimerTime.hours,
    prevMinutes: prevTimerTime.minutes,
    prevSeconds: prevTimerTime.seconds,

    // Computed
    isRunning: timerState === TIMER_STATES.RUNNING,
    isPaused: timerState === TIMER_STATES.PAUSED,
    isStopped: timerState === TIMER_STATES.STOPPED,
    hasHours: timerMode === TIMER_MODES.END_AT ? endAtHasHours : originalTimerTime.hours > 0,
    isReverting,
    isEndAtMode: timerMode === TIMER_MODES.END_AT,
    endAtTarget,

    // Controls
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    togglePlayPause,
    revertToOriginalTime,
    startEndAtTimer,
    setTimerTime: setTimerTimeValues,
  };
}
