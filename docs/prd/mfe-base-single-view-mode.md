# mfe-base Single View Mode

## Purpose

Allow a normal workspace tab to be moved to a dedicated surface that displays only its tile. A single-view surface has no navigation app bar, workspace tabs, drawer, or assistant UI.

## Handoff and Lifecycle

- The source creates a UUID-keyed, versioned handoff record in same-origin local storage. The record contains the selected tile container configuration and expires after 24 hours.
- The target URL contains only the opaque `singleView` handoff ID. Browser targets resolve the storage record on every load; OpenFin targets also receive the handoff in window `customData` so reloads work when window storage is isolated.
- In a browser, mfe-base requests a resizable 1200×800 popup. In OpenFin Platform, it creates a 1200×800 platform window.
- The source workspace is changed only after popup/window creation succeeds. If launch fails or is blocked, the source stays unchanged and the user receives an error.
- Moving the last source workspace tab leaves a new empty workspace in the normal-view source surface.

## User Interactions

- Users can choose **Open in Single View** from either the tab kebab menu or the tab right-click context menu.
- Releasing a dragged tab after its visual bounds leave the current viewport launches single view. Drops within the viewport preserve normal tab reordering.
- Single view is left by closing its popup or OpenFin window; there is no restore action.

## Acceptance Criteria

1. The single-view target renders the selected tile with its original tile parameters and FDC3 tile-provider context.
2. The target does not render workspace navigation, the app bar, drawer, timeout UI, snackbar UI, or chatbot UI.
3. A failed target creation does not remove the source tile.
4. OpenFin launches a separate platform window rather than a browser popup.
