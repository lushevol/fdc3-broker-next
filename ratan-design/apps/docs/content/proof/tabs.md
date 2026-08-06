# Tabs

## Purpose
Organize related panels with frozen outline, filled, and segmented appearances.

## Guidance
Use automatic activation for inexpensive panels and manual activation when switching is costly. `TabDivider` is collection-aware and may appear inside `TabList`.

## API
`Tabs`, `TabList`, `Tab`, `TabPanel`, and `TabDivider` support controlled/uncontrolled selection, activation mode, alignment, close actions, counters, errors, disabled state, and compatibility handles. See `tabsExample`.

## Tokens
Consumes the complete frozen `--sc-tab-*` token family plus spacing, typography, color, and focus variables.

## WebKit mapping
`sc-tab-group`, `sc-tab`, `sc-tab-panel`, and `sc-tab-divider` map to the compound API; legacy `type` becomes `variant` and selection events receive stable Ratan details.

## Deviations
React Aria owns collection relationships, disabled-key skipping, roving focus, automatic/manual activation, and RTL arrow behavior.
