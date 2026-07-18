# Number Input Guidelines

## Overview

Number Input is a specialised form field designed for numeric data entry and controlled increment/decrement. It supports direct keyboard typing, stepper buttons, prefixes/suffixes (e.g., currency, units), semantic validation states, and optional grouping labels and helper text.

Use Number Input when precision, controlled values, and validation feedback are required.

---

## When to Use

- The user needs to input a numeric value.
- Adjusting small values when increasing or decreasing them requires only a few clicks.
- When users may not know exact values and only want to change the values that are relative to its current state.

## When Not to Use

- The numeric value range is infinite.
- The numeric value can be either a fractional or whole number.
- The numeric value required is not part of a range, or is arbitrary.
- There is not enough space in the UI to account for the interaction between the input field and the buttons.

---

## Properties

### `intent: Neutral | Error | Warning | Success`

- Colors are representive of the conditions
- Neutral are the default base color
- Error are primarily red border around the input field. There will be a validation message below the input field.
- Warning are primarily amber border around the input field. There will be a validation message below the input field.
- Success are primarily green border around the input field. There will be a validation message below the input field.

### `state: Rest | Hover | Typing | Focused | Disabled | Read only`

- Rest: default white background with grey border input field
- Hover: raise emphasis (color/overlay) white background with light blue border input field
- Typing: tactile feedback will have a darker blue border input field and a caret to signify typing will appear. A clear grey circle filled x symbol will appear at the trailing end for user to clear the input empty ONLY FOR TYPING STATE.
- Focused: visible, accessible focus ring (non-color-only)
- Disabled: non-interactive; reduce contrast and remove shadows.
- Read-only: no background nor border

### `fillMode: None | Placeholder | Single input`

- Show expected format: “0.00”, “Enter amount”, “1234”.

### `hasPrefixOrSuffix: None | Prefix only | Suffix only | Prefix + Suffix`

- Keep short (SGD, $, kg, %, cm).
- Avoid long words inside prefix/suffix (they affect available typing space).
- Horizontal gap: **8–12px** inside field

### `hasIconLeading: True | False`

- use icon only for decorative enhancements to the input field

### `hasHelper: True | False``helperText: string`

- Helper is located below the input field

### `hasGroupLabel: True | False`

- Top label for input field

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

- Clear noun phrase (“Amount”, “Quantity”).
- For required fields, place _required_ indicators in the label.
- Tooltip may be used to provide additional hidden details
- Supporting text is located below the label to provide visible details.

---

## Overall

- Allow digits/numbers only (`0–9`), decimal separator (locale-aware), minus sign (if `min < 0`).
- Strip invalid characters on blur.
- Step maintains precision based on current or defined step value.
- Disable stepper when:
- Reaching min/max
- Field is disabled
- Field height: **32px**
- Border radius: **6px**
- For increment steppers, use a plus and minus icon dual-button stack side-by-side. Steppers share the same border with the input field.
- Each button **32by32px** tall
- Shared border with input
- Should not obscure long numbers
