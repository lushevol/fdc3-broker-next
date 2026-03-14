# Dark/Light Theme Switch Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a functional dark/light theme toggle to the Cashflow Blotter preview with LocalStorage persistence.

**Architecture:** React Context (ThemeProvider) manages theme state and persistence. Tailwind's `darkMode: 'class'` enables conditional dark styles. Theme toggle button in header switches between modes with Sun/Moon icons.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React icons

---

## File Structure

| File | Purpose |
|------|---------|
| `components/ThemeProvider.tsx` | NEW: Theme context with persistence logic |
| `main.tsx` | MODIFY: Wrap app with ThemeProvider, add toggle to header |
| `index.html` | MODIFY: Remove hardcoded dark class, update CSS for light theme |

---

## Chunk 1: ThemeProvider Component

### Task 1: Create ThemeProvider Component

**Files:**
- Create: `components/ThemeProvider.tsx`
- Modify: `main.tsx` (to wrap app)

**Context:** This is a React + TypeScript demo app. The Tailwind config already has `darkMode: 'class'` configured in `index.html`.

- [ ] **Step 1: Create ThemeProvider component**

Create `components/ThemeProvider.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
  // Check localStorage first
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la components/ThemeProvider.tsx`
Expected: File exists with content above

- [ ] **Step 3: Commit**

```bash
git add components/ThemeProvider.tsx
git commit -m "feat: add ThemeProvider with persistence"
```

---

## Chunk 2: Wrap Application with ThemeProvider

### Task 2: Integrate ThemeProvider into App

**Files:**
- Modify: `main.tsx` (top of file where imports and root render are)

- [ ] **Step 1: Add import for ThemeProvider**

At the top of `main.tsx`, add import:
```typescript
import { ThemeProvider } from './components/ThemeProvider';
```

- [ ] **Step 2: Wrap CashflowBlotterApp with ThemeProvider**

Find where `createRoot` is called (around line 800-850 in main.tsx):

Change from:
```typescript
const root = createRoot(document.getElementById('root')!);
root.render(<CashflowBlotterApp />);
```

To:
```typescript
const root = createRoot(document.getElementById('root')!);
root.render(
  <ThemeProvider>
    <CashflowBlotterApp />
  </ThemeProvider>
);
```

- [ ] **Step 3: Verify the change**

Run: `grep -A 5 "createRoot" main.tsx | head -10`
Expected: Shows ThemeProvider wrapping CashflowBlotterApp

- [ ] **Step 4: Commit**

```bash
git add main.tsx
git commit -m "feat: wrap app with ThemeProvider"
```

---

## Chunk 3: Add Theme Toggle to Header

### Task 3: Implement Theme Toggle Button

**Files:**
- Modify: `main.tsx` (Header component, around line 500-600)

Context: The Header component already has Sun and Moon icons imported. There's a comment/placeholder for the theme toggle.

- [ ] **Step 1: Add useTheme import in Header component area**

Find the Header component in main.tsx (search for "function Header" or "const Header"). Near the imports at top of file, `useTheme` is already available from the import added in Task 2.

Add inside the Header component function:
```typescript
const { theme, toggleTheme } = useTheme();
```

- [ ] **Step 2: Replace placeholder theme toggle with functional button**

Find the theme toggle button in Header (look for comment about "Dark Toggle" or Sun/Moon icon usage). Replace the placeholder with:

```typescript
<button
  onClick={toggleTheme}
  className="p-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-gray-100 transition-colors"
  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {theme === 'dark' ? (
    <Sun className="w-5 h-5 text-slate-300" />
  ) : (
    <Moon className="w-5 h-5 text-gray-600" />
  )}
</button>
```

- [ ] **Step 3: Verify toggle renders**

Run dev server and check header shows either Sun or Moon icon:
```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/packages/ratan-design
npm run dev:demo
```
Visit http://localhost:8001 and confirm toggle button appears in header.

- [ ] **Step 4: Test toggle functionality**

Click the toggle button. Expected: Icon switches between Sun and Moon.

Check localStorage in browser console:
```javascript
localStorage.getItem('theme') // should be "dark" or "light"
```

- [ ] **Step 5: Commit**

```bash
git add main.tsx
git commit -m "feat: add theme toggle button to header"
```

---

## Chunk 4: Update HTML Body for Theme Support

### Task 4: Remove Hardcoded Dark Class from HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update body class to be theme-agnostic**

Change:
```html
<body class="bg-slate-950 text-slate-200 font-sans antialiased bg-grid min-h-screen">
```

To:
```html
<body class="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-200 font-sans antialiased min-h-screen">
```

Note: Remove `bg-grid` class from body (will add it conditionally via CSS).

- [ ] **Step 2: Add conditional grid pattern**

Add to the `<style>` section in index.html:

```css
/* Grid pattern - only show in dark mode */
.dark .bg-grid {
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Light mode - subtle dot pattern or none */
.bg-grid {
  background-image: none;
}
```

- [ ] **Step 3: Add bg-grid class back to body**

