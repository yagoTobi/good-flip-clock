# Mobile Utilities Documentation

This document describes the mobile-specific CSS utilities and helper classes available in the flip clock application.

## Overview

The mobile utilities provide a comprehensive set of CSS classes and custom properties designed to enhance mobile user experience, improve touch interactions, and ensure consistent responsive design patterns.

## CSS Custom Properties

### Mobile Spacing Scale

```css
--mobile-space-xs: 0.25rem; /* 4px */
--mobile-space-sm: 0.5rem; /* 8px */
--mobile-space-md: 0.75rem; /* 12px */
--mobile-space-lg: 1rem; /* 16px */
--mobile-space-xl: 1.5rem; /* 24px */
--mobile-space-2xl: 2rem; /* 32px */
--mobile-space-3xl: 3rem; /* 48px */
```

### Touch Target Sizes

```css
--touch-target-min: 44px; /* Minimum touch target */
--touch-target-comfortable: 48px; /* Comfortable touch target */
--touch-target-large: 56px; /* Large touch target */
```

### Mobile Typography Scale

```css
--mobile-text-xs: 0.75rem; /* 12px */
--mobile-text-sm: 0.875rem; /* 14px */
--mobile-text-base: 1rem; /* 16px */
--mobile-text-lg: 1.125rem; /* 18px */
--mobile-text-xl: 1.25rem; /* 20px */
--mobile-text-2xl: 1.5rem; /* 24px */
--mobile-text-3xl: 1.875rem; /* 30px */
```

### Mobile Theme Variables

```css
--mobile-bg-primary: #1a1a1a;
--mobile-bg-secondary: #2a2a2a;
--mobile-bg-tertiary: #3a3a3a;
--mobile-text-primary: rgba(255, 255, 255, 0.95);
--mobile-text-secondary: rgba(255, 255, 255, 0.8);
--mobile-text-tertiary: rgba(255, 255, 255, 0.6);
```

## Utility Classes

### Layout Utilities

#### Flexbox

```css
.mobile-flex          /* display: flex */
/* display: flex */
.mobile-flex-col      /* flex-direction: column */
.mobile-flex-row      /* flex-direction: row */
.mobile-flex-center   /* align-items: center; justify-content: center */
.mobile-flex-between  /* justify-content: space-between */
.mobile-flex-around; /* justify-content: space-around */
```

#### Grid

```css
.mobile-grid          /* display: grid */
/* display: grid */
.mobile-grid-1        /* grid-template-columns: 1fr */
.mobile-grid-2        /* grid-template-columns: repeat(2, 1fr) */
.mobile-grid-auto; /* grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) */
```

### Spacing Utilities

#### Gap

```css
.mobile-gap-xs        /* gap: var(--mobile-space-xs) */
/* gap: var(--mobile-space-xs) */
.mobile-gap-sm        /* gap: var(--mobile-space-sm) */
.mobile-gap-md        /* gap: var(--mobile-space-md) */
.mobile-gap-lg        /* gap: var(--mobile-space-lg) */
.mobile-gap-xl        /* gap: var(--mobile-space-xl) */
.mobile-gap-2xl; /* gap: var(--mobile-space-2xl) */
```

#### Padding

```css
.mobile-p-xs          /* padding: var(--mobile-space-xs) */
/* padding: var(--mobile-space-xs) */
.mobile-p-sm          /* padding: var(--mobile-space-sm) */
.mobile-p-md          /* padding: var(--mobile-space-md) */
.mobile-p-lg          /* padding: var(--mobile-space-lg) */
.mobile-px-sm         /* padding-left/right: var(--mobile-space-sm) */
.mobile-py-md; /* padding-top/bottom: var(--mobile-space-md) */
```

### Touch Target Utilities

```css
.touch-target-min         /* min-width/height: 44px */
/* min-width/height: 44px */
.touch-target-comfortable /* min-width/height: 48px */
.touch-target-large; /* min-width/height: 56px */
```

### Typography Utilities

#### Font Sizes

```css
.mobile-text-xs       /* font-size: var(--mobile-text-xs) */
/* font-size: var(--mobile-text-xs) */
.mobile-text-sm       /* font-size: var(--mobile-text-sm) */
.mobile-text-base     /* font-size: var(--mobile-text-base) */
.mobile-text-lg       /* font-size: var(--mobile-text-lg) */
.mobile-text-xl       /* font-size: var(--mobile-text-xl) */
.mobile-text-2xl; /* font-size: var(--mobile-text-2xl) */
```

#### Responsive Typography

```css
.responsive-heading-1 /* Mobile-optimized h1 styling */
/* Mobile-optimized h1 styling */
.responsive-heading-2 /* Mobile-optimized h2 styling */
.responsive-heading-3 /* Mobile-optimized h3 styling */
.responsive-body      /* Mobile-optimized body text */
.responsive-caption; /* Mobile-optimized caption text */
```

