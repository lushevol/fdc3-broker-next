## ADDED Requirements

### Requirement: Operate without a provider
Ratan components SHALL resolve theme and font modes from document-global CSS, direction from `dir`, and locale from the browser or relevant explicit props without requiring a React provider or shared Ratan runtime.

#### Scenario: A component mounts in an independent React root
- **WHEN** the document has approved theme/mode selectors and no Ratan provider
- **THEN** the component SHALL render with the correct theme, direction, and locale defaults

### Requirement: Portal overlays to the document body
Dialogs, menus, popovers, tooltips, selects, and other overlays SHALL portal to `document.body` and use the document-global theme and z-index contract.

#### Scenario: An overlay opens from a themed application subtree
- **WHEN** the trigger opens the overlay
- **THEN** the overlay SHALL mount under `document.body` and use the document-global theme rather than an unsupported subtree theme

### Requirement: Provide accessible overlay lifecycle
Overlays MUST implement manifest-recorded dismissal, keyboard navigation, initial focus, focus containment where appropriate, focus restoration, nesting behavior, and deterministic listener/observer cleanup.

#### Scenario: A dialog closes with Escape
- **WHEN** an enabled modal dialog receives the Escape interaction
- **THEN** it SHALL close with the mapped reason and restore focus to the logical trigger

### Requirement: Support internationalization and direction
Locale-sensitive components SHALL use locale-aware parsing, formatting, calendar, numbering, and accessible messages, and layout/style behavior SHALL support inherited RTL where applicable.

#### Scenario: A date control receives a locale override in RTL
- **WHEN** the consumer supplies the supported locale prop under `dir="rtl"`
- **THEN** display, parsing, keyboard behavior, and layout SHALL follow that locale and direction

### Requirement: Respect reduced motion
Animations SHALL match the frozen motion contract unless corrected by an approved deviation and MUST disable or reduce non-essential motion when reduced motion is requested.

#### Scenario: Reduced motion is active
- **WHEN** `prefers-reduced-motion: reduce` matches
- **THEN** non-essential transitions SHALL be removed or reduced without hiding state changes

