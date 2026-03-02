# Text Input Guidelines

## Overview

Text Input is a foundational form control for **single-line text entry**. It supports labels, helper text, character counts, validation, prefix/suffix, leading/trailing icons, and fill modes. It is the most flexible input component in the UI library.

(Your Figma file includes **224 variants**, combining intents, states, fill modes, helper + validation combinations, prefix/suffix, icon leading, action trailing, etc.)

---

## When to Use

- For general free-form text entry: names, emails, titles, IDs.
- When a single line of input is required.
- When supporting structured patterns (email, URL, phone, etc.)

## When Not to Use

- For numbers, use Number Input.
- For long-form text, use Text Area / Rich Text Editor.
- For search queries, use Search Input.
- For masked or segmented values, use OTP/PIN.

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

### `fillMode: None | Placeholder | Single Input | Multi Input`

- `None` → no text in the input box
- `Placeholder` → assistive text to guide users on what is required to be filled
- `Single Input` → text input when user enters
- `Multi Input` → placed in the form of tags or copy for (3) selected

### `hasPrefixOrSuffix: None | Prefix only | Suffix only | Prefix + Suffix`

- Keep short (SGD, $, kg, %, cm).
- Avoid long words inside prefix/suffix (they affect available typing space).
- Horizontal gap: **8–12px** inside field

### `hasGroupLabel: True | False`

- Top label for input field

### `hasIconLeading: True | False`

- Leading icon → symbolic meaning (“lock”, “search”, “info”)

### `hasActionTrailing: True | False`

- Trailing action icon → clear, open modal, trigger suggestion, etc.

### `hasHelperOrCharacterCount: True | False``helperText: string` `characterCount: string`

- Helper is located below the input field on the left
- Character count states the maximum number of characters for that field. Count is located at the right

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

- Clear noun phrase (“First name”, “Password”).
- For required fields, place _required_ indicators in the label.
- Tooltip may be used to provide additional hidden details
- Supporting text is located below the label to provide visible details.

---

## Overall

- Container height: **32px**
- Icon size: **16px**
- Label spacing: **4px**
- Helper/Validation spacing: **8px**
