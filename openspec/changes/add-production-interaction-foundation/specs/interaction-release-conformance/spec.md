## ADDED Requirements

### Requirement: Additive design release
The interaction foundation SHALL release as `@fm/ratan-design@1.1.0` and MUST preserve all 1.0.0 public exports and compatible behavior.

#### Scenario: Existing Cashflow build consumes the minor
- **WHEN** an application upgrades within major version one
- **THEN** existing Button, TextField, StatusBadge, provider, and token imports continue to build and behave

### Requirement: Restricted public exports
The package MUST export only documented semantic components/types and MUST NOT export raw MUI components, arbitrary styling APIs, form engines, or internal modules.

#### Scenario: Consumer imports an internal dialog file
- **WHEN** a consumer addresses an undocumented package subpath
- **THEN** package exports block resolution

### Requirement: Forbidden dependency boundary
The foundation MUST remain free of Ant, AG Grid, federation runtimes, legacy Ratan/domain packages, and application source imports.

#### Scenario: Interaction implementation adds Ant Popconfirm
- **WHEN** dependency/import scans run
- **THEN** release acceptance fails

### Requirement: Interaction acceptance evidence
Release acceptance SHALL include unit/component coverage, accessibility behavior, Storybook build, demo usage, lint, declarations, packed JavaScript/CSS/type consumption, build sizes, and production-pilot regression tests.

#### Scenario: Publish candidate is evaluated
- **WHEN** the 1.1.0 release gate runs
- **THEN** all interaction and existing-foundation evidence passes before application adoption

