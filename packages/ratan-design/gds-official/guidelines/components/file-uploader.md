# File Uploader Guidelines

## Overview

The File Uploader lets users select, drag‑and‑drop, and manage files. It supports single and multiple uploads, progress indication, error handling (type/size/network), and post‑upload actions (download, delete, retry). Use it for forms, import flows, and content management.

---

## When to Use

- To attach files to forms, comments, tasks, or records.
- To import data (CSV/XLSX/JSON), images, or documents.
- When users need to manage multiple files with clear feedback on progress and errors.

## When Not to Use

- For transferring extremely large datasets that require background processing → use a **background uploader** pattern.
- For inline image capture or editing → use **camera/image picker** components.
- For cloud file browsing → use a **file picker integration** (Drive/SharePoint, etc.).

---

## Properties

### `type: Upload box``state: Rest | Hover | Pressed | Disabled`

- Rest: default box to trigger drag and drop or browse function.
- Hover: light blue border dotted lines to signify hover state. Blue text link as well.
- Pressed: darker blue border dotted lines to signify pressed state. Blue text link as well.
- Disabled: de‑emphasized; no focus/drag states.

### `type: Uploaded item``state: Rest | Hover | Pressed | Disabled`

- Rest: loading state where item is processing or unzipping
- Hover: Blue text link and background surface changes to hover grey
- Pressed: Blue text link and background surface changes to dark pressed grey
- Disabled: de‑emphasized; no focus/drag states.

### `type: Uploaded media``state: Rest | Hover | Pressed | Disabled`

- Rest: loading state where item is processing or unzipping
- Hover: Blue border around the media image
- Pressed: Blue border around the media image
- Disabled: de‑emphasized; no focus/drag states.

### `intent: Neutral | Error | Success`

- Neutral are the default base state
- Error are primarily red color during failure scenarios such as upload failed
- Success are primarily green color when upload are successful

### `hasDescription: True | False``descriptionText: string`

- Box description: constraints, e.g., “Accepted: PNG, JPG, PDF · Max 25MB each · Up to 10 files”.
- File description: file size, e.g., "200,58kb".

### `label: string`

- Box label: action‑oriented (e.g., “Drag and drop files here or Browse”).
- File label: Use original filename (no path). Truncate the middle section for long names: `very-long-f…name.pdf`.

### `hasRetry: True | False`

- Retry button appears when upload fails as a link text

### `hasDelete: True | False`

- Red destructive trash icon as the trailing end of the upload item to remove the item from the upload

### `hasDownload: True | False`

- Download is a text link beside the description or below the label

### `ValidationText: string`

- One message at a time, stay consistent in tone and be solution-focused
- Error: Be specific about what’s wrong, tell users how to fix it, use plain language, no tech jargon and don’t blame the user Example: “Email address is required”, “Password must be 8+ characters”, “File too large, Max 10MB”, “ Session expired. Please log in again”
- Alert: Match urgency to importance, explain why it matters, include timeframes when relevant and suggest actions to take Example: “Your keys and certs expires in 3 days”, “Update billing info required”, “Account not validated”
- Success: Confirm what was completed, be encouraging and positive, include relevant details and keep it brief Example: “Profile updated successfully”, “Account verified”, “Changes saved”

---

## Overall

- Click Browse triggers `<input type="file">`.
- Dragging files onto the box highlights the dropzone and prevents default page navigation.
- If `multiple=false`, replacing a file prompts confirmation or automatically replaces (product decision).

### Upload Box

- Upload box height: **120–160px** (room for icon + two lines of guidance).
- Upload box padding: **12px horizontal padding**.
- Upload box border radius: **6px**.
- Upload box drop ring thickness: **1px**.
- Use dashed outline for discoverability if desired.

### Upload Item

- Upload item row height: **64px** depending on metadata.
- Upload item thumbnail/icon: **32px**. Show a file icon with a bottom right green success circle tick or red error cross circle for validation.
- Upload item trailing actions gap: **8–12px**.
