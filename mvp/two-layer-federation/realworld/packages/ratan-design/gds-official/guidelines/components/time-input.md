# Time Input Guidelines

## Overview

Time Input is a specialised form control for selecting or entering time values in **HH:MM** or **HH:MM:SS** format. It includes a dropdown with hour/minute/second selectors, helper text, validation messages, and group labels. It supports both typed entry and structured dropdown selection.

---

## When to Use

- When users must specify time of day.
- For scheduling, booking, appointments, reminders, timers.
- When accuracy is important (e.g., seconds in logs).

## When Not to Use

- For date selection, use Date Input / Date Picker.
- For durations, use Number Input.

---

## Properties

### `intent: Neutral | Error | Warning | Success`

- Colors are representive of the conditions
- Neutral are the default base color
- Error are primarily red border around the input field. There will be a validation message below the input field.
- Warning are primarily amber border around the input field. There will be a validation message below the input field.
- Success are primarily green border around the input field. There will be a validation message below the input field.

### `state: Rest | Hover | Typing | Focused`

- Rest: default white background with grey border input field
- Hover: raise emphasis (color/overlay) white background with light blue border input field
- Typing: tactile feedback will have a darker blue border input field and a caret to signify typing will appear. A clear grey circle filled x symbol will appear at the trailing end for user to clear the input empty ONLY FOR TYPING STATE.

### `fillMode: None | Placeholder | Single Input`

- `None` → no text in the input box
- `Placeholder` → assistive text to guide users on what is required to be filled
- `Single Input` → text input when user enters

### `hasGroupLabel: True | False`

- Top label for input field

### `hasHelper: True | False``helperText: string`

- Helper is located below the input field on the left

### `hasValidation: True | False`

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

- Clear noun phrase (“Select time”, “Select duration”).
- For required fields, place _required_ indicators in the label.
- Tooltip may be used to provide additional hidden details
- Supporting text is located below the label to provide visible details.

---

## Overall

- Accept digits only.
- Auto-insert `:` separator if configured.
- Support both 12h (AM/PM) and 24h depending on locale.
- Clicking the field opens hour/minute/second dropdown list selection.
- Values wrap around (23 → 00).
- Input height: **32px**
- Dropdown panels: vertically stacked lists
- Padding: **12px**
- Label spacing: **8px**
- Dropdown style to follow the guidelines from dropdown. There should be header for Hours, Minutes and Seconds
