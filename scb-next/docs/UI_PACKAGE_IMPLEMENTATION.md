# ratan-design-origin implementation contract

## Accepted interfaces

The extraction plan defines the test surfaces: existing Base component exports,
existing consumer compatibility exports, and standalone package imports. Existing
business screens must compile without import, prop, or callback changes.

## Requirements

1. Base and ratan-design-origin use Material/icons 5.18.0 and React 18. Existing
   consumer dependency declarations remain unchanged. Base uses Data Grid 6.20.4
   and date pickers 6.20.2, matching the installed legacy consumer matrix.
2. Preserve token aliases, legacy/newStyles defaults, both theme modes, and
   existing application state. Do not revert unrelated post-upgrade fixes.
3. The standalone package owns reusable controls and explicit theme/token entry
   points. It cannot import Base source, mount an application, fetch services,
   or require a portal store. React/MUI/Emotion are external peers.
4. Existing Base exports delegate to the package; consumer compatibility exports
   retain their existing contracts, including differing loading/dialog defaults.
5. Package installation from a tarball works without sibling source checkouts.
   Core imports exclude date/grid/Pro code and custom-element registration.
6. Verify labels, input changes, disabled/loading behavior, selector callbacks,
   theme output, and existing exports through the public interfaces. Use current
   UI as the visual baseline; do not silently redesign while extracting.

## Baseline before implementation

- Base typecheck: passes.
- Base tests: 341 pass, 2 fail (123 files). The two existing root-store fixture
  expectations omit newStyles; captured in /tmp/ratan-design-base-baseline-test.log.
- GitNexus FTS repair succeeded; full index rebuild is in progress before edits
  to existing symbols.

## Stage 1: restore Base to MUI 5

Implemented against target HEAD `ee17144e`. History reference `54319977`
predates the MUI-specific upgrades in `d0db574c`, `77359ffa`, and `a8c181bb`.
Only MUI-specific API adaptations were restored. Modern tooling, token
support, React 18, and the existing `newStyles=false` default remain intact.

### Dependency matrix

| Base dependency | Pinned version |
| --- | --- |
| Material and icons | 5.18.0 |
| Data Grid | 6.20.4 |
| Date pickers and Pro range pickers | 6.20.2 |

These versions match the installed legacy consumers. Ratan/Cashflow manifests,
business screens, imports, federation sharing, and appearance defaults are
unchanged. Their UI libraries remain application-local.

### Compatibility work

- Restore MUI 5 Grid `item`/`xs`, Dialog paper props, and Switch input props.
- Restore X 6 picker types and labels, single-input Pro ranges, and row-parameter
  value getters in the admin/detail flow and its fixtures.
- Accept original Input props and translate the current Base slot spelling,
  preserving label overrides, disabled state, helper descriptions, and refs.
- Correct existing store expectations to include `newStyles: false`.
- Complete the development login fixture with its missing `auth_time` claim.
  The browser regression originally crashed Profile with `Invalid time value`;
  the complete fixture renders the profile without changing production auth.

### Change-scope evidence

GitNexus FTS repair and full index rebuild completed before symbol edits.
Input, Dialog/DialogTitle, detail controller, and changed fixture impacts were
LOW with no indexed processes. InputStyled has two direct source-file
dependents (Input and Select), twelve total dependents, and no indexed process.
Direct source inspection shows broader UI use than the JSX call graph reports;
the full Base suite and integrated flows cover that limitation.

### Verification record (2026-09-17)

- Base strict typecheck passes.
- Base unit suite: 125 files, 353 tests pass. Coverage: 96.97% lines,
  93.33% branches.
- Base production build and Storybook build pass.
- Ratan and Cashflow production builds pass without consumer source changes.
- Root architecture/mock/deployment tests: 6 files, 60 tests pass.
- Dependency-isolation verification passes for Base, Ratan, and Cashflow on
  workspace-local MUI 5.
- Focused Input compatibility lint and `git diff --check` pass.
- Focused browser suite: 4 tests pass. Both style generations retain dark/light
  theme switching and 800x600 profile dialog maximize/restore/close controls.
- Integrated browser suite: 8 tests pass, 1 production-edge-only test skipped.
  Covers login, New Tile, Cashflow rendering across both federation boundaries,
  Alpha investigation, workspace deletion, and the MUI compatibility scenarios.

### Remaining limitations

- Full Base lint retains unrelated legacy debt: 8 errors and 138 warnings.
- Root workspace typecheck fails in Ratan because its `emitDeclarationOnly`
  configuration conflicts with the existing `tsc --noEmit` command. Base,
  Alpha, and the service typechecks pass.
- Narrow (390x844) login screenshots retain the existing fixed-column clipping.
  The login style source is unchanged; this restoration does not claim mobile
  responsiveness or introduce a redesign.
- Development console contains existing CSS/React warnings. Browser page-error
  assertions do not imply a warning-free console.
- Production-edge acceptance and clean corporate-registry installation were
  not verified by this stage.

## Next stage

Stage 2 remains pending: standalone package foundation, explicit theme/token
inputs, extracted Button/LoadingButton/Input/Select, and clean tarball consumer
proof. Stage 1 establishes the compatible MUI prerequisite, not completion of
the standalone-library migration.
