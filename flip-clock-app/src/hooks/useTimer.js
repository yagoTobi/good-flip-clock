import { useState, useEffect, useCallback } from "react";
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

  // Timer countdown logic - runs continuously when active
  useEffect(() => {
    if (timerState !== TIMER_STATES.RUNNING) return;

    const timer = setInterval(() => {
      setTimerTime((currentTime) => {
        // Store current time as previous BEFORE updating (like ClockDisplay)
        setPrevTimerTime(currentTime);

        const { hours, minutes, seconds } = currentTime;

        // Calculate new time
        if (seconds > 0) {
          return { ...currentTime, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Timer completed - stop at 00:00
          setTimerState(TIMER_STATES.STOPPED);
          return currentTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerState]);

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

  const setTimerTimeValues = useCallback((newHours, newMinutes, newSeconds) => {
    const newTime = {
      hours: newHours,
      minutes: newMinutes,
      seconds: newSeconds,
    };
    setTimerTime(newTime);
    setPrevTimerTime(newTime);
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
    hasHours: timerTime.hours > 0,

    // Controls
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerTime: setTimerTimeValues,
  };
}
