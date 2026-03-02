# Slider Guidelines

## Overview

Slider is a numeric input component for selecting a value or range within a defined interval. It supports single-value and range sliders, intent states, helper text, validation, input fields, and tick marks.

---

## When to Use

- Use when selecting a single value or range of number values.
- Use sliders when there is a need to show a selection of a single value or range of values.
- Use when needing to expose a variety of options or to limit the number of options quickly.

## When Not to Use

- For precise numeric values, use Number Input.
- For discrete choices, use Button Segment or Dropdown.
- For large ranges without context , pair with min/max text.

---

## Properties

### `filledTrack: True | False`

- Line between the two handles will be grey by default when not selected state
- Line switches to blue when in selected state

### `state: Rest | Hover | Pressed | Focused | Disabled`

- Rest: default background is white with grey border
- Hover: raise emphasis (color/overlay) white background with hover blue border
- Pressed: tactile feedback (darker fill or inset shadow)
- Focused: visible, accessible focus ring (non-color-only)
- Disabled: non-interactive; reduce contrast and remove shadows.

### `intent: Neutral | Error`

- Colors are representive of the conditions
- Neutral are the default base color (simliar to secondary button)
- Error are primarily red border around the button. There will be a validation message below the segment field.

### `hasStartHandle: True | False``hasEndHandle: True | False’

- For range slider, there will be two handles to control the range

### `hasBadge: True | False`

- Badge is located above the handle to show the number of progress
- Badge above the handle is optional but should be visible on hover or pressed. Height of the slider should not change. badge is with the cursor overlay.

### `type: Single numeric selector | Range numeric selector | Single text selector`

- Single numeric selector: A slider that lets users choose one specific numeric value along a defined scale.
- Range numeric selector: A dual‑handle slider that allows users to select a minimum and maximum value within a numeric range.
- Single text selector: A slider that lets users pick one option from a set of predefined text labels.

### `intent: Neutral | Error`

- Colors are representive of the conditions
- Neutral are the default base color (simliar to secondary button)
- Error are primarily red border around the button. There will be a validation message below the segment field.

### `haGroupLabel: True | False`

- Overall label title for the component

### `hasInputField: True | False`

- Provide an option for user to enter the numeric digit instead of using the slider for accessibility
- Input field is located at the front or end of the slider line

### `hasValidation: True | False`

- One message at a time, stay consistent in tone and be solution-focused
- Error: Be specific about what’s wrong, tell users how to fix it, use plain language, no tech jargon and don’t blame the user Example: “This field is required”

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

- Drag handle to update value.
- Click on track moves handle toward clicked position.
- Two handle thumb (min & max).
- Drag independently; collision provides lock or swap depending on product rules.
- Input field binds directly to slider value.
- Validates against min/max.
- Track height: **4px**.
- Handle size: **20px**.
- Tick spacing depends on step count.
