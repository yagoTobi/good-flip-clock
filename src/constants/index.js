/**
 * Animation timing constants for flip card transitions
 * These values must match the CSS animation durations for proper synchronization
 */

/** Duration of the complete flip animation in milliseconds */
export const FLIP_ANIMATION_DURATION = 600; // ms

/** Midpoint timing for flip animation state changes (60% of total duration) */
export const FLIP_ANIMATION_MIDPOINT = 360; // ~60% of duration for ease-in-out curve (90° point)

/** Delay before clearing flip animation state to match CSS animation completion */
export const FLIP_STATE_CLEAR_DELAY = 600; // ms - Match CSS animation duration exactly

/**
 * Default timer values when the application starts or timer is reset
 */

/** Default timer minutes value */
export const DEFAULT_TIMER_MINUTES = 10;

/** Default timer seconds value */
export const DEFAULT_TIMER_SECONDS = 0;

/** Default timer hours value */
export const DEFAULT_TIMER_HOURS = 0;

/**
 * Timer input validation limits
 * Defines the acceptable range for timer duration inputs
 */
export const TIMER_LIMITS = {
  /** Maximum hours that can be set (99 hours = ~4 days) */
  MAX_HOURS: 99,
  /** Maximum minutes that can be set (standard 60-minute hour) */
  MAX_MINUTES: 59,
  /** Maximum seconds that can be set (standard 60-second minute) */
  MAX_SECONDS: 59,
  /** Minimum value for any time unit */
  MIN_VALUE: 0,
};

/**
 * Default timer settings configuration
 * Used when initializing timer settings or resetting to defaults
 */
export const TIMER_SETTINGS_DEFAULTS = {
  /** Default hours setting */
  hours: 0,
  /** Default minutes setting */
  minutes: 10,
  /** Default seconds setting */
  seconds: 0,
};

/**
 * Application display modes
 * Defines the different functional modes the app can operate in
 */
export const MODES = {
  /** Real-time clock display mode */
  CLOCK: "Clock",
  /** Countdown timer mode */
  TIMER: "Timer",
  /** Pomodoro technique timer mode with work/break sessions */
  POMODORO: "Pomodoro",
};

/**
 * Timer operational states
 * Defines the possible states for timer functionality
 */
export const TIMER_STATES = {
  /** Timer is stopped/reset and not running */
  STOPPED: "stopped",
  /** Timer is actively counting down */
  RUNNING: "running",
  /** Timer is paused and can be resumed */
  PAUSED: "paused",
};

/**
 * Pomodoro session types
 * Defines the different types of sessions in the Pomodoro technique
 */
export const POMODORO_SESSION_TYPES = {
  /** Work/focus session where tasks are performed */
  FOCUS: "focus",
  /** Short break between focus sessions */
  SHORT_BREAK: "shortBreak",
  /** Longer break after completing multiple focus sessions */
  LONG_BREAK: "longBreak",
};

/**
 * Default Pomodoro technique durations and intervals
 * Based on the traditional Pomodoro technique timing
 * All durations are in minutes
 */
export const POMODORO_DEFAULTS = {
  /** Standard focus session duration (25 minutes) */
  FOCUS_DURATION: 25,
  /** Standard short break duration (5 minutes) */
  SHORT_BREAK_DURATION: 5,
  /** Standard long break duration (15 minutes) */
  LONG_BREAK_DURATION: 15,
  /** Number of focus sessions before a long break is triggered */
  LONG_BREAK_INTERVAL: 4, // Number of focus sessions before long break
};

/**
 * Predefined Pomodoro timing presets
 * Provides common Pomodoro configurations for different work styles
 * All durations are in minutes
 */
export const POMODORO_PRESETS = {
  /** Traditional Pomodoro: 25min focus, 5min break, 15min long break */
  CLASSIC: {
    name: "25:5",
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  },
  /** Extended sessions: 50min focus, 10min break, 30min long break */
  EXTENDED: {
    name: "50:10",
    focusDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 30,
  },
  /** Deep work sessions: 90min focus, 20min break, 45min long break */
  DEEP_WORK: {
    name: "90:20",
    focusDuration: 90,
    shortBreakDuration: 20,
    longBreakDuration: 45,
  },
  /** User-defined custom timing configuration */
  CUSTOM: {
    name: "Custom",
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  },
};

/**
 * Pomodoro timer operational states
 * Defines the possible states for Pomodoro session management
 */
export const POMODORO_STATES = {
  /** No active session, waiting to start */
  IDLE: "idle",
  /** Session is actively running (focus or break) */
  ACTIVE: "active",
  /** Session is paused and can be resumed */
  PAUSED: "paused",
  /** Transitioning between sessions (e.g., focus to break) */
  TRANSITIONING: "transitioning",
  /** Session or full Pomodoro cycle has completed */
  COMPLETED: "completed",
};

/**
 * Default Pomodoro settings configuration
 * Used when initializing Pomodoro settings or resetting to defaults
 */
export const POMODORO_SETTINGS_DEFAULTS = {
  /** Default preset configuration to use */
  preset: "CLASSIC",
  /** Default focus session duration in minutes */
  focusDuration: POMODORO_DEFAULTS.FOCUS_DURATION,
  /** Default short break duration in minutes */
  shortBreakDuration: POMODORO_DEFAULTS.SHORT_BREAK_DURATION,
  /** Default long break duration in minutes */
  longBreakDuration: POMODORO_DEFAULTS.LONG_BREAK_DURATION,
  /** Whether to automatically advance to next session */
  autoAdvance: true,
  /** Whether to show notifications for session transitions */
  notifications: true,
  /** Number of focus sessions before triggering a long break */
  longBreakInterval: POMODORO_DEFAULTS.LONG_BREAK_INTERVAL,
};
