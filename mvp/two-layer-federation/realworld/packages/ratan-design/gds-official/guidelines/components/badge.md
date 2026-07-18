# Badge Guidelines

## Overview

Badges are compact visual indicators used to highlight **status**, **counts**, **categories**, or **attributes**. They draw attention to specific information and enable quick visual scanning of important metadata. Badges may be **dot**, **text**, or **icon** style, and can be **filled** or **outlined**.

---

## When to Use

- Notifications counts on icons, navigation items
- Status indicators in lists, tables ,dashboards
- Quantity indicators on cart icons, counters
- Unread message or update indicators

## When Not to Use

- If interactivity is required or to allow users to group, sort or filter information, use tags
- Primary call-to-actions, use buttons
- Critical information requiring detailed explanation, use banner
- More than 3-4 badges per item

---

## Properties

### `type: Dot | Text | Icon`

- **Dot**: minimal presence/status indicator; no label.
- **Text**: shows counts; numeric only with max 4 characters.
- **Icon**: semantic state via pictogram; ensure accessible name.

### `intent: Default Grey | Brand Blue | Informational Blue | Destructive Red | Warning Amber | Success Green | Minor-error Orange`

- Colors are representive of the severity of the action required
- **Default Grey** – neutral, low emphasis.
- **Brand Blue** – brand‑accent informational.
- **Informational Blue** – system info.
- **Success Green** – positive/confirmed.
- **Warning Amber** – caution/attention.
- **Destructive Red** – critical or error.
- **Error Orange** – error/alert variant (use sparingly if both Red & Orange exist).

### `isFilled: True | False`

- badges are always filled unless due to accessibility requirements to have it as outlined.

### `label: string`

- Prefer numeric content for Text badges.
- Use **“99+”** or **“999+”** overflow depending on size.
- Do not wrap or truncate with ellipses.

---

## overall

- Badge appears when there is something to indicate (e.g., `count > 0`).
- **Auto‑hide**: When a component is selected or the condition clears, the badge hides (e.g., unread cleared).
- Anchor to the **top‑right** (default). Adjust for RTL to **top‑left**.
- Provide a small **offset** so the badge slightly overlaps the anchor.
- Ensure the badge does not occlude essential icon details.
- Appear/disappear with scale+fade (120–180ms).
- Avoid exaggerated motion that distracts from the primary task.
- **Dot:** 6–10px (depends on density)
- **Text/Icon container height:** 16–20px (compact), 20–24px (default)
- **Horizontal padding (Text/Icon):** 6–8px
- **Corner radius:** full (pill) or circle
- **Stroke (Outlined):** 1px

### Placement with Anchors

- Offset from anchor corner: **4–6px**
- When used on avatars or small icons, add a **2px border ring** using the background color to keep shapes distinct.
