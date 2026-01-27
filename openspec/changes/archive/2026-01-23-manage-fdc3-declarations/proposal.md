# Manage FDC3 Declarations

## Background

Currently, FDC3 declarations (intents, channels, app definitions) are often static or hard-coded. Administrators need a way to manage these configurations dynamically via an Admin UI, specifically allowing for a "Master List" of Intents and Contexts that can be reused across multiple Apps (Tiles).

## Goal

Extend the `FDC3Declaration` admin module to:

1.  **Manage Metadata**: CRUD operations for a master list of Intents and Contexts.
2.  **Declare App Interop**: A professional logic-editor ("InteropEditor") to map Apps to Intents/Contexts by selecting from the master list.

## Solution

1.  **Metadata Management**:
    - Add tabs/views for "Intents" and "Contexts" management.
    - Persist these definitions to the backend.

2.  **Interop Editor**:
    - A rich UI component within the App Declaration view.
    - Allows users to add "Listens For" and "Raises" capabilities.
    - Uses Autocomplete to select Intents from the master list.
    - Uses Multi-select (Chips) to select Contexts for each Intent.

3.  **Strict Typing**:
    - Maximize type safety and minimize `any` usage in the implementation.

## Risks

- **Complexity**: The Interop JSON structure is nested. Managing state for this in a UI requires careful design.
- **Migration**: Existing hardcoded intents might need to be migrated to the database.
