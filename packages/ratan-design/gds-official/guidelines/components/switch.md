# Switch Guidelines

## Overview

A Switch is a binary toggle that turns a setting **on/off**. It supports labels, state icons, and full interaction states.

---

## When to Use

- Switches are best used to adjust settings and other standalone options.
- Switches control binary options, not opposing ones. A binary option represents a single selection that is either on or off. Opposing options are when only one option in a set can be selected at a time, like a list or grid view.
- The effects of a switch should start immediately, without needing to save
- One option on the switch is always pre-selected

## When Not to Use

- For one‑time actions, use Button.
- For multiple exclusive choices, use Radio.
- For values that require confirmation, use Checkbox or a form.

---

## Properties

### `on: True | False`

- On: Switch is turned on when handle is pushed to the right. Switch background will be in blue and handle in white. - Off: Switch is turned off when handle is pushed to the left. Switch background will be in white with grey handle and border.

### `layout: Vertical | Horizontal`

- Adjust the orientation of the stepper

### `state: Rest | Hover | Pressed | Focused | Disabled`

- Rest: default background
- Hover: raise emphasis (color/overlay) in a lighter color
- Pressed: tactile feedback (darker fill or inset shadow)
- Focused: visible, accessible focus ring (non-color-only)
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `hasGroupLabel: True | False`

- Label is positioned on the left of the switch

### `hasStateIcon: True | False`

- Icon is placed inside the stepper

### `type: Label | Label (optional) | Label (optional) (i) | Label * | Label * (i) | Label (i)`

- Determine the groupLabel type if its an optional field or a required field
- Tooltip opens up for more additional hidden details
- info tooltip should be information text blue color and compulsory fields should be error text red color

### `layout: Left-aligned | Right-aligned`

- Determine position and layout of the groupLabel

### `hasSupporting: True | False``supportingText: string`

- Provide additional visible details below the groupLabel

### `groupLabelText: string`

- Use 1-3 words or phrase maximum for step labels
- Choose action-oriented or descriptive names e.g “Push notifications”, “Dark theme”
- Maintain consistent grammatical structure across all steps

---

## Overall

- Clicking or tapping toggles the value.
- **Focus**: show visible ring on the control (not only on label).
- **Drag** gesture: handle moves left/right (desktop + mobile).
- If the change is **destructive**, show a confirmation or use a different control.
- Typical dimensions: track **34px width × 16px height**
- Label gap: **8–12px**.
- Hit target: **≥ 44×44px** including padding.
- Switch handle: **12px** round circle
- Handle should smoothly transits when toggling left and right
