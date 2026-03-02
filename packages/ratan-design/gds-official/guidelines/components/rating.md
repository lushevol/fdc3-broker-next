# Rating Guidelines

## Overview

The Rating component enables users to provide feedback or view evaluation scores. It supports **5‑segment** and **10‑segment** layouts, intent colors, helper text, validation, and group labels. Each segment can represent a star, heart, or custom icon depending on implementation.

---

## When to Use

- User feedback (e.g., product reviews, satisfaction scores).
- Evaluations with fixed scales (1–5, 1–10).
- Read-only ratings for content display.

## When Not to Use

- Continuous values, use Slider.
- Weighted feedback, use multi‑criteria forms.
- Input requiring text justification, pair with Text Area.

---

## Properties

### `type: 5 Segment rating | 10 Segment rating | 5 Star rating | Truncated rating`

- 5 Segment: Use for simple sentiment rating for fast, low cognitive load
- 10 Segment: Use for detailed scoring for high granularity
- 5 star: Use for public-facing quality scores that has universal, emotional impact
- Truncated: Shows an overflow segment when options exceed the visible count. There will be only two buttons in a truncated segment. The first button will show "Select" and the second button will show a down arrow chevron where if clicked, opens a dropdown.

### `intent: Neutral | Error`

- Colors are representive of the conditions
- Neutral are the default base color (simliar to secondary button)
- Error are primarily red border around the button. There will be a validation message below the segment field.

### `hasGroupLabel: True | False`

- Overall label title for the component
- May contain tooltip (optional) to provide additional hidden details
- May contain supporting text (located below the label) for additional visible details

### `hasHelper: True | False``helperText: string`

- Helper provides brief instructional help (one sentence).
- Text is located below the button segment component (in between any validation messages)
- - Helper text clarifies scale (“1 = Poor, 5 = Excellent”).

### `hasValidation: True | False`

- One message at a time, stay consistent in tone and be solution-focused
- Error: Be specific about what’s wrong, tell users how to fix it, use plain language, no tech jargon and don’t blame the user Example: “This field is required”

### `type: Label | Label (optional) | Label (optional) (i) | Label * | Label * (i) | Label (i)`

- Determine the groupLabel type if its an optional field or a required field
- Tooltip opens up for more additional hidden details
- info tooltip should be information text blue color and compulsory fields should be error text red color

### `layout: Left-aligned | Right-aligned`

- Determine position and layout of the groupLabel

### `hasSupporting: True | False``supportingText: string`

- Provide additional visible details below the groupLabel

### `groupLabelText: string`

- Overall label title for the component
- Be concise. Keep to 1-4 words.
- Do not truncate. Longer labels will spill over to next line.
- Use sentence case

---

## Overall

- Hovering previews fill up to target.
- Clicking selects rating (or deselects when clicking selected value if allowed).
- Icon size: **20–24px** (desktop), **18–20px** (mobile).
- Gap between icons: **4–8px**.
- Group label spacing: **4–8px** above component.
- Style follows the same as button segment for numeric rating.
- Star rating buttons are blue icon only without border, following icon link button interaction and style.
