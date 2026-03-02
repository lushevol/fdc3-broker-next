# List Guidelines

## Overview

List is a structured container that displays multiple related items with consistent affordances (leading/trailing content, description, roles, drag, show more, dividers). Use **List Item** for a single row and **List Group** to compose sections or cards of lists.

---

## When to Use

- Entity collections (teams, contacts, settings).
- Editable rows (with controls or inline inputs).
- Sectioned lists with titles and dividers.

## When Not to Use

- Data-heavy tabular content, use Table.
- Single selection tabs, use Tabs or Button Segment.

---

## Properties

### `type: List | Editing | Section title | Divider | Main title`

- List: Provides a list item with various information
- Editing: Editing state of a list component. Usually consist of input fields or selection fields
- Section title: Category sectioning within a list group
- Main title: Title section within a list group

### `hasDrag: True | False`

- Can have a drag icon at the front to allow user to drag and reoder the menu item
- When `hasDrag=True`, show a drag handle; increase elevation while dragging.
- Maintain layout stability—use placeholders during drag.
   ### `isCollapsible: True | False`
- Shows nested submenus when activated.
- Should open inline, to the right, or nested depending on platform.
- Chevron points to the right and placed before any other elements when collapsed
- Chevron points down when expanded

### `hasTooltip: True | False`

- Tooltip is placed on the right of the label text to provide additional hidden details
   ### `hasLeadingContent: True | False`
- Arranged at the front of the menu item
- Can be decorative icon or avatar
- Can be checkbox or radio selection

### `hasTrailingContent: True | False`

- Arranged at the back of the menu item
- Can be included for hint text or additional status

### `hasEyebrow: True | False``eyebrowText: string`

- small/uppercase or overline style
- placed above the main text
- Font size: **12px medium**

### `hasPositionRole: True | False``positionRoleText: string`

- small/uppercase or overline style
- place between the main text and the description text
- Font size: **12px medium**

### `hasDescription: True | False``descriptionText: string`

- 2–3 lines; prefer truncation over overflow
- sits below the label
- Font size: **12px regular**

---

## Overall

- Row height: **48–72px** depending on description/controls.
- Leading content size: **16px**.
- Gaps: leading→label **12–16px**, label→trailing **auto**, between rows **8–12px**.
- Divider thickness: **1px**.
