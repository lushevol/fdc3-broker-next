# Search Input Guidelines

## Overview

Search Input is a specialised text field designed for **query entry**, **content filtering**, and **search-triggered interactions**. It supports inline validation, group labels, helper text, trailing icons, and multiple fill modes. The component is optimised for both instant search and submit-based search patterns.

---

## When to Use

- When users need to search, filter, or look up information.
- When the user needs a single-line query field with optional trailing controls.
- For global header search, table search, filter panels, and “type to find” experiences.

## When Not to Use

- For long-form text, use Text Input or Rich Text Editor.
- For structured filters (date/number/status) → pair with Dropdown, Date Input, etc.

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
-
- ### `fillMode: None | Placeholder | Single Input`
- `None` → no text in the input box
- `Placeholder` → assistive text to guide users on what is required to be filled
- `Single Input` → text input when user enters

### `hasGroupLabel: True | False`

- Top label for input field

### `hasIconTrailing: True | False`

- Icon trailing provides additional actions at the end of the input such as voice input

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

- Clear noun phrase (“Search”, “Search API”).
- For required fields, place _required_ indicators in the label.
- Tooltip may be used to provide additional hidden details
- Supporting text is located below the label to provide visible details.

---

## Overall

- Height: **32px**
- Padding: **12–16px**
- Round: **full**
- Leading icon: **16px**
- Trailing icon: **16px**
