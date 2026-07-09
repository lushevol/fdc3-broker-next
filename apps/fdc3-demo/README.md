# FDC3 PostMessage Console

A standalone demo web application showcasing FDC3 package usage and browser-to-portal
PostMessage intent handoff.

## Overview

This demo application demonstrates the capabilities of the FDC3 packages:

- **@fm/fdc3-agent**: Client-side FDC3 agent for tiles
- **@fm/fdc3-broker**: Core FDC3 2.2 DesktopAgent implementation
- **@fm/fdc3-app-directory**: FDC3 app directory client

It also acts as a standalone source console for opening the FMO portal and sending an
FDC3 intent/context envelope via `window.postMessage`.

## Portal PostMessage Flow

1. Start the portal UI stack (`root-config`, `base`, and the target container/tile).
2. Start this console on `http://localhost:8011`.
3. In the console, keep the default portal URL `http://localhost:8001`.
4. Click **Open Portal**, sign in to the portal, then click **Send to Portal**.
5. The console posts an `fdc3-pm-event` envelope with `method: "intentEvent"` and
   a payload containing `intent` and `context`.

For local development, `apps/base/.env.mfe` includes:

```bash
FDC3_POSTMESSAGE_ALLOWED_ORIGINS='http://localhost:8011,http://localhost:8010'
```

For production, set `FDC3_POSTMESSAGE_ALLOWED_ORIGINS` to the exact deployed
origin(s) of the approved source page. Avoid `*` in production; the portal broker
uses this allowlist to decide which browser origins may trigger FDC3 intents.

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
