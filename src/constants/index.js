// Animation timings
export const FLIP_ANIMATION_DURATION = 600; // ms
export const FLIP_ANIMATION_MIDPOINT = 360; // ~60% of duration for ease-in-out curve (90° point)
export const FLIP_STATE_CLEAR_DELAY = 600; // ms - Match CSS animation duration exactly

// Timer defaults
export const DEFAULT_TIMER_MINUTES = 10;
export const DEFAULT_TIMER_SECONDS = 0;
export const DEFAULT_TIMER_HOURS = 0;

// Timer limits and validation
export const TIMER_LIMITS = {
  MAX_HOURS: 99,
  MAX_MINUTES: 59,
  MAX_SECONDS: 59,
  MIN_VALUE: 0,
};

// Timer settings defaults
export const TIMER_SETTINGS_DEFAULTS = {
  hours: 0,
  minutes: 10,
  seconds: 0,
};

// App modes
export const MODES = {
  CLOCK: "Clock",
  TIMER: "Timer",
  POMODORO: "Pomodoro",
};

// Timer states
export const TIMER_STATES = {
  STOPPED: "stopped",
  RUNNING: "running",
  PAUSED: "paused",
};

// Pomodoro session types
export const POMODORO_SESSION_TYPES = {
  FOCUS: "focus",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
};

// Pomodoro default durations (in minutes)
export const POMODORO_DEFAULTS = {
  FOCUS_DURATION: 25,
  SHORT_BREAK_DURATION: 5,
  LONG_BREAK_DURATION: 15,
  LONG_BREAK_INTERVAL: 4, // Number of focus sessions before long break
};

// Pomodoro preset configurations
export const POMODORO_PRESETS = {
  CLASSIC: {
    name: "25:5",
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  },
  EXTENDED: {
    name: "50:10",
    focusDuration: 50,
    shortBreakDuration: 10,
    longBreakDuration: 30,
  },
  DEEP_WORK: {
    name: "90:20",
    focusDuration: 90,
    shortBreakDuration: 20,
    longBreakDuration: 45,
  },
  CUSTOM: {
    name: "Custom",
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  },
};

// Pomodoro state constants
export const POMODORO_STATES = {
  IDLE: "idle",
  ACTIVE: "active",
  PAUSED: "paused",
  TRANSITIONING: "transitioning",
  COMPLETED: "completed",
};

// Pomodoro settings defaults
export const POMODORO_SETTINGS_DEFAULTS = {
  preset: "CLASSIC",
  focusDuration: POMODORO_DEFAULTS.FOCUS_DURATION,
  shortBreakDuration: POMODORO_DEFAULTS.SHORT_BREAK_DURATION,
  longBreakDuration: POMODORO_DEFAULTS.LONG_BREAK_DURATION,
  autoAdvance: true,
  notifications: true,
  longBreakInterval: POMODORO_DEFAULTS.LONG_BREAK_INTERVAL,
};
