# Breadcrumbs Guidelines

## Overview

A breadcrumb displays the current location within a hierarchy and traces a user’s path. It allows user to go back to states higher up in the hierarchy (parent step or previous step), and all links in a breadcrumb should be clickable. Breadcrumbs are very useful in products with a huge amount of content organised, but they should always be treated as secondary navigation and should not replace the primary navigation.

---

## When to Use

- Use when products and experiences have a large amount of content organized in a hierarchy of more than two levels.

## When Not to Use

- Breadcrumbs are always treated as secondary and should never entirely replace the primary navigation. They shouldn’t be used for products that have single level navigation because they create unnecessary clutter.
- If you are taking users through a multistep process use a progress indicator instead.

---

## Properties

### `itemCount: 2 Segment | 3 Segment | 4 Segment | 5 Segment | Truncated Segment | Truncated Segment (onHover)`

- label needs to have clear indication of destination that matches page titles
- Follow site architecture and reflect actual navigation path
- 1-4 words per breadcrumb items, do not truncate text

---

## Overview

- Breacrumb items follows the same interaction as a link primary button and using a chevron right as separator
