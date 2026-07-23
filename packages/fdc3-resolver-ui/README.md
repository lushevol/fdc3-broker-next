# ratan-fdc3-resolver-ui

**React resolver UI component for FDC3 intent resolution with full accessibility support**

## Overview

`ratan-fdc3-resolver-ui` provides React components for displaying the resolver UI when multiple target applications are available for an intent. It features a user-friendly interface with full keyboard navigation and WCAG 2.1 AA compliance.

### Key Features

- **Resolver Dialog**: Modal dialog for selecting target applications
- **App Cards**: Visual cards displaying app metadata and icons
- **Context Preview**: Shows context data being passed
- **Keyboard Navigation**: Full keyboard support (arrows, Enter, Escape)
- **Accessibility**: WCAG 2.1 AA compliant with ARIA labels and screen reader support
- **Multi-Instance Handling**: Support for multiple app instances
- **Standalone**: No framework dependencies, works with any React setup
- **Customizable**: MUI-based styling for easy theming
- **Code Splitting**: Lazy loading support to reduce initial bundle size

### Architecture

```
┌─────────────────────────────────────────────────┐
│           Base MFE (@fm/base)                  │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │      ratan-fdc3-broker                    │  │
│  │  - Detects ambiguous intent targets    │  │
│  │  - Calls onShowResolverUI callback     │  │
│  │  - Waits for user selection            │  │
│  └──────────────┬───────────────────────────┘  │
│                 ↓                               │
│  ┌──────────────────────────────────────────┐  │
│  │  ratan-fdc3-resolver-ui                  │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │ ResolverDialog                     │ │  │
│  │  │ - Modal overlay                    │ │  │
│  │  │ - Keyboard navigation              │ │  │
│  │  │ - ARIA attributes                  │ │  │
│  │  └────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │ AppCard                           │ │  │
│  │  │ - App metadata                    │ │  │
│  │  │ - Instance selection               │ │  │
│  │  │ - Focus indicators                │ │  │
│  │  └────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │ ContextPreview                    │ │  │
│  │  │ - Context type                    │ │  │
│  │  │ - Context data                     │ │  │
│  │  └────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Installation

```bash
cd apps/base
npm install ratan-fdc3-resolver-ui
```

### Peer Dependencies

```json
{
  "react": "^18.0.0"
}
```

### Optional Dependencies

```json
{
  "@mui/material": "^5.0.0",
  "@emotion/react": "^11.0.0",
  "@emotion/styled": "^11.0.0"
}
```

Note: MUI is optional. Components work with inline styles but can use MUI theming if desired.

## Code Splitting

This package supports code splitting to reduce the initial bundle size. Use lazy loading when the resolver UI is not needed immediately on page load.

### Lazy Loading with Suspense

```tsx
import { lazyResolverDialog, ResolverSuspense } from 'ratan-fdc3-resolver-ui';

const App: React.FC = () => {
  const [resolverState, setResolverState] = useState({
    open: false,
    intent: '',
    context: null,
    targets: [],
  });

  // Create lazy resolver component
  const LazyResolver = lazyResolverDialog();

  return (
    <ResolverSuspense fallback={<div>Loading resolver...</div>}>
      {resolverState.open && (
        <LazyResolver
          open={resolverState.open}
          intent={resolverState.intent}
          context={resolverState.context}
          targets={resolverState.targets}
          onSelect={handleSelect}
          onCancel={handleCancel}
        />
      )}
    </ResolverSuspense>
  );
};
```

### Preloading for Better UX

Prefetch the resolver components before they're needed to improve the user experience:

```tsx
import { preloadResolver } from 'ratan-fdc3-resolver-ui';

// Preload on component mount
useEffect(() => {
  preloadResolver();
}, []);

// Or preload on user interaction (e.g., hover)
<button onMouseEnter={preloadResolver} onClick={showResolver}>
  Show Resolver
</button>;
```

### Benefits of Lazy Loading

- **Smaller Initial Bundle**: Resolver UI code is only loaded when needed
- **Faster Initial Load**: Reduces time to interactive for your app
- **Better Performance**: Less JavaScript to parse and execute on load
- **On-Demand Loading**: Components load only when the resolver is shown

### When to Use Lazy Loading

**Use lazy loading when:**

- The resolver UI is shown occasionally (e.g., user action triggers it)
- Initial page load performance is critical
- You want to minimize the main bundle size

**Use direct imports when:**

- The resolver UI is shown immediately on page load
- You don't need to optimize initial bundle size
- You prefer simpler code over lazy loading

## Quick Start

### Basic Integration with Broker

```tsx
// apps/base/src/root.tsx or apps/base/src/hooks/provider/index.tsx

