import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import {
  TIMER_STATES,
  DEFAULT_TIMER_HOURS,
  DEFAULT_TIMER_MINUTES,
  DEFAULT_TIMER_SECONDS,
} from "../constants";

const DEFAULT_TIME = {
  hours: DEFAULT_TIMER_HOURS,
  minutes: DEFAULT_TIMER_MINUTES,
  seconds: DEFAULT_TIMER_SECONDS,
};

export function useTimer() {
  const [timerState, setTimerState] = useState(TIMER_STATES.STOPPED);
  const [timerTime, setTimerTime] = useState(DEFAULT_TIME);
  const [prevTimerTime, setPrevTimerTime] = useState(DEFAULT_TIME);
  const [originalTimerTime, setOriginalTimerTime] = useState(DEFAULT_TIME); // Remember original time
  const [isReverting, setIsReverting] = useState(false); // Track revert animation

  // Timer countdown logic - runs continuously when active
  useEffect(() => {
    if (timerState !== TIMER_STATES.RUNNING) return;

    console.log("⏰ COUNTDOWN EFFECT STARTED");

    const timer = setInterval(() => {
      console.log("⏰ COUNTDOWN TICK");

      // First, capture current time for previous
      setTimerTime((currentTime) => {
        console.log("⏰ Current time:", currentTime);

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
          // Timer completed - stop at 00:00
          setTimerState(TIMER_STATES.STOPPED);
          newTime = currentTime;
        }

        console.log("⏰ New time:", newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      console.log("⏰ COUNTDOWN EFFECT CLEANUP");
      clearInterval(timer);
    };
  }, [timerState]); // Only depend on timerState, not timerTime!

  // Control functions - memoized for performance
  const startTimer = useCallback(() => {
    console.log("▶️ START TIMER called with:", {
      timerState,
      timerTime,
      originalTimerTime,
      prevTimerTime,
      isReverting,
    });

    // If timer is at 00:00, reset to default time
    if (
      timerState === TIMER_STATES.STOPPED &&
      timerTime.hours === 0 &&
      timerTime.minutes === 0 &&
      timerTime.seconds === 0
    ) {
      console.log(
        "▶️ Timer at 00:00, resetting to DEFAULT_TIME:",
        DEFAULT_TIME
      );
      setTimerTime(DEFAULT_TIME);
    }

    console.log("▶️ Setting timer state to RUNNING");
    setTimerState(TIMER_STATES.RUNNING);
  }, [timerState, timerTime, originalTimerTime, prevTimerTime, isReverting]);

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
    console.log("🔄 REVERT START:", {
      current: timerTime,
      original: originalTimerTime,
      prev: prevTimerTime,
    });

    // Use flushSync to ensure all state updates happen synchronously
    flushSync(() => {
      setPrevTimerTime(timerTime);
      setIsReverting(true);
      setTimerState(TIMER_STATES.STOPPED);
      setTimerTime(originalTimerTime);
    });

    console.log("🔄 REVERT COMPLETE");

    // Clear revert flag and reset prevTimerTime after animation
    setTimeout(() => {
      setIsReverting(false);
      setPrevTimerTime(originalTimerTime); // Reset prev to match current to prevent flash
      console.log("🔄 REVERT FLAG CLEARED");
    }, 600); // Match flip animation duration
  }, [originalTimerTime, timerTime, prevTimerTime]);

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
    revertToOriginalTime,
    setTimerTime: setTimerTimeValues,
  };
}
