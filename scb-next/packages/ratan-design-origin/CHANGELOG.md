# Changelog

## 0.1.0 - Local Release Candidate

- Opt-in `tokens.css` exposes document-wide CSS variables without a React
  provider, defaulting to WebKit/light with HTML attributes for dark/legacy.

- Standalone ESM/TypeScript React 18 and MUI 5 controls with explicit scoped
  legacy/WebKit themes, semantic tokens and packaged WebKit 2.0.5 assets.
- Button/input/select, composed search layouts, Builder pattern, feedback,
  controlled Dialog, EmptyState/ErrorFallback/LoadingOverlay and Spinner.
- Closed LoadingOverlay roots release pointer hit testing immediately while exit
  transitions finish, preserving input access to the underlying interface.
- Optional dates, Pro date-range and historical portal-theme integrations.
- Pro date ranges preserve empty and partial null endpoints instead of converting
  them into invalid Dayjs values.
- Community date controls preserve MUI X uncontrolled `defaultValue` behavior
  when callers omit `value`.
- SearchInput exposes a localizable clear-action name and disables clearing for
  disabled or read-only fields across legacy and modern input prop spellings.
- Select now generates and connects stable control/label IDs for custom and native
  modes, while Label exposes its compact combobox name and honors ARIA overrides.
- LoadingButton and SearchButton retain their action names, expose button-level
  busy state and hide their decorative progress indicators from assistive technology.
- WebKit placeholders and focus rings use reviewed semantic colors; legacy outlined
  inputs and opt-in portal DataGrid headers/cells expose visible 2px keyboard focus
  indicators across light and dark modes.
- Loader and PageLoader retain their visible status affordance but stop both ring
  rotations when the browser requests reduced motion; status text now follows the
  active theme's contrast-safe secondary text color.
- LoadingOverlay uses a contrast-safe backdrop and long Snackbar messages expose
  a keyboard-focusable scroll region.
- Public contract matrix, compiling consumer examples and catalog links now record
  defaults, value/null behavior, callbacks/reasons, refs, slots, accessible names/
  IDs, style precedence and inherited MUI props. Font documentation distinguishes
  packaged WebKit assets from host-provided legacy Poppins and assigns optional
  peer, localization and MUI X Pro policy to hosts.
- Package output preserves source-module boundaries and marks side-effect-free
  styled/memo component initialization as pure. The pinned external-peer Button
  check now renders only `Button.js` at 427 bytes (21,935 before) and enforces a
  2,048-byte ceiling plus unrelated-module/marker exclusions.
- Collapsed search criteria keep the visible row interactive while clipped rows
  leave keyboard navigation; the toggle now exposes its state and controlled region.
- Base and Ratan/Cashflow adoption behind their existing compatible exports,
  defaults, callbacks and selectors; portal policy remains with applications.
- Ratan and Cashflow now share the migration-only `base-compat` presentation
  namespaces while retaining host-owned services, storage, routing and theme policy.
- Verified public interfaces, independent tarball consumption, SSR/tree shaking,
  catalog states and integrated workspace journeys. See implementation evidence.
- Repository browser gates now fail on serious/critical axe findings across every
  catalog story and the independent consumer, verify keyboard/focus/overlay/date
  behavior, and compare eight reviewed mobile/desktop legacy/WebKit light/dark
  screenshots. Baseline updates require a separate explicit command and review.
- Dependency verification now enforces the package's full React/MUI/Emotion peer
  ranges, host declarations and Vite-resolved core identity for Base, Ratan and
  Cashflow. Optional integrations are checked only when host-declared, with
  negative fixtures for unsupported, missing, duplicate and incompatible cases.
- Package lint now applies recommended TypeScript, React Hooks and JSX accessibility
  rules with zero warnings. A fail-fast repository command and Azure entry point
  aggregate package, dependency, browser, packed-consumer and affected host gates.
- Real Base/Ratan/Cashflow production builds now have a recorded three-run
  legacy/WebKit host baseline and enforced static, transfer, duplication, runtime
  and same-run generation-ratio budgets; the evidence does not justify changing
  provider or MUI/Emotion federation boundaries.
- Date wrappers now merge their required label and hidden styles at the rendered
  text-field slot while preserving caller slot props, keeping the established
  `hidden` contract stable across the locked MUI and DOM-testing versions.
- Internal candidate only. The package is marked private to prevent accidental
  publication; named owners, registry and asset/Pro licensing decisions remain
  external release gates.
