# Project Structure

## Root Level

- `src/` - Main application source code
- `public/` - Static assets served directly
- `dist/` - Production build output (generated)
- `.kiro/` - Kiro AI assistant configuration and specs

## Source Organization (`src/`)

### Core Application

- `main.jsx` - Application entry point with React root
- `App.jsx` - Main app component with theme provider
- `App.css` - Global app styles
- `index.css` - Base CSS and reset styles

### Component Architecture (`src/components/`)

Components follow a consistent folder structure:

```
ComponentName/
├── ComponentName.jsx     # Main component file
├── ComponentName.css     # Component-specific styles
├── index.js             # Export barrel file
└── __tests__/           # Component tests (when present)
```

#### Key Components

- **FlipClock/**: Core clock display with flip animations
  - `displays/` - Different display modes (ClockDisplay, TimerDisplay, FlipCardGrid)
- **CustomizationPanel/**: Theme and appearance settings
- **ModeSelector/**: Switch between clock and timer modes
- **TimerControls/**: Play/pause/reset timer functionality
- **TimerSettings/**: Configure timer duration
- **BackgroundSelector/**: Background theme selection
- **FontSelector/**: Font family selection

### Application Logic

- `contexts/` - React contexts (ThemeContext for global theming)
- `hooks/` - Custom React hooks (useTimer, useFont)
- `constants/` - Application constants and configuration
- `utils/` - Utility functions and helpers

## File Naming Conventions

- **Components**: PascalCase for folders and JSX files (`FlipClock.jsx`)
- **Styles**: Match component name (`FlipClock.css`)
- **Hooks**: camelCase with `use` prefix (`useTimer.js`)
- **Constants**: UPPER_SNAKE_CASE for values, camelCase for files
- **Index files**: Always `index.js` for barrel exports

## Import/Export Patterns

- Use barrel exports (`index.js`) for cleaner imports
- Default exports for main components
- Named exports for utilities and constants
- Relative imports for local files, absolute for external packages
