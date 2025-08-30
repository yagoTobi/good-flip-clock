# Design Document

## Overview

The Pomodoro timer feature extends the existing flip clock application by adding a third mode alongside Clock and Timer. This implementation leverages the existing timer infrastructure while introducing Pomodoro-specific state management, session cycling, and enhanced UI components. The design maintains consistency with the current architecture and visual design language.

## Architecture

### Mode System Extension

The current two-mode system (Clock/Timer) will be extended to support three modes:

- **Clock Mode**: Existing real-time clock functionality
- **Timer Mode**: Existing countdown timer functionality
- **Pomodoro Mode**: New Pomodoro technique implementation

### State Management Strategy

The Pomodoro mode will use a dedicated hook `usePomodoroTimer` that extends the existing `useTimer` pattern but adds Pomodoro-specific state:

```javascript
// Pomodoro-specific state additions
{
  sessionType: 'focus' | 'shortBreak' | 'longBreak',
  cycleCount: number, // Completed focus sessions in current cycle
  currentTask: string, // User-defined task for focus sessions
  isAutoAdvancing: boolean, // Whether sessions auto-advance
  pomodoroSettings: {
    focusDuration: { minutes: number },
    shortBreakDuration: { minutes: number },
    longBreakDuration: { minutes: number },
    preset: 'custom' | '25:5' | '50:10' | '90:20'
  }
}
```

## Components and Interfaces

### 1. ModeSelector Enhancement

**Current Implementation**: Two-button toggle with sliding indicator
**New Implementation**: Three-button selector with icons

```javascript
// Updated mode selector structure
const modes = [
  { key: "CLOCK", label: "Clock", icon: ClockIcon },
  { key: "TIMER", label: "Timer", icon: TimerIcon },
  { key: "POMODORO", label: "Pomodoro", icon: TomatoIcon },
];
```

**Visual Design**:

- Expand current sliding selector to accommodate three options
- Add consistent icon system using react-icons
- Maintain current animation and styling patterns

### 2. PomodoroControls Component

**Purpose**: Specialized control panel for Pomodoro mode
**Location**: `src/components/PomodoroControls/`

**Interface**:

```javascript
function PomodoroControls({
  pomodoroTimer,
  onSettingsClick,
  onTaskChange,
  onSkipSession,
}) {
  // Play/Pause/Reset controls (reuse existing patterns)
  // Skip to next session button
  // Task input field
  // Session type indicator
  // Cycle progress display
}
```

### 3. PomodoroSettings Component

**Purpose**: Configuration panel for Pomodoro preferences
**Location**: `src/components/PomodoroSettings/`

**Interface**:

```javascript
function PomodoroSettings({ isOpen, onClose, onSave, currentSettings }) {
  // Preset selection (25:5, 50:10, 90:20, Custom)
  // Custom duration inputs for each session type
  // Auto-advance toggle
  // Notification preferences
}
```

### 4. PomodoroDisplay Component

**Purpose**: Enhanced display showing session context
**Location**: `src/components/FlipClock/displays/PomodoroDisplay.jsx`

**Features**:

- Current session type indicator
- Task name display (when in focus mode)
- Cycle progress (e.g., "Session 2 of 4")
- Visual differentiation between session types

### 5. SessionTransition Component

**Purpose**: Smooth transitions between Pomodoro sessions
**Location**: `src/components/SessionTransition/`

**Features**:

- Completion celebration for finished sessions
- Next session preview
- Auto-advance countdown
- Manual advance option

## Data Models

### PomodoroSession Model

```javascript
const PomodoroSession = {
  type: "focus" | "shortBreak" | "longBreak",
  duration: { minutes: number, seconds: number },
  task: string | null, // Only for focus sessions
  startTime: Date | null,
  endTime: Date | null,
  completed: boolean,
};
```

### PomodoroSettings Model

```javascript
const PomodoroSettings = {
  preset: "custom" | "25:5" | "50:10" | "90:20",
  focusDuration: { minutes: number },
  shortBreakDuration: { minutes: number },
  longBreakDuration: { minutes: number },
  autoAdvance: boolean,
  notifications: boolean,
  longBreakInterval: number, // Sessions before long break (default: 4)
};
```

