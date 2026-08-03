# QA Checklist (since 126cfa9744bf90fdd61d2ed1bb452c2a46dd3f7c)

## Mobile Dropdown (single + multi-select)
- Open dropdown on mobile viewport (e.g., 375px wide).
  - Expected: opens smoothly, aligns to trigger, no clipping.
- Scroll list with many options.
  - Expected: smooth scroll, no stutter or jump, selection stays responsive.
- Select and deselect items in multi-select.
  - Expected: selected state updates, tags/values render correctly, no duplicates.
- Use search (if enabled).
  - Expected: filtering matches input; "no results" state renders as expected.

## Tag Input
- Add tag via Enter and via selection UI (if available).
  - Expected: tag appears, no layout break.
- Remove tag via close icon and Backspace.
  - Expected: tag removed, focus stays in input.
- Validate max tags or invalid entries (if configured).
  - Expected: error/blocked state behaves correctly.

## Radio Group Accessibility
- Tab to radio group, navigate with arrow keys.
  - Expected: focus moves correctly, selected value updates.
- Screen reader readout (if you can test).
  - Expected: role and state announced properly.

## Stepper
- Move through steps, including disabled states.
  - Expected: correct visual state and navigation rules.
- Resize to mobile/tablet.
  - Expected: layout stays readable and aligned.

## Checkbox Group Disabled
- Disable whole group and individual items.
  - Expected: disabled items cannot be toggled; visuals match state.

## File Input/List Events
- Upload file, observe list and item events.
  - Expected: events propagate correctly; listeners receive composed events.
- Remove item, check list update.
  - Expected: list updates immediately, no ghost items.

## Menu Bar Mobile
- Verify title link on mobile.
  - Expected: visible, tappable, correct alignment and spacing.

## Column Layout Height
- Render column layout with varied content heights.
  - Expected: height behaves as expected; no extra spacing or clipping.

## Action Bar + Button Group Mobile
- Test on tablet and mobile widths.
  - Expected: alignment is correct; buttons wrap/resize properly.

## Storybook
- Build storybook.
  - Expected: no build errors.
- Open new/updated stories (content card, mobile updates).
  - Expected: render matches design, no console errors.

## Icon Removal
- Search for removed pin icons usage in UI.
  - Expected: no missing icon or broken references.
