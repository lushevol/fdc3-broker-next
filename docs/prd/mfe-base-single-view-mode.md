# mfe-base Single View Mode

## Purpose

Allow a normal workspace tab to be moved to a dedicated surface that displays only its tile. A single-view surface has no navigation app bar, workspace tabs, drawer, or assistant UI.

## Addressing and Lifecycle

- The target URL contains the stable tile application ID: `?singleView=<tileId>`. This is the complete single-view launch contract; it never contains a workspace or container-instance ID.
- The target resolves the tile from the accessible tile catalogue and creates a fresh single-view container. No per-window single-view handoff data is written to local storage or OpenFin window `customData`, and the target does not depend on the source workspace instance.
- In a browser, mfe-base opens a normal new tab. In OpenFin Platform, it creates a 1200×800 platform window.
- After a successful launch, the source workspace tab is removed. A failed launch leaves the source tab unchanged.
- If launch fails or is blocked, the source stays unchanged and the user receives an error.

## User Interactions

- Users can choose **Open in Single View** from either the tab kebab menu or the tab right-click context menu.
- Releasing a dragged tab after its visual bounds leave the current viewport launches single view. Drops within the viewport preserve normal tab reordering.
- Single view is left by closing its browser tab or OpenFin window; there is no restore action.

## Acceptance Criteria

1. The single-view target renders the selected tile with its original tile parameters and FDC3 tile-provider context.
2. The target does not render workspace navigation, the app bar, drawer, timeout UI, snackbar UI, or chatbot UI.
3. A failed target creation does not remove the source tile.
4. OpenFin launches a separate platform window while browsers use a normal new tab.
5. A single-view broker exposes only the selected tile as an internal FDC3 target. Incoming intents that would require another tile are rejected rather than opening a workspace tile.
6. Intents raised by the selected tile are routed to the configured external OpenFin or browser bridge, never to an in-window internal tile.
7. User-channel joins, leaves, broadcasts, and context listeners remain available to the selected tile and continue to use the configured external bridge.
