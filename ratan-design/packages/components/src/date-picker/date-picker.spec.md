# DatePicker proof contract

## Frozen source and public shape

The `/date-picker` subpath composes the included frozen `sc-date-input`,
`sc-date-picker`, `sc-date-range-input`, and `sc-date-range-picker` contracts with
their supporting calendar parts. This proof implements the single-value
`DatePicker`; range APIs remain in the same subpath and are completed with the
date/time cohort.

The public value is an ISO calendar-date string (`YYYY-MM-DD`) or `null`, keeping
React Aria and `@internationalized/date` value types private. `value` is
controlled, `defaultValue` is uncontrolled, and `onValueChange` reports the next
ISO string or null. Invalid ISO input fails explicitly rather than silently
selecting a different date.

## API and defaults

The API includes `label`, `description`, `errorMessage`, `name`, `required`,
`disabled`, `readOnly`, `invalid`, `value`, `defaultValue`, `onValueChange`,
`open`, `defaultOpen`, `onOpenChange`, `locale`, `dir`, `minValue`, `maxValue`,
and a forwarded root ref. The frozen visual defaults are box-style, medium text,
closed popover, single date, no drag selection, and no range.

## React Aria composition

The component uses private React Aria DatePicker, DateInput, DateSegment, Group,
Button, Popover, Dialog, Calendar, CalendarGrid, CalendarCell, Heading, Label,
Text, and FieldError adapters. An internal I18nProvider is used only when an
explicit component locale override is supplied; consumers require no provider.

## Behavior gates

- Browser locale is the default; explicit `locale` changes segment order,
  formatting, calendar labels, and accessible messages.
- Segment arrow-key editing and calendar keyboard navigation remain React Aria
  behavior.
- The popover portals to `document.body`, restores focus, and cleans up on close.
- Direction inherits from the document; RTL date fields and portalled calendars
  are verified with `dir="rtl"` on `html` or `body`.
- Named values submit natively, disabled values are excluded, required validity
  is exposed, and uncontrolled reset returns to `defaultValue`.
- Every fixture passes Axe and maps to the frozen date-picker manifest entries.
