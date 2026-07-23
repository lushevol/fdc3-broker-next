# Modal Guidelines

## Overview

Modals are focused overlays used to confirm decisions, collect short inputs, or display critical information. They contain a **header** (with optional intent styles), **body** content (slots), and a **footer** with actions. Close affordances and accessibility are mandatory.

---

## When to Use

- Confirmations (destructive actions, irreversible changes).
- Short, task‑focused forms.
- Critical information requiring acknowledgment.

## When Not to Use

- Long, multi-step flows → consider Drawer/Side Sheet or full page.
- Ephemeral feedback → use Toast or Banner.

---

## Properties

### `type: Hug content | Fixed screen space | <custom slot>`

- determines the occupancy screen real estate of the modal content

### `hasBlanket: True | False`

- Define if there is a grey opacity backdrop to prevent clicking on the items on the page when drawer sheet is active 

### `hasFooter: True | False`

- Footer appears at the bottom of the page
- Footer can have actions or pagination

### `hasScrollbar: True | False`

- When content gets too long, vertical scrollbar will be visible

### `intent: Neutral | Error | Warning | Success | Informational`

- Colors are representative of the conditions
- Neutral are the default base white background color
- Error modals have a light red background color used for critical or major destructive action
- Warning modals have a light amber background color used for alert messages
- Success modals have a light green background color used for positive actions
- Informational modals have a light blue background color used for providing information supplementary details

### `hasIconLeading: True | False`

- Add a front icon such as tick or alert symbol depending on the intent

### `hasClose: True | False`

- Close button x is located at the top right of the modal

### `hasDivider: True | False`

- Used to separate between the header and the content

### `hasLargeCallout: True | False``largeCalloutText: string`

- largeCalloutText is for high‑salience numeric info (e.g., “$1,234.00”)
- placed below the card main text
- Font size: **28px medium**

### `hasSubDescription: True | False``subDescriptionText: string`

- 2–3 lines; prefer truncation over overflow
- sits below any title
- Font size: **12px regular**  ### `titleText: string`
- Be direct and descriptive
- Keep it concise, aim for 1-7 words when possible
- Avoid redundant words such as “ modal”, : dialog”, “window” in the title
- Action-oriented headers for confirmations: “Delete account” not “Delete account?”
- Descriptive headers for information:” Payment successful” not “Success”

---

## Overall

- Open via explicit user action.
- Close via:
  - Close button
  - Secondary action
  - Esc key
  - (Optional) Blanket click — avoid for critical flows
- Width: **Small/Medium/Large** presets (e.g., 480 / 640 / 800px).
- Header padding: **24px to the width ends of the container**, **16 vertical padding**.
- Header divider is 1px, optional.
- Footer actions: primary to the right (LTR).
