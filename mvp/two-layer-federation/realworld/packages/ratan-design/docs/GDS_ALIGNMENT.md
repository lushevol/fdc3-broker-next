# GDS alignment

`gds-official` is a checked-in design reference, not a production dependency.
Ratan exposes a small, scoped semantic API for the components used by the
Portal Host, Cashflow, Identity Profile, and FDC3 Admin applications.

## Principles

- Use SC Prosper Sans with Inter and system fallbacks.
- Use the GDS component, label, description, and title typography roles.
- Use sentence case and concise, action-led copy in consuming applications.
- Map colour by semantic purpose and interaction state, never by primitive name
  in component CSS.
- Keep buttons pill-shaped, feedback intent-specific, and keyboard focus visible.
- Keep modal actions right-aligned in left-to-right layouts and use the GDS
  480px, 640px, and 800px width presets.
- Scope every token and component rule to `.ratan-design-root`.

## Current component scope

The supported API is limited to components with current realworld consumers:
provider, actions, text/number/password/select/date fields, tabs, dialogs,
inline feedback, status, shell feedback, and profile display primitives.
The remaining GDS catalogue is not copied into Ratan until an application has a
specified use case and acceptance test.

## Token policy

`src/foundation/tokens.ts` is authoritative. It aliases only the GDS primitives
needed by the supported API and generates `src/generated/tokens.css`.
Component CSS must not reference an undefined `--ratan-*` variable.
