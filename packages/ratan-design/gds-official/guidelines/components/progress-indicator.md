# Progress Indicator Guidelines

## Overview

Progress Indicators communicate the **status of an ongoing process**. They can be **Bar**, **Segmented Bar**, or **Circle** styles, and support intents and percentage labels.

---

## When to Use

- When the user requires a display on how much progress they have made towards completing a certain task/workflow.
- When the user could benefit from understanding their progress on long forms such as eCommerce checkouts, onboarding, or visa applications.

## When Not to Use

- When a process or form has fewer than three steps, use a validation badge instead.
- When the process is automatically loaded, use a spinner/loader instead.
- When a fixed sequence is required for completion, use a stepper together with a progress indicator.

---

## Properties

### `style: Bar | Bar (Segmented) | Gylph symbol | Percentage % only | Full circle`

- Bar: Used when progress is continuous. Best for uploads, installs, large tasks
- Segmented Bar: Steps are discrete. Best for forms, onboarding, wizards
- Glyph symbol: Space is limited or visual emphasis needed using filled circles. Radial representation of completion from 0–100% with label to the right of the circle icon. Use green checkmark circle for success and red triangle for error.
- Percentage Only: Precision matters or space is tiny. Best for metrics, table data
- Full circle: Use best for Dashboards, summarises or loading screens.Radial representation of completion from 0–100% with label inside the circle.

### `intent: Neutral | Error | Success`

- Error freezes at the failure point and shows an error color + message.
- Success reaches 100% and optionally transitions to a confirmation state.

### `hasPercentage: True | False`

- Show percentage value
- Known progress (0–100%). Update value smoothly.
- Label can show **XX%** or step status.

---

## Overall

- Show discrete steps (e.g., 5/8). Each segment represents a step completed.
- Use eased transitions (150–300ms) per update; avoid jumpy changes.
- Bar height: **6px**
- Gylph circle symbol: **16px**
- Provide **context**: what is progressing and next steps.
- When using **percentage**, keep it in whole numbers or 1‑decimal precision.
