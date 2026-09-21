# Changelog

## 0.1.0 - Local Release Candidate

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
- Collapsed search criteria keep the visible row interactive while clipped rows
  leave keyboard navigation; the toggle now exposes its state and controlled region.
- Base and Ratan/Cashflow adoption behind their existing compatible exports,
  defaults, callbacks and selectors; portal policy remains with applications.
- Verified public interfaces, independent tarball consumption, SSR/tree shaking,
  catalog states and integrated workspace journeys. See implementation evidence.
- Internal candidate only. Publication owners, registry and asset/Pro licensing
  decisions remain external release gates.
