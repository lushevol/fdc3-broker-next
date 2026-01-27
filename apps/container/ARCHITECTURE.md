# Architecture: @fm/template_container

## Tech Stack

- **Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Libraries**: Ant Design, AG Grid (Enterprise), MUI
- **Data Layer**:
  - GraphQL (Apollo/Relay)
  - WebSockets (SockJS, Stomp)
- **Microfrontend**: Single-SPA

## Folder Structure

- `src/Root`: Main application logic and composition.
  - `src/Root/routing`: Routing configuration.
  - `src/Root/import`: Dynamic imports or module loading support.
- `src/App.tsx`: App component.
- `src/root.tsx`: Single-SPA entry point.

## Key Dependencies

- `ag-grid-enterprise`: For advanced data tables.
- `react-redux`: Global state management.
- `relay-runtime`: GraphQL data fetching.
