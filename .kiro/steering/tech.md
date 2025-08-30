# Technology Stack

## Build System & Framework

- **Vite**: Modern build tool with fast HMR (Hot Module Replacement)
- **React 19.1.0**: Latest React with modern hooks and features
- **ES Modules**: Project uses `"type": "module"` configuration

## Dependencies

- **react-icons**: Icon library for UI components
- **ESLint**: Code linting with React-specific rules

## Development Tools

- **@vitejs/plugin-react**: Vite plugin for React with Babel Fast Refresh
- **ESLint plugins**: react-hooks, react-refresh for React-specific linting

## Common Commands

### Development

```bash
npm run dev          # Start development server with HMR
npm run preview      # Preview production build locally
```

### Build & Deploy

```bash
npm run build        # Build for production (outputs to dist/)
```

### Code Quality

```bash
npm run lint         # Run ESLint on all files
```

## Browser APIs Used

- **localStorage**: For persisting user theme preferences
- **requestAnimationFrame**: For smooth animations (implied by flip animations)
- **CSS Custom Properties**: For dynamic theming

## Performance Considerations

- Components use React hooks for state management
- Theme settings persist across sessions
- Flip animations are CSS-based for optimal performance
