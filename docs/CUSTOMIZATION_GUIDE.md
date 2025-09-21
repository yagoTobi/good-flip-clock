# Customization Guide

## Overview

The Flip Clock App features a comprehensive customization system that allows users to personalize their clock experience through themes, fonts, colors, and backgrounds. This guide explains how the customization system works and how to extend it with new options.

## Customization System Architecture

### Theme Context System

The customization system is built around React Context for global state management:

```javascript
// Theme state structure
const themeState = {
  background: string, // Background theme identifier
  font: string, // Font family identifier
  clockColor: string, // Clock text color (hex)
  panelColor: string, // Panel background color (hex)
  // Setter functions
  setBackground: Function,
  setFont: Function,
  setClockColor: Function,
  setPanelColor: Function,
  resetToDefaults: Function,
};
```

### Persistence Layer

All customization settings are automatically persisted to localStorage:

```javascript
// Settings are saved as JSON
const settings = {
  background: "#2563eb",
  font: "roboto",
  clockColor: "#ffffff",
  panelColor: "#1a1a1a",
};
localStorage.setItem("clockThemeSettings", JSON.stringify(settings));
```

### CSS Custom Properties

The system uses CSS custom properties for dynamic styling:

```css
:root {
  --clock-font-family: "Roboto", sans-serif;
  --clock-color: #ffffff;
  --panel-color: #1a1a1a;
}
```

## Background Customization

### Background Types

The system supports three types of backgrounds:

#### 1. Solid Colors

```javascript
{
  id: "blue",
  name: "Blue",
  value: "#2563eb",
  thumbnail: "#2563eb",
  category: "colors"
}
```

#### 2. CSS Gradients

```javascript
{
  id: "gradient-sunset",
  name: "Sunset",
  value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  thumbnail: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  category: "gradients"
}
```

#### 3. Images

```javascript
{
  id: "image-mountains",
  name: "Mountains",
  value: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center") center/cover',
  thumbnail: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center") center/cover',
  category: "images"
}
```

### Adding New Backgrounds

To add new background options, modify the `BACKGROUND_OPTIONS` array in `src/components/BackgroundSelector/BackgroundSelector.jsx`:

```javascript
// Add to BACKGROUND_OPTIONS array
{
  id: "my-custom-background",
  name: "Custom Background",
  value: "#your-css-value-here",
  thumbnail: "#thumbnail-version",
  category: "colors" // or "gradients" or "images"
}
```

#### Adding Solid Colors

```javascript
{
  id: "emerald",
  name: "Emerald",
  value: "#10b981",
  thumbnail: "#10b981",
  category: "colors"
}
```

#### Adding Gradients

```javascript
{
  id: "gradient-rainbow",
  name: "Rainbow",
  value: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
  thumbnail: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
  category: "gradients"
}
```

#### Adding Images

```javascript
{
  id: "image-custom",
  name: "Custom Image",
  value: 'url("your-image-url-here") center/cover',
  thumbnail: 'url("your-thumbnail-url-here") center/cover',
  category: "images"
}
```

**Image Guidelines:**

- Use high-resolution images (1920x1080 or higher)
- Ensure images work well as backgrounds (not too busy)
- Provide smaller thumbnail versions (100x100) for performance
- Consider using Unsplash or similar services for quality images
- Test contrast with clock text for readability

## Font Customization

### Font System Architecture

Fonts are managed through the `fontUtils.js` system:

```javascript
// Font option structure
const fontOption = {
  id: "unique-identifier",
  name: "Display Name",
  value: "'Font Family', fallback, generic-family",
  sample: "12:34", // Preview text
};
```

### Available Fonts

The system includes several pre-configured fonts:

```javascript
export const FONT_OPTIONS = {
  default: {
    id: "default",
    name: "Impact",
    value: "'Impact', 'Arial Black', Arial, sans-serif",
    sample: "12:34",
  },
  roboto: {
    id: "roboto",
    name: "Roboto",
    value: "'Roboto', sans-serif",
    sample: "12:34",
  },
  orbitron: {
    id: "orbitron",
    name: "Orbitron",
    value: "'Orbitron', monospace",
    sample: "12:34",
  },
  // ... more fonts
};
```

