import React from "react";
import { usePomodoroTimer } from "../usePomodoroTimer.js";
import { POMODORO_SESSION_TYPES } from "../../constants/index.js";

// Test component to verify usePomodoroTimer hook works in React context
export function PomodoroTimerTestComponent() {
  const pomodoroTimer = usePomodoroTimer();

  const handleStartTimer = () => {
    pomodoroTimer.startTimer();
  };

  const handlePauseTimer = () => {
    pomodoroTimer.pauseTimer();
  };

  const handleResetTimer = () => {
    pomodoroTimer.resetTimer();
  };

  const handleSkipSession = () => {
    pomodoroTimer.skipToNextSession();
  };

  const handleSwitchToBreak = () => {
    pomodoroTimer.switchToSessionType(POMODORO_SESSION_TYPES.SHORT_BREAK);
  };

  const handleSetTask = () => {
    pomodoroTimer.setTaskName("Test Task");
  };

  const handleUpdateSettings = () => {
    pomodoroTimer.updatePomodoroSettings({
      focusDuration: 30,
      shortBreakDuration: 10,
    });
  };

  return (
    <div data-testid="pomodoro-timer-test">
      <h2>Pomodoro Timer Test Component</h2>

      {/* Timer Display */}
      <div data-testid="timer-display">
        <span data-testid="hours">
          {String(pomodoroTimer.hours).padStart(2, "0")}
        </span>
        :
        <span data-testid="minutes">
          {String(pomodoroTimer.minutes).padStart(2, "0")}
        </span>
        :
        <span data-testid="seconds">
          {String(pomodoroTimer.seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Session Info */}
      <div data-testid="session-info">
        <p data-testid="session-type">Session: {pomodoroTimer.sessionType}</p>
        <p data-testid="cycle-count">Cycle: {pomodoroTimer.cycleCount}</p>
        <p data-testid="current-task">
          Task: {pomodoroTimer.currentTask || "No task set"}
        </p>
        <p data-testid="timer-state">State: {pomodoroTimer.timerState}</p>
        <p data-testid="pomodoro-state">
          Pomodoro State: {pomodoroTimer.pomodoroState}
        </p>
      </div>

      {/* Status Indicators */}
      <div data-testid="status-indicators">
        <p data-testid="is-running">
          Running: {pomodoroTimer.isRunning ? "Yes" : "No"}
        </p>
        <p data-testid="is-paused">
          Paused: {pomodoroTimer.isPaused ? "Yes" : "No"}
        </p>
        <p data-testid="is-focus">
          Focus Session: {pomodoroTimer.isFocusSession ? "Yes" : "No"}
        </p>
        <p data-testid="is-break">
          Break Session: {pomodoroTimer.isBreakSession ? "Yes" : "No"}
        </p>
        <p data-testid="is-auto-advancing">
          Auto Advance: {pomodoroTimer.isAutoAdvancing ? "Yes" : "No"}
        </p>
      </div>

      {/* Controls */}
      <div data-testid="controls">
        <button data-testid="start-button" onClick={handleStartTimer}>
          Start
        </button>
        <button data-testid="pause-button" onClick={handlePauseTimer}>
          Pause
        </button>
        <button data-testid="reset-button" onClick={handleResetTimer}>
          Reset
        </button>
        <button data-testid="skip-button" onClick={handleSkipSession}>
          Skip Session
        </button>
        <button data-testid="switch-break-button" onClick={handleSwitchToBreak}>
          Switch to Break
        </button>
        <button data-testid="set-task-button" onClick={handleSetTask}>
          Set Test Task
        </button>
        <button
          data-testid="update-settings-button"
          onClick={handleUpdateSettings}
        >
          Update Settings
        </button>
        <button
          data-testid="toggle-auto-advance-button"
          onClick={pomodoroTimer.toggleAutoAdvance}
        >
          Toggle Auto Advance
        </button>
      </div>

      {/* Settings Display */}
      <div data-testid="settings-display">
        <h3>Current Settings</h3>
        <p data-testid="focus-duration">
          Focus: {pomodoroTimer.pomodoroSettings.focusDuration} min
        </p>
        <p data-testid="short-break-duration">
          Short Break: {pomodoroTimer.pomodoroSettings.shortBreakDuration} min
        </p>
        <p data-testid="long-break-duration">
          Long Break: {pomodoroTimer.pomodoroSettings.longBreakDuration} min
        </p>
        <p data-testid="long-break-interval">
          Long Break Interval:{" "}
          {pomodoroTimer.pomodoroSettings.longBreakInterval}
        </p>
      </div>

      {/* Computed Values */}
      <div data-testid="computed-values">
        <p data-testid="sessions-until-long-break">
          Sessions until long break: {pomodoroTimer.sessionsUntilLongBreak}
        </p>
      </div>
    </div>
  );
}

export default PomodoroTimerTestComponent;
