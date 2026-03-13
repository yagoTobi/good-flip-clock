import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import {
  TIMER_STATES,
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

  // Persist original timer time to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("timerOriginalTime", JSON.stringify(originalTimerTime));
    } catch {}
  }, [originalTimerTime]);

  // Timer countdown logic - runs continuously when active
  // Uses setInterval to decrement time every second when RUNNING
  useEffect(() => {
    if (timerState !== TIMER_STATES.RUNNING) return;

    const timer = setInterval(() => {
      // Use functional state update to ensure we have the latest time value
      // This prevents stale closure issues with the interval callback
      setTimerTime((currentTime) => {
        // Capture current time as previous for flip animation support
        // This must happen before calculating the new time to ensure proper animation sequence
        setPrevTimerTime(currentTime);

        // Calculate new time by decrementing seconds, handling time unit rollovers
        // This logic handles the cascade effect: seconds -> minutes -> hours
        const { hours, minutes, seconds } = currentTime;
        let newTime;

        if (seconds > 0) {
          // Simple case: just decrement seconds (most common path)
          newTime = { ...currentTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          // Seconds rollover: decrement minutes, reset seconds to 59
          // This happens every minute when seconds reach 0
          newTime = { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          // Minutes rollover: decrement hours, reset minutes and seconds
          // This happens every hour when both minutes and seconds are 0
          newTime = { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Timer completed (00:00:00 reached) - stop the countdown
          // This is the terminal condition that ends the timer
          setTimerState(TIMER_STATES.STOPPED);
          playCompletionSound();
          newTime = currentTime; // Keep at 00:00:00 to show completion
        }

        return newTime;
      });
    }, 1000); // 1000ms = 1 second interval for real-time countdown

    return () => {
      clearInterval(timer);
    };
  }, [timerState]); // Only depend on timerState to avoid recreating interval unnecessarily

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
    setTimerTime(newTime);
    setPrevTimerTime(newTime);
    setOriginalTimerTime(newTime); // Remember this as the original time
  }, []);

  const revertToOriginalTime = useCallback(() => {
    // Use flushSync to ensure all state updates happen synchronously
    // This prevents React from batching updates and ensures proper animation sequence
    // Without flushSync, the animation might not trigger correctly due to batched updates
    flushSync(() => {
      setPrevTimerTime(timerTime); // Set current time as "previous" for flip animation
      setIsReverting(true); // Flag to indicate revert animation is active
      setTimerState(TIMER_STATES.STOPPED); // Stop any running timer
      setTimerTime(originalTimerTime); // Jump to original time (triggers flip animation)
    });

    // Clear revert flag and reset prevTimerTime after animation completes
    // This cleanup prevents visual glitches and ensures proper state for next operation
    setTimeout(() => {
      setIsReverting(false);
      setPrevTimerTime(originalTimerTime); // Sync prev with current to prevent flash
    }, 600); // Duration matches FLIP_ANIMATION_DURATION constant (600ms)
  }, [originalTimerTime, timerTime]);

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
    hasHours: originalTimerTime.hours > 0, // Base format on original time, not current
    isReverting, // Flag for revert animation

    // Controls
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    togglePlayPause,
    revertToOriginalTime,
    setTimerTime: setTimerTimeValues,
  };
}