### Mobile Component Patterns

#### Mobile Button

```css
.mobile-button         /* Base mobile button styling */
/* Base mobile button styling */
.mobile-button-primary /* Primary button with blue background */
.mobile-button-secondary; /* Secondary button with transparent background */
```

#### Mobile Card

```css
.mobile-card/* Mobile-optimized card layout */;
```

#### Mobile Panel

```css
.mobile-panel         /* Bottom slide-up panel */
/* Bottom slide-up panel */
.mobile-panel.open; /* Open state for panel */
```

### Touch Interaction Utilities

```css
.mobile-touch-feedback    /* Enhanced touch feedback with scale animation */
/* Enhanced touch feedback with scale animation */
.tap-highlight-none      /* Removes default mobile tap highlight */
.touch-callout-none      /* Disables iOS callout menu */
.user-select-none; /* Prevents text selection */
```

### Responsive Utilities

#### Mobile-only Classes (max-width: 767px)

```css
.mobile-show          /* display: block !important on mobile */
/* display: block !important on mobile */
.mobile-hide          /* display: none !important on mobile */
.mobile-full-width    /* width: 100% !important on mobile */
.mobile-center        /* center content on mobile */
.mobile-stack-force   /* force vertical stacking on mobile */
.mobile-compact; /* reduce spacing on mobile */
```

#### Tablet-only Classes (min-width: 768px)

```css
.tablet-show          /* display: block !important on tablet+ */
/* display: block !important on tablet+ */
.tablet-hide; /* display: none !important on tablet+ */
```

### Orientation Utilities

#### Portrait-specific (mobile portrait only)

```css
.portrait-only        /* display: block in portrait */
/* display: block in portrait */
.portrait-stack; /* flex-direction: column in portrait */
```

#### Landscape-specific (mobile landscape only)

```css
.landscape-only       /* display: block in landscape */
/* display: block in landscape */
.landscape-row        /* flex-direction: row in landscape */
.landscape-compact; /* reduced spacing in landscape */
```

## Usage Examples

### Basic Mobile Layout

```html
<div class="mobile-container mobile-stack mobile-gap-lg">
  <div class="mobile-card mobile-p-lg">
    <h2 class="responsive-heading-2 mobile-text-center">Settings</h2>
    <div class="mobile-grid-1 mobile-gap-md">
      <button
        class="mobile-button mobile-button-primary touch-target-comfortable"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>
```

### Touch-Friendly Controls

```html
<div class="mobile-flex mobile-flex-center mobile-gap-xl">
  <button class="mobile-button touch-target-large mobile-touch-feedback">
    Play
  </button>
  <button class="mobile-button touch-target-large mobile-touch-feedback">
    Pause
  </button>
</div>
```

### Responsive Typography

```html
<div class="mobile-container">
  <h1 class="responsive-heading-1 mobile-text-center">Flip Clock</h1>
  <p class="responsive-body mobile-text-center mobile-mt-md">
    A beautiful, customizable clock application
  </p>
</div>
```

### Mobile Panel

```html
<div class="mobile-panel" id="settings-panel">
  <div class="mobile-p-lg">
    <h3 class="responsive-heading-3 mobile-mb-lg">Timer Settings</h3>
    <div class="mobile-stack mobile-gap-md">
      <!-- Panel content -->
    </div>
  </div>
</div>
```

## Performance Considerations

### Hardware Acceleration

```css
.mobile-gpu-accelerated       /* transform: translateZ(0) */
/* transform: translateZ(0) */
.mobile-gpu-accelerated-scroll; /* optimized scrolling */
```

### CSS Containment

```css
.mobile-contain-layout        /* contain: layout */
/* contain: layout */
.mobile-contain-style         /* contain: style */
.mobile-contain-paint         /* contain: paint */
.mobile-contain-all; /* contain: layout style paint */
```

## Accessibility Features

- All touch targets meet WCAG 2.1 AA minimum size requirements (44px)
- High contrast mode support with `@media (prefers-contrast: high)`
- Reduced motion support with `@media (prefers-reduced-motion: reduce)`
- Screen reader utilities with `.mobile-sr-only`
- Focus visible utilities with `.mobile-focus-visible`

## Browser Support

The mobile utilities are designed to work across all modern mobile browsers:

- iOS Safari 12+
- Chrome Mobile 70+
- Firefox Mobile 68+
- Samsung Internet 10+

## Integration

The mobile utilities are automatically imported in `src/main.jsx` and are available throughout the application. They work seamlessly with the existing theme system and responsive breakpoints.
