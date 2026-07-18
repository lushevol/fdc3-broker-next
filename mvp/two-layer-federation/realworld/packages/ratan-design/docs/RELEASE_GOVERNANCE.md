# Release governance

## Version axes

| Version              | Purpose                                | Compatibility decision                         |
| -------------------- | -------------------------------------- | ---------------------------------------------- |
| `@fm/ratan-design`   | Build-time components and tokens       | Package manager semver                         |
| Application contract | Host/application mount API             | Host manifest validation                       |
| Appearance contract  | Snapshot and semantic runtime boundary | Host manifest validation and explicit adapters |

Different compatible design-package minors may run in host and application bundles. Package equality is not required. Unsupported protocol majors are rejected before rendering.

## Semver

- Major: removed/renamed API or token, required prop, changed semantic meaning, or peer major.
- Minor: optional component/prop/token with existing behavior preserved.
- Patch: compatible defect, accessibility, documentation, or internal implementation fix.

Every major includes migration guidance. A host may support the immediately previous protocol major only with an explicit adapter and automated compatibility suite.

## POC separation

`mvp/two-layer-federation/poc/packages/ratan-design-poc` remains private evidence. Production code does not import it, alias it, or publish it. Proven behavior was reimplemented behind production identities and gates.

## Next pilot

The production host, independent Cashflow pilot, and first read-only AG Grid cohort now consume the production package family. Version 1.1 adds interaction presentation only; typed Cashflow entitlement/service ports and behavior-tested mutations remain a later application cohort.
