# ratan-fdc3 — Architecture

`ratan-fdc3` is a distribution facade. It contains no broker, workspace, or
business logic.

| Public entry point                 | Internal responsibility         |
| ---------------------------------- | ------------------------------- |
| `ratan-fdc3`                       | React providers + agent API     |
| `ratan-fdc3/agent`                 | Agent API and React hooks       |
| `ratan-fdc3/app-directory`         | App-directory client            |
| `ratan-fdc3/broker`                | Broker runtime                  |
| `ratan-fdc3/finos`                 | FINOS FDC3 API                  |
| `ratan-fdc3/module-loader`         | Module-composition primitives   |
| `ratan-fdc3/openfin`               | OpenFin FDC3 adapter            |
| `ratan-fdc3/react`                 | Root/child provider composition |
| `ratan-fdc3/resolver-ui`           | Resolver and diagnostics UI     |
| `ratan-fdc3/workflow-orchestrator` | Workflow orchestration          |

The focused packages remain independently testable implementation units.
Consumers receive them transitively through one versioned distribution.

`FDC3RootProvider` creates the module loader. It discovers global SystemJS
automatically and accepts an optional Module Federation loading function.
Hosts retain runtime loading capabilities, while adapter construction, caching,
permission enforcement, lifecycle execution, and export validation stay inside
the FDC3 distribution. The provider calls the host-owned entitlement policy
with `load-module`; the package does not implement business access rules.