import React, { useState } from 'react';
import { BrokerProvider } from 'ratan-fdc3-broker';
import { ResolverDialog } from 'ratan-fdc3-resolver-ui';

const AppWithBroker: React.FC = ({ children }) => {
  const [resolverState, setResolverState] = useState({
    open: false,
    intent: '',
    context: null,
    targets: [],
  });

  // Configure broker callbacks
  const brokerConfig = {
    callbacks: {
      onLoginStatusCheck: async () => !!localStorage.getItem('token'),
      onTileOpen: async (tileId, context) => {
        // Open tile logic
      },
      onShowResolverUI: async (targets) => {
        return new Promise((resolve, reject) => {
          setResolverState({
            open: true,
            intent: resolverState.intent,
            context: resolverState.context,
            targets,
          });

          // Store resolve/reject for dialog callbacks
          (resolverState as any).currentResolve = resolve;
          (resolverState as any).currentReject = reject;
        });
      },
    },
    appDirectory: appDirectory,
    enableDebug: false,
    userChannelIds: ['red', 'green', 'blue'],
  };

  // Handle resolver selection
  const handleResolverSelect = (target: any) => {
    (resolverState as any).currentResolve?.(target);
    setResolverState({ ...resolverState, open: false });
  };

  // Handle resolver cancellation
  const handleResolverCancel = () => {
    (resolverState as any).currentReject?.(new Error('User cancelled'));
    setResolverState({ ...resolverState, open: false });
  };

  return (
    <BrokerProvider config={brokerConfig}>
      {children}

      {/* Resolver UI */}
      <ResolverDialog
        open={resolverState.open}
        intent={resolverState.intent}
        context={resolverState.context}
        targets={resolverState.targets}
        onSelect={handleResolverSelect}
        onCancel={handleResolverCancel}
      />
    </BrokerProvider>
  );
};

export default AppWithBroker;
```

### Standalone Usage

```tsx
import React, { useState } from 'react';
import { ResolverDialog } from 'ratan-fdc3-resolver-ui';

const App: React.FC = () => {
  const [resolverState, setResolverState] = useState({
    open: false,
    intent: '',
    context: null,
    targets: [],
  });

  const showResolver = () => {
    setResolverState({
      open: true,
      intent: 'ViewChart',
      context: {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL' },
      },
      targets: [
        {
          appId: 'chart-app-1',
          instanceId: 'chart-1',
          metadata: {
            appId: 'chart-app-1',
            name: 'Basic Chart',
            version: '1.0.0',
            title: 'Basic Charting Tool',
            description: 'Simple charting with basic indicators',
            icons: [
              {
                src: 'https://example.com/icons/chart.png',
                size: '64x64',
                type: 'image/png',
              },
            ],
          },
        },
        {
          appId: 'chart-app-2',
          instanceId: 'chart-2',
          metadata: {
            appId: 'chart-app-2',
            name: 'Advanced Chart',
            version: '2.0.0',
            title: 'Advanced Charting Tool',
            description: 'Professional charting with advanced features',
            icons: [
              {
                src: 'https://example.com/icons/advanced-chart.png',
                size: '64x64',
                type: 'image/png',
              },
            ],
          },
        },
      ],
    });
  };

  const handleSelect = (target: any) => {
    console.log('Selected:', target);
    setResolverState({ ...resolverState, open: false });
  };

  const handleCancel = () => {
    console.log('Cancelled');
    setResolverState({ ...resolverState, open: false });
  };

  return (
    <div>
      <button onClick={showResolver}>Show Resolver</button>

      <ResolverDialog
        open={resolverState.open}
        intent={resolverState.intent}
        context={resolverState.context}
        targets={resolverState.targets}
        onSelect={handleSelect}
        onCancel={handleCancel}
      />
    </div>
  );
};
```

## API Reference

### `ResolverDialog`

Main dialog component for intent resolution.

#### Props

```tsx
interface ResolverDialogProps {
  open: boolean;
  intent: string;
  context: Context | null;
  targets: ResolverTarget[];
  onSelect: (target: ResolverTarget) => void;
  onCancel: () => void;
}
```

**Parameters:**

- `open` (boolean): Whether the dialog is open
- `intent` (string): The intent being resolved (e.g., "ViewChart")
- `context` (Context | null): The context data being passed
- `targets` (ResolverTarget[]): Array of available target applications
- `onSelect` (function): Callback when user selects a target
  - Parameters: `target` (ResolverTarget)
  - Returns: `void`
- `onCancel` (function): Callback when user cancels
  - Returns: `void`

**Type Definitions:**

```tsx
interface ResolverTarget {
  appId: string;
  instanceId?: string;
  metadata: AppMetadata;
}

