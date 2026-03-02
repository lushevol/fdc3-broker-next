# Stages Guidelines

## Overview

A stage component is a horizontal, step‑based progress indicator that visually communicates a multi‑step process. Each stage is represented by an arrow‑shaped pill in a ribbon like manner. Stacking of stages will have their arrows paralell to each other, similiar to a double chevron. The selected/current stage is highlighted in a solid blue treatment, while subsequent stages use a grey border while maintaining the arrow-shaped pill. The component scales to support different process lengths—two, three, four, or five stages—while maintaining consistent spacing, alignment, and visual hierarchy.

---

## When to Use

- To communicate current, completed, or blocked phases in a process.
- To summarize pipeline status (e.g., KYC → Review → Approved).
- As a compact alternative to a full stepper when navigation is not required.

## When Not to Use

- For fine‑grained, user‑navigable steps, use Stepper.
- For one‑off states without sequencing, use Status.

---

## Properties

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
- Selected: enabled button or clicked state where button has a blue fill
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `isTruncated: True | False`

- Truncated stage item will be denoted by three horizontal ellipsis icon.
- Click on the truncated stage to open a dropdown to select the stage to jump to.

### `hasTrailing Content: True | False`

- Trailing content may include progress indicator or hint text
- Located at the end of the component

### `hasDescription: True | False``descriptionText: string`

- Offer contextual help without cluttering the interface
- Keep up to a single sentence

### `stepNumberText: string`

- Step number is numeric only (1, 2, 3…)

---

## Overall

- Stages may be **static** (read‑only) or **clickable** to reveal details.
- If clickable, ensure **focus ring** and **keyboard activation (Enter/Space)**.
- **Truncation**: single‑line label truncates with tooltip for full text.
- **Progression**: completed stages may switch to **Success** intent.
- Container padding: **8–12px vertical**, **12px horizontal**.
- Gap between number and label: **8px**.
- Trailing content gap: **8–12px** from text block.
