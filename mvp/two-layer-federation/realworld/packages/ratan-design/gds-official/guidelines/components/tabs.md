# Tabs Guidelines

## Overview

Tabs organize content into **mutually exclusive** views. They support web/mobile styles, filled/underlined variants, dark/light surfaces, labels, leading icons, badges, expand and clear actions.

---

## When to Use

- To switch between related content areas within a page.
- For horizontally navigable sibling sections.

## When Not to Use

For page‑level navigation, use Top Navigation.
For process steps, use Stepper.

---

## Properties

### `style: Web | Mobile`

- Web: Icon is 16px by 16px and placed inline with the label horizontally - Mobile: Icon is 24px by 24px and placed above the label. Used for bottom navigation in mobile for most use cases.

### `state: Rest | Hover | Pressed | Focused | Selected | Disabled`

- Rest: default background
- Hover: raise emphasis (color/overlay) in a lighter grey color
- Pressed: tactile feedback (darker fill or inset shadow)
- Focused: visible, accessible focus ring (non-color-only) - Selected: If isFilled=True, tab background will be blue and if isFilled=False, a blue underline will appear below the text
- Disabled: non-interactive; reduce contrast and remove shadows. Keep label legible enough to be recognized but clearly disabled

### `isFilled: True | False`

- Filled tabs does not have any underline stroke
- Underlined tabs will only have an underline in selected state

### `onSurface: Light | Dark`

- Determines the inverse color when tab is on a lighter or darker surface

### `hasLabel: True | False``label:string`

- Keep tab labels short (1–3 words) and descriptive.
- Ensure each tab’s content is clear, concise, and relevant to that tab only.
- Maintain consistent tone and structure across all tabs.
- Avoid duplicate content between tabs.
- No placeholder or vague labels (e.g., “Stuff”, “Misc”).
- Content must match the product’s design system voice.

### `hasIconLeading: True | False`

- Used only for communicating actions that text is not sufficient

### `hasBadge: True | False`

- Badge is placed on the right of the label
- Only use badge if there is a count required to show for the content underneath it

### `hasExpand: True | False`

- Expand is a chevron pointing down and does not change when state changes for the tab

### `hasClear: True | False`

- Clear allows the tab to be removed from the series of tabs when editing
- Clear is defined by a cross x symbol at the trailing end of the tab

### `hasLeftScroll: True | False``hasRightScroll: True | False`

- When there are more tabs than the UI allows, a left/right scrolling will be enabled
- A chevron pointing left at the leading start of the tab group and a chevron pointing right at the trailing end of the tab group

---

## Overall

- **Click** or **Enter/Space** activates a tab.
- Only one tab selected at a time.
- **Left/Right** (horizontal) or **Up/Down** (vertical) moves focus.
- **Home/End** jump to first/last tab.
- Item height: **48px**
- Icon size: **16px**; badge aligns to label baseline.
