# Component API Documentation

## Overview

This document provides comprehensive API documentation for all major components in the Flip Clock App. Each component is documented with its purpose, props interface, usage examples, and integration patterns.

## Core Display Components

### App

**Purpose**: Root application component that provides theme context

**Props**: None

**Usage**:

```jsx
import App from "./App";

// Root component - no props needed
<App />;
```

**Features**:

- Wraps entire application with ThemeProvider
- Entry point for component tree
- No direct props or state management

---

### AppContent

**Purpose**: Main application logic and layout management

**Props**: None (uses internal state and context)

**Internal State**:

- `selectedMode`: Current display mode (MODES.CLOCK, MODES.TIMER, MODES.POMODORO)
- `isCustomizationOpen`: Customization panel visibility
- `isTimerSettingsOpen`: Timer settings modal visibility
- `isPomodoroSettingsOpen`: Pomodoro settings modal visibility
- `isMusicOpen`: Music player panel visibility (lifted from MusicPlayer to enable mutual exclusion with TaskList)
- `isTasksOpen`: Task list panel visibility
- `isMusicPlaying`: Whether music is currently playing (forwarded to MobileBottomBar for its pulse indicator)

**Usage**:

```jsx
// Internal component - used within App
<ThemeProvider>
  <AppContent />
</ThemeProvider>
```

**Features**:

- Mode state management
- Modal visibility coordination
- Background theme application to document body
- Timer hook integration

---

### FlipClock

**Purpose**: Central display component with mode switching and flip animations

**Props**:

```typescript
interface FlipClockProps {
  mode: string; // Current display mode (MODES.CLOCK, MODES.TIMER, MODES.POMODORO)
  timer: TimerHook; // Timer hook instance for timer functionality
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer hook instance
}
```

**Usage**:

```jsx
import FlipClock from "./components/FlipClock";
import { useTimer } from "./hooks/useTimer";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { MODES } from "./constants";

const timer = useTimer();
const pomodoroTimer = usePomodoroTimer();

<FlipClock mode={MODES.TIMER} timer={timer} pomodoroTimer={pomodoroTimer} />;
```

**Features**:

- Mode-specific display rendering
- Smooth flip animations for mode transitions
- Directional animation based on mode order
- Animation timing management (300ms transitions)

---

## Display Components (FlipClock/displays/)

### ClockDisplay

**Purpose**: Real-time clock display with flip animations

**Props**: None (self-contained)

**Usage**:

```jsx
import ClockDisplay from "./components/FlipClock/displays/ClockDisplay";

<ClockDisplay />;
```

**Features**:

- Real-time updates every second
- Automatic flip animations for time changes
- 24-hour format with zero-padding
- Seconds display in mini format

---

### TimerDisplay

**Purpose**: Countdown timer display with flip animations

**Props**:

```typescript
interface TimerDisplayProps {
  timer: TimerHook; // Timer hook instance with countdown logic
}
```

**Usage**:

```jsx
import TimerDisplay from "./components/FlipClock/displays/TimerDisplay";
import { useTimer } from "./hooks/useTimer";

const timer = useTimer();

<TimerDisplay timer={timer} />;
```

**Features**:

- Countdown display with flip animations
- Dynamic format (HH:MM:SS or MM:SS based on duration)
- Integration with timer hook state
- Previous value tracking for animations

---

### PomodoroDisplay

**Purpose**: Pomodoro timer display with session indicators

**Props**:

```typescript
interface PomodoroDisplayProps {
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer hook instance
}
```

**Usage**:

```jsx
import PomodoroDisplay from "./components/FlipClock/displays/PomodoroDisplay";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";

const pomodoroTimer = usePomodoroTimer();

<PomodoroDisplay pomodoroTimer={pomodoroTimer} />;
```

**Features**:

- Session-aware countdown display
- Integration with Pomodoro session management
- Consistent flip animations with other displays

---

### FlipCardGrid

**Purpose**: Reusable flip card animation system

**Props**:

```typescript
interface FlipCardGridProps {
  leftValue: string; // Current left card value (hours)
  rightValue: string; // Current right card value (minutes)
  prevLeftValue: string; // Previous left value for animation
  prevRightValue: string; // Previous right value for animation
  flippingUnits: {
    // Animation state object
    left?: boolean; // Whether left card should flip
    right?: boolean; // Whether right card should flip
    mini?: boolean; // Whether mini seconds should flip
  };
  showMiniSeconds?: boolean; // Whether to show seconds display
  miniSecondsValue?: string; // Current seconds value
  prevMiniSecondsValue?: string; // Previous seconds for animation
}
```

