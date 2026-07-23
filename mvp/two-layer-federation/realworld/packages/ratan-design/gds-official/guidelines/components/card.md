# Card Guidelines

## Overview

Cards are contained UI elements that group related information and actions into a single, scannable module. They help create clear information hierarchy, make content browseable, and support quick decision‑making via contextual actions.

---

## When to Use

- Product listings and e-commerce catalogs
- Blog posts, articles and content previews
- User profiles and team member directories
- Dashboard widgets and data summaries
- Feature highlights and service offerings
- Notification feed and activity streams
- Image galleries and portfolio items
- Settings sections and configuration panels

## When Not to Use

- Long-form content (use page or section layout)
- Deeply nested content
- More than 2-3 actions per card
- Critical alerts requiring immediate attention (use banner or snackbar)
- Primary navigation (use navigation menu or tabs)

---

## Properties

### `imagePosition: Image layered | Image Left | Image Right | Image Top | No Image`

- Prefer one primary image per card; if multiple visuals are needed, use a gallery pattern inside the card body.
- Image layered puts the image in the background where text are overlayed on top

### `intent: Neutral | Destructive | Success | Warning`

- Colors are representive of the severity of the action required
- Neutral are the default base color
- Destructive cards have a red border and red background on state change
- Success cards have a green border and green background on state change
- Warning cards have an amber border and amber background on state change

### `state: Rest | Hover | Pressed | Focused | Selected | Disabled`

- Rest: default white background with no border
- Hover: raise emphasis (color/overlay) in a lighter color border. subtle elevation or overlay.
- Pressed: tactile feedback (darker color border)
- Focused: visible, accessible focus ring (non-color-only)
- Selected: enabled or clicked state where background surface is filled with a light color
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `hasLeadingContent: True | False`

- Leading content is located at the top left of the card
- Icon: allow a front decorative icon to communicate with the title - Avatar: allow a user profile icon
- Checkbox: allow for multi selection of card among other stacked cards
- Radio: allow for single selection of card among other stacked cards

### `hasDrag: True | False`

- Cards can have a drag icon at the front to allow user to drag and reorder the card
- When `hasDrag=True`, show a drag handle; increase elevation while dragging.
- Maintain layout stability—use placeholders during drag.  ### `hasTrailingContent: True | False`
- Trailing content is located at the top right of the card
- Collapsible: to signify more details hidden - Switch: allow toggling of certain functions that the card enables
- Action buttons: dual buttons such as approve/reject, and single icon text button such as menu to open up dropdown options
- Hint text: add a copy at the trailing right of the card
- Status: show the status of any progress

### `hasEyebrow: True | False``eyebrowText: string`

- small/uppercase or overline style
- placed above the card main text
- Font size: **12px medium**

### `hasTooltip: True | False`

- allow for hidden additional details

### `hasLargeCallout: True | False``largeCalloutText: string`

- largeCalloutText is for high‑salience numeric info (e.g., “$1,234.00”)
- placed below the card main text
- Font size: **28px medium**

### `hasDescription: True | False``descriptionText: string`

- 2–3 lines; prefer truncation over overflow
- sits below any title
- Font size: **12px regular**

### `hasAdditionalDetails: True | False`

- Use for labels and text copy that is separated/differentiated from the description
- Shown using informational color in the format of Icon.Dot.Text

### `hasTags: True | False`

- Use sparingly as a quick classifier (e.g., “New”, “Beta”).
- Can be used as searchable tagging

### `hasDivider: True | False`

- Use to separate between the content and the footer

### `hasFooter: True | False`

- use for additional actions driven by the details in the card

### `titleText: string`

- Clear, scannable, 1–2 lines max. Use sentence case.

---

## Overall

- A card can be clickable as a whole (navigates to detail) or contain inline actions.
- If the entire card is clickable, ensure inline buttons/links don’t trigger navigation (use event isolation).
- Use tooltips only for icons or truncation, not to hide crucial information.
- Click to select (single or multi, depending on collection rules).
- Show a clear selection ring/checkbox and announce selection to AT.
- Container padding: **12px horizontal and vertical padding**
- Gap between items in the card: **4px**
- Corner radius: **6px**
- Media aspect ratio: **1:1, 4:3, or 16:9 presets**
- Provide fallback (solid color + icon) when image is missing.
- Group primary actions in header or trailing region.
