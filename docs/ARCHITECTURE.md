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
  - Modal visibility state coordination (Customization, Timer Settings, Pomodoro Settings)
  - Floating panel state ownership: `isMusicOpen`, `isTasksOpen`, `isNotesOpen`, `isMusicPlaying`
  - Mutual exclusion between MusicPlayer, TaskList, and Notes panels
  - Integration between timer hooks and display components
  - Focus mode (desktop) and tap-to-focus (mobile) inactivity timers
- **Key Features**:
  - `handleMusicToggle` / `handleTasksToggle` / `handleNotesToggle` — opening one panel closes the others
  - Background theme application via BackgroundLayer
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

### Floating UI Components

Fixed-position components that sit above the main layout at `z-index: 100`. Their open state is lifted to `AppContent` so they can enforce mutual exclusion.

- **MusicPlayer** (`bottom-left`): Streams study music via YouTube IFrame API; four curated stations
- **TaskList** (`bottom-left`, offset right of MusicPlayer): Persistent to-do list panel; tasks saved to `localStorage`
- **Notes** (`bottom-left`): Scratchpad panel with `maxLength={10000}` textarea; content persisted in `localStorage`
- **CoffeeButton** (`bottom-right`): Support link (desktop only)
- **MobileBottomBar**: Mobile-only (`max-width: 767px`) persistent bottom bar — mode dots, animated controls row, utility buttons. See [Mobile UX](MOBILE_UTILITIES.md) for full details.
- **InspirationalQuote**: Fixed top-center quote. Visible on tablet and desktop only; hidden on all mobile via `display: none`.

### BackgroundLayer

A `position: fixed; z-index: 0` component rendered inside `ThemeProvider` but outside `AppContent`. It handles all background rendering via CSS `opacity` crossfades (GPU-composited) rather than applying `background` to `document.body`. Images are preloaded before the background switches to prevent flash-of-empty.

`AppContent` renders at `position: relative; z-index: 1` so it always sits above BackgroundLayer.

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

Each `FlipCard` renders four permanent layers plus one conditional animation element:

```
┌─────────────────────────────────┐  ← .flip-card-inner (transparent bg, overflow:hidden)
│  .flip-card-top    z-index:1    │  height: calc(50% - 2px)  shows NEW value always
│                                 │
│ ─ ─ ─ ─ 4px gap ─ ─ ─ ─ ─ ─ ─ │  ← transparent: app background shows through
│                                 │
│  .flip-card-bottom z-index:1    │  height: calc(50% - 2px)  shows displayedBottomValue
└─────────────────────────────────┘

When isFlipping=true, additionally:
┌─────────────────────────────────┐
│  .flip-animation   z-index:22   │  height: calc(50% - 2px), rotates from top to bottom
│    .flip-animation-front z:23   │  shows prevValue top half (backface-visibility:hidden)
│    .flip-animation-back  z:23   │  shows value bottom half  (backface-visibility:hidden)
└─────────────────────────────────┘
```

#### The Gap Split

`.flip-card-inner` has a transparent background; each half-panel carries its own `backgroundColor: panelColor`. With both halves at `height: calc(50% - 2px)`, a real 4 px gap sits at the midpoint where the app background shows through — no drawn line, no overlay.

#### The `rotateX` Animation

```
@keyframes flipDown { 0% → rotateX(0deg)   100% → rotateX(-180deg) }
duration: 0.6s ease-in-out
```

The pivot must land at the **center of the gap** (50% of card height), not at the bottom of the animation element. Because the element is `calc(50% - 2px)` tall, its own bottom is 2 px above that center. The correct transform-origin is:

```css
transform-origin: center calc(100% + 2px);
/* element bottom = calc(50% - 2px) from card top
   + 2px offset   = 50%            from card top  ✓  */
```

This guarantees that after a full −180° rotation the element covers exactly `calc(50% + 2px) → 100%`, landing flush on `.flip-card-bottom`.

#### State Timeline (e.g. value "46" → "47")

| Time | `.flip-card-top` | `.flip-animation-front` | `.flip-card-bottom` | `.flip-animation-back` |
|------|-----------------|------------------------|--------------------|-----------------------|
| 0 ms | "47" (new, covered by front face) | "46" visible | "46" | "47" hidden |
| ~300 ms | "47" revealed (front face passes 90°) | invisible | "46" | "47" becoming visible |
| 360 ms (`FLIP_ANIMATION_MIDPOINT`) | "47" | — | **"47"** (displayedBottomValue switches) | "47" |
| 600 ms | "47" | — | "47" | "47" (animation ends, forwards fill) |
| 650 ms | "47" | unmounted | "47" | unmounted |

#### The `backface-visibility` Bleed-Through Rule

At the ~90° crossing (~300 ms) both faces are simultaneously hidden by `backface-visibility: hidden`, making `.flip-animation` momentarily transparent. Because `.flip-card-top` (z-index 1) was painted before `.flip-animation` (z-index 22), it shows through the transparent container. This is **intentional**: `.flip-card-top` always holds the **new** value, so its reveal at exactly the 90° point is the correct mechanical flip clock reveal — the new top half "was always there" behind the falling panel. No state change is needed.

