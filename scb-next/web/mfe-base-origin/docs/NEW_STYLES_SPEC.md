# Portal prototype appearance specification

## Scope and compatibility

The new appearance recreates the reference frames in `new-styles-prototypes` for Base-owned Portal surfaces. It retains production authentication, entitlements, analytics, workspace persistence, cached remote layouts, and tile-launch contracts. Tenant content remains owned by its tenant.

Appearance selection is a single decision shared by standalone and embedded Base:

| Base `newStyles` prop/store | `new-layout` query | Appearance              |
| --------------------------- | ------------------ | ----------------------- |
| false or omitted            | absent/false       | Legacy                  |
| false or omitted            | true               | Retained layout preview |
| true                        | any                | Prototype               |

The standalone bootstrap maps `new-styles=true` to the same Base prop. Prototype selection takes precedence over the legacy layout-preview query. Public remote token exports and legacy aliases stay compatible. Default appearance remains legacy until rollout is explicitly enabled.

## Global principles

- Layouts adapt to width, height, zoom, and long content. No overlapping or unreachable controls; scrolling is contained in the appropriate region.
- All surfaces support light and dark modes. Match supplied references; record theme adaptations where references are absent, including dark login and light empty workspace.
- Preserve necessary interactions and purposeful motion. Drawer/dialog transitions, selection feedback, hover/focus/pressed states, and entitlement expansion remain usable with keyboard and reduced-motion preferences. Motion cannot postpone dispatching user actions.
- Use shared components/icons/tokens; define Base branding and measured layout values as tokens. Production strings/data remain dynamic.

## Observable requirements

### Shell and workspace

- The prototype shell uses the MO1 logo and navy branded background in both modes. At the 1512 × 982 reference viewport its content boundary is 94px from the top.
- Keep New Tile, theme, UTC/local time, avatar, workspace add/rename/close/refresh/focus behavior. The workspace add button remains available in the new appearance.
- Tabs occupy a contained scrolling row; controls remain reachable on narrow screens. Remote workspace height derives from the actual shell height.
- Empty workspace opens the existing tile drawer through Find Tile and retains its analytics/loading behavior.

### Login

- Match Frame 11's light layout, logo, patterned hero, labels, inputs, Sign In, divider and SSO action. Provide the same composition with dark semantic tokens.
- Preserve SSO-only defaults, normal-login flag, normalization, password whitespace, Enter submission, loading/errors, and existing continuation URLs.
- Unauthenticated appearance uses an explicit mode without overwriting the saved authenticated workspace preference.

### Avatar and profile

- Avatar menu retains identity/profile, logout and version sections, with the reference pointer, dimensions, and theme surfaces.
- Profile retains real metadata/session values, photo/fallback policy, functional/data entitlement grouping, and role/subject/action expansion.
- Match collapsed, role-expanded and subject-expanded references. Keep identity/banner stable while the hierarchy scrolls; close/Escape returns focus to the initiating control.
- Optional metadata and long data must fit without hiding required entitlements.

### Drawer and tile launch

- Match the reference panel/header/patterned body and three-column desktop cards; adapt column count to available width.
- Header close, Escape and New Tile toggle close the drawer. Plus/card activation preserves the current entitled launch.
- Location pills are optional explicit launch actions, with defined parameters. Entitlement entity names cannot be repurposed as locations.

## Acceptance and test seams

Test appearance selection through the resolver and props-only Base composition; test user behavior through visible login, shell/workspace, avatar/profile and drawer controls; mock only external API, clock, photo and remote boundaries. Prototype fixtures use fixed time, identities, entitlements and categories. Reference comparisons use native 1512 × 982 crops and real editable UI. Legacy migration snapshots stay separate.

Verify dark/light, 390/768/1280px widths, short heights, long content, focus return and reduced motion. Complete the required localhost:8001 login → New Tile → launch → remove-tab journey after UI changes. Each completed stage passes relevant type/lint/build/coverage and visual gates before an isolated commit.