interface AppMetadata {
  appId: string;
  name: string;
  version: string;
  title?: string;
  description?: string;
  icons?: Array<{
    src: string;
    size?: string;
    type?: string;
  }>;
  images?: Array<{
    src: string;
    size?: string;
  }>;
  categories?: string[];
}
```

### `AppCard`

Card component for displaying individual app targets. This is used internally by `ResolverDialog` but can be used independently.

#### Props

```tsx
interface AppCardProps {
  app: AppMetadata;
  instanceId?: string;
  currentContext?: Context;
  selected: boolean;
  focused: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  tabIndex: number;
}
```

### `ContextPreview`

Component for previewing context data. Used internally by `ResolverDialog`.

#### Props

```tsx
interface ContextPreviewProps {
  context: Context;
}
```

## Accessibility

### WCAG 2.1 AA Compliance

The resolver UI is fully accessible and meets WCAG 2.1 AA standards:

- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Attributes**: Proper roles and labels for screen readers
- **Focus Management**: Visible focus indicators and logical tab order
- **Screen Reader Support**: Announces changes and provides context
- **Color Contrast**: Meets minimum contrast ratios (4.5:1 for text)

### Keyboard Navigation

| Key                        | Action                                          |
| -------------------------- | ----------------------------------------------- |
| `ArrowUp` / `ArrowDown`    | Navigate between app cards                      |
| `ArrowLeft` / `ArrowRight` | Navigate between app cards (row layout)         |
| `Enter`                    | Select focused app (same as single click)       |
| `Escape`                   | Cancel intent resolution (close dialog)         |
| `Tab`                      | Navigate through interactive elements           |
| `Shift + Tab`              | Navigate backwards through interactive elements |

### ARIA Attributes

```tsx
// Dialog wrapper
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="resolver-title"
  aria-describedby="resolver-description"
>

// App list
<div
  role="listbox"
  aria-label="Available applications"
>

// App cards
<button
  role="option"
  aria-selected={selected}
  tabIndex={tabIndex}
>
```

## Customization

### Styling with Inline Styles

The components use inline styles by default and work without any additional dependencies:

```tsx
// Override with custom styles using style prop
const customStyles = {
  dialog: {
    backgroundColor: '#f5f5f5',
  },
  title: {
    color: '#0066cc',
  },
};
```

### MUI Theming

For advanced customization, wrap components with MUI ThemeProvider:

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <ResolverDialog {...props} />
</ThemeProvider>;
```

### Custom Dialog Content

You can also create your own dialog using the individual components:

```tsx
import { AppCard, ContextPreview } from 'ratan-fdc3-resolver-ui';

const CustomResolver = ({ open, targets, onSelect, onCancel }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!open) return null;

  return (
    <div className="custom-resolver-overlay">
      <div className="custom-resolver-dialog">
        <h2>Select Application</h2>
        <ContextPreview context={context} />

        <div className="app-list">
          {targets.map((target, index) => (
            <AppCard
              key={target.instanceId || target.appId}
              app={target.metadata}
              instanceId={target.instanceId}
              currentContext={context}
              selected={selectedIndex === index}
              focused={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(target);
              }}
              onDoubleClick={() => onSelect(target)}
              tabIndex={index}
            />
          ))}
        </div>

        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};
```

## Common Patterns

### Pattern 1: Integration with Broker (Recommended)

