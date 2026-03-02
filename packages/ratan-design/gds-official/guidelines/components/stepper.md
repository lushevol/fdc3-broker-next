# Steppers Guidelines

## Overview

Steppers guide users through a **sequential workflow**. They can be navigable (allow step jumps) or read‑only (progress only). Items support dot, numeric, and custom‑icon types; horizontal or vertical layouts; tails/connectors; optional “optional” indicators; trailing content; action buttons; and description slots.

---

## When to Use

- Steppers are particularly beneficial for breaking down intricate tasks into smaller, more manageable steps, making the process feel less overwhelming for the user. 
- They provide a visual roadmap, indicating the user's progress and the order of steps, which can be especially helpful for new users or those unfamiliar with the process. 

## When Not to Use

- If a form or process has fewer than three sections, using a stepper is unnecessary. Steppers are most effective when breaking down complex tasks into smaller steps. 
- If the steps in a process are not necessarily in a specific order, or if users need to easily jump between steps without following a linear path, a stepper might not be the best choice. 
- Avoid using multiple steppers on the same page or embedding steppers within steppers, as this can make the UI confusing.

---

## Properties

- ### `type: Dot | Numeric | <Custom Icon>`
- Dots: Use dots for short, simple, linear flows where users don’t need context about each step.
- Icons: Use icons when each step represents a distinct concept that benefits from quick visual recognition. When going through validation, icon stepper will have green circle tick for success step and red circle cross for error step.
- Numbers: Use numbers when the sequence is important and users need clear visibility of their progress. When going through validation, numbers will remain with color for error and success. Success or error steps do not use icons.

### `layout: Vertical | Horizontal`

- Adjust the orientation of the stepper

### `intent: Neutral | Error | Success`

- Colors are representative of the conditions
- Neutral are the default base color
- Error are primarily red border around the component.
- Success are primarily green border around the component.

### `state: Rest | Hover | Pressed | Focused | Selected | Disabled`

- Rest: default white background
- Hover: raise emphasis (color/overlay) in a lighter color
- Pressed: tactile feedback (darker fill or inset shadow)
- Focused: visible, accessible focus ring (non-color-only)
- Selected: enabled state or clicked state where stepper has a light background fill to signify selected. Number circle and icon circle will be filled.
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `hasTail: True | False`

- For the last stepper, there should not be a line tail

### `isCollapsible: True | False`

- Chevron points to the right when collapsed and points down when expanded to show more details such as descriptions or actions

### `isOptional: True | False`

- Determines if the step is optional with a grey optional text

### `hasTooltip: True | False`

- Tooltip is located in the same line as optional and the stepper label

### `hasTrailingContent: True | False`

- Trailing content can be collapsible, with hint text
- May contain status or progress indicator

### `hasActionButton: True | False`

- Action button includes a link button below the label

### `hasContentSlot: True | False`

- Section slot for other contents

### `hasDescription: True | False``descriptionText: string`

- Offer contextual help without cluttering the interface
- Keep up to a single sentence

### `stepNumberText: string`

- Step number is numeric only (1, 2, 3…)

### `label: string`

- Choose action-oriented or descriptive names e.g “Account details”, “Payments” and avoid generic labels e.g “Step 1”, “Next”
- Maintain consistent grammatical structure across all steps

---

## Overall

- **Current/Selected** step is emphasized (brand color/focus).
- **Completed** steps show success color/check.
- **Error** steps display error color and message/tooltip.
- **Optional** step indicates `(optional)` next to label.
- **Navigation** rules:
  - Click a completed or enabled step to jump (if allowed).
  - Keyboard: Left/Right (horizontal) or Up/Down (vertical); Enter to activate.
- **Content slot** can reveal contextual fields under the step (vertical pattern).
- **Horizontal**: step circle (numeric/icon) are 24px in heigth; connector/tail between items. Label is left-aligned **4px right below the step circle and connector container**.
- **Vertical**:step circle (numeric/icon) are 24px in width and arranged in a single column; connector/tail between items. Label is on the **right 12px of the step circle and connector container**.
- Circle sizes for numeric and icon: **24px**
- Step should have **8px top vertical padding** and **4px to both sides with horizontal padding**
