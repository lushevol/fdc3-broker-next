# POC consolidation into realworld

The POC was frozen on 2026-07-27 at commit `8d162420204f9fde6a0d74be209c41425cf4b357`. It remains read-only evidence and is not a dependency or source-copy target.

## Last-day POC evidence and realworld disposition

| POC evidence | Realworld disposition | Status |
| --- | --- | --- |
| Direct host-to-remote Module Federation loading | `portal-host` loads manifest-addressed application modules directly | Complete |
| Registry-directed remote release URL without rebuilding the host | Runtime registry plus production release-swap acceptance | In progress |
| Multiple independent tile instances, activation, and previous-tab selection on close | Instance-based realworld workspace state | In progress |
| Host-owned capabilities and instance-attributed telemetry | Typed platform contracts and SDK | Complete; expand per-instance verification |
| Remote failure containment/retry | `RemoteApplication` and hosted browser coverage | Complete |
| React 19/Vite Host proof | React 19/Vite portal host with React 18 Cashflow mounted through an independent root | Complete |
| Web Component/Shadow Root application isolation and asset adoption | CSS isolation investigation, including CSS Modules/CSS-in-JS/Tailwind sample tiles | Deferred to backlog |
| OpenFin/browser adapter parity | Typed FDC3 capability with production adapter verification | Planned |
| POC Cashflow/Positions composition | Realworld Cashflow plus lower-priority Data Lab/TanStack migration | In progress |

## Migration rules

1. Realworld keeps production package identities and must never import `*-poc` artifacts.
2. Every port receives realworld unit, package-boundary, and hosted-browser coverage.
3. The React 19 portal and React 18 Cashflow use an imperative mount/unmount boundary, so no React element or context crosses major versions. This does not imply a shared singleton.
4. CSS isolation is explicitly deferred. Evaluate Shadow Root/custom-element adoption only with remote CSS, overlays, focus semantics, and unmount lifecycle coverage; do not treat the current compatibility root as a CSS-isolation solution.