```tsx
import { BrokerProvider } from 'ratan-fdc3-broker';
import { ResolverDialog } from 'ratan-fdc3-resolver-ui';

const App = () => {
  const [resolverState, setResolverState] = useState({
    open: false,
    intent: '',
    context: null,
    targets: [],
    currentResolve: null,
    currentReject: null,
  });

  const brokerConfig = {
    callbacks: {
      onShowResolverUI: async (targets) => {
        return new Promise((resolve, reject) => {
          setResolverState({
            ...resolverState,
            open: true,
            targets,
            currentResolve: resolve,
            currentReject: reject,
          });
        });
      },
    },
    // ... other config
  };

  return (
    <BrokerProvider config={brokerConfig}>
      <YourApp />
      <ResolverDialog
        open={resolverState.open}
        intent={resolverState.intent}
        context={resolverState.context}
        targets={resolverState.targets}
        onSelect={(target) => {
          resolverState.currentResolve?.(target);
          setResolverState({ ...resolverState, open: false });
        }}
        onCancel={() => {
          resolverState.currentReject?.(new Error('User cancelled'));
          setResolverState({ ...resolverState, open: false });
        }}
      />
    </BrokerProvider>
  );
};
```

### Pattern 2: Auto-Select First Target

```tsx
const App = () => {
  const [resolverState, setResolverState] = useState({
    open: false,
    targets: [],
  });

  const showResolverWithAutoSelect = async (targets) => {
    // Auto-select if only one target
    if (targets.length === 1) {
      return targets[0];
    }

    // Show resolver UI for multiple targets
    setResolverState({
      open: true,
      targets,
    });

    return new Promise((resolve, reject) => {
      (resolverState as any).currentResolve = resolve;
      (resolverState as any).currentReject = reject;
    });
  };

  return (
    <ResolverDialog
      open={resolverState.open}
      targets={resolverState.targets}
      onSelect={(target) => {
        (resolverState as any).currentResolve?.(target);
        setResolverState({ ...resolverState, open: false });
      }}
      onCancel={() => {
        (resolverState as any).currentReject?.(new Error('User cancelled'));
        setResolverState({ ...resolverState, open: false });
      }}
    />
  );
};
```

### Pattern 3: Context-Aware Resolver

```tsx
const ContextAwareResolver = ({ targets, context }) => {
  // Sort targets by relevance to context
  const sortedTargets = useMemo(() => {
    if (!context) return targets;

    return [...targets].sort((a, b) => {
      // Prioritize apps with matching categories
      const aRelevance = calculateRelevance(a.metadata, context);
      const bRelevance = calculateRelevance(b.metadata, context);
      return bRelevance - aRelevance;
    });
  }, [targets, context]);

  return (
    <ResolverDialog
      open={open}
      intent={intent}
      context={context}
      targets={sortedTargets}
      onSelect={onSelect}
      onCancel={onCancel}
    />
  );
};
```

## Error Handling

### ResolverErrorBoundary Component

The `ResolverErrorBoundary` component catches JavaScript errors in the resolver dialog, logs those errors, and displays a fallback UI instead of the crashed component tree. It allows graceful fallback when the resolver fails to display or operate correctly.

#### Basic Usage

```tsx
import { ResolverErrorBoundary, ResolverDialog } from 'ratan-fdc3-resolver-ui';

<ResolverErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Resolver error:', error, errorInfo);
    // Send error to monitoring service
  }}
  onCancel={() => {
    // Handle cancel when resolver fails
    reject(new Error('Resolver failed to initialize'));
  }}
>
  <ResolverDialog
    open={open}
    intent={intent}
    context={context}
    targets={targets}
    onSelect={handleSelect}
    onCancel={handleCancel}
  />
</ResolverErrorBoundary>;
```

#### Custom Fallback UI

```tsx
<ResolverErrorBoundary
  fallback={
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Unable to Show App Selection</h2>
      <p>Please try again or select an app manually.</p>
      <button onClick={handleCancel}>Close</button>
    </div>
  }
  recoverable={true}
  onCancel={handleCancel}
>
  <ResolverDialog {...props} />
</ResolverErrorBoundary>
```

#### Props

```typescript
interface ResolverErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Custom fallback UI
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  recoverable?: boolean; // Show "Try Again" button (default: true)
  onCancel?: () => void; // Callback when cancel is clicked
}
```

#### Features

- **Error Logging**: Automatically logs all errors with full stack traces to console
- **Development Details**: Shows detailed error information in development mode
- **User-Friendly**: Displays non-technical error messages to end users
- **Recovery Options**: Provides retry and cancel buttons (configurable)
- **Custom Fallback**: Supports custom fallback UI components
- **Error Callback**: Optional callback for custom error handling/reporting
- **Cancel Integration**: Triggers cancel callback when resolver fails

