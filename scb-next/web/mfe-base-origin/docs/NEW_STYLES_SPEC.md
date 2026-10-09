# Portal prototype appearance specification

## Scope and compatibility

The new appearance uses the reference frames in `new-styles-prototypes` for Base-owned Portal branding and artwork, with the compact desktop adaptation below. It retains production authentication, entitlements, analytics, workspace persistence, cached remote layouts, and tile-launch contracts. Tenant content remains owned by its tenant.

Appearance selection is a single decision shared by standalone and embedded Base:

| Base `newStyles` prop/store | `new-layout` query | Appearance              |
| --------------------------- | ------------------ | ----------------------- |
| false or omitted            | absent/false       | Legacy                  |
| false or omitted            | true               | Retained layout preview |
| true                        | any                | Prototype               |

The standalone bootstrap maps `new-styles=true` to the same Base prop. Prototype selection takes precedence over the legacy layout-preview query. Public remote token exports and legacy aliases stay compatible. Default appearance remains legacy until rollout is explicitly enabled.

## Global principles

- All new-appearance implementation, component composition and appearance
  selection live under Base `src/new-styles`. Existing public component/page
  paths are compatibility delegates; host controllers and transport contracts
  retain their existing responsibilities. Appearance defaults, URL parsing,
  theme selection and federated appearance mapping belong to this boundary.
- Supported UI controls, icons, styling APIs, theme utilities and canonical CSS
  are consumed through public `ratan-design-origin` entries. Portal composition
  remains in `new-styles`; missing reusable support is added to the package
  before use. Direct MUI/Emotion/WebKit implementation imports are prohibited.
- Layouts adapt to width, height, zoom, and long content. No overlapping or unreachable controls; scrolling is contained in the appropriate region.
- All surfaces support light and dark modes. Match supplied references; record theme adaptations where references are absent, including dark login and light empty workspace.
- Preserve necessary interactions and purposeful motion. Drawer/dialog transitions, selection feedback, hover/focus/pressed states, and entitlement expansion remain usable with keyboard and reduced-motion preferences. Motion cannot postpone dispatching user actions.
- Use shared components/icons/tokens; define Base branding and measured layout values as tokens. Production strings/data remain dynamic.

## Compact typography and density

The compact adaptation supersedes the native reference sizes for desktop login,
drawer cards, profile entitlement rows, avatar-menu geometry and
empty-workspace/avatar-menu typography
and operational controls. Reference images
remain the source for branding/artwork; they are not the geometry acceptance
baseline for these adapted surfaces.

- Construct the new theme from raw options with coherent SC Prosper Sans variants
  and font conversion. Apply responsive typography once. Preserve host AppBar,
  grid styling, custom theme fields and legacy-generation defaults.
- Use semantic roles: 14px body/regular MUI controls, 12px compact controls/captions,
  16px section headings, 20px identity titles and 32px login page headings.
  Data-dense grid headers/cells retain their 11px/12px roles with the new font.
- Small operational controls use approximately 28px height; regular controls use
  32px. Size-specific text, padding and line height must prevent unintended
  wrapping. MUI, Ant and grids consume the same semantic font/density contract.
  Ant business inputs retain their established data-dense 12px text role, with
  28px small and 32px regular control heights.
- Desktop login has a 360px form with 14px input/action text and 44px controls.
- Desktop drawer cards are 125px tall in four columns at the native viewport.
  Columns adapt to available width; mobile launch and close actions retain 44px
  touch targets.
- Profile entitlement rows are 48px tall on desktop. Long content and narrow
  screens remain contained and interactive; collapsed height follows its content.
- Empty workspace uses a 20px/26px heading and 14px/20px description/action text
  on desktop and mobile. Its illustration and 48px Find Tile target retain their
  existing geometry.
- Avatar dropdown uses 14px/20px identity and Logout text, with 12px/18px profile
  hint and version text. Use a 320px desktop width, clamped to the viewport with
  12px outer clearance, 16px horizontal padding and a 4px identity/hint gap.
  Identity/version sections use 12px vertical padding; Logout uses 8px.
  Identity/Logout/version sections have 72px/44px/60px
  minimum heights; long content may increase height without truncation.

## Observable requirements

### Shell and workspace

- The prototype shell uses the MO1 logo and navy branded background in both modes. At the 1512 × 982 reference viewport its content boundary is 94px from the top.
- Keep New Tile, theme, UTC/local time, avatar, workspace add/rename/close/refresh/focus behavior. The workspace add button remains available in the new appearance.
- Tabs occupy a contained scrolling row; controls remain reachable on narrow screens. Remote workspace height derives from the actual shell height.
- Empty workspace opens the existing tile drawer through Find Tile and retains its analytics/loading behavior.
- Theme/time switches keep a stable 32px by 14px track footprint and 12px thumb,
  inset 1px from both track ends. Hover and focus feedback cannot add a border,
  move the thumb or change hit areas; both checked and unchecked states remain
  stable while hovered, toggled or operated from the keyboard.

