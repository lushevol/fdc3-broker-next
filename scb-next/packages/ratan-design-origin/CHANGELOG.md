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
- Base and Ratan/Cashflow adoption behind their existing compatible exports,
  defaults, callbacks and selectors; portal policy remains with applications.
- Verified public interfaces, independent tarball consumption, SSR/tree shaking,
  catalog states and integrated workspace journeys. See implementation evidence.
- Internal candidate only. Publication owners, registry and asset/Pro licensing
  decisions remain external release gates.
