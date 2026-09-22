# Alpha Payments direct-adoption pilot

Date: 2026-09-22. Tracker: RD-027.

## Scope and acceptance criteria

Alpha Payments duplicated five presentation concerns that already have public
`ratan-design-origin` contracts: search and status inputs, asynchronous row
actions, initial loading, load failure/retry and empty results. The pilot adopts
`SearchInput`, `Select`, `LoadingButton`, `Button`, `Loader`, `ErrorFallback` and
`EmptyState`, plus `RatanDesignProvider` and the explicit package stylesheet.

The Alpha-owned case model, API requests, filtering rules, summary calculations,
table markup, routing and workspace lifecycle remain unchanged. Acceptance is:

- Base passes `{ mode, designGeneration }`; standalone Alpha falls back to
  light/legacy and every overlay remains inside Alpha's provider scope.
- Search keeps the `Search cases` name and clear behavior; status keeps the
  `Filter by status` name; acknowledgement exposes disabled/`aria-busy` saving
  state; loading, error/retry and empty states remain named and operable.
- Alpha's local table chrome resolves shared WebKit semantic variables first and
  existing legacy host variables second. Dark/legacy is verified in the live
  Base journey and light/legacy plus dark/WebKit are covered by provider tests.
- Alpha declares every required package peer and resolves host/package imports to
  one physical instance under its Vite policy. Optional date and Pro peers are
  not added.

## Measurement

`npm run measure:alpha-adoption` records emitted JS/CSS bytes from Alpha's latest
production build and three cold 1280x720 Chromium contexts against the local Base
host. Each context logs in, opens Payment Investigation and filters for Northstar.
The sample is directional development-host evidence, not a production service
SLA. Browser cache is cold per context and all samples completed with zero page
errors.

| Metric | Before | Pilot | Delta |
| --- | ---: | ---: | ---: |
| JS/CSS files | 18 | 18 | 0 |
| Raw JS/CSS | 255,342 B | 666,084 B | +410,742 B (+160.9%) |
| Gzip JS/CSS | 82,962 B | 174,359 B | +91,397 B (+110.2%) |
| Brotli JS/CSS | 73,341 B | 146,325 B | +72,984 B (+99.5%) |
| Cold tile p95 (3 runs) | 567.0 ms | 1,064.1 ms | +497.1 ms (+87.7%) |
| Search filter p95 (3 runs) | 5.6 ms | 23.2 ms | +17.6 ms |

The UI consistency and accessibility benefit justifies retaining Alpha as the one
bounded canary, but the first-load regression does **not** justify copying this
adoption mechanically into more remotes. Further rollout is paused until a
separate, reversible experiment can bring cold-tile p95 to no more than 25% above
the pre-adoption sample without weakening peer isolation. RD-030 explicitly does
not authorize MUI/Emotion federation sharing, so that architecture is not changed
by this pilot. The development shell consequently reports that Emotion is loaded
by more than one independently bundled MFE. Each Alpha/package import still
resolves to one local instance, but removing the cross-MFE advisory is part of the
same future architecture decision, not a reason to weaken this stage's peer gate.

## Verification, rollout and rollback

The stage passes Alpha typecheck, production build and six covered interaction
tests; Base typecheck/build and its nine-test Container suite; the dependency
fixture suite and live four-host resolution check; and the existing login → New
Tile → Payment Investigation → search → acknowledge → add workspace → delete tile
journey at `http://127.0.0.1:8001` in dark/legacy at 1280x720.

Rollout remains local-source only while RD-028 is blocked. Do not publish the
private package or promote direct adoption to another remote. To roll back, revert
the RD-027 stage commit: Alpha returns to its native controls and local feedback
styles, Base stops passing Alpha appearance, and Alpha's added package/peer
dependencies and resolver entries are removed. No data, route, API or persisted
state migration is involved.
