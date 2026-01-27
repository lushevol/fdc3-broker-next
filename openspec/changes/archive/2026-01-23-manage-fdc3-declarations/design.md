# FDC3 Declaration Manager Design

## Context

The `FDC3Declaration` admin module is intended to manage the FDC3 `interop` configuration for applications (Tiles). This includes `intents` (listensFor, raises) and Context types.
Crucially, it must support a "Master List" of Intents and Contexts that users can pick from, rather than just free-text entry per app.

## Architecture

We will extend the architecture of `apps/base/src/admin/Tile` but with more complex data relationships.

### Data Model

1.  **Intent Master List**: A catalog of valid FDC3 Intents.
    - `name` (string): e.g., "ViewInstrument"
    - `displayName` (string): e.g., "View Instrument"

2.  **Context Master List**: A catalog of valid FDC3 Context types.
    - `type` (string): e.g., "fdc3.instrument"
    - `schema` (json): Optional schema validation or example.

3.  **App Interop (FDC3Declaration)**: The standard FDC3 App Directory 'interop' block.
    ```typescript
    interface FDC3Interop {
      intents: {
        listensFor: Record<string, { contexts: string[] }>;
        raises: Record<string, { contexts: string[] }>;
      };
      userChannels?: string[];
    }
    ```

### Components

1.  **`admin/FDC3Declaration/index.tsx`**:
    - **Tabs**:
      - **Declarations**: List of Apps/Tiles and their FDC3 configuration.
      - **Intents**: Master list of Intents (CRUD).
      - **Contexts**: Master list of Contexts (CRUD).

2.  **`admin/FDC3Declaration/common/InteropEditor.tsx`** (New):
    - A rich editor component for the `interop` JSON.
    - **Visual Mode**:
      - Sections for "Listens For" and "Raises".
      - "Add Intent" button opens a simplified selector from the Intent Master List.
      - For each specific Intent, a "Contexts" multi-select (Chip input) sourced from the Context Master List.
    - **JSON Mode**: Fallback to raw JSON editing for advanced users.

3.  **`admin/FDC3Declaration/common/useController.tsx`**:
    - Needs to fetch specific App Declaration AND the Master Lists (Intents/Contexts) for the dropdowns.

4.  **`admin/FDC3Declaration/services/useServices.ts`**:
    - **New Endpoints Needed**:
      - `getIntentList()`
      - `createIntent()`
      - `getContextList()`
      - `createContext()`

### UI/UX Requirements

- **Professional & Beautiful**: Use Material UI components effectively (Cards, Chips, Autocomplete).
- **Type Safety**: strict TypeScript usage, `interface.ts` definitions for all DTOs.
- **Validation**: Ensure that adding a "Listen" intent requires picking at least one Context if applicable (or standardized).

## Technical Decisions

- **State Management**: Local state with `useReducer` or extended `useController` logic to handle the complex nested editing of `interop` object.
- **Reusable Components**: `InteropEditor` should be reusable if specific interop editing is needed elsewhere.