### Adding New Fonts

#### 1. Add Font Option to fontUtils.js

```javascript
// Add to FONT_OPTIONS in src/utils/fontUtils.js
"my-custom-font": {
  id: "my-custom-font",
  name: "My Custom Font",
  value: "'My Custom Font', 'Fallback Font', sans-serif",
  sample: "12:34",
}
```

#### 2. Load Web Fonts (if needed)

For Google Fonts or other web fonts, add the import to your CSS:

```css
/* In src/index.css or App.css */
@import url("https://fonts.googleapis.com/css2?family=Your+Font+Name:wght@400;700&display=swap");
```

Or use the HTML link method in `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Your+Font+Name:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

#### 3. Font Selection Best Practices

- **Include Fallbacks**: Always provide fallback fonts for reliability
- **Test Readability**: Ensure fonts are readable at large sizes
- **Consider Style**: Choose fonts that match the clock's aesthetic
- **Performance**: Limit the number of web fonts to avoid loading delays

#### Example: Adding a Custom Google Font

```javascript
// 1. Add to FONT_OPTIONS
"playfair": {
  id: "playfair",
  name: "Playfair Display",
  value: "'Playfair Display', Georgia, serif",
  sample: "12:34",
}
```

```css
/* 2. Import in CSS */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap");
```

## Color Customization

### Color System

The color system manages two primary colors:

- **Clock Color**: Text color for time digits and labels
- **Panel Color**: Background color for flip cards and panels

### Color Integration

Colors are applied through CSS custom properties:

```css
.flip-card {
  color: var(--clock-color);
  background-color: var(--panel-color);
}
```

### Adding Color Presets

To add predefined color combinations, you can extend the ColorSelector component:

```javascript
// Add to ColorSelector component
const COLOR_PRESETS = [
  {
    name: "Dark Theme",
    clockColor: "#ffffff",
    panelColor: "#1a1a1a",
  },
  {
    name: "Light Theme",
    clockColor: "#000000",
    panelColor: "#ffffff",
  },
  {
    name: "Blue Theme",
    clockColor: "#ffffff",
    panelColor: "#2563eb",
  },
];
```

### Color Accessibility

When adding colors, consider:

- **Contrast Ratio**: Ensure sufficient contrast between text and background
- **Color Blindness**: Test with color blindness simulators
- **Readability**: Verify text remains readable in all lighting conditions

## Theme Presets

### Creating Complete Theme Presets

You can create complete theme presets that combine background, font, and colors:

```javascript
// Theme preset structure
const THEME_PRESETS = {
  "dark-modern": {
    name: "Dark Modern",
    background: "#0a0a0a",
    font: "roboto",
    clockColor: "#ffffff",
    panelColor: "#1a1a1a",
  },
  "light-classic": {
    name: "Light Classic",
    background: "#f5f5f5",
    font: "default",
    clockColor: "#000000",
    panelColor: "#ffffff",
  },
  "neon-cyber": {
    name: "Neon Cyber",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    font: "orbitron",
    clockColor: "#00ff00",
    panelColor: "#000000",
  },
};
```

### Implementing Theme Presets

To implement theme presets, you could add a new component:

```javascript
// ThemePresetSelector.jsx
const ThemePresetSelector = () => {
  const { setBackground, setFont, setClockColor, setPanelColor } = useTheme();

  const applyPreset = (preset) => {
    setBackground(preset.background);
    setFont(preset.font);
    setClockColor(preset.clockColor);
    setPanelColor(preset.panelColor);
  };

  return (
    <div className="theme-presets">
      {Object.entries(THEME_PRESETS).map(([id, preset]) => (
        <button
          key={id}
          onClick={() => applyPreset(preset)}
          className="preset-button"
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};
```

## Advanced Customization

### Custom CSS Properties

You can extend the system with additional CSS custom properties:

```css
:root {
  --clock-font-family: "Roboto", sans-serif;
  --clock-color: #ffffff;
  --panel-color: #1a1a1a;
  --accent-color: #2563eb;
  --border-radius: 8px;
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

### Animation Customization

Customize flip animations by modifying CSS variables:

```css
:root {
  --flip-duration: 0.6s;
  --flip-timing: ease-in-out;
  --flip-perspective: 1000px;
}

.flip-card {
  transition: transform var(--flip-duration) var(--flip-timing);
  perspective: var(--flip-perspective);
}
```

### Dynamic Theme Generation

For advanced use cases, you could implement dynamic theme generation:

```javascript
// Generate theme based on a base color
const generateTheme = (baseColor) => {
  const hsl = hexToHsl(baseColor);

  return {
    background: `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 40, 5)}%)`,
    clockColor: hsl.l > 50 ? "#000000" : "#ffffff",
    panelColor: `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 20, 95)}%)`,
    accentColor: baseColor,
  };
};
```

