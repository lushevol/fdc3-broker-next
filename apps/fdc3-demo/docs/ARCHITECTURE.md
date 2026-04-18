# FDC3 Demo - Architecture

## Overview

This document describes the architecture of the FDC3 Demo Application, a standalone web application that demonstrates the capabilities of the FDC3 packages.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FDC3 Demo Application                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    React UI Layer                        │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │   Context   │  │   Intents   │  │    Channels     │ │  │
│  │  │  Selector   │  │   Panel     │  │    Panel        │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐                      │  │
│  │  │   Actions  │  │  Activity   │                      │  │
│  │  │   Panel    │  │    Log      │                      │  │
│  │  └──────────────┘  └──────────────┘                      │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              FDC3 React Hooks Layer                      │  │
│  │                                                          │  │
│  │  • useFDC3()              - Access DesktopAgent API      │  │
│  │  • useIntentListener()    - Listen for intents           │  │
│  │  • useContextListener()   - Listen for context           │  │
│  │  • useUserChannels()      - Get available channels       │  │
│  │  • useCurrentChannel()    - Get current channel          │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              AgentProvider (React Context)               │  │
│  │                                                          │  │
│  │  • Provides FDC3 Agent context to all child components   │  │
│  │  • Manages Broker lifecycle                              │  │
│  │  • Handles connection status                             │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                    FDC3 Packages Layer                            │
│                                                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │  @fm/fdc3-agent │  │ @fm/fdc3-broker │  │ @fm/fdc3-app-   │   │
│  │                 │  │                 │  │ directory       │   │
│  │ • React hooks   │  │ • DesktopAgent  │  │                 │   │
│  │ • AgentProvider │  │   implementation│  │ • App discovery │   │
│  │ • ScopedDesktop │  │ • Intent routing│  │ • Intent lookup │   │
│  │   Agent         │  │ • Channel mgmt  │  │                 │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### App Component Structure

```
App.tsx
├── Context Selection Panel
│   ├── Context type buttons (Instrument, Contact)
│   └── Context JSON preview
├── Actions Panel
│   ├── Broadcast actions
│   ├── Intent actions
│   ├── Channel actions
│   └── Info actions
└── Activity Log Panel
    └── Real-time FDC3 event log
```

### State Management

The application uses React's built-in state management:

```typescript
// Core state
const [logs, setLogs] = useState<string[]>([]);
const [selectedContext, setSelectedContext] = useState<Context>(sampleInstrument);

// FDC3 hooks provide reactive state
const fdc3 = useFDC3();
const channels = useUserChannels();
const currentChannel = useCurrentChannel();
```

## FDC3 Integration Flow

### 1. Application Bootstrap

```
index.tsx
    │
    ▼
ReactDOM.createRoot()
    │
    ▼
AgentProvider wraps App
    │
    ▼
Broker initialization
    │
    ▼
App component renders with FDC3 available
```

### 2. Intent Flow

```
User clicks "Raise ViewChart"
    │
    ▼
handleRaiseIntent('ViewChart')
    │
    ▼
fdc3.raiseIntent('ViewChart', context)
    │
    ▼
Broker resolves intent
    │
    ▼
Target app receives intent
    │
    ▼
useIntentListener callback executes
    │
    ▼
Log updated with result
```

### 3. Context Broadcast Flow

```
User clicks "Broadcast"
    │
    ▼
handleBroadcast()
    │
    ▼
fdc3.broadcast(context)
    │
    ▼
Broker routes to channel
    │
    ▼
Apps on channel receive context
    │
    ▼
useContextListener callback executes
    │
    ▼
Log updated with received context
```

## File Structure

```
apps/fdc3-demo/
├── package.json              # Dependencies and scripts
├── rsbuild.config.ts         # Build configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # User documentation
├── index.html               # HTML template
├── docs/
│   └── ARCHITECTURE.md      # This document
└── src/
    ├── index.tsx            # Application entry point
    ├── App.tsx              # Main application component
    ├── styles.css           # Application styles
    └── env.d.ts             # TypeScript declarations
```

## Key Design Decisions

### 1. Standalone Application

The demo is a **standalone web application** that doesn't require the full MFE platform. It demonstrates FDC3 capabilities in isolation.

### 2. No External UI Library

Uses plain CSS for styling to keep the demo lightweight and focused on FDC3 functionality.

### 3. React Hooks Pattern

Leverages FDC3 React hooks (`useFDC3`, `useIntentListener`, etc.) for clean, declarative FDC3 integration.

### 4. Real-time Logging

Activity log shows FDC3 operations in real-time, making it easy to understand what's happening.

## Performance Considerations

1. **Lazy Loading**: FDC3 packages are loaded on demand
2. **Minimal Dependencies**: Only essential React and FDC3 dependencies
3. **Efficient Rendering**: React best practices for minimal re-renders
4. **Log Truncation**: Activity log limited to 50 entries

## Security

1. No sensitive data in demo
2. Mock data only (sample instruments and contacts)
3. No external API calls
4. Safe for public demonstration

## Future Enhancements

1. **Multiple Windows**: Demonstrate cross-window communication
2. **Private Channels**: Show app-to-app private communication
3. **Resolver UI**: Display intent resolution UI
4. **Metrics Dashboard**: Show FDC3 performance metrics
5. **Import/Export**: Save and load FDC3 scenarios

## Troubleshooting

### Build Issues

```bash
# Clean and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Port Conflicts

```bash
# Change port in rsbuild.config.ts
server: {
  port: 8011, // Use different port
}
```

### FDC3 Not Working

- Check browser console for errors
- Verify FDC3 packages are built: `npm run build:packages`
- Ensure AgentProvider wraps the app
