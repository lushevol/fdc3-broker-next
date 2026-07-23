# Status & Status Filter Guidelines

## Overview

**Status** is a compact indicator that communicates the **current state or outcome** of an entity (e.g., “Draft”, “Pending”, “Rejected”, “Success”). It supports multiple severities, filled/outlined (tag) styles, and on‑surface adaptations.  
**Status Filter** lets users narrow down lists by one or more statuses using the same vocabulary and colors as Status.

---

## When to Use

- To tag items (rows/cards) with a state.
- To filter a dataset by one or many states.
- To maintain a consistent lexicon for lifecycle stages.

## When Not to Use

- For numerical progress, use Progress Indicator.
- For steps in a process → use Stages or Stepper.

---

### Properties

### `severity: Neutral (None) | 1 (Low) | 2 (medium) | 3 (High) | 4 (Very high)`

- Categorise based on intensity of the warning

### `type: Locked (Grey 350) | On hold (Grey 350) | Archived (Grey 500) | Draft (Grey 550) | Missing type (Grey 550) | Information (Blue 500) | In progress (Blue 550) | Complete (Blue 600) | Error (Error-text) | Rejected (Error-text) | Warning (Warning-text) | Pending type (Warning-text) | Success (Success-text) | Minor error (Orange 600) | Critical (Black)`

- Use the colors for different functions

### `onSurface: Light | Dark | None`

- change the contrast depending on the surface/background the component is on

### `isFilled: True | False`

- Change the icon to solid or outlined
- Change the tag to solid fill or outline fill

### `hasIconLeading: True | False`

- Add a front icon/symbol

### `hasLabel: True | False``label: string`

- Keep text minimal to 1-2 words

---

## Overall

- Height: **20–24px** (compact) / **28–32px** (default).
- Padding: **6–10px** horizontally.
- Icon size: **12–16px** with **6–8px** gap to label.
