## Context

`@fm/ratan-design@1.0.0` supplies tokens, provider, Button, TextField, and StatusBadge. The legacy Authorization Limits mutation flow uses MUI Dialog/Box/Button/IconButton and Ant Form/Input/InputNumber/Popconfirm/message. Copying that mixture into the new Cashflow application would violate the production design boundary. The reusable interaction mechanics are stable enough to promote independently; authorization and service semantics are not.

## Goals / Non-Goals

**Goals:**

- Add accessible, controlled interaction primitives that cover numeric form entry, modal composition, confirmation, and inline feedback.
- Keep APIs semantic and bounded while adapting existing MUI/Emotion peers.
- Preserve independent React roots and scoped semantic styling.
- Prove additive package compatibility, documentation, and packed consumption.

**Non-Goals:**

- A form-state/validation library, schema engine, toast manager, global overlay service, or host capability.
- Domain-specific Authorization Limits forms, permission checks, API calls, or maker/checker decisions.
- Select/date/autocomplete controls not required by the proven next cohort.
- Raw MUI component exports, `sx`, arbitrary slot injection, or federation delivery.

## Decisions

### Controlled NumberField with raw numeric semantics

NumberField accepts `number | null`, returns `number | null`, and exposes native min/max/step constraints. Display/currency formatting stays application-owned because locale/domain rounding rules vary. Invalid transient text returns null while browser/MUI validity and supplied error/help copy remain visible.

Alternative: embed currency formatting. Rejected because it would conflate a generic control with financial domain policy.

### Dialog is composition; ConfirmationDialog is policy-shaped interaction

Dialog provides title, optional description, content, bounded action content, close behavior, width, and `dismissible`. ConfirmationDialog composes it with confirm/cancel buttons, default/danger tone, and `loading`. Applications own the async operation and decide when to close.

### InlineAlert, not a global notification singleton

InlineAlert provides persistent local feedback with semantic tones and one optional labeled action. Host notification capability remains a separate cross-boundary concern. A future toast system needs lifecycle/queue/accessibility decisions and is not smuggled into this change.

### Additive minor release

Existing exports and behavior remain unchanged; new exports are additive, so the package advances from 1.0.0 to 1.1.0. Protocol versions do not change.

## Risks / Trade-offs

- [MUI dialog portal escapes the provider DOM node] → MUI ThemeProvider context still crosses portals; semantic component styling uses theme/token values and browser tests verify both schemes.
- [Focus restoration differs across hosts] → Rely on tested MUI modal focus trap/restore and prohibit nested host-owned overlay services in this package.
- [Number parsing surprises financial users] → Keep numeric semantics explicit and leave precision/currency transformation to domain code.
- [Confirmation is mistaken for authorization] → Document and test it as presentation only; application policy must decide whether an action is offered/enabled.

## Migration Plan

1. Add failing behavior/accessibility/public-export tests.
2. Implement components and semantic styling as an additive 1.1.0 API.
3. Update Storybook, demo, README, changelog, architecture/rules, and packed consumer.
4. Run package and production-pilot regression gates.
5. In a later change, consume these primitives in Authorization Limits only after service/entitlement ports are specified.

Rollback is reverting the additive package minor; no application consumes the new exports in this change.

## Open Questions

- Should a future toast/notification system be host capability-backed or application-local?
- Which precision/rounding package will own financial decimal input beyond safe JavaScript integers?
- Which Select/Autocomplete semantics are required by the next proven cohort?

