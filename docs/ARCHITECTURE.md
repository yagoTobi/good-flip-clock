# Architecture Documentation

## Overview

The Flip Clock App is built using modern React patterns with a focus on component composition, custom hooks for state management, and a centralized theme system. The architecture emphasizes separation of concerns, reusability, and maintainability while providing smooth animations and responsive user interactions.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App (Root)                           │
│                   ┌─────────────────┐                       │
│                   │  ThemeProvider  │                       │
│                   └─────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AppContent                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │   FlipClock     │  │  ModeSelector   │  │ Modal Panels│  │
│  │                 │  │                 │  │             │  │
│  │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ • Custom-   │  │
│  │ │Clock Display│ │  │ │Mode Buttons │ │  │   ization   │  │
│  │ │Timer Display│ │  │ │Theme Button │ │  │ • Timer     │  │
│  │ │Pomodoro Disp│ │  │ └─────────────┘ │  │   Settings  │  │
│  │ └─────────────┘ │  └─────────────────┘  │ • Pomodoro  │  │
│  │                 │                       │   Settings  │  │
│  │ ┌─────────────┐ │                       └─────────────┘  │
│  │ │Timer        │ │                                        │
│  │ │Controls     │ │                                        │
│  │ └─────────────┘ │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### Root Level Components

#### App

- **Purpose**: Root component that provides theme context to the entire application
- **Responsibilities**:
  - Wraps application with `ThemeProvider`
  - Serves as the entry point for the component tree
- **Key Features**: Context provider setup

#### AppContent

- **Purpose**: Main application logic and layout management
- **Responsibilities**:
  - Mode state management (Clock, Timer, Pomodoro)
  - Modal visibility state management
  - Background theme application to document body
  - Integration between timer hooks and display components
- **Key Features**:
  - Background theme application with full-screen coverage
  - Modal state coordination
  - Timer instance management

### Core Display Components

#### FlipClock

- **Purpose**: Central display component with mode switching and animations
- **Responsibilities**:
  - Mode-specific display rendering
  - Flip animations for mode transitions
  - Integration with timer hooks
- **Key Features**:
  - Smooth flip animations with directional movement
  - Mode-specific component rendering
  - Animation timing management

#### Display Components (FlipClock/displays/)

- **ClockDisplay**: Real-time clock with flip card animations
- **TimerDisplay**: Countdown timer with flip animations
- **PomodoroDisplay**: Pomodoro timer with session indicators
- **FlipCardGrid**: Reusable flip card animation system

### Control Components

#### ModeSelector

- **Purpose**: Mode switching interface with visual indicators
- **Responsibilities**:
  - Mode selection (Clock, Timer, Pomodoro)
  - Running timer indicators
  - Customization panel trigger
- **Key Features**:
  - Animated slider for mode selection
  - Timer running indicators
  - Icon-based navigation

#### Timer Controls

- **TimerControls**: Play/pause/stop controls for timers
- **TimerSettings**: Duration configuration interface
- **PomodoroControls**: Pomodoro-specific controls
- **PomodoroSettings**: Pomodoro session configuration

### Customization System

#### CustomizationPanel

- **Purpose**: Modal interface for theme customization
- **Responsibilities**:
  - Tabbed interface for customization options
  - Live preview integration
  - Theme system integration
- **Key Features**:
  - Background, font, and color customization
  - Real-time preview updates
  - Modal overlay with accessibility

#### Customization Components

- **BackgroundSelector**: Background theme selection
- **FontSelector**: Font family selection with live samples
- **ColorSelector**: Color picker for clock and panel colors
- **ClockPreview**: Live preview of customization changes

## State Management Architecture

### Context-Based Global State

#### ThemeContext

```javascript
// Theme state structure
{
  background: string,      // Background theme identifier
  font: string,           // Font family identifier
  clockColor: string,     // Clock text color (hex)
  panelColor: string,     // Panel background color (hex)
  setBackground: Function,
  setFont: Function,
  setClockColor: Function,
  setPanelColor: Function,
  resetToDefaults: Function
}
```

**Features**:

- Automatic localStorage persistence
- Default value fallbacks
- Error handling for storage operations
- Global font application via useFont hook

### Custom Hooks for Business Logic

#### useTimer Hook

```javascript
// Timer state interface
{
  // Time state
  hours: number,
  minutes: number,
  seconds: number,
  prevHours: number,    // For flip animations
  prevMinutes: number,
  prevSeconds: number,

  // Control state
  timerState: TIMER_STATES,
  isRunning: boolean,
  isPaused: boolean,
  isStopped: boolean,
  hasHours: boolean,
  isReverting: boolean,

  // Control functions
  startTimer: Function,
  pauseTimer: Function,
  stopTimer: Function,
  resetTimer: Function,
  revertToOriginalTime: Function,
  setTimerTime: Function
}
```

**Key Features**:

- Countdown logic with automatic stopping
- Flip animation support with previous values
- Revert animation for returning to original time
- Configurable timer durations

#### usePomodoroTimer Hook