Add `bg-grid` back to body class:
```html
<body class="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-200 font-sans antialiased bg-grid min-h-screen">
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: make body theme-aware, conditional grid pattern"
```

---

## Chunk 5: Update Component Styles for Light Mode

### Task 5: Update Card/Panel Backgrounds

**Files:**
- Modify: `main.tsx` (multiple locations)

Context: Need to add `dark:` prefix to existing dark styles and add light mode equivalents.

- [ ] **Step 1: Update Search Panel styles**

Find the Search Panel component (look for "Quick Search Panel" or similar). Update container classes:

From:
```typescript
className="... bg-slate-900/50 border-slate-700/50 ..."
```

To:
```typescript
className="... bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-none ..."
```

- [ ] **Step 2: Update Statistics Bar styles**

Find Statistics Bar. Update:

From:
```typescript
className="... bg-slate-800/50 ..."
```

To:
```typescript
className="... bg-white dark:bg-slate-800/50 border-b border-gray-200 dark:border-transparent ..."
```

- [ ] **Step 3: Update Data Grid styles**

Find Data Grid container. Update:

From:
```typescript
className="... bg-slate-900/30 ..."
```

To:
```typescript
className="... bg-white dark:bg-slate-900/30 border border-gray-200 dark:border-transparent ..."
```

- [ ] **Step 4: Update Grid Header styles**

Find Grid Header. Update:

From:
```typescript
className="... bg-slate-800/50 ..."
```

To:
```typescript
className="... bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700/50 ..."
```

- [ ] **Step 5: Commit**

```bash
git add main.tsx
git commit -m "feat: update panel backgrounds for light/dark themes"
```

---

## Chunk 6: Update Text and Input Styles

### Task 6: Update Text Colors and Input Styles

**Files:**
- Modify: `main.tsx`

- [ ] **Step 1: Update page title and headings**

Find page title elements. Update slate-200/300 text colors:

From:
```typescript
className="... text-slate-200 ..."
```

To:
```typescript
className="... text-gray-900 dark:text-slate-200 ..."
```

- [ ] **Step 2: Update secondary text**

Find secondary text elements (labels, descriptions). Update:

From:
```typescript
className="... text-slate-400 ..."
```

To:
```typescript
className="... text-gray-500 dark:text-slate-400 ..."
```

- [ ] **Step 3: Update input fields**

Find input elements. Update:

From:
```typescript
className="... bg-slate-800 border-slate-700 text-slate-200 ..."
```

To:
```typescript
className="... bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 ..."
```

- [ ] **Step 4: Update table rows**

Find table row hover styles. Update:

From:
```typescript
className="... hover:bg-slate-800/50 ..."
```

To:
```typescript
className="... hover:bg-gray-50 dark:hover:bg-slate-800/50 ..."
```

- [ ] **Step 5: Commit**

```bash
git add main.tsx
git commit -m "feat: update text and input styles for light theme"
```

---

## Chunk 7: Update Scrollbar and Custom CSS

### Task 7: Update Scrollbar Styles for Light Theme

**Files:**
- Modify: `index.html` (style section)

- [ ] **Step 1: Update scrollbar CSS to support both themes**

Replace the scrollbar styles in `<style>`:

From:
```css
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
```

To:
```css
/* Scrollbar - Dark mode */
.dark ::-webkit-scrollbar-track {
  background: #0f172a;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

/* Scrollbar - Light mode */
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

- [ ] **Step 2: Update glass effect styles**

Update glass styles to support both themes:

From:
```css
.glass {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

To:
```css
.glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.dark .glass {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: update scrollbar and glass styles for light theme"
```

---

## Chunk 8: Final Verification

### Task 8: Test Complete Implementation

**Files:**
- Verify: `main.tsx`, `index.html`, `components/ThemeProvider.tsx`

- [ ] **Step 1: Run dev server**

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/packages/ratan-design
npm run dev:demo
```

- [ ] **Step 2: Test light mode**

1. Clear localStorage or set to light: `localStorage.setItem('theme', 'light')`
2. Refresh page
3. Verify: White background, dark text, visible toggle with Moon icon

- [ ] **Step 3: Test dark mode**

1. Click toggle button
2. Verify: Dark background, light text, toggle shows Sun icon
3. Check localStorage: `localStorage.getItem('theme')` returns `"dark"`

- [ ] **Step 4: Test persistence**

1. Refresh page
2. Verify theme persists (should stay dark)

- [ ] **Step 5: Test system preference fallback**

1. Clear localStorage: `localStorage.removeItem('theme')`
2. Refresh page
3. Should match OS dark/light preference

- [ ] **Step 6: Final commit**

```bash
git status  # verify all changes committed
git log --oneline -5  # verify commit history
```

---

## Summary

This implementation adds:
1. ThemeProvider context with localStorage persistence
2. Header toggle button with Sun/Moon icons
3. Dual-mode styles for all components
4. System preference detection as fallback

All existing dark mode styles remain functional; light mode provides clean white backgrounds with dark text.