### Common Error Scenarios

```tsx
// Handle resolver rendering errors
<ResolverErrorBoundary
  onError={(error) => {
    if (error.message.includes('Invalid context')) {
      console.error('Context validation failed');
    } else if (error.message.includes('No targets')) {
      console.error('No target applications available');
    }
  }}
  onCancel={() => {
    // Fall back to default app or cancel intent
    console.log('Resolver dialog failed, cancelling operation');
  }}
>
  <ResolverDialog {...props} />
</ResolverErrorBoundary>
```

## Testing

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
```

### Test Setup

```typescript
// test/setup.ts
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
```

### Example Tests

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResolverDialog } from "ratan-fdc3-resolver-ui";

describe("ResolverDialog", () => {
  const mockTargets = [
    {
      appId: "chart-app",
      instanceId: "chart-1",
      metadata: {
        appId: "chart-app",
        name: "Chart",
        version: "1.0.0",
        title: "Charting Tool",
      },
    },
    {
      appId: "news-app",
      instanceId: "news-1",
      metadata: {
        appId: "news-app",
        name: "News",
        version: "1.0.0",
        title: "News Feed",
      },
    },
  ];

  it("should render dialog when open", () => {
    const onSelect = vi.fn();
    const onCancel = vi.fn();

    render(
      <ResolverDialog
        open={true}
        intent="ViewChart"
        context={{ type: "fdc3.instrument", id: { ticker: "AAPL" } }}
        targets={mockTargets}
        onSelect={onSelect}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText(/Select Application for ViewChart/i)).toBeInTheDocument();
  });

  it("should call onSelect when app is clicked", () => {
    const onSelect = vi.fn();
    const onCancel = vi.fn();

    render(
      <ResolverDialog
        open={true}
        intent="ViewChart"
        context={null}
        targets={mockTargets}
        onSelect={onSelect}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByText(/Charting Tool/i));
    expect(onSelect).toHaveBeenCalledWith(mockTargets[0]);
  });

  it("should call onCancel when escape is pressed", () => {
    const onSelect = vi.fn();
    const onCancel = vi.fn();

    render(
      <ResolverDialog
        open={true}
        intent="ViewChart"
        context={null}
        targets={mockTargets}
        onSelect={onSelect}
        onCancel={onCancel}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalled();
  });

  it("should navigate with arrow keys", () => {
    const onSelect = vi.fn();
    const onCancel = vi.fn();

    render(
      <ResolverDialog
        open={true}
        intent="ViewChart"
        context={null}
        targets={mockTargets}
        onSelect={onSelect}
        onCancel={onCancel}
      />
    );

    // Navigate down
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });

    // Select with Enter
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Enter" });

    expect(onSelect).toHaveBeenCalled();
  });
});
```

## Accessibility Testing

### Keyboard Navigation Test

```typescript
describe("Keyboard Navigation", () => {
  it("should be fully operable with keyboard", () => {
    render(<ResolverDialog {...props} />);

    // Test all keyboard interactions
    const keys = [
      { key: "ArrowDown", expected: "navigate to next item" },
      { key: "ArrowUp", expected: "navigate to previous item" },
      { key: "Enter", expected: "select focused item" },
      { key: "Escape", expected: "close dialog" },
    ];

    keys.forEach(({ key, expected }) => {
      fireEvent.keyDown(document, { key });
      // Verify expected behavior
    });
  });
});
```

### Screen Reader Testing

Test with screen readers (NVDA, JAWS, VoiceOver):

1. Open the resolver dialog
2. Navigate using keyboard
3. Verify announcements:
   - "Select Application for ViewChart dialog"
   - "2 applications available"
   - App names and descriptions when focused
   - Context information

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Screen Readers:
  - NVDA (Firefox)
  - JAWS (Chrome/Edge)
  - VoiceOver (Safari)

## License

MIT

## Related Packages

- [`ratan-fdc3-broker`](../fdc3-broker) - FDC3 broker (uses this package)
- [`ratan-fdc3-agent`](../fdc3-agent) - FDC3 agent for tiles
- [`ratan-fdc3-app-directory`](../fdc3-app-directory) - App Directory client
- [`@finos/fdc3`](https://www.npmjs.com/package/@finos/fdc3) - Official FDC3 standard
