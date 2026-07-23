# Accordion Guidelines

## Overview

Accordion is a collapsible component that delivers large amounts of content in a small and limited space. User gets key details about the underlying content with a header and can choose to expand that content within the constraints of the accordion. The expand/collapse action is indicated and triggered by a down/up arrow icon.

---

## When to Use

- To organize related information
- To shorten pages and reduce scrolling when content is not crucial to read in full.
- When space is at a premium and long content cannot be displayed all at once, like on a mobile interface or in a side panel.

## When Not to Use

- Use a modal or a card if information gets too much for a single screen
- If a user is likely to read all of the content, then don’t use an accordion as it adds the burden of an extra click; instead use a full scrolling page with normal headers.

---

## Properties

### `expand: True | False`

- Expanding reveals the content panel.
- Collapsing hides it.
- Chevron rotates 90° when expanded.
- Chevron arrow points to the right when collapsed and points down when expanded
- Duration: 150–200ms.
- Height transitions should feel smooth and responsive.
- Clicking/tapping the header toggles expand.
- Trailing actions must not trigger accordion expansion.

### `state: Rest | Hover | Pressed | Focused | Disabled`

- rest: default appearance of the header
- hover: header surface changes reacting to pointer hover
- pressed: indicates active interaction
- focused: shows an accessible focus ring
- disabled: accordion cannot be expanded. Reduce opacity and disable interaction

### `chevronPosition: Front | Back`

- Chevron are mostly positioned at the front before any labels or icons
- Back chevron are used depending on use cases

### `hasIconLeading: True | False`

- Leading icon, left-aligned: **4px from content**

### `hasEyebrow: True | False``eyebrowText: string`

- Eyebrow text sits directly above the label, left aligned: **12px medium**
- Optional contextual grouping.
- Use sparingly.

### `hasDescription: True | False``descriptionText: string`

- Description text sits below the label, left aligned: **12px regular**
- Supports multi-line formatting.
- Provides supplementary context.

### `hasTooltip: True | False`

- Tooltip is placed beside the label
- Open tooltip on hover
- Arrow of tooltip should be pointing to the direction of the tooltip icon, maintain visibility on screen

### `hasTrailingAction: True | False`

- Trailing action is found at the right-most end of the accordion container
- Contains a text button for interaction

### `hasStatus: True | False`

- Status tag is found at the right-most end of the accordion container, just after any trailing action
- Used when there are progress status required

### `hasDivider: True | False`

- Dividers are used to separate one accordion from another in an accordion group
- accordions can be stacked as without borders, contained (stacked in an enclosed container), or separated (each accordion is a container on its own)

---

## Overall

- Header horizontal padding: **12px**
- Header vertical padding: **12px**
- label: **14px medium**
