# Dropdown Menu Guidelines

## Overview

Dropdown Menus allow users to select one or multiple options from a collapsible list. They are used to expose additional actions, filters, or settings without cluttering the UI. Dropdown menus support several item types — including single-select, multi-select (checkbox), collapsible groups, items with descriptions, and items with additional metadata.

---

## When to Use

- When users need to choose one or multiple options from a list.
- When options are contextual to an action (e.g., sorting, filtering, view options).
- When the list is too long to display inline.
- For nested choices or categorised menus.

## When Not to Use

- Limited options: Do not use a dropdown if there are only two options. Use radio instead.
- Nesting: Do not nest dropdowns or use for overly complex information. Keep options as straight forward as possible.
- Form-based or mobile platform: Consider using a select if most of your experience is form-based or frequently used on mobile platforms. The native HTML select works more easily when submitting data and is also easier to use on a mobile platform.

---

## Properties

### `type: Item | Header only | Divider only | Header + Divider | Footer`

- Building blocks of a dropdown menu

### `intent: Neutral | Destructive`

- Colors are representive of the severity of the action required
- Neutral are the default base color
- Destructive are primarily red color used for actions such as delete, archive

### `state: Rest | Hover | Pressed | Focused | Disabled`

- Rest: default white background when not selected and light blue background when selected
- Hover: raise emphasis (color/overlay) grey background
- Pressed: tactile feedback (darker fill or inset shadow)
- Focused: visible, accessible focus ring (non-color-only)
- Disabled: non-interactive; reduce contrast and remove shadows.

### `Selected: True | False`

- Selected state have a light blue background

### `isCollapsible: True | False`

- Shows nested submenus when activated.
- Should open inline, to the right, or nested depending on platform.
- Chevron points to the right and placed before any other elements when collapsed
- Chevron points down when expanded

### `hasEyebrow: True | False``eyebrowText: string`

- small/uppercase or overline style
- placed above the main text
- Font size: **12px medium**

### `hasDescription: True | False``descriptionText: string`

- 2–3 lines; prefer truncation over overflow
- sits below the label
- Font size: **12px regular**

### `hasIndentation: True | False`

- Provide indentation for structuring and tree

### `hasCheckbox: True | False`

- enable checkbox to have multiselect dropdown
- select all functions as one of the option

### `hasDrag: True | False`

- Can have a drag icon at the front to allow user to drag and reoder the menu item
- When `hasDrag=True`, show a drag handle; increase elevation while dragging.
- Maintain layout stability—use placeholders during drag.

### `hasLeadingContent: True | False`

- Arranged at the front of the menu item
- Can be decorative icon or avatar
- Can be status or HTTP tag

### `hasTrailingContent: True | False`

- Arranged at the back of the menu item
- Can be included for hint text or additional status
- Right arrow indicator also to signify more content

### `label: string`

- Short, action‑oriented.
- Avoid truncation whenever possible.

---

## Overall

- Text do not change color when on state change. Only when selected, text will be in selected blue color.
- Use `--sc-color-foundation-basic-container-layer` as the backdrop for the dropdown container.
- Whole row is clickable except trailing non-interactive metadata.
- Multi-select uses `checkbox`; single-select uses `selectedTickMark`.
- Item height: **32px** (depending on text & density).
- Padding: **8px** (horizontal).
- Gap between leading icon and label: **8px**.
- Indentation: **8–16px** depending on hierarchy level.
- Eyebrow sits on top of label with **2–4px** spacing.
- Description text sits below label with **4–6px** spacing.
- Divider spacing: **4–8px** above/below.
- When `hasSearch=True`, a search field appears at the top.
- Filters items in real-time.