**Usage**:

```jsx
import FlipCardGrid from "./components/FlipClock/displays/FlipCardGrid";

<FlipCardGrid
  leftValue="12"
  rightValue="34"
  prevLeftValue="12"
  prevRightValue="33"
  flippingUnits={{ right: true }}
  showMiniSeconds={true}
  miniSecondsValue="45"
  prevMiniSecondsValue="44"
/>;
```

**Features**:

- Consistent flip animation system
- Configurable card layout
- Previous value management for smooth animations
- Optional seconds display

---

## Control Components

### ModeSelector

**Purpose**: Mode switching interface with visual indicators

**Props**:

```typescript
interface ModeSelectorProps {
  selectedMode: string; // Current selected mode
  onModeChange: (mode: string) => void; // Mode change callback
  isTimerRunning: boolean; // Whether any timer is currently running
  onCustomizationClick: () => void; // Customization panel trigger
}
```

**Usage**:

```jsx
import ModeSelector from "./components/ModeSelector";
import { MODES } from "./constants";

<ModeSelector
  selectedMode={MODES.TIMER}
  onModeChange={(mode) => setSelectedMode(mode)}
  isTimerRunning={timer.isRunning}
  onCustomizationClick={() => setCustomizationOpen(true)}
/>;
```

**Features**:

- Animated slider for mode selection
- Running timer indicators
- Icon-based navigation
- Customization panel trigger

---

### TimerControls

**Purpose**: Play/pause/stop controls for timers

**Props**:

```typescript
interface TimerControlsProps {
  mode: string; // Current mode to determine control visibility
  timer: TimerHook; // Timer hook instance
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer hook instance
  onSettingsClick: () => void; // Settings panel trigger callback
}
```

**Usage**:

```jsx
import TimerControls from "./components/TimerControls";

<TimerControls
  mode={MODES.TIMER}
  timer={timer}
  pomodoroTimer={pomodoroTimer}
  onSettingsClick={() => setTimerSettingsOpen(true)}
/>;
```

**Features**:

- Mode-aware control rendering
- Animated stop button appearance
- Settings panel integration
- Delegates to PomodoroControls for Pomodoro mode

---

### PomodoroControls

**Purpose**: Pomodoro-specific timer controls

**Props**:

```typescript
interface PomodoroControlsProps {
  mode: string; // Current mode (should be MODES.POMODORO)
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer hook instance
  onSettingsClick: () => void; // Settings panel trigger callback
}
```

**Usage**:

```jsx
import PomodoroControls from "./components/PomodoroControls";

<PomodoroControls
  mode={MODES.POMODORO}
  pomodoroTimer={pomodoroTimer}
  onSettingsClick={() => setPomodoroSettingsOpen(true)}
/>;
```

**Features**:

- Pomodoro-specific control layout
- Session management controls
- Skip session functionality
- Integration with Pomodoro settings

---

## Customization Components

### CustomizationPanel

**Purpose**: Modal panel for customizing clock appearance

**Props**:

```typescript
interface CustomizationPanelProps {
  isOpen: boolean; // Whether the panel is visible
  onClose: () => void; // Close panel callback
}
```

**Usage**:

```jsx
import CustomizationPanel from "./components/CustomizationPanel";

<CustomizationPanel
  isOpen={isCustomizationOpen}
  onClose={() => setIsCustomizationOpen(false)}
/>;
```

**Features**:

- Tabbed interface (Background, Fonts, Colors)
- Live preview integration
- Modal overlay with accessibility
- Theme system integration

---

### BackgroundSelector

**Purpose**: Interface for selecting background themes

**Props**: None (uses theme context)

**Usage**:

```jsx
import BackgroundSelector from "./components/BackgroundSelector";

// Used within CustomizationPanel
<BackgroundSelector />;
```

**Features**:

- Categorized background options (colors, gradients, images)
- Visual thumbnails for preview
- Curated high-quality image backgrounds
- Integration with theme context

**Background Categories**:

- **Colors**: Solid color backgrounds including light/dark themes
- **Gradients**: CSS linear gradients with artistic combinations
- **Images**: Curated landscape and abstract images from Unsplash

---

### FontSelector

**Purpose**: Interface for selecting display fonts

**Props**: None (uses theme context and font utilities)

**Usage**:

```jsx
import FontSelector from "./components/FontSelector";

// Used within CustomizationPanel
<FontSelector />;
```

**Features**:

- Visual font preview with sample text
- Integration with font utility functions
- Real-time font application
- Support for web fonts and system fonts

---

### ColorSelector

**Purpose**: Interface for customizing text and background colors

**Props**: None (uses theme context)

