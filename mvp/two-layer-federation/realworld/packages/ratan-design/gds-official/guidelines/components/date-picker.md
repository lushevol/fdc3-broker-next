# Date Picker Guidelines

## Overview

The Date Picker presents a calendar interface to let users select dates or date ranges. It includes month/year navigation, selectable days, keyboard support, and range-hover preview states. It is used in forms, filters, booking flows, and anywhere a date is required with contextual calendar UI.

---

## When to Use

- When users need to choose a date (e.g., meetings, events, scheduling).
- When tasks benefit from viewing dates in context (weekday, weekend, month).
- When selecting date ranges (check-in/out, start/end periods).

## When Not to Use

-When the user already knows the date and can type faster, use Text Input.

- For selecting broad periods (e.g., quarter, fiscal year), use Segmented selectors or Dropdown.
- For time selection, use Time Picker.

---

## Properties calendar item

### `type: Day | Month`

- Day: Text is grey with white background (**14px medium**)
- Month: Text is grey with white background (**14px medium**)

### `intent: Neutral | Empty | Current | Future``state: Rest | Hover | Pressed | Focused | Selected | Disabled`

- Neutral: contains rest, hover, pressed, focused, selected, disabled. Selected state is the same dark blue as primary button.
- Current: denoted by a blue border and a small blue dot below the text
- Future: disabled state

### `hasRangeFront: True | False`

- Blue front background to show range of selection mainly for date range

### `hasRangeEnd: True | False`

- Blue end background to show range of selection mainly for date range

### `dateText: string``monthText: string`

- Date should follow from 01 to 31 in double digit - Month should folllow from Jan to Dec in three letters

---

## Properties date input

### `intent: Neutral | Error | Warning | Success`

- Colors are representive of the conditions
- Neutral are the default base color
- Error are primarily red border around the input field. There will be a validation message below the input field.
- Warning are primarily amber border around the input field. There will be a validation message below the input field.
- Success are primarily green border around the input field. There will be a validation message below the input field.

### `state: Rest | Hover | Typing | Focused | Disabled | Read only`

- Rest: default white background with grey border input field
- Hover: raise emphasis (color/overlay) white background with light blue border input field
- Typing: tactile feedback will have a darker blue border input field and a caret to signify typing will appear. A clear grey circle filled x symbol will appear at the trailing end for user to clear the input.
- Focused: visible, accessible focus ring (non-color-only)
- Disabled: non-interactive; reduce contrast and remove shadows.
- Read-only: no background nor border

### `fillMode: None | Placeholder | Single input`

- Show expected placeholder format: “DD/MM/YYYY”, “DD MMM YYYY".
- Only allow typing of numbers if format is DD/MM/YYYY and automatically add a / while typing after the letter format.

### `hasGroupLabel: True | False`

- Top label for input field
   ### `hasHelper: True | False``helperText: string`
- Provide additional guidance on what to fill

### `ValidationText: string`

- One message at a time, stay consistent in tone and be solution-focused
- Error: Be specific about what’s wrong, tell users how to fix it, use plain language, no tech jargon and don’t blame the user Example: “Email address is required”, “Password must be 8+ characters”, “File too large, Max 10MB”, “ Session expired. Please log in again”
- Alert: Match urgency to importance, explain why it matters, include timeframes when relevant and suggest actions to take Example: “Your keys and certs expires in 3 days”, “Update billing info required”, “Account not validated”
- Success: Confirm what was completed, be encouraging and positive, include relevant details and keep it brief Example: “Profile updated successfully”, “Account verified”, “Changes saved”

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

- Calendar grid: 7 columns × 5–6 rows.
- Day cell size: **32–40px**.
- Navigation spacing: **8–12px** between buttons.
- Range highlighting uses a **continuous pill shape** for the internal range and **distinct markers** at start/end.
- Month displayed in **MMM** or **MMMM** format (based on locale).
- Day labels use short forms (Mo, Tu, We…).
- Ensure localization rules apply for first day of week.
