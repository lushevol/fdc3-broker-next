---
name: ratan-design-origin
description: Use ratan-design-origin components in React hosts, migrate existing UI through compatible adapters, or extract reusable presentation into this SCB Next package. Apply for package imports, appearance, overlays, optional date integrations, and tree shaking; retain application workflows in their owning host.
---

# Ratan Design Origin

Use the maintained SCB Next `ratan-design-origin` package as the destination.
Match the user's requested scope: component usage, consumer migration, or package
extraction. An explanation or migration plan does not require changing applications.

## Find the current contract

The package root is three directories above this skill folder. Read its
[README](../../../README.md) for the public contract matrix and direct import
table, and [package.json](../../../package.json) for actual exports, peer ranges,
and scripts. Inspect the requested component's exported declaration in `dist`
or its implementation in `src` when working in a source checkout.

A tarball installation contains `dist`, package documentation, and this skill;
it does not contain the source checkout's fixtures, stories, or monorepo docs.
Use the resources that are present. Resolve host paths from the user's workspace,
not from a developer's machine or a different worktree.

Read only the reference needed for the task:

- [Usage](references/usage.md): selecting imports, provider/theme composition,
  component contracts, dates, and CSS-only tokens.
- [Migration](references/migration.md): adopting in an existing host, preserving
  Base namespaces, and adding a reusable package component.
- [Validation](references/validation.md): consumer checks, package quality gates,
  packed consumption, and honest verification evidence.

## Keep the ownership boundary

The package owns reusable rendering, visual states, semantic tokens, and shared
control behavior. Hosts own auth, storage, routing, services, FDC3, analytics,
workspace orchestration, application state, and document/browser policy.

Use an existing public surface when it supplies the needed contract. Keep
`compatibility` and `base-compat` for migration adapters; build new standalone
usage on public components and the scoped provider. `portal-theme` is an explicit
historical host integration with document/grid policy.

## Preserve imports and appearance

Prefer direct named component paths, such as `ratan-design-origin/button`, for
new consumers that should avoid compiling unrelated package modules. Existing
root imports remain supported and eliminate unused final bundle code. The
producer library build still emits all public modules. Stylesheets are explicit
side effects; JavaScript imports do not load CSS or fonts automatically.

Pass host-selected `mode` and `designGeneration` into `RatanDesignProvider`.
Its standalone defaults are light/legacy; nested providers inherit omitted
fields. Preserve the current appearance during a transparent migration, and
switch to WebKit when that visual change is requested. Forward the resolved
appearance explicitly across independently mounted MFE roots.

## Complete the requested change

For consumer adoption, capture the old contract and verify the adapter through
the consumer's public imports. For package extraction, preserve existing root
exports, isolate optional peers, and prove direct-import dependency boundaries.
Use [validation](references/validation.md) to choose checks for the actual scope.

Report the adopted imports, preserved behavior, checks run, and remaining
failures. Follow the enclosing repository's specification, test, impact-analysis,
and commit conventions when present. Package use does not authorize publication,
deployment, peer upgrades, federation-policy changes, or unrelated host repairs.