**Usage**:

```jsx
import ColorSelector from "./components/ColorSelector";

// Used within CustomizationPanel
<ColorSelector />;
```

**Features**:

- Clock text color customization
- Card background color customization
- Real-time color preview
- Integration with ColorPicker components

---

### ColorPicker

**Purpose**: Reusable color picker component

**Props**:

```typescript
interface ColorPickerProps {
  value: string; // Current color value (hex string)
  onChange: (color: string) => void; // Color change callback
  label: string; // Display label for the color picker
}
```

**Usage**:

```jsx
import ColorPicker from "./components/ColorPicker";

<ColorPicker
  value="#ff0000"
  onChange={(color) => setClockColor(color)}
  label="Text Color"
/>;
```

**Features**:

- HTML5 color input integration
- Hex color value handling
- Accessible labeling
- Real-time color updates

---

### ClockPreview

**Purpose**: Live preview of customization changes

**Props**: None (uses theme context)

**Usage**:

```jsx
import ClockPreview from "./components/ClockPreview";

// Used within CustomizationPanel
<ClockPreview />;
```

**Features**:

- Real-time clock display with current theme
- Background, font, and color preview
- Miniature version of main clock display
- Automatic time updates

---

## Settings Components

### TimerSettings

**Purpose**: Modal for configuring timer duration

**Props**:

```typescript
interface TimerSettingsProps {
  isOpen: boolean; // Whether the settings modal is visible
  onClose: () => void; // Close modal callback
  onSave: (hours: number, minutes: number, seconds: number) => void; // Save settings callback
  currentTimer: TimerHook; // Current timer instance for default values
}
```

**Usage**:

```jsx
import TimerSettings from "./components/TimerSettings";

<TimerSettings
  isOpen={isTimerSettingsOpen}
  onClose={() => setIsTimerSettingsOpen(false)}
  onSave={(h, m, s) => {
    timer.setTimerTime(h, m, s);
    setIsTimerSettingsOpen(false);
  }}
  currentTimer={timer}
/>;
```

**Features**:

- Time input components for hours, minutes, seconds
- Validation for time values
- Integration with timer hook
- Modal interface with save/cancel actions

---

### PomodoroSettings

**Purpose**: Modal for configuring Pomodoro session durations

**Props**:

```typescript
interface PomodoroSettingsProps {
  isOpen: boolean; // Whether the settings modal is visible
  onClose: () => void; // Close modal callback
  onSave: (settings: PomodoroSettings) => void; // Save settings callback
  currentSettings: PomodoroSettings; // Current Pomodoro settings
}

interface PomodoroSettings {
  focusDuration: number; // Focus session duration in minutes
  shortBreakDuration: number; // Short break duration in minutes
  longBreakDuration: number; // Long break duration in minutes
  longBreakInterval: number; // Number of focus sessions before long break
}
```

**Usage**:

```jsx
import PomodoroSettings from "./components/PomodoroSettings";

<PomodoroSettings
  isOpen={isPomodoroSettingsOpen}
  onClose={() => setIsPomodoroSettingsOpen(false)}
  onSave={(settings) => {
    pomodoroTimer.updatePomodoroSettings(settings);
    setIsPomodoroSettingsOpen(false);
  }}
  currentSettings={pomodoroTimer.pomodoroSettings}
/>;
```

**Features**:

- Duration inputs for all session types
- Long break interval configuration
- Validation for Pomodoro timing rules
- Integration with Pomodoro timer hook

---

## Session Components

### PomodoroSessionHeader

**Purpose**: Display current Pomodoro session information

**Props**:

```typescript
interface PomodoroSessionHeaderProps {
  mode: string; // Current mode (shows only in POMODORO mode)
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer instance
}
```

**Usage**:

```jsx
import PomodoroSessionHeader from "./components/PomodoroSessionHeader";

<PomodoroSessionHeader mode={MODES.POMODORO} pomodoroTimer={pomodoroTimer} />;
```

**Features**:

- Session type display (Focus, Short Break, Long Break)
- Current task name display
- Conditional rendering based on mode
- Integration with Pomodoro session state

---

### PomodoroSessionIndicator

**Purpose**: Visual indicator of Pomodoro session progress

**Props**:

```typescript
interface PomodoroSessionIndicatorProps {
  mode: string; // Current mode (shows only in POMODORO mode)
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer instance
}
```

**Usage**:

```jsx
import PomodoroSessionIndicator from "./components/PomodoroSessionIndicator";

<PomodoroSessionIndicator
  mode={MODES.POMODORO}
  pomodoroTimer={pomodoroTimer}
/>;
```

