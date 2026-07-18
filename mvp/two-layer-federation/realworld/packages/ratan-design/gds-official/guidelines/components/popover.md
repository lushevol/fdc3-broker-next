# Popover Guidelines

## Overview

A Popover is a floating UI element that appears adjacent to a trigger element, containing contextual content or lightweight actions. It supports headers, footers, scrollable content, fixed/auto height, and a variety of placements.

---

## When to Use

- To display **additional context**, hints, or **lightweight actions** without navigating.
- For compact forms, quick pickers, or confirmations when a full dialog is unnecessary.

## When Not to Use

- For blocking tasks or critical confirmations → use **Modal**.
- For purely informational, non-interactive tips → consider **Tooltip**.

---

## Properties

### `layout: ← left (bottom) | ← left (middle) | ← left (top) | ↑ top (left) |  ↑ top (middle) |  ↑ top (right) | → right (bottom) | → right (middle) | → right (top) | ↓ bottom (right) | ↓ bottom (left) | ↓ bottom (middle)`

- Positions relative to trigger; flips when collision detected (viewport aware).
- Arrow rotates to match placement.

### `hasFooter: True | False`

- Provide CTA actions
- Button labels should be verb‑first: _Apply_, _Save_, _Cancel_.
- Positioned at the bottom of the footer

### `hasScrollbar: True | False`

- On longer content, scrollbar will be visible

### `hasIconLeading: True | False`

- Add a front icon such as tick or alert symbol depending on the intent

### `hasClose: True | False`

- Close button x is located at the top right of the modal

### `hasDivider: True | False`

- Used to separate between the header and the content  ### `titleText: string`
- Write in sentence case
- Aim for 1-3 words or phrase
- Keep label brief but descriptive
- Avoid jargon or technical terms unless necessary

---

## Overall

- Open on click/press of trigger, close on:
  - clicking outside
  - pressing **Esc**
  - performing a primary action
- Return focus to trigger on close.
- Max width: **320–420px** for text content; larger for pickers as needed.
- Max height: **40–60vh** with scroll.
- Padding: **16–20px** (content), **12–16px** (header/footer).
- Arrow size: **8–12px**.
