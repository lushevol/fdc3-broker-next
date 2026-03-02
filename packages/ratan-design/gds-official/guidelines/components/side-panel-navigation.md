# Side Panel Navigation (Left) Guidelines

## Overview

Side Panel Navigation provides **application‑level** or **module‑level** navigation within a right-hand panel frame. It supports sections, nested items with indentation, leading/trailing affordances, drag/reorder, and stateful selection. Designed for dense admin/product UIs.

---

## When to Use

- Provides navigation shortcuts and quick links to access different parts of the site
- Keep the main area uncluttered by moving less frequently used information to a side panel
- Allow users to interact with the main content while also accessing related data or actions in the side panel 

## When Not to Use

- Site‑wide navigation, use Top Navigation.
- Pure in‑page anchors, use Anchor Navigation.

---

## Properties

### `type: Navigation (web) | Navigation (mobile) | Header | Divider`

- determines the type of component within the navigation panel

### `state: Rest | Hover | Pressed | Selected | Disabled`

- Rest – default text and indicator.
- Hover/Pressed – background emphasis for pointer users.
- Selected – item representing the currently visible section.
- Disabled – non-interactive (rare for anchor lists).

### `onSurface: Light | Dark`

- change the contrast depending on the surface/background the component is on

### `hasHeaderDivider: True | False`

- Allow a divider below the header to create sectioning

### `hasDrag: True | False`

- Can have a drag icon at the front to allow user to drag and reorder the menu item
- When `hasDrag=True`, show a drag handle; increase elevation while dragging.
- Maintain layout stability—use placeholders during drag.

### `isCollapsible: True | False`

- Chevron will appear pointing to the right in collapsed and points down when in expanded
- Chevron is placed between the checkbox and the label

### `hasLeadingContent: True | False`

- Arranged at the front of the navigation item
- Can be decorative icon or avatar or tag

### `hasTrailingContent: True | False`

- Arranged at the back of the menu item
- Can be included for hint text, additional status, progress indicators

### `hasDescription: True | False``DescriptionText: string`

- Add additional descriptive text to the label
- Font size: **12px regular**

### `label: string`

- Use 1-4 words or phrase for optimal scan-ability
- Use sentence case
- Be specific about the destination or function
- Avoid redundancy with category header
- Font size: **14px regular**

---

## Overall

- Item height: **32px**
- Leading icon size: **16–20px**.
- Indentation step: **12–16px**.
- Container padding: **12–16px**; group header padding top/bottom **8–12px**.
