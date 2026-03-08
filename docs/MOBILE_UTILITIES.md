# Mobile UX Documentation

This document describes the mobile-specific layout system, UX behaviours, and CSS patterns in the flip clock application.

## Overview

Mobile is split into two orientations with distinct layouts. Both use `100dvh` (dynamic viewport height) so the layout tightly tracks the browser's visible area as the address bar shows and hides.

| Context | Breakpoint | Layout |
|---|---|---|
| Portrait | `max-width: 767px` + `orientation: portrait` | Two cards stacked vertically, MobileBottomBar fixed at bottom |
| Landscape | `max-height: 500px` + `orientation: landscape` | Two cards side-by-side, controls hidden, landscape-customize-btn fixed |
| Tablet / Desktop | `min-width: 768px` | Horizontal card pair, ModeSelector pill, floating panels |

---

## Card Sizing System

### Unified aspect ratio

All flip cards use `aspect-ratio: 22 / 24` as the single source of truth for card shape. This means cards always look the same proportion on every screen — the only difference is which dimension drives sizing.

- **Desktop / landscape** — width-driven: `width: 22vw`, height auto-computed from aspect-ratio
- **Mobile portrait** — height-driven: explicit `height: clamp(...)`, width auto-computed from aspect-ratio

### Portrait card formula

```css
/* FlipCard.css — mobile portrait */
.flip-card:not(.mini) .flip-card-inner {
  height: clamp(170px, calc((100dvh - 170px) / 2), 340px);
  width: auto;         /* auto-computed = height × 22/24 */
  max-width: none;
  min-width: 0;
}
```

**Overhead breakdown**: `170px = 8px top padding + 160px bottom padding (MobileBottomBar clearance) + 2px gap buffer`

The font size is derived from the same 13:24 ratio as desktop:

```css
font-size: clamp(92px, calc((100dvh - 170px) * 0.27), 184px);
/* 0.27 ≈ 13/24 / 2 — halved because the formula is per-card, not total height */
```

### app-main portrait padding

```css
@media (max-width: 767px) and (orientation: portrait) {
  .app-main {
    padding: 0.5rem 0.5rem 160px;  /* bottom clears MobileBottomBar */
  }
}
```

The `160px` bottom padding is sized for the tallest MobileBottomBar state (controls row visible). It matches the formula overhead so the two always stay in sync.

---

## MobileBottomBar

**File**: `src/components/MobileBottomBar/MobileBottomBar.jsx` + `MobileBottomBar.css`

A fixed bottom bar shown only on mobile (`max-width: 767px`). It has three rows:

### Mode dots row

Three dots corresponding to Clock / Timer / Pomodoro. The active dot is filled; the active dot pulses when a timer is running.

### Controls row

Animated height: hidden (max-height: 0) when in Clock mode, expanded when in Timer or Pomodoro mode.

**Timer controls** (Settings → Play/Pause → Stop):
```
[ ⚙ ]  [ ▶ / ⏸ ]  [ ⏹ ]
```

**Pomodoro controls** (Settings → Play/Pause → Stop → Skip):
```
[ ⚙ ]  [ ▶ / ⏸ ]  [ ⏹ ]  [ ⏭ ]
```

Stop and Skip buttons are dimmed (`opacity: 0.4`) when the timer hasn't started yet.

The React component keeps controls mounted for 250 ms after switching away from Timer/Pomodoro mode so the CSS height-collapse transition can animate cleanly before React removes the nodes.

### Utility row

```
[ Customize ]  [ Music ]  [ Coffee ]
```

Music button pulses when music is playing and the panel is closed.

---

## Tap-to-Focus (Portrait)

After **4 seconds of inactivity** on mobile portrait, the class `.mobile-chrome-hidden` is added to `.app`. This:

- Fades out the MobileBottomBar (`opacity: 0; pointer-events: none`)
- Collapses `.app-main` top and bottom padding to zero, so the clock floats in the true center of `100dvh`

Any touch anywhere restores the chrome and resets the 4 s timer. Tapping the clock/background area also manually toggles chrome visibility.

```css
@media (max-width: 767px) and (orientation: portrait) {
  .app.mobile-chrome-hidden .mobile-bottom-bar {
    opacity: 0;
    pointer-events: none;
  }
  .app.mobile-chrome-hidden .app-main {
    padding: 0 0.5rem;
  }
}
```

