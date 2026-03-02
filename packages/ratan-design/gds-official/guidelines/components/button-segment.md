# Button Segment Guidelines

## Overview

Button Segment groups multiple related options into a single, cohesive control. Each option appears as a segmented button. Only one option is selected at a time by default (single‑select), though multi‑select can be supported as a variant if required by product needs.

Common use cases include view switches (List / Grid), data modes (Daily / Weekly / Monthly), and inline filters (All / Open / Closed).

---

## When to Use

- View switching: List/grid, table/cards, map/list
- Time period selection: Day/week/month/year filters
- Data filtering: Status filters, category toggles
- Display preferences: Compact/Comfortable/spacious
- Content types: All/images/videos/ documents
- Binary choices: On/off, yes/no, public/private

## When Not to Use

- Do not use for flowchart or step by step navigation. Use tabs or stepper instead.
- Do not use to navigate content modules or subpages. Use tabs instead.
- Do not use more than 5 segments. For long and complex content, consider radio.
- Do not use for binary actions or choices, such as “yes/no” or “on/off”. Use switch instead. A segmented button can be used to change views, e.g. switch between grid and list view, but should not be used to make choices.

---

## Properties for button segment item

### `intent: Neutral | Destructive`

- Colors are representive of the severity of the action required
- Neutral are the default base color
- Destructive buttons are primarily red in color

### `State: Rest | Hover | Pressed | Focused | Selected | Disabled`

- Rest: default grey border with white background (Similar to secondary button)
- Hover: raise emphasis with light blue border and white background
- Pressed: tactile feedback (darker blue border)
- Focused: visible, accessible focus ring (non-color-only)
- Selected: enabled state in primary blue background (Simliar to primary button)
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `layout: Front | Middle | Back`

- Decides the position of the button within a button segment

### `iconOnly: True | False`

- `iconOnly=True` ignores `label` and centers the icon; always provide a tooltip and accessible name.

### `hasiconLeading: True | False`

- front icon before the button label: **8px before the label**
- Used only for communicating actions that text is not sufficient
- To be enabled together with text

### `label: string`

- Short, single word preferred - Truncation may be used as a last resort in which case, a tooltip will appear on hover
- Button labels should clearly reflect the action taken. Use verb + noun construction.
- Choices should be logically connected, with the most important option first

## Properties for button segment group

### `intent: Neutral | Error`

- Button segment can exist in an error state during form errors such as field selection not done
- Error intent typically surfaces a validation state at group level.
- Error state will have red borders instead of the default grey border
- Display `validationTextError` beneath the group when a required selection is missing or invalid.

### `progressLevel: 1st selected | 2nd selected | 3rd selected | 4th selected | 5th selected | None`

- Determine the selection of the button

### `itemCount: 2 | 3 | 4 | 5 | Truncated`

- Truncated shows an overflow segment like “More” when options exceed the visible count
- There will be only two buttons in a truncated segment. The first button will show "Select" and the second button will show a down arrow chevron where if clicked, opens a dropdown.

### `hasGroupLabel: True | False`

- Overall label title for the component
- May contain tooltip (optional) to provide additional hidden details
- May contain supporting text (located below the label) for additional visible details

### `hasHelper: True | False``helperText: string`

- Helper provides brief instructional help (one sentence).
- Text is located below the button segment component (in between any validation messages)  ### `behaviour: Single-select | None-selected | Multi-select`
- Single select by default: selecting a segment deselects the currently selected one.
- Optional None-selected initial state is allowed for filters; ensure clear defaults.
- For multi-select variant (if implemented), allow toggling multiple segments and update summary in the group label or an overflow chip.

### `type: Label | Label (optional) | Label (optional) (i) | Label * | Label * (i) | Label (i)`

- Determine the groupLabel type if its an optional field or a required field
- Tooltip opens up for more additional hidden details
- info tooltip should be information text blue color and compulsory fields should be error text red color

### `layout: Left-aligned | Right-aligned`

- Determine position and layout of the groupLabel

### `hasSupporting: True | False``supportingText: string`

- Provide additional visible details below the groupLabel

### `groupLabelText: string`

- Overall label title for the component
- Be concise. Keep to 1-4 words.
- Do not truncate. Longer labels will spill over to next line.
- Use sentence case

---

## Overall

- item corner radius: **6px front and back**
- item height (with text): **32px height**; 16px horizontal padding
- item height (with icon only): **8px height**; 8px horizontal padding
- Gap between icon and label: **8px**.
