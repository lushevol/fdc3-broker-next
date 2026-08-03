# Portal Host Ratan WebKit migration

Status: implemented and live-browser verified on 3 August 2026. See the
Realworld [current-state record](../../../docs/CURRENT_STATE.md).

## Principle

All reusable Portal Host controls come from the public
`@fm/ratan-design-webkit` API. Host code may compose semantic landmarks,
responsive layout, authentication state, registry state, and remote mount
boundaries, but it must not create local visual or interactive replacements for
WebKit primitives.

## Public boundary

Portal Host imports React adapters from its local `src/webkit.ts` boundary.
Those adapters are created by `@fm/ratan-design-webkit/react` and wrap the
catalog's registered `sc-*` elements. Component implementation remains under
the WebKit package's `src/components` directory.

The host does not:

- import `@fm/ratan-design`;
- import WebKit internals directly;
- install or bootstrap a scoped-custom-element-registry polyfill;
- define local React component implementations for WebKit primitives;
- runtime-share the design system through Module Federation.

## Current ownership

WebKit owns:

- buttons, icon buttons, links, fields, labels, search, toggles, and progress;
- dialogs, modal overlays, dismissal controls, alerts, badges, and feedback;
- avatars, icons, cards, tabs, tab panels, and close interactions;
- the generated close, notification, edit, trash, and person icon assets;
- accessible interaction semantics and nested Shoelace registration.

Portal Host owns:

- login, registry, workspace, authentication, identity, appearance, and route
  state;
- page landmarks and responsive structural layout;
- the application picker's content and filtering;
- remote mount containers and `data-composition-boundary` attributes;
- capability injection and remote failure containment.

## Implemented behavior

1. The login screen uses WebKit fields, tabs, buttons, and separators.
2. The shell header shows Markets Operations One, New tile, theme,
   notifications, and a visible initials avatar.
3. New tile opens a centered WebKit dialog portalled to `document.body`, so the
   overlay is not clipped by the workspace or a remote mount.
4. Applications render in closable WebKit tabs. The generated close icon has a
   working pointer hit target and removes the active instance.
5. Registry loading and contained failures use WebKit spinner, alert, and
   button components.
6. Active remotes consume the same package boundary independently and do not
   depend on a component remote.

## Native registration model

The package uses the browser's global custom-element registry. Every element
registration is guarded so repeated imports from separately built remotes are
safe. The React wrapper registers nested Shoelace definitions required by
WebKit components. No application bootstrap imports
`@webcomponents/scoped-custom-element-registry`.

This model replaced the earlier scoped-registry plan after live Chrome exposed
illegal-constructor failures, zero-size icon buttons, blank avatars, and dialogs
whose nested elements did not upgrade.

## Acceptance evidence

The latest verification passed:

- WebKit: 10 tests, production build, and lint with four existing `any`
  warnings;
- Portal Host: 46 tests, production build, and lint;
- Cashflow: 84 tests, production build, and lint;
- FDC3 Admin: 6 tests, production build, and lint;
- Identity/Profile: 6 tests, production build, and lint;
- GitNexus change detection: low risk and no affected indexed execution flow.

Live Chrome screenshots and interactions covered login, host header, picker,
Cashflow pages, Identity/Profile, all FDC3 catalogs, create/edit/delete dialogs,
theme toggle, icons, avatars, and workspace-tab removal.

## Change rules

- Prefer an existing component from WebKit's component folders.
- Change WebKit only when the existing component or wrapper does not function.
- Add a new reusable component under `src/components`; do not add a root-level
  substitute.
- Add component registration and React-wrapper coverage with every new public
  element.
- Run WebKit's clean build before consumer builds, not concurrently with them.
- Complete the Realworld [live Chrome checklist](../../../docs/VERIFICATION.md)
  after UI changes.
