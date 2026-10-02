# Base UI console and appearance contract

The shared-UI migration must preserve the existing login and workspace behavior,
styles, dimensions, theme selection, and accessible controls while removing
Base-owned React and Emotion errors.

- Empty login credentials remain controlled inputs. Typing retains the same
  values, trimming, key handlers, and submit behavior.
- Workspace tabs retain MUI tab roles, focus, selection, names, and styling.
  Refresh/delete buttons are independent controls; deleting a tab does not select
  it first. Decorative tab slots do not leak MUI-only props into the DOM.
- `TabPanel` still accepts `tabId`; it does not expose that internal prop as an
  invalid DOM attribute. Its visibility and lazy-loading lifecycle remain intact.
- Workspace height rules still apply only to the first direct content root when
  that root is a section or div. Emotion-injected style nodes do not count as
  content. Later roots retain their existing height.
- The disabled tile title retains `white-space: nowrap` through Emotion's
  supported `whiteSpace` style key.
- Vite serves the existing SC WebKit font files from the sibling local package,
  preserving its default workspace file access. Parity runners can set
  `BASE_UI_PARITY_CACHE_DIR` to isolate concurrent dependency optimization caches;
  ordinary development retains Vite's default cache directory.

Focused regression coverage lives in the Login tests,
`Home/console-contract.test.tsx`, and `Home/common/style.test.tsx`. The Base visual
parity suites compare login, home, drawer, and profile states across legacy/WebKit
themes, old/new layouts, and responsive viewports with zero changed pixels.

Full Ratan and Cashflow feature-UI migration is deferred to the shared backlog.
Their existing feature-specific console errors remain separate release evidence
and must not be hidden by the strict browser gate.
