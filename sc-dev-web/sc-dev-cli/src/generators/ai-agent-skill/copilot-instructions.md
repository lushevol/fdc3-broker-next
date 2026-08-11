# Repository Enforcement Rules (For UI Code Generation)

These rules are blocking rules for all Copilot code generation in this repository.

## 1) Required Skill Order (UI tasks)

For any Service Bench UI task, the agent must follow this order before writing code:
1. Load .github/skills/sc-webkit-components/SKILL.md
2. Load .github/skills/sc-webkit-live/SKILL.md
3. Load feature-specific skills only after 1 and 2

If step 1 or 2 is skipped, do not produce code.

## 2) WebKit-First Is Mandatory

Do not use native interactive HTML tags when an sc-* equivalent exists.
Forbidden by default when equivalent exists:
- button
- input
- textarea
- select

## 2.1) WebKit Imports Are Global

`@scdevkit/webkit` components are globally loaded by `service-bench.html` in this repository.

Mandatory rules:
- Do not add `import '@scdevkit/webkit/elements'` in `.ts` component files.
- Do not add `import '@scdevkit/webkit/elements/<component>.js'` in `.ts` component files.
- Do not add equivalent side-effect imports from `@scdevkit/webkit-ext`, `@scdevkit/webkit-datavis`, `@scdevkit/data`, `@scdevkit/docviewer`, `@scdevkit/form`, or `@scdevkit/service-bench-core` component bundles in `.ts` component files when they are already loaded by `service-bench.html`.

Use the globally registered custom elements directly in templates unless a task explicitly requires changing the outer HTML bootstrap.

Allowed only with explicit API-gap justification in final report.

## 3) CustomEvent Prefix Policy (Mandatory)

All newly introduced CustomEvents must start with plugin prefix derived from project context.

Derivation order:
1. manifests/routes.json route component prefix (for example sb-demo-test from sb-demo-test-home)
2. package.json name suffix (for example sb-demo-test from @sc-sb-project/sb-demo-test)

Event naming format:
- <pluginId>:<event-name>

Examples:
- sb-demo-test-api-select
- sb-demo-test-field-toggle

Unprefixed event names are not allowed in new code.

## 3.1) CustomElement Tag Prefix Policy (Mandatory)

All newly introduced `customElements.define(tagName, ...)` tag names must start with the derived pluginId prefix.

Derivation order:
1. manifests/routes.json route component prefix (for example sb-demo-test from sb-demo-test-home)
2. package.json name suffix (for example sb-demo-test from @sc-sb-project/sb-demo-test)

Tag naming format:
- <pluginId>-<element-name>

Examples:
- sb-demo-test-report-manifest-plugin
- sb-demo-test-filter-selector

Disallowed examples:
- report-manifest-plugin
- filter-selector

Notes:
- Route entry component tags must follow `manifests/routes.json` exactly.
- Internal child components must still follow the pluginId prefix rule.

## 4) Mandatory Pre-Delivery Self-Check

Before final response, include all items below:
1. WebKit components used: list all sc-* components
2. Native fallbacks used: list and reason, or none
3. CustomEvents introduced: full list and prefix check
4. CustomElements introduced: full list and prefix check
5. Requirement mapping: each requirement mapped to components/events

If any item is missing, task is not complete.

## 5) Failure Policy

Any violation of sections 1-4 requires rework before delivery.
