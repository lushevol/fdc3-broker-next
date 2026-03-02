# Action Bar Guidelines

## Overview

The Action Bar provides a consistent place for primary and secondary actions, lightweight status (e.g., “Last saved”), and optional back navigation. It sits below the Page Header or can be used standalone on simpler pages and list views.

---

## When to Use

- When a page or object requires **consistent, repeatable actions** (Save, Cancel, Submit).
- When you need to surface **back navigation**, **status**, or **validation** near actions.
- When actions are **contextual to the current page** rather than a specific element inside the page.

## When Not to Use

- For inline object actions inside cards/rows → use **inline button groups**.
- For page‑blocking confirmation → use **Dialog/Modal**.
- If there’s only one primary action and no status → consider placing a single **primary button in the Page Header** instead.

---

## Properties

### `hasBack: True | False`

- text link at the leading left of the action bar
- usually separated with a divider from the other leading actions
- returns to previous route; confirm when there are unsaved changes.

### `hasTitle: True | False``titleText: string`

- supplementary title compared to the page header
- exist at the left of the action bar after the "back action"
- concise entity/page name

### `hasLeftActions: True | False`

- Left actions can include additional functions that manages the page such as Export, Template
- Left actions are primarily link buttons and may include leading icons
- up to 4 actions can be listed, if there are more than 4 or on a smaller screen, use a 'more' to list the additional actions in a dropdown.

### `hasLastSaved: True | False`

- Placed on the right trailing of the action bar 4px infront ofthe right link action buttons.
- text updates after successful autosave/manual save (avoid flicker; debounce updates)
- humanized timestamp (“Last saved 3m ago”)

### `hasRightActions: True | False`

- Right trailing actions are the main CTA in the page such as Submit, Proceed
- There can be up to 3 buttons; One primary button, one secondary button with border (E.g Cancel) and one link button (E.g Save). Always stick to this format where primary is compulsory and use secondary if there is another action.

---

## Overall

- Height: **48px**.
- Horizontal padding at the ends of the action bar container: **24px**.
- Minimum gap between grouped actions: **8px**.
