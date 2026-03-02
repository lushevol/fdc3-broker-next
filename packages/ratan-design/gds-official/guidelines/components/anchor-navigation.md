# Anchor Navigation (Right) Guidelines

## Overview

Anchor Navigation provides **in‑page** wayfinding for long documents and content-heavy pages. It lists section anchors and allows users to jump to headings. It supports headers, dividers, indentation (levels), leading/trailing content, and dark/light surfaces.

---

## When to Use

- Long content pages (docs, policies, reports) with multiple headings.
- To provide quick access to **H2/H3** sections and show scroll position.
- When TOC needs to be **always visible** inside a left column.

## When Not to Use

- Cross‑page navigation → use **Side Panel Navigation** or **Top Navigation**.
- Small pages with few headings → use **Section Header** only.

---

## Properties

### `type: Navigation (web) | Header | Divider`

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

- Smooth scroll to anchors (offset for fixed headers).
- Collapse/expand (optional) for deep structures.
- Truncation: Single-line items truncate with ellipsis; full label via tooltip.
- Item height: **32px**.
- Gap: leading icon → label **4px**.
- Container padding: **12px**.