**Features**:

- Visual progress indicators for session cycles
- Completed session tracking
- Long break countdown display
- Session type visual differentiation

---

### SessionProgress

**Purpose**: Progress bar for current Pomodoro session

**Props**:

```typescript
interface SessionProgressProps {
  pomodoroTimer: PomodoroTimerHook; // Pomodoro timer instance for progress calculation
}
```

**Usage**:

```jsx
import SessionProgress from "./components/SessionProgress";

<SessionProgress pomodoroTimer={pomodoroTimer} />;
```

**Features**:

- Visual progress bar for current session
- Percentage calculation based on elapsed time
- Session-aware progress display
- Smooth progress updates

---

## Floating UI Components

These components are `position: fixed` and render independently of the main layout. Their open state is managed by `AppContent` so panels can enforce mutual exclusion (opening one closes the other).

### MusicPlayer

**Purpose**: Floating bottom-left panel for streaming study music via YouTube IFrame API

**Props**:

```typescript
interface MusicPlayerProps {
  isOpen: boolean;                      // Controlled open state (owned by AppContent)
  onToggle: () => void;                 // Toggle callback — used by both the icon button and the ✕ close button
  onPlayingChange?: (playing: boolean) => void; // Optional — notifies parent of playback state (used by MobileBottomBar)
}
```

**Usage**:

```jsx
import MusicPlayer from "./components/MusicPlayer";

<MusicPlayer
  isOpen={isMusicOpen}
  onToggle={handleMusicToggle}
  onPlayingChange={setIsMusicPlaying}
/>;
```

**Features**:

- Four curated study stations: Lofi, Jazz, House, Focus
- YouTube IFrame player initialised lazily on first open; persists while mounted so music continues when panel is collapsed
- Pulse animation on the toggle button when music is playing and panel is closed
- Full light/dark background adaptation and reduced-motion support

---

### TaskList

**Purpose**: Floating bottom-left to-do panel for tracking session tasks

**Props**:

```typescript
interface TaskListProps {
  isOpen: boolean;      // Controlled open state (owned by AppContent)
  onToggle: () => void; // Toggle callback — used by both the icon button and the ✕ close button
}
```

**Usage**:

```jsx
import TaskList from "./components/TaskList";

<TaskList isOpen={isTasksOpen} onToggle={handleTasksToggle} />;
```

**Features**:

- Fixed `224×300px` panel (same glassmorphic style as MusicPlayer)
- Ships with 3 placeholder tasks; tasks persist across sessions via `localStorage`
- Click a task's circle button to toggle completion (strikethrough + dimmed text)
- Delete button appears on row hover
- Scrollable task list — no upper limit on task count
- Add tasks via the bottom input row; `Enter` key or the `+` button submits
- Full light/dark background adaptation and reduced-motion support

---



### Modal Pattern

Many components follow a consistent modal pattern:

```jsx
// Modal component structure
const ModalComponent = ({ isOpen, onClose, ...props }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Modal Title</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{/* Modal content */}</div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
```

### Theme Integration Pattern

Components that need theme access follow this pattern:

```jsx
import { useTheme } from "../../contexts/ThemeContext";

const ThemedComponent = () => {
  const { background, setBackground, clockColor, setClockColor } = useTheme();

  // Component logic using theme values

  return (
    <div style={{ background, color: clockColor }}>
      {/* Component content */}
    </div>
  );
};
```

### Hook Integration Pattern

Components that use timer hooks follow this pattern:

```jsx
const TimerComponent = ({ timer, pomodoroTimer }) => {
  // Extract needed values from hooks
  const { hours, minutes, seconds, isRunning, startTimer, pauseTimer } = timer;

  // Component logic

  return (
    <div>
      <div>
        {hours}:{minutes}:{seconds}
      </div>
      <button onClick={isRunning ? pauseTimer : startTimer}>
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};
```

## Accessibility Considerations

### ARIA Labels

Most interactive components include proper ARIA labels:

```jsx
<button aria-label="Start timer" onClick={startTimer}>
  <PlayIcon />
</button>
```

### Keyboard Navigation

Components support keyboard navigation where appropriate:

```jsx
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect();
    }
  }}
>
  Selectable Item
</div>
```

### Focus Management

Modal components manage focus appropriately:

```jsx
useEffect(() => {
  if (isOpen) {
    // Focus first interactive element
    modalRef.current?.querySelector("button")?.focus();
  }
}, [isOpen]);
```

This component documentation provides a comprehensive reference for understanding and using all major components in the Flip Clock App. Each component is designed to be reusable, accessible, and well-integrated with the overall application architecture.
