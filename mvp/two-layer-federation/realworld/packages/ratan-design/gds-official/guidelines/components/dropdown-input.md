# Dropdown Input Guidelines

## Overview

Dropdown Input is a single‑line form control that allows users to select from a predefined list of options. It combines Text Input behaviors (labels, validation, helper text) with Dropdown behaviors (menu, selection, keyboard navigation). It is suitable for structured choices where free‑form typing is not permitted.

---

## When to Use

- When users must pick **one value** from a known set (country, type, category).
- When the list includes **5–20 options**.
- When inline validation and helper text are needed in a “form field” layout.

## When Not to Use

- For a small to medium number of options, especially when only one or a few options can be selected, radio buttons or checkboxes might be a better choice.
- If the user's choices are less defined and they might type their own input, an autocomplete field could be more appropriate. 
- For simple selections with a small number of options, a direct input field with pre-populated options might be more intuitive. 
- For long text selections, do not truncate or use tooltip. Use a card button as another mean of selection instead where more text can be contained.

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

## Overview

Dropdown Input is a single‑line form control that allows users to select from a predefined list of options. It combines Text Input behaviors (labels, validation, helper text) with Dropdown behaviors (menu, selection, keyboard navigation). It is suitable for structured choices where free‑form typing is not permitted.

---

## When to Use

- When users must pick **one value** from a known set (country, type, category).
- When the list includes **5–20 options**.
- When inline validation and helper text are needed in a “form field” layout.

## When Not to Use

- For a small to medium number of options, especially when only one or a few options can be selected, radio buttons or checkboxes might be a better choice.
- If the user's choices are less defined and they might type their own input, an autocomplete field could be more appropriate. 
- For simple selections with a small number of options, a direct input field with pre-populated options might be more intuitive. 
- For long text selections, do not truncate or use tooltip. Use a card button as another mean of selection instead where more text can be contained.

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
- Typing: tactile feedback will have a darker blue border input field and a caret to signify typing will appear. A clear grey circle filled x symbol will appear at the trailing end for user to clear the input.
   ### `fillMode: None | Placeholder | Single Input | Multi Input`
- `None` → no text in the input box
- `Placeholder` → assistive text to guide users on what is required to be filled
- `Single Input` → text input when user enters
- `Multi Input` → placed in the form of tags or copy for (3) selected

### `hasGroupLabel: True | False`

- Top label for input field

### `hasIconLeading: True | False`

- Leading icon → symbolic meaning (“lock”, “search”, “info”)

### `hasActionTrailing: True | False`

- Trailing action icon → clear, open modal, trigger suggestion, etc.

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

### `layout: Left-aligned | Right-aligned`

- Determine position and layout of the groupLabel

### `hasSupporting: True | False``supportingText: string`

- Provide additional visible details below the groupLabel

### `groupLabelText: string`

- Clear noun phrase (“Select country”, “Select GroupID”).
- For required fields, place _required_ indicators in the label.
- Tooltip may be used to provide additional hidden details
- Supporting text is located below the label to provide visible details.

---

## Overall

- Clicking or focusing the container opens the dropdown. Clicking outside closes it.
- Selecting an item closes the menu and updates the input text.
- Disabled items are skipped.
- Container height: **32px**
- Horizontal padding: **12px**
- Chevron icon size: **16px**
