# FDC3 Demo Application

A standalone demo web application showcasing the FDC3 (Financial Desktop Connectivity and Collaboration Consortium) packages usage.

## Overview

This demo application demonstrates the capabilities of the FDC3 packages:

- **@fm/fdc3-agent**: Client-side FDC3 agent for tiles
- **@fm/fdc3-broker**: Core FDC3 2.2 DesktopAgent implementation
- **@fm/fdc3-app-directory**: FDC3 app directory client

## Features

### Context Selection

- Switch between different FDC3 context types (Instrument, Contact)
- Preview the selected context JSON

### Broadcast

- Broadcast context to the current channel
- Listen for context broadcasts from other applications

### Intents

- Raise intents (ViewChart, ViewInstrument)
- Listen for incoming intents
- Handle intent resolution

### Channels

- View available user channels
- Join/leave channels
- See current channel status

### Activity Log

- Real-time logging of all FDC3 operations
- View broadcast, intent, and channel events

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:8010`.

## Architecture

### Components

```
src/
├── index.tsx      # Application entry point with AgentProvider
├── App.tsx        # Main application component
├── styles.css     # Application styles
├── env.d.ts       # TypeScript environment declarations
└── index.html     # HTML template
```

### FDC3 Integration

The app uses the `AgentProvider` from `@fm/fdc3-agent` to wrap the application,
providing FDC3 capabilities to all child components:

```tsx
<AgentProvider>
  <App />
</AgentProvider>
```

Inside the app, hooks like `useFDC3()`, `useIntentListener()`, `useContextListener()`,
`useUserChannels()`, and `useCurrentChannel()` provide convenient access to FDC3 functionality.

## FDC3 Context Types

The demo includes sample context types:

### fdc3.instrument

```json
{
  "type": "fdc3.instrument",
  "name": "Apple Inc.",
  "id": {
    "ticker": "AAPL",
    "ISIN": "US0378331005"
  }
}
```

### fdc3.contact

```json
{
  "type": "fdc3.contact",
  "name": "John Doe",
  "id": {
    "email": "john.doe@example.com"
  }
}
```

## Available Intents

- **ViewChart**: View a chart for the selected instrument
- **ViewInstrument**: View instrument details

## User Channels

Standard FDC3 user channels are available:

- Red, Green, Blue, Purple, Orange, Yellow

## Development

### Tech Stack

- React 18
- TypeScript
- Rsbuild (build tool)
- FDC3 2.2

### Code Structure

- Functional components with React Hooks
- TypeScript for type safety
- CSS for styling (no external UI libraries)
- FDC3 hooks for all FDC3 operations

## License

MIT