### Login

- Use Frame 11's light composition, logo, patterned hero, labels, inputs, Sign In, divider and SSO action with compact desktop geometry. Provide the same composition with dark semantic tokens.
- Preserve SSO-only defaults, normal-login flag, normalization, password whitespace, Enter submission, loading/errors, and existing continuation URLs.
- Unauthenticated appearance uses an explicit mode without overwriting the saved authenticated workspace preference.

### Avatar and profile

- Avatar menu retains identity/profile, logout and version sections, with a
  pointer aligned to the launching avatar, compact dimensions and theme surfaces.
- Profile custom banner fills the popup width with one continuous themed
  background. Title/close/portrait remain above the artwork; inherited dialog
  decoration cannot introduce blue/white patches. The overlapping upper portrait
  remains fully visible initially, including short viewports. As the short-screen
  identity scrolls, its portrait progressively clips beneath the fixed banner
  without leaving a fragment across the title area; scrolling back to the top
  restores the full overlap.
- Profile retains real metadata/session values, photo/fallback policy, functional/data entitlement grouping, and role/subject/action expansion.
- Preserve collapsed, role-expanded and subject-expanded composition with compact entitlement rows. Keep identity/banner stable while the hierarchy scrolls; close/Escape returns focus to the initiating control.
- At heights of 600px or less, keep the banner/close control fixed and scroll identity plus hierarchy together so long metadata cannot make entitlements unreachable. This is a responsive adaptation without a supplied reference.
- Optional metadata and long data must fit without hiding required entitlements.

### Drawer and tile launch

- Preserve the reference panel/header/patterned body with four-column compact desktop cards; adapt column count to available width.
- Header close, Escape and New Tile toggle close the drawer. Plus/card activation preserves the current entitled launch.
- Location pills are optional explicit launch actions, with defined parameters. Entitlement entity names cannot be repurposed as locations.

## Local development styling console

- A styling-console icon is available only in development builds served on
  localhost, 127.0.0.1 or the IPv6 loopback. Production bundles exclude the console.
- A compact **Portal style · Local** control beside the console icon switches the
  complete Portal between Legacy and WebKit on login and in the authenticated shell.
  It updates the existing `new-styles` URL flag, removes `new-layout`, preserves all
  unrelated query parameters and the hash, and updates the existing appearance
  state live so Base and federated apps use the same generation. The current
  selection survives reloads in the URL; switching retains authentication, expiry
  timestamps, theme preferences, workspaces and the selected tab. It neither
  reloads the document nor refreshes/extends the authenticated session. The
  existing layout boundary remounts remote views when generation changes; their
  transient, unsaved UI state can reset.
- The existing reducer only delegates to a `new-styles` appearance reducer. Its
  local action changes the appearance flag only and is inert outside development
  on loopback hosts. Existing actions preserve their original behavior.
- Switching generation disables any applied console preview before changing appearance;
  other preview settings remain available. This prevents preview CSS from masking
  the chosen Portal style. The console's package-generation preview stays separate
  from this complete Portal switch.
- Implementation, switching, preview themes and temporary settings remain under
  `src/new-styles`; every UI control/icon/theme API uses public
  `ratan-design-origin` entries.
- The console provides light/dark mode, WebKit/legacy package generation,
  10–20px base font size, packaged font-family presets, a six-digit primary
  color, 0–16px control radius and small/medium control size.
- Package samples preview changes immediately. Apply to Portal is initially off
  and applies settings to Base theme controls and explicit Portal semantic tokens.
  Portal layout selection remains independent of package component generation.
  Remote business grids retain their existing appearance contract and geometry.
- The editor retains stable compact sizing while its samples and Portal change.
  The drawer uses a transparent backdrop so Portal colors remain inspectable,
  scrolls within the viewport and remains operable at mobile widths.
- Settings survive reloads in a separate versioned sessionStorage entry. Invalid
  values normalize to safe defaults/bounds; unavailable storage never blocks UI.
  Reset restores defaults, disables Portal application and clears this entry.
  Turning off Portal application restores its original mode/theme and tokens.
- Preview changes do not dispatch application preferences or overwrite login,
  identity, authentication, saved workspaces or the authenticated theme preference.

## Acceptance and test seams

Test appearance selection through the resolver and props-only Base composition; test user behavior through visible login, shell/workspace, avatar/profile and drawer controls; mock only external API, clock, photo and remote boundaries. Prototype fixtures use fixed time, identities, entitlements and categories. Reference comparisons use native 1512 × 982 crops and real editable UI. Legacy migration snapshots stay separate.

Verify dark/light, 390/768/1280px widths, short heights, long content, focus return and reduced motion. Complete the required localhost:8001 login → New Tile → launch → remove-tab journey after UI changes. Each completed stage passes relevant type/lint/build/coverage and visual gates before an isolated commit.
