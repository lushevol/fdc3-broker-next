# Dark/Light Theme Switch - Design Document

## Overview

Add a dark/light theme toggle to the Cashflow Blotter preview that persists user preference and provides a clean, professional light mode alternative to the current dark theme.

---

## Architecture

### State Management

- **ThemeProvider**: React Context wrapping the application
- **useTheme hook**: Access theme state and toggle function
- **Persistence**: localStorage key `theme` with values `"dark" | "light"`
- **Default Logic**: Check `prefers-color-scheme` media query if no saved preference, fallback to `"dark"`

### Tailwind Configuration

Already configured in `index.html`:

```javascript
darkMode: 'class';
```

The `dark` class on `<html>` or `<body>` triggers dark mode styles. All existing dark styles use Tailwind's `dark:` prefix.

---

## Color Mappings

| Element          | Dark Mode               | Light Mode                        |
| ---------------- | ----------------------- | --------------------------------- |
| Page Background  | `bg-slate-950`          | `bg-gray-50`                      |
| Card/Panel BG    | `bg-slate-900/50`       | `bg-white border border-gray-200` |
| Elevated Surface | `bg-slate-850`          | `bg-gray-100`                     |
| Primary Text     | `text-slate-200`        | `text-gray-900`                   |
| Secondary Text   | `text-slate-300`        | `text-gray-700`                   |
| Muted Text       | `text-slate-400`        | `text-gray-500`                   |
| Borders          | `border-slate-700/50`   | `border-gray-200`                 |
| Hover States     | `hover:bg-slate-800`    | `hover:bg-gray-50`                |
| Input BG         | `bg-slate-800`          | `bg-white`                        |
| Table Row Hover  | `hover:bg-slate-800/50` | `hover:bg-gray-50`                |
| Scrollbar Track  | `#0f172a`               | `#f1f5f9`                         |
| Scrollbar Thumb  | `#334155`               | `#94a3b8`                         |
| Glass Effect     | `bg-slate-900/70 blur`  | `bg-white/90 shadow-lg`           |
| Grid Pattern     | Subtle grid on slate    | Remove or use dots                |

---

## Component Changes

### 1. ThemeProvider (New)

**Location**: `components/ThemeProvider.tsx`

**Responsibilities**:

- Initialize theme from localStorage or system preference
- Apply `dark` class to document root based on theme
- Provide `theme`, `toggleTheme()`, `setTheme()` via context

**State Logic**:

```typescript
// On mount:
const saved = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');

// On theme change:
document.documentElement.classList.toggle('dark', theme === 'dark');
localStorage.setItem('theme', theme);
```

### 2. Header Toggle Button (Existing Location)

**File**: `main.tsx` Header component

**Changes**:

- Replace placeholder with functional toggle
- Icon: Sun (light mode active) / Moon (dark mode active)
- Tooltip or label for accessibility

### 3. Global Style Updates (index.html)

**Changes**:

- Remove hardcoded `dark` classes from `<body>`
- Add conditional class application via ThemeProvider
- Update custom CSS for light theme variants:
  - Scrollbar colors
  - Glass effect
  - Grid pattern visibility

### 4. Component Style Mappings

All components in `main.tsx` need dual-mode styles:

**Search Panel**:

- Dark: `bg-slate-900/50 border-slate-700/50`
- Light: `bg-white border-gray-200 shadow-sm`

**Statistics Bar**:

- Dark: `bg-slate-800/50`
- Light: `bg-white border-b border-gray-200`

**Data Grid**:

- Dark: `bg-slate-900/30`, header `bg-slate-800/50`
- Light: `bg-white`, header `bg-gray-50`

**Inputs**:

- Dark: `bg-slate-800 border-slate-700 text-slate-200`
- Light: `bg-white border-gray-300 text-gray-900`

---

## UI Specifications

### Toggle Button

- **Position**: Header, between "New Tile" and Time
- **Size**: 32px × 32px
- **Icon**:
  - Dark mode: Moon icon (indicates clicking switches to dark)
  - Light mode: Sun icon (indicates clicking switches to light)
- **Style**: Ghost button, rounded-full
- **Transition**: 150ms ease on background and icon swap

### Icon Swap Animation

- Fade out old icon (75ms)
- Fade in new icon (75ms)
- Scale subtle bounce on toggle (optional enhancement)

---

## Accessibility

- `aria-label` on toggle: "Switch to light/dark mode"
- Respect `prefers-reduced-motion` for transitions
- Ensure contrast ratios meet WCAG 2.1 AA in both modes
- Focus visible states for keyboard navigation

---

## Testing Checklist

- [ ] Toggle switches theme immediately
- [ ] Preference persists across page refresh
- [ ] System preference detected on first visit
- [ ] All components readable in both modes
- [ ] No flash of wrong theme on load
- [ ] Scrollbar styled correctly in both modes
- [ ] Glass effects work in both modes

---

## File Changes

| File                           | Change Type | Description                                       |
| ------------------------------ | ----------- | ------------------------------------------------- |
| `components/ThemeProvider.tsx` | Create      | Theme context provider                            |
| `main.tsx`                     | Modify      | Wrap with ThemeProvider, add toggle functionality |
| `index.html`                   | Modify      | Remove hardcoded dark class, update CSS variables |

---

## Success Criteria

1. User can toggle between dark and light themes via header button
2. Theme preference persists in localStorage
3. Default theme respects system preference
4. All UI elements are readable and visually consistent in both modes
5. No layout shifts or visual glitches during theme transition
