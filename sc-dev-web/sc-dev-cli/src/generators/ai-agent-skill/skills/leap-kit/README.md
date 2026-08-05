# leap-kit Skills

This folder contains Copilot skills for the **@leap** React component library (v3.70.0).

## Skills

| Skill | Folder | Description |
|-------|--------|-------------|
| `leap-kit-components` | [`leap-kit-components/`](./leap-kit-components/) | Reference skill for building UI with `@leap/sdk`, `@leap/ui-elements`, `@leap/ui-components`, `@leap/ui-extensions`, and `@leap/icons` — covers component selection, correct props, import patterns, layout, forms, feedback components, domain entities, navigation HOCs, and service wiring. |

## When These Skills Are Used

These skills are automatically loaded when a task involves:

- Importing or using any `@leap/*` package
- Selecting the right Leap component for a UI requirement
- Wiring up forms, tables, modals, alerts, or navigation using Leap components
- Using `HttpService`, `AuthService`, or other Leap service utilities
- Working with icons via `@leap/icons`

## Packages Covered

| Package | Purpose |
|---------|---------|
| `@leap/sdk` | Unified entry point — re-exports `ui-elements`, `ui-components`, `ui-extensions` |
| `@leap/ui-elements` | Primitive UI: Button, Table, Modal, Alert, Card, Grid, Tag, Tooltip, Spinner, etc. |
| `@leap/ui-components` | Domain UI: Contact, Application, Avatar, Navigation, Header, Forms, DataContainer, etc. |
| `@leap/ui-extensions` | Extension-level UI: APIDoc, ApplicationExt, CertificateExt, HostExt, IncidentChange |
| `@leap/icons` | SVG icon set |

**Import rule:** Always import from `@leap/sdk`, not sub-packages directly.

## Reference Files

Detailed component APIs are documented in [`leap-kit-components/references/`](./leap-kit-components/references/):

- [`ui-elements.md`](./leap-kit-components/references/ui-elements.md) — Primitive UI component APIs
- [`ui-components.md`](./leap-kit-components/references/ui-components.md) — Domain UI component APIs
- [`services.md`](./leap-kit-components/references/services.md) — HttpService, AuthService, and other service utilities
- [`icons.md`](./leap-kit-components/references/icons.md) — Icon usage with `@leap/icons`
