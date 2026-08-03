# @fm/portal-host — Rules

Status: current for the WebKit-based host. Last reviewed 3 August 2026.

## Ratan-first UI

- All basic user-interface components must come from the public
  `@fm/ratan-design-webkit` API: buttons and links styled as actions; text, number,
  password, date, select, switch, and text-area inputs; tabs and navigation;
  cards and description lists; dialogs; alerts, toasts, progress, empty states,
  and error states.
- Do not create local replacements for those primitives and do not import Ratan
  internals. When a needed basic primitive is absent, add it to Ratan with a
  public API, accessibility tests, registration/wrapper coverage, tokens, and
  release documentation before using it here.
- Plain semantic elements remain host-owned only for page landmarks, structural
  layout, copy, and remote composition boundaries. In particular,
  `data-composition-boundary` mount elements are integration surfaces, not UI
  primitives.
- Every portal UI control must retain its native or ARIA semantics, accessible
  name, keyboard behavior, focus treatment, disabled/pending behavior, and
  feedback state through Ratan.

## Responsive layout

- Every host page and state must work without overlap, clipped critical content,
  or document-level horizontal overflow at narrow mobile and desktop widths.
- Use WebKit semantic tokens and content-driven CSS. A defensive fallback is
  permitted only inside the reusable WebKit component when a missing consumer
  token otherwise makes the component non-functional or invisible.
- Treat long application names, translated strings, remote error messages,
  compact/comfortable density, light/dark schemes, and right-to-left direction
  as normal responsive inputs.
- Verify every UI change at a narrow viewport (768px or narrower) and a desktop
  viewport. Check login, empty, loading, error, and active-workspace states
  where the change can affect them.

## Ownership

- The host owns registry loading, routing, workspace lifecycle, capabilities,
  appearance persistence, and remote failure containment.
- WebKit owns reusable presentation and interaction behavior. Remote
  applications own their domain content and their local WebKit scope when
  running standalone.
- Keep direct federation mounts isolated; the host must not reach into a remote
  React tree to style or control its UI.

## Required checks

- Run portal unit tests with coverage, lint, and production build after a host
  UI change.
- Run WebKit tests, build, and lint whenever the migration adds or changes a
  public component, registration module, icon, or React wrapper.
- Build WebKit before its consumers; do not run consumer builds while WebKit's
  clean build is deleting and recreating `dist`.
- Complete the browser smoke flow for the affected portal state and record any
  unavailable local remote as an expected failure-containment test, not as a
  passing remote integration test.
- Follow the live Chrome matrix in
  [`../../../docs/VERIFICATION.md`](../../../docs/VERIFICATION.md), including
  screenshots for every affected page and dialog.
