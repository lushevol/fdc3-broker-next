# Pagination Guidelines

## Overview

Pagination splits content or data into several pages and lets users navigate between them. It supports different truncation strategies, total‐count display, and page‐size selection.

---

## When to Use

- When it could take a considerable amount of time to load the available data at once or in a scrolling view
- When there is too much data to display on one page or within one view of a component
- To make large amounts of data more accessible to consume by users
- To optimise on-page real estate
- To give users more control over how they view large amounts of information

## When Not to Use

- Infinite, feed‑like content, use infinite scroll (with care).
- Small data sets (≤ 20 items), consider no pagination or simple previous/next.

---

## Properties

### `type: Default | Default (End truncated) | Default (Middle truncated) | Default (Front truncated) | Document`

- Click page number → go to that page.
- Previous/Next disabled at bounds (1 and last).
- Ellipses represent skipped ranges; clicking a number near ellipses reveals new numbers.
- Front truncated → hides low pages.
- End truncated → hides high pages.
- Middle truncated → hides middle pages for large ranges.
- Choose based on current index proximity to bounds.

### `hasTotalCount: True | False`

- Total count uses range + of + total: “1–10 of 50 items”.

### `hasPageSizeSelector: True | False`

- Changing size resets to page 1 (recommended) to avoid empty pages. - Page size labels: “10 items per page”, “25 items per page”, etc.

---

## Overall

- Target size for numbers & controls: **32px** height.
- Gap between page numbers: **4px**.
- Keep the control vertically centered within table/list footers.
