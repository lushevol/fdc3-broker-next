## Context

The POC now isolated under `mvp/two-layer-federation/poc` proved the desired runtime and appearance boundary, but its `*-poc` packages are private evidence and intentionally cannot become production identities. The repository originally contained `packages/ratan-design`, an unconsumed `0.0.2` Ant/Emotion experiment with component-local literal tokens and no provider or runtime compatibility contract. Repository-wide search found no imports in the four legacy applications, making a controlled major reset and later relocation to `mvp/two-layer-federation/realworld/packages/ratan-design` safer than preserving an accidental API.

The long-term platform has two runtime layers: a new host/base platform directly loads independently deployed applications. `mfe-ratan-container` is not a layer. Shared Ratan logic and UI are packages. The production foundation must therefore work in separate React roots, standalone application development, rolling application releases, and future isolation boundaries without a shared React context or design remote.

## Goals / Non-Goals

**Goals:**

- Establish `@fm/ratan-design@1.0.0` as the production, domain-neutral foundation.
- Establish production platform contract/SDK packages with independently versioned application and appearance protocols.
- Preserve POC-proven MUI/Emotion, scoped semantic CSS-variable, local-provider, and external-store patterns.
- Publish only bounded APIs and mechanically prevent Ant, AG Grid, federation, or domain dependencies from entering the foundation.
- Provide deterministic build, type, accessibility, coverage, and package-consumer verification.
- Define a rolling compatibility policy suitable for independently deployed applications.

**Non-Goals:**

- Migrating the new production host or any real application in this change.
- Replacing `apps/root-config` or deleting `mfe-ratan-container` yet.
- Providing dialogs, navigation, data grids, charts, or complete form composition.
- Migrating existing Ant screens or AG Grid wrappers.
- Publishing to an external registry; packages remain private workspaces until release infrastructure is approved.

## Decisions

### Major-reset the existing package under a scoped identity

Rename `ratan-design@0.0.2` to `@fm/ratan-design@1.0.0` in the existing workspace. No repository consumers exist, so preserving the experimental Ant API would create more migration debt than compatibility value. Git history and the changelog remain available.

Alternative: create a second `portal-design` package. Rejected because it leaves two plausible owners and makes governance ambiguous.

### Use one typed semantic token source with generated CSS

Author production token values in TypeScript using semantic roles. Generate the scoped CSS artifact deterministically during build/test, and check it into `src/generated` so consumers, Storybook, and static analysis share the same artifact. Token keys become an independently versioned appearance contract; MUI theme values are adapters, not the source of truth.

Alternative: hand-maintain TypeScript and CSS in parallel. Rejected because drift is inevitable and difficult to validate.

### Expose bounded components instead of MUI

The public root exports provider/types, token metadata, Button, TextField, and StatusBadge. It does not export MUI, theme internals, arbitrary `sx`, or product/domain types. MUI and Emotion are peer dependencies and consumer dependencies; the library build externalizes them.

Alternative: re-export MUI with a configured theme. Rejected because consumers could bypass semantic APIs and bind to implementation details.

### Separate runtime protocol from package version

Create `@fm/platform-contracts` and `@fm/platform-sdk`. The application contract and appearance contract have distinct version constants. Registries and remote manifests declare both. Compatibility compares supported major versions, validates full snapshots with Zod, and reports typed failure codes. The design package version is diagnostic and build-time only.

Alternative: require the same design package version in host and every application. Rejected because it forces atomic deployment and prevents safe rolling upgrades.

### Support a one-major rolling window with explicit adapters

Version 1 hosts support appearance contract major 1. Future hosts may support the current and immediately previous major only when an explicit adapter and contract test exist. Unknown majors fail before application rendering. Minor additions must be optional/defaultable; semantic changes require a major.

### Keep the foundation free of runtime composition concerns

Static dependency tests and package manifest tests prohibit Module Federation, Single-SPA, SystemJS, import-map loaders, AG Grid, Ant Design, and Ratan domain packages in the design foundation and platform protocol packages. Only applications configure federation.

### Verify the packed artifact as a consumer

In addition to unit coverage, build and pack each production package, install the tarball into a temporary TypeScript/React consumer, and verify public imports and CSS resolution. This catches source-alias success with broken published exports.

## Risks / Trade-offs

- [Major reset removes experimental Button/Card/Input APIs] → No consumers exist; record the break and retain migration examples in the changelog.
- [MUI/Emotion increases consumer bundles] → Bundle into each deployable for deterministic independence; measure during the host/application pilot before optimization.
- [Checked-in generated CSS can become stale] → Generator test compares byte-for-byte output and CI fails on drift.
- [Scoped CSS variables do not automatically style portals rendered outside the provider root] → Provider supplies a documented overlay container strategy in the later overlay cohort; this slice contains no portal components.
- [Exact colors may change during product design review] → Semantic names and contract tests stabilize meaning; values can change in compatible minor releases when accessibility remains valid.
- [Existing root tests assume package name `ratan-design`] → Update scripts, docs, and workspace references atomically and validate the packed identity.

## Migration Plan

1. Add failing tests for package identity, dependency prohibitions, token generation, public exports, components, and focus behavior.
2. Add production platform contracts and SDK with compatibility/failure-code tests.
3. Replace the experimental implementation with the scoped MUI/Emotion foundation and generated tokens under `mvp/two-layer-federation/realworld/packages/ratan-design`.
4. Update Storybook/demo/docs/changelog to the new API and remove Ant/icon dependencies.
5. Run unit coverage, lint, type/build, dependency scans, and packed-consumer verification.
6. Commit the foundation independently. A later change pilots it in the new production host and one application.

Rollback is a commit revert because no production consumer is introduced in this slice. Existing legacy applications and the POC remain operational.

## Open Questions

- External registry and provenance/signing policy remains a DevOps decision before first non-private publication.
- The long-term overlay container API will be decided with the Dialog/Popover cohort.
- Whether product branding eventually changes the `ratan` scope is outside this migration.
