# Snackbar & Toast Guidelines

## Overview

Snackbars are a non-disruptive message appearing at the top of an interface that provide quick, at-a-glance feedback on the outcome of an action. Snackbars are generally more interactive and can be dismissed by the user, whereas toasts disappear automatically after a set duration. Toasts are used more to display brief, non-interactive messages, often system-level notifications. Use cases span form submission feedback, undo actions, system status updates, confirmation messages, and non-critical alerts.

---

## When to Use

- Short, transient feedback: “Saved”, “Message sent”.
- System‑level notifications that don’t block tasks uses snackbar
- Error messages that do not require immediate user uses toasts

## When Not to Use

- Blocking confirmations, use Modal.
- Huge callouts, use Alert/Message Banner.
- Inline form errors, use Validation components.

---

## Properties

### `type: Snackbar | Toast`

- Snackbar: A short, interactive message that appears briefly at the bottom of the screen and can include actions (like Undo). - Toast: A brief, non-interactive message that simply informs the user and disappears automatically.
- Snackbar has container-layer-inverse as the background while toast has container-layer as the background

### `intent: Informational | Error | Warning | Success`

- Colors are representative of the conditions
- Informational contains a blue leading info icon
- Error contains a red leading alert triangle icon
- Warning contains an amber leading circular alert icon
- Success contains a green leading circular tick icon

### `hasActionTrailing: True | False`

- Action link buttons located at the trailing end of the component
- Up to three actions

### `hasClose: True | False`

- Close x button at the trailing end of the component

### `hasLoadingBar: True | False`

- Loading bar at the bottom of the toast component is used to show the duration before the message disappears

### `hasDescription: True | False``descriptionText: string`

- Snackbar: Provide relevant details about the completed action E.g “Changes applied to all apps”, “Moved from inbox to ‘Projects’ label”
- Explain system behaviour or status details
- Toast: Provide technical context when needed E.g “Last synced 5 minutes ago”, “SSL certificate expires in 3 days”

### `headlineText: string`

- Snackbar: Confirm user-initiated actions and their outcomes
  File operations e.g “Document saved”, “Document deleted”, “Folder created”
  Data operations e.g “Settings updated”, “Profile changed”, “Password reset”
  Content operations e.g “Message sent”, “Item added to cart”, “Bookmark saved”
  Form operations e.g “Changes applied”, “Draft saved”, “Submission complete”
- Toast: Communicate system status changes and events
  Connectivity e.g “Connection lost”, “Back online”, “Syncing data”
  System status e.g “Update available”, “Maintenance mode”, “Storage full”
  Background processes e.g “Sync complete”, “Backup finished”, “Downloading in progress”
  Security events e.g “Password expires tomorrow”, “New login detected”, “Account locked”

---

## Overall

- Auto-dismiss after **3–5 seconds** (Snackbar).
- Toasts may dismiss sooner (2–3s), or stay until dismissed for persistent types.
- Hover pauses dismissal.
- Close button immediately removes it.
- Trailing actions should not exceed 2–3 items.
- Stack vertically with **8–12px spacing**.
- Maximum of 3 visible at once.
- **Snackbar:** top‑center
- **Toast:** top‑right or top‑center.
- Height: **48–72px** depending on content.
- Padding: **12–20px**.
- Text lines: headline + optional description.
- Loading bar height: **2–4px** at top or bottom.
- Snackbar and toast are two different components. Always differentiate them based on their use cases.
- Do not include a leading line at the front of the component for snackbar and toast.
