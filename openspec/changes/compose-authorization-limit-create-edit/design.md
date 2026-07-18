# Design: Dependency-injected create/edit composition

## Decisions

### Opt-in as one coherent capability

`AuthorizationLimitsMutationCapability` contains both principal and service. The component cannot receive only identity or only transport. Absence means read-only and preserves the accepted runtime. A future authenticated bootstrap constructs the capability after its own contract and adapter gates pass.

### Create from list, edit from details

An entitled create trigger appears on the list. Confirmed details expose edit when policy allows it. Pending records do not expose edit. This avoids adding an action-rendering escape hatch to the bounded grid adapter.

### Application-owned controlled form

The application owns profile, USD currency, limitation, validation, open/loading state, service calls, reconciliation, and feedback. `Dialog`, `TextField`, `NumberField`, `Button`, and `InlineAlert` own presentation/accessibility only. Profile is editable for create and locked for edit; USD is always locked; limitation is bounded from zero through 99,999,999,999.

### Reconcile only successful records

Create appends the returned record and edit replaces by `limitationId`. Errors keep the dialog open and display local categorized feedback. Loading disables both dismissal and repeated submission. No optimistic update occurs before success.

## Non-goals

- Production HTTP/authentication adapter or host identity capability.
- Delete, approve, reject, or pending-transition UI.
- Global notifications or cross-MFE mutation events.
- Changing the accepted grid package or adding raw grid actions.

## Rollback

Omit the mutation capability. All triggers and mutation state disappear while the read-only list/details path remains unchanged.
