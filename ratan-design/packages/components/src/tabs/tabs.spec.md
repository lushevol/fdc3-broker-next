# Tabs parity specification

## Frozen legacy surface

`Tabs`, `Tab`, `TabPanel`, and `TabDivider` map the complete public surface of
`sc-tab-group`, `sc-tab`, `sc-tab-panel`, and `sc-tab-divider` at the frozen
WebKit baseline. The legacy `type` property is exposed as `variant` with the
unchanged `outline` default and `filled | outline | segmented` values.

## React API

- `Tabs` owns controlled/uncontrolled selection through `selectedKey`,
  `defaultSelectedKey`, and `onSelectionChange`.
- `activation="auto" | "manual"` maps to React Aria automatic/manual keyboard
  activation without exposing React Aria event or collection types.
- `alignment`, `showTabsBottomLine`, `orientation`, inherited `dir`/`lang`, and
  the frozen variant are stable public props represented by deterministic
  `data-*` states.
- `onTabSelect`, `onTabShow`, and `onTabHide` receive a Ratan-owned lifecycle
  detail. The handle methods `show`, `updateScrollControls`, and
  `hideClosedTab` preserve the observed legacy imperative capabilities.
- `Tab` maps `panel` to its collection key, `disabled`, `closable`,
  `noActiveBottomLine`, `error`, `icon`, `counter`, and the legacy visual
  `active` state. Closing uses the React Aria press foundation and reports a
  Ratan-owned close detail.
- `TabPanel` maps legacy `name` to the same collection key. `TabDivider` is a
  presentational separator for custom navigation layouts.

## Interaction and accessibility

React Aria owns collection semantics, roving focus, arrow/Home/End behavior,
automatic/manual activation, disabled-key skipping, tab/panel relationships,
and RTL behavior. Ratan adds no hand-written keyboard or focus system.

## Visual contract

Static component CSS consumes only frozen `--sc-*` variables. Variant,
selection, focus-visible, hover, disabled, error, close, counter, alignment,
orientation, and bottom-line states are selected using stable attributes.

