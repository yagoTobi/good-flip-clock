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
};

// Timer states
export const TIMER_STATES = {
  STOPPED: "stopped",
  RUNNING: "running",
  PAUSED: "paused",
};
