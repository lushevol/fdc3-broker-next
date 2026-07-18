# Button Guidelines

## Overview

Buttons are prominent, clickable UI elements that trigger actions. Use them to submit forms, confirm choices, open dialogs, and navigate when the action is primary to the current task.

---

## When to Use

- Primary actions: Save, submit, create, purchase
- Navigation: Next, back, go to page
- Dangerous actions: Delete, remove, cancel subscription
- Form submissions and confirmation
- Opening modals, dialogs, or new windows
- Triggering operations and processes
- Each page should have only one primary button, and any remaining calls to action should be represented as lower emphasis buttons.

## When Not to Use

- Do not use buttons as navigational elements. Instead, use links when the desired action is to take the user to a new page.
- Toggle switches (use toggle component)
- Radio/checkbox selections (use form controls)
- Opening dropdowns (use dropdown)

---

## Properties

### `intent: Neutral | Destructive | Success | Warning`

- Colors are representive of the severity of the action required
- Neutral are the default base color
- Destructive buttons are primarily red in color and used for actions such as delete, decline
- Success buttons are primarily green in color and used for actions such as approve
- Warning buttons are pirmarily amber in color and used for actions such as proceed with caution

### `state: Rest | Hover | Pressed | Focused | Selected | Disabled`

- Rest: default
- Hover: raise emphasis (color/overlay) in a lighter color
- Pressed: tactile feedback (darker fill or inset shadow)
- Loading: Replace leading icon with spinner or swap label to _Loading…_; disable interactions. Maintain button width to avoid layout shift.
- Focused: visible, accessible focus ring (non-color-only)
- Selected: enabled button or clicked state where button has a darker fill
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `style: Primary | Secondary | Link Primary | Link Secondary | Link Inverse | Floating (FAB)`

- Primary: High emphasis; one per view as the main call to action. Defined by blue filled buttons
- Secondary: Medium emphasis; supporting actions. Defined by white filled and grey border buttons
- Link Primary: Textual buttons with minimal chrome. Defined by text blue clickable
- Link Secondary: Textual buttons without a surface. Defined by text grey clickable
- Link Inverse: Textual button on dark surfaces. Defined by lighter blue text clickable
- Floating (FAB): Primary button with a shadow floating.`Floating (FAB)` is a distinct style: circular/extended, elevated, persistent over content.

### `iconOnly: True | False`

- `iconOnly=True` ignores `label` and centers the icon; always provide a tooltip and accessible name.

### `hasiconLeading: True | False`

- front icon before the button label: **8px before the label**
- Used only for communicating actions that text is not sufficient
- To be enabled together with text

### `hasiconTrailing: True | False`

- back icon after the button label: **8px after the label**
- Used for additional prompters/triggers such as dropdown
- To be enabled together with text

### `label: string`

- Short, action‑oriented verbs: Save, Create, Send, Add.
- Sentence case; avoid punctuation.
- Prefer 1–2 words. If longer, consider secondary UI.

---

## Overall

- All buttons should be pill-shaped
- Action buttons are always on the right side of the screen such as action bars and footers
- Text button size: **32px height**; 16px horizontal padding
- Icon-only button size: circular pill; match height with equal width (e.g., 40×40)
- ✔ Use a single Primary action per view.
- ✔ Use Secondary for supporting actions and Link for lightweight inline actions.
- ✔ Keep button widths content‑based; only full‑width when the layout calls for it (mobile forms).
- ✔ Provide tooltips for icon-only buttons and clarify ambiguous icons.
- ✖ Dont't stack multiple Primary buttons together.
- ✖ Don't use Destructive style for non‑destructive actions.
- ✖ Don't combine too many icons and long labels.
