# OTP & PIN Input Guidelines

## Overview

OTP & PIN Inputs provide a controlled numeric entry experience across multiple cells.  
Each cell accepts exactly **one digit**, and focus moves automatically as users type. These components are used for:

- Authentication (2FA codes, login verification)
- Transaction signing and approvals
- Secure PIN entry
- Multi-factor workflows

OTP/PIN ensures accuracy, speed, and predictable behavior even on mobile keyboards.

---

## When to Use

- Is used in situations where extra security is needed, such as when logging in to a new device or making a financial transaction
- For verifying the legitimacy of users during online purchases or transactions, adding a layer of security to prevent unauthorized transactions. 
- When logging in from a new or unrecognized device, an OTP may be required to ensure the user is who they say they are.
- To verify the user's identity before resetting a forgotten password.  
- In situations where a high-value transaction is being conducted, such as on a banking app, an OTP may be required to add an extra layer of security. 

## When Not to Use

- Users must enter free-form numbers, use Number Input
- Codes are not fixed-length, use Text Input with validation

---

## Properties

### `intent: Neutral | Error | Success`

- Colors are representive of the conditions
- Neutral are the default base color
- Error are primarily red border around the input field. There will be a validation message below the input field.
- Success are primarily green border around the input field. There will be a validation message below the input field.

### `state: Rest | Hover | Typing | Focused`

- Rest: default white background with grey border input field
- Hover: raise emphasis (color/overlay) white background with light blue border input field
- Typing: tactile feedback will have a darker blue border input field and a caret to signify typing will appear
- Focused: visible, accessible focus ring (non-color-only)

### `fillMode: None | Filled | Hidden`

- Shows a digit (or masked dot if hidden mode enabled)
- Automatically moves focus to the next cell
- Deleting an empty cell moves focus back to the previous cell
- When pasting a full code (e.g., "123456"), the component should:
  - Distribute digits across cells
  - Auto-fill all available cells
  - Trigger validation automatically
- If pasted value is too long → ignore extras
- If too short → fill what exists & keep focus on next cell
- Only `0–9` allowed
- Reject non-numeric input silently

### `intent: Neutral | Error | Success`

- Colors are representive of the conditions
- Neutral are the default base color
- Error are primarily red border around the input field. There will be a validation message below the input field.
- Success are primarily green border around the input field. There will be a validation message below the input field.

### `layout: 4 segment | 6 segment | 3 - 3 segment | 4 - 4 segment`

- Depending on requirements on security needs

### `fillMode: None | Filled | Hidden`

- Shows a digit (or masked dot if hidden mode enabled)
- Automatically moves focus to the next cell
- Deleting an empty cell moves focus back to the previous cell
- When pasting a full code (e.g., "123456"), the component should:
  - Distribute digits across cells
  - Auto-fill all available cells
  - Trigger validation automatically
- If pasted value is too long → ignore extras
- If too short → fill what exists & keep focus on next cell
- Only `0–9` allowed
- Reject non-numeric input silently

### `numberText: string`

- single digit

### `hasValidation: True | False`

- One message at a time, stay consistent in tone and be solution-focused
- Error: Be specific about what’s wrong, tell users how to fix it, use plain language, no tech jargon and don’t blame the user Example: “Email address is required”, “Password must be 8+ characters”, “File too large, Max 10MB”, “ Session expired. Please log in again”
- Alert: Match urgency to importance, explain why it matters, include timeframes when relevant and suggest actions to take Example: “Your keys and certs expires in 3 days”, “Update billing info required”, “Account not validated”
- Success: Confirm what was completed, be encouraging and positive, include relevant details and keep it brief Example: “Profile updated successfully”, “Account verified”, “Changes saved”

---

## Overall

- Input height: **32px** (min 36px mobile)
- Border radius: **6px**
- Internal padding: **0–8px** depending on font scale
- Gap between cells: **8–12px**
- GroupLabel → first row: **4–8px**
- Last row → Validation: **4–6px**
- Cells should align horizontally
- For 6-digit OTP, center-align entire group
- For PIN entry, left alignment is acceptable if inside a form