---

## Tap-to-Hide Controls (Landscape)

In landscape orientation, the same 4 s inactivity auto-hide applies. `.mobile-chrome-hidden` hides:

- Timer/Pomodoro desktop controls
- The LandscapeBar (mode dots + utility buttons)
- `.app-main` padding collapses to zero so the clock centers in the full viewport

```css
@media (max-height: 500px) and (orientation: landscape) {
  .app.mobile-chrome-hidden .timer-controls,
  .app.mobile-chrome-hidden .pomodoro-controls,
  .app.mobile-chrome-hidden .lb-dots,
  .app.mobile-chrome-hidden .lb-utils {
    opacity: 0;
    pointer-events: none;
  }
  .app.mobile-chrome-hidden .app-main {
    padding: 0;
  }
}
```

---

## LandscapeBar

**Component**: `src/components/LandscapeBar/LandscapeBar.jsx` + `LandscapeBar.css`

In landscape the MobileBottomBar is hidden (too tall for the short viewport). The LandscapeBar provides equivalent navigation and utility access via two compact glassmorphic pills:

- **Left pill** (`.lb-dots`): Three mode indicator dots — active dot highlighted, pulses green when a timer is running. `position: fixed; bottom: 0.75rem; left: 1rem`.
- **Right pill** (`.lb-utils`): Customize and Coffee buttons. `position: fixed; bottom: 0.75rem; right: 1rem`.

Both pills are hidden by `.mobile-chrome-hidden` alongside the timer controls. The center area remains clear for the timer/pomodoro control buttons.

---

## Mode Label Toast

**Class**: `.mobile-mode-label`

A small uppercase label (e.g. "POMODORO", "TIMER") that appears for 3 s at the top of the screen whenever the user changes mode on mobile. It is `position: fixed` so it never affects layout.

```css
/* portrait: top: 1rem */
/* landscape: top: 0.5rem */
animation: mobileModeLabel 3s ease forwards;

@keyframes mobileModeLabel {
  0%   { opacity: 0;   transform: translateX(-50%) translateY(-5px); }
  12%  { opacity: 0.6; transform: translateX(-50%) translateY(0); }
  70%  { opacity: 0.6; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0;   transform: translateX(-50%) translateY(3px); }
}
```

The component remounts (key prop changes) on every mode switch so the animation always replays from the beginning.

---

## Swipe to Change Mode

Left/right swipe gestures on the clock card area cycle through Clock → Timer → Pomodoro (swipe left = next, swipe right = previous). Handled via `touchstart`/`touchend` listeners in the FlipClock component with a 50 px minimum swipe threshold.

---

## Inspirational Quote

Hidden on all mobile (`max-width: 767px`). Visible on tablet and desktop only.

```css
@media (max-width: 767px) {
  .inspirational-quote {
    display: none;
  }
}
```

This frees the full visible area for the flip cards on mobile portrait.

---

## Pomodoro Session Indicator

The session progress dots are hidden on mobile portrait (space too tight). They remain visible on landscape and desktop.

```css
@media (max-width: 767px) and (orientation: portrait) {
  .pomodoro-session-indicator {
    display: none;
  }
}
```

---

## Orientation Change Transitions

Padding and gap changes are smoothed to avoid jarring layout jumps when the device rotates:

```css
@media (max-width: 767px) {
  .app-main,
  .clock-container {
    transition: padding 0.3s ease, gap 0.3s ease, flex-direction 0.3s ease;
  }
}
```

---

## Viewport Height

`100dvh` (dynamic viewport height) is used throughout mobile so the layout tightly fits between the browser's own chrome — Chrome Mobile's address bar shrinks `dvh` from the top; Safari's toolbar shrinks it from the bottom. Older browsers that don't support `dvh` fall back to the globally-set `100vh`.

---

## Touch Interaction Notes

- `-webkit-tap-highlight-color: transparent` on all interactive buttons
- `user-select: none` on the body; `user-select: text` restored on inputs and textareas
- `overscroll-behavior: none` on body to prevent pull-to-refresh and elastic scrolling
- Minimum touch target size 44–48 px on all buttons (WCAG 2.1 AA)
