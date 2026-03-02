# Checkbox Guidelines

## Overview

A checkbox is a square UI control that toggles between checked/unchecked states, allowing users to make binary choices or multiple selections.
It displays as an empty or filled box with checkmark, accompanied by a clickable label.
Common uses include terms acceptance, preferences, filters and task lists. Unlike radio buttons, checkboxes operate independently, enabling multiple simultaneous selections.

---

## When to Use

- Forms: Allow users to select options in forms, modals, or side panels
- Filtering and batch action: Allow users to filter content on a page, menu or within a component. Can also be used in tables and dropdowns for batch editing.
- Terms and conditions: Allow users to agree to terms

## When Not to Use

- When only one option is allowed, use Radio Group
- When options need clarification beyond simple labels, use List or Cards.
- When toggling a simple on/off item, prefer a Switch.

---

## Properties Checkbox item

### `intent: Neutral | Error | Warning | Success`

- Colors are representative of the severity of the action required
- Neutral are the default base color
- Error checkboxes are primarily red in color
- Success checkboxes are primarily green in color
- Warning checkboxes are primarily amber in color

### `state: Rest | Hover | Pressed | Focused | Disabled``checked: Unchecked | Checked | Indetermined`

- Rest: default box background is white with grey border when unchecked and blue background with a white checkmark when checked
- Hover: raise emphasis (color/overlay) white background with hover blue border when unchecked and lighter blue background when checked
- Pressed: tactile feedback (darker fill or inset shadow)
- Loading: Replace the whole checkbox with spinner; disable interactions.
- Focused: visible, accessible focus ring (non-color-only)
- Disabled: non-interactive; reduce contrast and remove shadows.

### `isCollapsible: True | False`

- Chevron will appear pointing to the right in collapsed and points down when in expanded
- Chevron is placed between the checkbox and the label

### `hasTooltip: True | False`

- Tooltip provides additional hidden details

### `hasLabel: True | False``label: string`

- Clear and concise; sentence case.
- Avoid wrapping long labels; aim for 1–2 lines max.
- End labels with nouns, not punctuation.

### `hasDescription: True | False``descriptionText: string`

- Optional; adds clarity.
- Should not exceed 1–2 sentences.

---

## Properties Checkbox Group

### `type: Default | Correlated | Expandable`

- Correlated: Parent = indeterminate when some (but not all) children are selected. Parent resets to checked/unchecked as child states change.
- All child checkboxes belong to a single labeled set.
- Validation is announced via error text below the group.

### `intent: Neutral | Error`

- Colors are representative of the severity of the action required
- Neutral are the default base color
- Error checkboxes are primarily red in color

### `layout: Horizontal | Vertical`

- checkbox can be stacked horizontally with **8px gap between each checkboxes**
- checkbox can be stacked vertically with **8px gap between each checkboxes**
- Horizontal layout should wrap responsibly if space is constrained.

### `hasGroupLabel: True | False``groupLabelText: string`

- Required in forms; optional in filter panels.
- Describes what all items represent.

### `hasHelper: True | False``helperText: string`

- Short instructional sentence.
- Clear guidance for validation text: e.g., “Select at least one option.”

---

## Overall

- Entire label area toggles the checkbox.
- Checkbox and label must be a single interactive unit.
- Checkbox size: **16px** depending on DS size tokens.
- Label gap: **8px**
- Description baseline: aligned under label with **4px** gap.
- Hit target: minimum **44×44px** for accessibility.
