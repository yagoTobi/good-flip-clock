# Flip Clock App

A customizable flip clock application built with React that provides both clock and timer functionality with smooth flip card animations. Features a modern, responsive design with extensive theming options including background customization, font selection, and color schemes.

## Features

- **Real-time Clock Display** - Digital clock with smooth flip animations for time transitions
- **Countdown Timer** - Customizable timer with play, pause, and reset controls
- **Pomodoro Timer** - Built-in Pomodoro technique support with work/break sessions
- **Theme Customization** - Multiple background options, color schemes, and font choices
- **Responsive Design** - Clean, modern interface that works on all screen sizes
- **Persistent Settings** - User preferences automatically saved and restored
- **Smooth Animations** - CSS-based flip card animations for optimal performance

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd flip-clock-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the application for production deployment
- `npm run lint` - Run ESLint to check code quality and style
- `npm run preview` - Preview the production build locally

### Development Workflow

1. **Development Server**: Use `npm run dev` for active development with instant hot reloading
2. **Code Quality**: Run `npm run lint` to check for code style and potential issues
3. **Production Testing**: Use `npm run build` followed by `npm run preview` to test production builds
4. **File Organization**: Follow the established component structure with co-located styles and tests

## Project Structure

```
src/
├── components/          # React components
│   ├── FlipClock/      # Core clock display with animations
│   ├── CustomizationPanel/ # Theme and settings controls
│   ├── ModeSelector/   # Clock/Timer mode switching
│   ├── TimerControls/  # Timer play/pause/reset controls
│   └── ...             # Additional feature components
├── contexts/           # React contexts for global state
├── hooks/              # Custom React hooks
├── constants/          # Application constants
├── utils/              # Utility functions
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## Architecture

### State Management

- **React Context** - Global theme and settings management
- **Custom Hooks** - Timer logic and font loading (`useTimer`, `usePomodoroTimer`, `useFont`)
- **Local Storage** - Persistent user preferences

### Component Hierarchy

```
App (ThemeProvider)
└── AppContent
    ├── FlipClock
    │   ├── ClockDisplay
    │   ├── TimerDisplay
    │   └── PomodoroDisplay
    ├── ModeSelector
    ├── CustomizationPanel
    │   ├── BackgroundSelector
    │   ├── ColorSelector
    │   └── FontSelector
    └── Timer/Pomodoro Controls
```

### Technology Stack

- **React 19.1.0** - Modern React with latest hooks and features
- **Vite** - Fast build tool with hot module replacement
- **CSS Modules** - Component-scoped styling
- **React Icons** - Icon library for UI components
- **ESLint** - Code quality and consistency

## Customization

### Adding New Themes

The app supports extensive customization through the theme system:

1. **Background Options** - Solid colors, gradients, and image backgrounds
2. **Color Schemes** - Customizable text and accent colors
3. **Font Selection** - Multiple font families with Google Fonts integration
4. **Layout Options** - Responsive design adapts to different screen sizes

### Extending Functionality

The modular architecture makes it easy to add new features:

- Add new display modes by creating components in `src/components/FlipClock/displays/`
- Extend theming by modifying the ThemeContext and related components
- Add new timer types by creating custom hooks following the existing patterns

## Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

### Deployment Options

- **Static Hosting** - Deploy the `dist/` folder to services like Netlify, Vercel, or GitHub Pages
- **Web Servers** - Serve the built files with any web server (Apache, Nginx, etc.)
- **CDN** - Upload to CDN services for global distribution

## Contributing

### Code Standards

- Follow the existing component structure and naming conventions
- Use JSDoc comments for component and function documentation
- Maintain consistent import/export patterns
- Write tests for new functionality when applicable

### Development Guidelines

1. Create feature branches for new functionality
2. Follow the established file organization patterns
3. Update documentation when adding new features
4. Test changes across different screen sizes and browsers

### Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes following the code standards
3. Test your changes thoroughly
4. Update documentation as needed
5. Submit a pull request with a clear description

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite for optimal development experience
- Flip animations inspired by classic flip clocks
- Icons provided by React Icons library
