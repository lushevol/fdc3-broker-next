# Alert Message Banner Guidelines

## Overview

The Alert Message Banner is a prominent, inline notification component that communicates important status updates, system information, warnings, errors, and confirmations. Use it to draw attention without blocking the user’s workflow. Background color is based on the intent or status.

---

## When to Use

- Marketing and promotional campaigns
- Form validation feedback at page or section level
- Important announcements affecting user experience
- Time-sensitive notifications and warnings
- Only one banner is shown at a time

## When Not to Use

- If an important system notification or operational notification is triggered, use snackbar or toast instead.
- Field-level validation errors (use inline validation message)
- Minor status updates and multiple simultaneous alerts

---

## Properties

### `intent: Informational | Warning | Error | Success`

- background of the message banner should be based on intent
- informational has a blue50 background, warning has a amber50 background, error has a red50 background and success has a green50 background
- Do not add a colored line in front of the banner
- Icon at the front of the banner are always filled

### `imagePosition: Left | Right | None`

- Image can be used to communicate the message intent
- image is optional
- position of the image are usually on the right, left images need to be considerate of top right close button

### `hasClose: True | False`

- close button are always on the top right corner of the banner 12px away from the edges
- close button are 24px by 24px
- Dismissive banners depends on context, most banners should be non-dismissive

### `hasDescription: True | False``descriptionText: string`

- Description text sits below the label, left aligned: **12px regular**
- Supports multi-line formatting.
- Provides supplementary context.

### `hasCustomContent: True | False`

- custom content are below any title or description to provide additional context

### `hasActionTrailing: True | False`

- Action trailing contains up to three link buttons placed at the top right of the banner
- Link buttons should follow the state changes as per buttons guidelines
- All link actions will be intent default color
- located next to the close button
- on a wider screen, action trailing is preferred

### `hasActionBottom: True | False`

- Action bottom contains up to three link buttons placed at the bottom of the banner
- Link buttons should follow the state changes as per buttons guidelines
- All link actions will be intent default color
- located left-aligned after the title or description or content
- on a narrower screen, action bottom is preferred

---

## Overall

- Header horizontal padding: **12px**
- Header vertical padding: **12px**
- title: **16px medium**
- Do not use circular icons since there is already a colored circle.