## Customization UI Components

### Adding New Customization Tabs

To add new customization options, extend the CustomizationPanel:

```javascript
// Add new tab to CustomizationPanel
const [activeTab, setActiveTab] = useState("background");

// Add tab button
<button
  className={`tab-button ${activeTab === "animations" ? "active" : ""}`}
  onClick={() => setActiveTab("animations")}
>
  Animations
</button>;

// Add tab content
{
  activeTab === "animations" && (
    <div className="tab-content">
      <AnimationSelector />
    </div>
  );
}
```

### Creating Custom Selectors

Follow the existing pattern for new selector components:

```javascript
const AnimationSelector = () => {
  const { animationSpeed, setAnimationSpeed } = useTheme();

  const speeds = [
    { id: "slow", name: "Slow", value: "1s" },
    { id: "normal", name: "Normal", value: "0.6s" },
    { id: "fast", name: "Fast", value: "0.3s" },
  ];

  return (
    <div className="animation-selector">
      <h3>Animation Speed</h3>
      <div className="speed-options">
        {speeds.map((speed) => (
          <button
            key={speed.id}
            className={`speed-option ${
              animationSpeed === speed.value ? "selected" : ""
            }`}
            onClick={() => setAnimationSpeed(speed.value)}
          >
            {speed.name}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Performance Considerations

### Optimization Tips

1. **Lazy Load Images**: Load background images only when needed
2. **Limit Web Fonts**: Too many web fonts can slow initial load
3. **CSS Custom Properties**: Use for dynamic styling instead of inline styles
4. **Debounce Updates**: Debounce rapid theme changes to avoid excessive re-renders

### Memory Management

```javascript
// Clean up resources when themes change
useEffect(() => {
  // Apply theme
  applyTheme(theme);

  // Cleanup function
  return () => {
    // Clean up any resources (event listeners, etc.)
  };
}, [theme]);
```

## Testing Customizations

### Visual Testing

- Test all theme combinations for visual consistency
- Verify readability in different lighting conditions
- Check responsive behavior on different screen sizes

### Accessibility Testing

- Verify color contrast ratios meet WCAG guidelines
- Test with screen readers
- Ensure keyboard navigation works properly

### Performance Testing

- Measure theme switching performance
- Test with slow network connections (for web fonts/images)
- Monitor memory usage with frequent theme changes

## Troubleshooting

### Common Issues

#### Fonts Not Loading

```javascript
// Check if font is loaded
document.fonts.ready.then(() => {
  console.log("All fonts loaded");
});

// Load specific font
const font = new FontFace("MyFont", "url(font.woff2)");
font.load().then(() => {
  document.fonts.add(font);
});
```

#### Background Images Not Displaying

- Check image URLs are accessible
- Verify CORS settings for external images
- Test with different image formats

#### Theme Not Persisting

- Check localStorage availability
- Verify JSON serialization/deserialization
- Test in private browsing mode

### Debug Mode

Add debug logging for theme changes:

```javascript
const debugTheme = (theme) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Theme applied:", theme);
    console.log("CSS custom properties:", {
      "--clock-font-family": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--clock-font-family"),
      "--clock-color": getComputedStyle(
        document.documentElement
      ).getPropertyValue("--clock-color"),
    });
  }
};
```

This customization guide provides a comprehensive foundation for understanding and extending the Flip Clock App's theming system. The modular architecture makes it easy to add new customization options while maintaining consistency and performance.
