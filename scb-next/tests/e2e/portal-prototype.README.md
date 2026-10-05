# Portal prototype reference harness

This suite keeps the supplied design references separate from the historical
`base-ui-*` migration snapshots. Start the existing SCB Next Base dev server at
port 8001, then run from `scb-next`:

```bash
npx playwright test --config tests/e2e/portal-prototype.playwright.config.ts --grep 'fixture smoke'
PORTAL_PROTOTYPE_CAPTURE=1 npx playwright test --config tests/e2e/portal-prototype.playwright.config.ts
PORTAL_PROTOTYPE_COMPARE=1 npx playwright test --config tests/e2e/portal-prototype.playwright.config.ts --grep 'Frame 04'
```

The smoke test proves that current login controllers receive deterministic
identity, four functional roles, nested subjects/actions, and populated tile
categories. Capture mode attaches the full current page, the owned Base region,
the supplied reference, its corresponding crop, and source SHA-256 metadata to
each native-frame test. It makes no fidelity assertion before that surface has
been implemented. Comparison mode is a deliberate acceptance gate for completed
surfaces; each expected image is generated from the supplied PNG, written under
the system temporary directory, and compared with zero differing pixels.
`--update-snapshots` must never promote implementation captures into reference
images. The dedicated config disables snapshot updates.

## Reference and data contract

- All 14 source frames are mapped in `tests/fixtures/portal-prototype.ts`. The
  1512 × 982 native viewport, device scale 1, `en-US` locale, and
  `Asia/Singapore` timezone remain fixed. Frame 04 is dark despite its filename.
- Requests use the existing serialized `userInfo.oud`, `entities`, `drawers`,
  and authorization-header API contracts. Tests intercept HTTP responses and
  existing photo endpoints; they do not replace source modules or controller
  behavior. Stored fixtures contain preferences/workspaces, never a preloaded
  authenticated user or token.
- The supplied header says 06:45 UTC, while supplied profile text expires at
  01:23 on the same day. These reference values cannot describe one valid live
  session. Shell captures fix the clock at 06:45 with next-day expiry. Profile
  captures fix it at 01:06 with the reference 01:23 expiry; their owned crops
  exclude the header clock.
- The fixture portrait is a 118 × 120 source crop. It belongs to tests only;
  production keeps the real photo/fallback policy. The stress preset adds a
  separate data-entitlement role, long identity/email and ten workspaces.
- Location choices are separate candidate presentation metadata. They are not
  sent as `Tile.entity` values or invented launch parameters. Stage 7 must
  define the actual location launch contract before asserting that behavior.

## Scope and remaining acceptance work

Native clips include only Base-owned login, header, empty workspace, avatar
menu, profile or drawer. Tenant Cashflow and Flowzero contents are excluded;
workspace fixture labels resemble the prototypes while their content remains
empty. Profile/menu rounded-corner pixels can reveal tenant content underneath
in the supplied references. Inspect full-page evidence and document any narrow
boundary mask before accepting a strict comparison; do not hide differences
with a larger global tolerance.

The standalone host supplies its actual Root/Base version strings. Version text
is dynamic production data and may differ from the source references; a future
test fixture metadata seam or explicitly scoped text mask is needed before
claiming an exact avatar-footer comparison. This harness does not rewrite
`package.json` or intercept JavaScript modules to fabricate those versions.

Responsive evidence covers 390, 768, 1280, short-height and 1920 pixel widths in
both themes, with long data and reduced-motion preference. These adaptations
have no supplied visual counterpart. They are review evidence, not proof that
all controls are reachable, focus is preserved, layouts never overflow, or
necessary transitions work. Add surface-specific behavior and geometry gates
as each implementation stage lands. Login's dark adaptation also requires the
explicit unauthenticated appearance contract from Stage 2/3.