```javascript
// Extends useTimer interface with Pomodoro features
{
  // All useTimer properties plus:

  // Pomodoro state
  sessionType: POMODORO_SESSION_TYPES,
  cycleCount: number,
  currentTask: string,
  isAutoAdvancing: boolean,
  pomodoroState: POMODORO_STATES,
  pomodoroSettings: Object,

  // Computed state
  isActive: boolean,
  isTransitioning: boolean,
  isFocusSession: boolean,
  isBreakSession: boolean,
  sessionsUntilLongBreak: number,

  // Pomodoro controls
  skipToNextSession: Function,
  switchToSessionType: Function,
  updatePomodoroSettings: Function,
  setTaskName: Function,
  toggleAutoAdvance: Function,
  resetCycle: Function
}
```

**Key Features**:

- Automatic session transitions (focus → break → focus)
- Cycle counting with long break intervals
- Configurable session durations
- Auto-advance functionality
- Task name tracking

## Data Flow Patterns

### Props Down, Callbacks Up

```
AppContent (State Owner)
    │
    ├── selectedMode ──────────────┐
    │                              ▼
    ├── timer ────────────────► FlipClock
    │                              │
    ├── pomodoroTimer ─────────────┘
    │
    ├── onModeChange ──────────────┐
    │                              ▼
    └── onCustomizationClick ──► ModeSelector
                                   │
                                   └── onClick callbacks ──► AppContent
```

### Context for Global State

```
ThemeProvider (Context)
    │
    ├── background ────────────┐
    ├── font ──────────────────┼──► Any Component
    ├── clockColor ────────────┤    (via useTheme hook)
    └── panelColor ────────────┘
```

### Hook-Based Business Logic

```
Component
    │
    ├── useTimer() ────────────┐
    │                          ▼
    └── usePomodoroTimer() ──► Timer Logic
                               │
                               ├── Countdown Management
                               ├── State Transitions
                               └── Animation Support
```

## Animation System

### Flip Card Animations

The application uses CSS-based flip animations for smooth time transitions:

```css
/* Flip animation timing */
.flip-card {
  transition: transform 0.6s ease-in-out;
}

/* Animation states */
.flip-card.flipping {
  transform: rotateX(90deg);
}
```

**Animation Flow**:

1. Previous value displayed on front of card
2. Animation triggered by state change
3. Card flips 90 degrees (edge-on view)
4. New value updated during flip
5. Card completes flip to show new value

### Mode Transition Animations

Mode switching uses directional flip animations:

```javascript
// Animation direction logic
const getFlipDirection = (fromMode, toMode) => {
  const modeOrder = [MODES.CLOCK, MODES.TIMER, MODES.POMODORO];
  const fromIndex = modeOrder.indexOf(fromMode);
  const toIndex = modeOrder.indexOf(toMode);
  return toIndex > fromIndex ? "right" : "left";
};
```

**Features**:

- Directional animations based on mode order
- Smooth transitions with proper timing
- State synchronization during animation

## File Organization

### Component Structure

```
src/components/ComponentName/
├── ComponentName.jsx     # Main component
├── ComponentName.css     # Component styles
├── index.js             # Barrel export
└── __tests__/           # Component tests
```

### Hook Organization

```
src/hooks/
├── useTimer.js          # Timer functionality
├── usePomodoroTimer.js  # Pomodoro functionality
├── useFont.js           # Font loading
└── __tests__/           # Hook tests
```

### Context Organization

```
src/contexts/
└── ThemeContext.jsx     # Global theme state
```

## Performance Considerations

### Optimization Strategies

1. **Memoized Callbacks**: Control functions use `useCallback` to prevent unnecessary re-renders
2. **Context Optimization**: Theme context only updates when values actually change
3. **CSS Animations**: Hardware-accelerated CSS transforms for smooth animations
4. **Selective Re-rendering**: Components only re-render when their specific props change

### Memory Management

1. **Timer Cleanup**: Intervals and timeouts are properly cleared on unmount
2. **Event Listener Cleanup**: All event listeners are removed during cleanup
3. **Reference Management**: useRef for timer references to prevent memory leaks

### Animation Performance

1. **CSS Transforms**: Use transform properties for hardware acceleration
2. **Animation Timing**: Carefully tuned timing to balance smoothness and performance
3. **State Batching**: Use flushSync for critical animation state updates

## Error Handling

### Theme System

- localStorage access errors are caught and logged
- Fallback to default values when persistence fails
- Graceful degradation when storage is unavailable

### Timer System

- Automatic cleanup of intervals and timeouts
- State validation before timer operations
- Recovery from invalid timer states

### Component Errors

- Error boundaries could be added for component-level error handling
- Prop validation through TypeScript or PropTypes
- Graceful fallbacks for missing or invalid props

## Extensibility

### Adding New Modes

1. Add mode constant to `src/constants/index.js`
2. Create display component in `src/components/FlipClock/displays/`
3. Add mode handling to `FlipClock.jsx`
4. Update `ModeSelector` with new mode option

### Adding New Themes

1. Add theme constants to theme system
2. Create theme selector component
3. Update theme context with new theme support
4. Add theme-specific CSS variables

### Adding New Timer Types

1. Create new custom hook extending timer patterns
2. Add timer-specific constants and types
3. Create display components for new timer
4. Integrate with existing control systems

This architecture provides a solid foundation for the Flip Clock App while maintaining flexibility for future enhancements and modifications.
