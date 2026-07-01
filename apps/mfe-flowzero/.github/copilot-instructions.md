# Copilot Instructions for AI Coding Agents

## Project Overview

This is a React/TypeScript repo for a workflow management application. It uses Ant Design, Tailwind CSS, and custom BPMN (Business Process Model and Notation) logic. The architecture is modular, with clear separation between UI components, providers, stores, and service layers.

## Key Architectural Patterns

- **Component Structure:**
  - Pages are in `src/pages/`, each representing a major app view 
  - State management uses custom stores (see `src/stores/BPMNStore.ts`).
- **Workflow Logic:**
  - BPMN-related logic and UI are tightly integrated, with custom panels and drawers for node editing and workflow details.

## Coding Standards
  - Use function based components in React.
  - Use arrow functions for callbacks.
  - Do not use inline style,Prioritize using Tailwind.
  - Generate code by prettier rules



## Project-Specific Conventions

- **Styling:**
  - Tailwind CSS is used for utility classes. Custom styles are in `src/style/`.
  - Ant Design components are themed via `AntdThemeProvider`.
**Routing:**
  - Routing imports and usage must follow these conventions:
    - Always import routing APIs via `import { ReactRouterDom } from "src/Root/import";`.
    - Destructure required routing methods, e.g., `const { useNavigate } = ReactRouterDom;`.
    - For navigation and route changes, always use the `navigate` instance from `useNavigate()`.
    - Do NOT import routing APIs directly from `react-router-dom`; all routing APIs must be accessed via the unified export in `src/Root/import`.
    - See `src/pages/ToDo/index.tsx` for a reference implementation.

- **Component Communication:**
  - Use props and context for cross-component communication. Avoid direct store mutation outside providers.

## Integration Points

- **External APIs:**
  - All API calls should go through the service layer (`src/api/`).


## Examples

- To add a new workflow node panel, create a component in `src\pages\workflow\view\NodePropertiesConfig`, 
- To extend BPMN logic, update `src/stores/BPMNStore.ts` and wrap new logic in `BPMNProvider`.

