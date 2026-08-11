# DatePicker

## Purpose
Edit and choose ISO calendar dates with locale-sensitive segments and a body-portalled calendar.

## Guidance
The public value is `YYYY-MM-DD`; browser locale is the default and `locale` is an explicit override. Direction inherits from the document unless `dir` is set.

## API
Controlled/uncontrolled ISO values and open state, bounds, validation, native forms, locale, RTL, descriptions, errors, and refs are supported. See `datePickerExample`.

## Tokens
Consumes frozen form-input, date/calendar, overlay, typography, spacing, color, and focus tokens.

## WebKit mapping
`sc-date-input`, `sc-date-picker`, `sc-date-range-input`, and `sc-date-range-picker` map to the `/date-picker` composition; range APIs are completed in the date cohort.

## Deviations
Invalid ISO strings fail early. React Aria corrects segment, calendar, focus, and locale accessibility defects documented by the manifest.
