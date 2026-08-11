## ADDED Requirements

### Requirement: Maintain distinct workbench surfaces
The system MUST provide a docs app, Storybook package, packed-package playground, and WebKit/Ratan parity lab with distinct documented responsibilities and CI tasks.

#### Scenario: A proof-cohort component is declared complete
- **WHEN** its required docs, stories, playground flows, or parity fixtures are absent
- **THEN** the component SHALL remain incomplete

### Requirement: Follow specification-driven test-driven delivery
Contract and accessibility specifications and failing tests MUST precede component implementation, and the final package MUST maintain greater than 90 percent line and branch coverage, strict TypeScript, zero lint warnings, and compilable documentation examples.

#### Scenario: A component implementation is proposed without contract tests
- **WHEN** cohort validation inspects the change
- **THEN** promotion SHALL fail until specification-derived tests exist

### Requirement: Enforce visual parity
Managed Chrome and Edge fixtures SHALL run with identical fonts, viewport, DPR, theme, mode, data, and interaction state; unexplained geometry, typography, colour, spacing, and focus differences are prohibited, and screenshot differences MUST remain below 0.1 percent changed pixels.

#### Scenario: A screenshot exceeds tolerance
- **WHEN** changed pixels are at or above 0.1 percent without an approved deviation
- **THEN** the parity gate SHALL fail

### Requirement: Enforce accessibility evidence
All applicable fixtures MUST run Axe and automated keyboard/focus/form checks; dialogs, menus, select/combobox, date controls, tabs, and DataGrid MUST receive manual accessibility review before stable release.

#### Scenario: Axe passes but manual review is required
- **WHEN** a listed composite component lacks manual review evidence
- **THEN** stable promotion SHALL remain blocked

### Requirement: Enforce package and interaction budgets
Excluding React peers, common Portal Host design-system JavaScript and CSS MUST be at least 20 percent smaller than equivalent WebKit delivery, p95 synchronous interaction work MUST remain below 10 ms, and root imports MUST exclude DataGrid.

#### Scenario: A common-route bundle regresses
- **WHEN** the measured packed package misses the size target
- **THEN** the cohort SHALL require remediation or an explicit architecture re-review

### Requirement: Verify browser and micro-frontend lifecycle
The playground and parity lab SHALL test React 18.2 and 19, managed Chrome and Edge, CSP/offline assets, MFE mount/unmount, mixed WebKit/Ratan operation, forms, overlays, RTL, supported locale overrides, reduced motion, high contrast, and 200-percent zoom.

#### Scenario: A micro-frontend repeatedly mounts and unmounts
- **WHEN** the lifecycle scenario completes
- **THEN** Ratan SHALL leave no leaked overlay node, listener, observer, or global style mutation