#### `displayedBottomValue` State

The bottom half must show the **old** value for the first half of the animation and the **new** value for the second half, timed so the swap aligns with the back face becoming visible:

```javascript
useEffect(() => {
  if (isFlipping) {
    setDisplayedBottomValue(prevValue);           // old value at flip start
    const t = setTimeout(() => {
      setDisplayedBottomValue(value);             // new value at FLIP_ANIMATION_MIDPOINT
    }, FLIP_ANIMATION_MIDPOINT);                  // 360 ms ≈ 60% of 600 ms
    return () => clearTimeout(t);
  } else {
    setDisplayedBottomValue(value);
  }
}, [isFlipping, prevValue, value]);
```

`FLIP_ANIMATION_MIDPOINT = 360 ms` is set at 60% of the 600 ms duration. Because `ease-in-out` spends more time near the center, 60% of *time* corresponds to ~70–75% of *rotation progress* (≈126–135°), safely past the 90° reveal point and aligned with the back face becoming clearly visible.

#### Mini (seconds) Cards

The seconds badge uses `size="mini"`. It deliberately opts out of the gap split — overridden back to `height: 50%` and `transform-origin: bottom` — because it is too small for the split to be visible and the gap would look like a rendering artefact at that size.

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

The mode transition animation uses `scaleX` (a 2D transform) rather than `rotateY`:

```css
@keyframes flipLeft {
  0%   { transform: scaleX(1); opacity: 1; }
  50%  { transform: scaleX(0); opacity: 0.6; }
  100% { transform: scaleX(1); opacity: 1; }
}
```

**Why `scaleX` and not `rotateY`**: `rotateY` is a 3D transform. Even without `transform-style: preserve-3d`, it triggers a 3D compositing pass on the element for the duration of the animation. That pass temporarily disrupts `backdrop-filter` sampling on unrelated `position: fixed` elements elsewhere on the page (the mode selector pill, music player, and coffee button all briefly lose their glass blur). `scaleX` is purely 2D, runs on the GPU compositor without a 3D context, and produces an identical visual result since the content swap happens at the 150ms midpoint when the element is squished to zero width.

**Features**:

- Directional animations based on mode order
- Smooth transitions with proper timing
- State synchronization during animation
- GPU-safe: no 3D compositing context created

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

### `backdrop-filter` Compositor Safety

Several fixed UI elements use `backdrop-filter` for a glassmorphic look (mode selector, music player, coffee button). This property is sensitive to how other elements on the page interact with the GPU compositor. The following rules keep it stable:

- **No `rotateY` on ancestors**: 3D transforms create a 3D compositing context that invalidates `backdrop-filter` on unrelated elements. Use `scaleX`/`scaleY` or 2D transforms instead for any animation that wraps backdrop-filter siblings.
- **No `backdrop-filter` on `.clock-container`**: The container has no visible background — applying blur to it creates an unnecessary compositor layer that child controls' blur effects nest inside, causing cascade invalidations. `backdrop-filter` belongs only on elements with a visible glass background.
- **No `backdrop-filter` on elements inside a promoted compositor layer**: E.g., `PomodoroSessionHeader.session-type` originally had `backdrop-filter: blur(10px)` while being a child of `.flip-clock` (which has `transform: translateZ(0)`). A backdrop-filter inside a promoted layer creates an ambiguous sampling dependency. Removed; the element's near-opaque background (`rgba(..., 0.9)`) makes the blur invisible anyway.
- **`contain: layout` on absolutely-positioned control panels**: `PomodoroControls` and `TimerControls` are `position: absolute` with `transform: translateY(-50%)`. Adding `contain: layout` isolates their compositor subtree, preventing their backdrop-filter buttons from interfering with the global compositing tree.
- **Avoid `transition: all`**: Broad transitions on elements inside compositor layers cause continuous repaints. Use specific property lists (`background`, `transform`, `opacity`) instead.

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

## Mobile UX Architecture

See [Mobile UX](MOBILE_UTILITIES.md) for the full breakdown. Key architectural points:

### Focus Mode (Desktop, `min-width: 768px`)

After 20 s of no mouse movement, `.focus-mode` is added to `.app`. All chrome (quote, mode selector, controls, floating buttons) fades to `opacity: 0; pointer-events: none` over 2 s. Mouse movement removes the class and restores everything over 1 s.

### Tap-to-Focus (Mobile Portrait)

After 4 s of no touch activity, `.mobile-chrome-hidden` is added to `.app`. The MobileBottomBar fades out and `.app-main` padding collapses to zero so the clock floats at true viewport center. Any touch event restores chrome and resets the timer.

### Tap-to-Hide Controls (Mobile Landscape)

Same `.mobile-chrome-hidden` class in landscape hides timer/pomodoro controls and the landscape-customize-btn.

### Card Sizing

Desktop uses a width-driven system (`width: 22vw`, height auto via `aspect-ratio: 22/24`). Mobile portrait uses a height-driven system (`height: clamp(170px, calc((100dvh - 170px) / 2), 340px)`, width auto). Both produce the same 22:24 card shape.

This architecture provides a solid foundation for the Flip Clock App while maintaining flexibility for future enhancements and modifications.
