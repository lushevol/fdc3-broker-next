## Why

The accepted Authorization Limits read-only cohort cannot safely migrate create/edit/delete or checker approvals while the production design system lacks numeric form controls, accessible dialogs, confirmation behavior, and semantic feedback. Promoting those reusable interactions first removes Ant/MUI implementation duplication without inventing backend, entitlement, or maker/checker policy.

## What Changes

- Release `@fm/ratan-design@1.1.0` with bounded NumberField, Dialog, ConfirmationDialog, and InlineAlert APIs.
- Define keyboard, focus, labeling, disabled/loading, validation, dismissal, destructive confirmation, and semantic feedback behavior.
- Keep dialog state, validation rules, asynchronous operation state, domain copy, authorization, and service calls application-owned.
- Add complete component tests, Storybook coverage, demo usage, public-export checks, packed-consumer verification, and accessibility evidence.
- Preserve the existing Button, TextField, StatusBadge, provider, tokens, and package compatibility without breaking changes.
- Continue forbidding Ant, AG Grid, federation runtimes, legacy Ratan packages, raw MUI exports, and arbitrary styling escape hatches from the foundation package.

## Capabilities

### New Capabilities

- `production-form-controls`: Controlled numeric input, validation semantics, constraints, formatting boundaries, and accessible labels/help/errors.
- `production-dialog-overlays`: Accessible modal/dialog and destructive/default confirmation APIs with focus, keyboard, loading, and dismissal behavior.
- `production-inline-feedback`: Semantic inline information/success/warning/error feedback with optional bounded actions.
- `interaction-release-conformance`: Additive semver, public exports, forbidden dependencies, Storybook/demo documentation, packed consumption, and acceptance evidence.

### Modified Capabilities

None.

## Impact

- Updates only `packages/ratan-design` and shared verification/documentation scripts in this change.
- Adds no new runtime dependency: components adapt the existing MUI/Emotion peers.
- Does not modify the Cashflow application or enable mutation/approval workflows yet.
- Unblocks a later Authorization Limits mutation cohort once service and entitlement contracts are explicitly approved.
