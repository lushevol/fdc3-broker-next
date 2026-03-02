# Avatar Guidelines

## Overview

The Avatar is a compact visual representation of a user, team, or entity. It commonly displays a profile image, initials, or icon, and may show presence or notification badges. Avatars are used in people lists, comments, navigation bars, and collaboration UI.

---

## When to Use

- To display a user's profile picture or initials, providing a visual representation of the user
- To visually represent users in a chat, allowing for quicker identification of who is speaking or posting. 
- To identify users in lists or grids, particularly in large organizations where names might not be sufficient. 

## When Not to Use

- When the context doesn't require user identification: For example, in anonymous forums or when the user's identity is not relevant. 
- When showing an interactive icon: Use a button with an icon instead of an avatar. 
- When the avatar has little importance or is too large: In interfaces with limited space or where the avatar is not the main focus, consider using a smaller avatar or alternative representation.

---

## Properties

### `type: Icon only | Image only | Text only`

- Image (photo) or Icon or Text initials (up to two letters)
- Optional color scheme for background when no image
- Prefer centered, face‑visible photos for image avatar, avoid overly detailed images which lose clarity at small sizes.
- Use up to **2 letters** (first and last names). For single names, use first letter.
- Do not include punctuation or diacritics when space is constrained.

### `state: Rest | Hover | Pressed | Selected | Disabled`

- Rest: Default appearance for static contexts.
- Hover: Used for interactive avatars (clickable, menu trigger). Subtle elevation or ring.
- Pressed: Active interaction feedback when the avatar is a button.
- Selected: Used in multi‑select or assignment pickers; show selection ring/fill.
- Disabled: Non‑interactive and de‑emphasized. Remove hover/press behaviors.

### `colorScheme: Amber450 | Grey400 | Blue400 | Green500 | Red300`

- Color is depending on the use case where required to differentiate avatars based on purpose
- Use deterministic color assignment (e.g., hash of user ID → color token) to keep the avatar color consistent across sessions.
- Ensure contrast between initials/icon and background meets accessibility requirements.

### `isFilled: True | False`

- Avatar can be filled with a colored background or a colored border only

### `hasNotificationBadge: True | False`

- When there is an alert notification on an avatar especially for profiles, a top right notification dot or text badge can be used
- Indicates new activity

### `hasPresenceBadge: True | False`

- Icon badge located at the bottom right provides an indicator of the person's status such as out of office, available etc.
- Reflects real‑time status
- Badge will be shown with an icon symbol such as green tick circle for available.

---

## Overall

- If the image is missing or fails to load, fall back to **initials** first, then **generic icon**.
- When `hasTooltipOnHover = True`, show a tooltip with the full name, email, or role.
- Tooltips should appear on **hover** and **keyboard focus** (not just pointer).
- Avatars can open a **menu**, **profile card**, or **people picker**. Maintain a minimum target size of **32px** for touch.
- Recommended sizes: `Base-300` (e.g., 24px): dense tables and lists and `Base-400` (e.g., 32px): default size
- Keep badge sizes proportional (presence ≈ 50% of avatar diameter; notification dot ≈ 25% of avatar diameter).
- Icon size inside the container: **50–60%** of avatar diameter.
- Initials font size: use a responsive scale to maintain readability; center vertically and horizontally.
- Avatars overlap with consistent **stack offset** (e.g., 8px).
- **Hover** on the **last (overflow) avatar** opens a dropdown list of hidden members.
- **Maximum visible**: 3–4 avatars, then show **overflow indicator** (e.g., `+4`).
