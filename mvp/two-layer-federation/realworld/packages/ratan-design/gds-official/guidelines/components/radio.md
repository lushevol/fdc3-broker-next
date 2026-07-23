# Radio Guidelines

## Overview

A Radio buttons is a circular input control that allows users to select exactly one option from a group of mutually exclusive choices, automatically deselecting other options when a new selection is made.
It appears as a small circle that fills wit ha dot or changes colour when selected.
Use cases span survey questions, payment method selection, shipping options, preference settings, and any scenario requiring single-choice selection from multiple alternatives.

---

## When to Use

- When the user must select **exactly one** item from a set.
- When all options should remain visible simultaneously.
- For contextual choices where selection cannot be empty.

## When Not to Use

- When multiple selections are allowed → use **Checkboxes**.
- When toggling settings → use a **Switch**.
- When long, detailed descriptions per option are required → use cards or list selectors.

---

## Properties Radio item

### `intent: Neutral | Error | Warning | Success`

- Colors are representative of the severity of the action required
- Neutral are the default base color
- Error checkboxes are primarily red in color
- Success checkboxes are primarily green in color
- Warning checkboxes are primarily amber in color

### `state: Rest | Hover | Pressed | Focused | Disabled``selected: True | False`

- Rest: default radio background is white with grey border when not selected and white background with a blue dot and border when selected
- Hover: raise emphasis (color/overlay) white background with hover blue border when not selected and lighter blue dot and border when selected
- Pressed: tactile feedback (darker fill or inset shadow)
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

## Properties Radio Group

### `type: Default | Expandable`

- Selecting one radio automatically deselects all others in the group.
- Validation is announced via error text below the group.

### `intent: Neutral | Error`

- Colors are representative of the severity of the action required
- Neutral are the default base color
- Error checkboxes are primarily red in color

### `layout: Horizontal | Vertical`

- radio can be stacked horizontally with **8px gap between each radio button**
- radio can be stacked vertically with **8px gap between each radio button**
- Horizontal layout should wrap responsibly if space is constrained.

### `hasGroupLabel: True | False``groupLabelText: string`

- Required in forms; optional in filter panels.
- Describes what all items represent.

### `hasHelper: True | False``helperText: string`

- Short instructional sentence.
- Clear guidance for validation text: e.g., “Select at least one option.”

---

## Overall

- Entire label area toggles the radio.
- Radio and label must be a single interactive unit.
- Radio size: **16px** depending on DS size tokens.
- Label gap: **8px**
- Description baseline: aligned under label with **4px** gap.
- Hit target: minimum **44×44px** for accessibility.
- Only one radio in the group can be selected.
