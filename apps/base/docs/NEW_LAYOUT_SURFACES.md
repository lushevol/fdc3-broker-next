# New Layout Portal Surfaces

This specification applies only when the portal URL contains `new-layout=true`.
The legacy layout and its interactions remain unchanged.

## Workspace Shell

- The workspace content begins immediately below the combined navigation and workspace-tab header.
- The App Bar does not repeat the Local/UTC control because timezone preference is owned by the profile modal.
- An empty workspace presents a spacious launch surface with a clear primary action that opens the Tile Library.

## Profile

- Selecting the App Bar avatar opens profile details directly.
- The profile owns the Local/UTC preference.
- Selecting Logout performs the existing logout operation directly and does not open the legacy survey or logout-confirmation modal.

## Tile Library

- The catalog uses a persistent left category rail and a scrollable application area.
- The top toolbar contains search, the All/Favorites/Most used view tabs, and an alphabetical sort control.
- In the All view, scrolling application sections updates the active category in the rail.
- Selecting a category scrolls its application section into view without leaving the All view.
- Favorites are user-controlled and persisted in local storage.
- Opening an application increments its local usage count; Most used shows opened applications ordered by usage.
- Search and alphabetical sorting apply to the active view.