### PomodoroState Model

```javascript
const PomodoroState = {
  currentSession: PomodoroSession,
  cycleCount: number, // Completed focus sessions in current cycle
  totalSessionsToday: number, // For daily tracking
  isActive: boolean,
  isPaused: boolean,
  timeRemaining: { minutes: number, seconds: number },
};
```

## Error Handling

### Timer State Conflicts

- **Issue**: User switches modes while Pomodoro timer is active
- **Solution**: Pause current session and show confirmation dialog before mode switch
- **Recovery**: Allow user to resume or abandon current session

### Settings Validation

- **Issue**: Invalid duration inputs (negative numbers, excessive values)
- **Solution**: Input validation with user-friendly error messages
- **Constraints**: 1-120 minutes for focus sessions, 1-30 minutes for breaks

### Session Persistence

- **Issue**: Browser refresh or accidental closure during active session
- **Solution**: Persist session state to localStorage with timestamp
- **Recovery**: On app load, check for active session and offer to resume

### Notification Failures

- **Issue**: Browser blocks notifications or user denies permission
- **Solution**: Graceful fallback to visual-only notifications
- **User Experience**: Clear indication of notification status in settings

## Testing Strategy

### Unit Tests

**usePomodoroTimer Hook**:

- Session type transitions (focus → short break → focus → long break)
- Cycle counting logic (4 focus sessions = long break trigger)
- Timer state management (play/pause/reset/skip)
- Settings persistence and validation

**PomodoroControls Component**:

- Button interactions and state updates
- Task input handling and validation
- Skip session confirmation flow

**PomodoroSettings Component**:

- Preset selection and custom input validation
- Settings save/cancel functionality
- Default value handling

### Integration Tests

**Mode Switching**:

- Seamless transition between Clock/Timer/Pomodoro modes
- State preservation during mode switches
- Theme consistency across all modes

**Session Flow**:

- Complete Pomodoro cycle (4 focus + 3 short breaks + 1 long break)
- Auto-advance vs manual advance scenarios
- Session interruption and recovery

**Persistence**:

- Settings save/load from localStorage
- Session state recovery after browser refresh
- Theme integration with existing customization system

### User Experience Tests

**Accessibility**:

- Keyboard navigation for all Pomodoro controls
- Screen reader compatibility for session announcements
- High contrast mode support for session type indicators

**Performance**:

- Smooth animations during session transitions
- Responsive UI during timer countdown
- Memory usage during extended Pomodoro sessions

**Cross-browser Compatibility**:

- Notification API support across browsers
- localStorage persistence reliability
- CSS animation consistency

## Implementation Notes

### Reusing Existing Infrastructure

**Timer Logic**: The core countdown mechanism from `useTimer` will be extended rather than replaced, maintaining the existing flip animation system.

**Theme Integration**: Pomodoro components will use the existing ThemeContext for consistent styling and customization.

**Component Patterns**: Follow established patterns for component structure, CSS organization, and prop interfaces.

### Performance Considerations

**State Updates**: Minimize re-renders by using proper dependency arrays and memoization for Pomodoro-specific calculations.

**Animation Efficiency**: Leverage existing flip card animations without modification, ensuring smooth performance.

**Memory Management**: Clean up timers and intervals properly when switching modes or unmounting components.

### Accessibility Features

**Session Announcements**: Use ARIA live regions to announce session transitions for screen readers.

**Keyboard Controls**: Ensure all Pomodoro functionality is accessible via keyboard shortcuts.

**Visual Indicators**: Provide clear visual feedback for session types using color, icons, and text.

### Future Extensibility

**Statistics Tracking**: Design data models to support future analytics features (daily/weekly Pomodoro counts, productivity metrics).

**Sound Notifications**: Architecture supports adding audio notifications for session transitions.

**Team Features**: State management designed to potentially support shared Pomodoro sessions or team synchronization.
