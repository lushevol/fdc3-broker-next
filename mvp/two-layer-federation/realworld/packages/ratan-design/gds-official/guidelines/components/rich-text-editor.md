# Rich Text Editor Guidelines

## Overview

The Rich Text Editor (RTE) is a multi-line input component that enables users to compose and format text with common typographic controls (bold, italic, underline, strikethrough, color, background color, alignment), undo/redo, and optional character counting. It is designed for comments, descriptions, document bodies, and any free-form text entry requiring inline formatting.

---

## When to Use

- When users need formatted text, not just plain strings.
- For descriptions, comments, notes, docs, and content entry areas.
- When basic WYSIWYG controls are needed with consistent formatting tokens.

## When Not to Use

For short text inputs like notes, phone numbers, or short messages, a rich text editor is often overkill. Plain text editors or simpler input fields are more efficient and streamlined.
In scenarios where plain text or structured data is required, such as storing data in a database or using a specific data format, a rich text editor may not be suitable. These editors add formatting information that can be difficult to handle in these contexts. 
While rich text editors offer various formatting options, they may lack the advanced features found in specialized word processing formats. For highly complex layouts or design requirements, a rich text editor might not be sufficient. 

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

### `fillMode: None | Placeholder | Single Input`

- `None` → no text in the input box
- `Placeholder` → assistive text to guide users on what is required to be filled
- `Single Input` → text input when user enters

### `hasFunctions: True | False`

- Rich text editor can have functions such as Undo, Redo, Bold, Italic, Underline, Align Left, Table, Image

### `hasHelperOrCharacterCount: True | False``helperText: string``characterCount: string`

- Helper is located below the input field on the left while character count is on the right

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

- Clear noun phrase (“Enter a message”, “Leave a comment”).
- For required fields, place _required_ indicators in the label.
- Tooltip may be used to provide additional hidden details
- Supporting text is located below the label to provide visible details.

---

## Overall

- Container height (default): **160–240px** editable viewport; grows vertically if **auto-resize** is enabled.
- Padding: **12px horizontal padding** inside editor area.
- Border radius: **6px**.
- Toolbar - Function to function: **8px** gap
- Grouping via `hasDividers=True` creates clear clusters (e.g., Text styles | Color | Align | Clear | Undo/Redo).
