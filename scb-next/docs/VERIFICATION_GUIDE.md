# SCB Next verification guide

This guide is the executable release gate for the migration defined by
[MIGRATION.md](MIGRATION.md) and [MIGRATION_SPEC.md](MIGRATION_SPEC.md). Run it
from the checkout being accepted. A dated report, an earlier test count, or a
successful build from another checkout is context only and MUST NOT replace a
current command result.

The commands assume the repository is at
`/Users/lushevol/code/github/fdc3-broker-next`. Substitute the actual absolute
path when another checkout is used.

## Verification rules

1. Record the target commit, dirty-worktree state, runtime versions, registry,
   operating system, and execution date before running a gate.
2. Preserve the complete command, exit code, and unedited output for every
   applicable gate.
3. Mark a gate `pass`, `fail`, `blocked`, or `not applicable`. A blocked gate
   includes the failing command, exact error, owner, and prerequisite needed to
   unblock it.
4. Stop claiming release readiness after any required gate fails. Continue
   diagnosis only when doing so cannot overwrite acceptance evidence.
5. Run frontend verification from leaf to host: Cashflow, Ratan, then Base.
6. Treat fixture-backed browser results as frontend-composition evidence. Only
   a real-BFF run can certify production business behavior.
7. Treat [PRODUCTION_ACCEPTANCE.md](PRODUCTION_ACCEPTANCE.md) as a dated
   historical snapshot and report template, never as current evidence.

## 1. Record the candidate

```bash
cd /Users/lushevol/code/github/fdc3-broker-next
git rev-parse HEAD
git status --short
node --version
npm --version
npm config get registry
uname -a
date -u
```

Record the legacy `scb/` source revision separately when it differs from the
target repository revision. The worktree may contain unrelated user changes,
but the acceptance record must identify them and the migration commit must not
include them.

Completion criterion: the handoff identifies the legacy source SHA, target
starting SHA, candidate SHA, environment, and every pre-existing worktree
change.

## 2. Verify prerequisites and source isolation

Required tools and endpoints:

- Node.js `20.19+` or `22.12+`; Node 22 LTS is preferred for Vite 8;
- npm with access to the configured corporate registry;
- Chromium installed for Playwright;
- Docker and Compose for optional local fixture acceptance;
- Minikube and `kubectl` for the portable Kubernetes proof;
- JDK 17+, Maven, corporate Artifactory, and service credentials for real-BFF
  certification;
- development ports `8001`, `8009`, and `8015`;
- local Compose edge port `9081` and Minikube edge-forward port `9083`.

Confirm the source and target ownership roots:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next
test -d scb/web
test -d scb/services
test -d scb-next/web
test -d scb-next/services
```

`scb/` is read-only reference and rollback evidence. The active target must not
import, link, serve, or build from it.

Completion criterion: all required roots exist, prerequisites are recorded,
and no migration step has modified `scb/`.

## 3. Install and prove dependency isolation

Install from the SCB Next root. Do not create child lockfiles or flatten Base's
MUI 9 tree over the unchanged MUI 5 remote trees.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm install
npm run verify:dependency-isolation
npm ls --all
npx playwright install chromium
```

The isolation gate must prove all of the following:

- Base resolves its declared MUI 9 and MUI X 9 packages;
- Ratan resolves its declared MUI 5 packages and icons;
- Cashflow resolves its declared MUI 5 packages and icons;
- all active origins remain on compatible React 18 versions;
- the root lockfile describes the complete workspace installation;
- no invalid, extraneous, or unresolved dependency affects the active graph.

If `npm install` cannot access private packages, record the registry and exact
package error as a blocker. An existing `node_modules` tree may be used for
diagnosis, but it is not clean-install evidence.

Missing paths such as `@mui/icons-material/DeleteOutline` in Ratan or
`@mui/icons-material/CheckCircleOutline` in Cashflow indicate broken workspace
isolation. Restore the declared nested MUI 5 installation through the correct
registry. Do not upgrade Ratan, Cashflow, or React to work around it.

Completion criterion: install, isolation verification, and `npm ls --all` all
exit successfully from the candidate lockfile.

## 4. Run architecture and development-mock contract tests

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm test -- tests/architecture.test.ts --run
npm test -- tests/dev-mock-api.test.ts --run
npm test
```

At the time this guide was updated, the root suite contains 44 tests, including
deployment architecture and Minikube adapter coverage. Counts may increase.
Acceptance depends on the current discovered suite passing, not on reproducing
historical numbers.

The mock test must cover:

- normal login, token header, entitlements, and drawer entries;
- metadata and generic fallbacks;
- all four predefined metric requests;
- initial Cashflow data;
- ID search for `M0P56753524`;
- matching detail, accounting-empty, and currency-holiday responses;
- saved filter `Pending operator cashflows`;
- saved view `Cashflow operations`;
- executable SockJS JSONP open, connected, heartbeat/send behavior.

Completion criterion: focused architecture, focused mock, and complete root
suites pass from the candidate checkout.

## 5. Verify Cashflow, Ratan, and Base separately

Run tests and builds in dependency order so a leaf failure cannot be hidden by
a host result.

### Cashflow

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm exec --workspace @fm/ratan_cashflow_blotter-origin -- vitest run --reporter=dot
npm run build --workspace @fm/ratan_cashflow_blotter-origin
```

### Ratan

```bash
npm exec --workspace @fm/ratan_container-origin -- vitest run
npm run build --workspace @fm/ratan_container-origin
```

### Base

```bash
npm exec --workspace @fm/base-origin -- vitest run
npm run build --workspace @fm/base-origin
```

Run Storybook tests/builds when the changed Base surface has Storybook coverage
or a workspace script defines that gate. Then run the aggregate build gate:

```bash
npm run build
```

The workspace `npm run test:unit` command invokes Base and Ratan package scripts
with coverage enabled. That instrumentation currently exposes recorded legacy
Ant Design and hoisted-mock debt, so it is not a substitute for the functional
Vitest commands above. Run `npm run test:unit` and `npm run typecheck` when the
release policy requires those debt gates, preserve their actual results, and
never report them as passing based on a production build.

Completion criterion: each leaf-to-host test and build is independently green,
and aggregate commands do not reveal an additional integration failure.

## 6. Verify the copied BFF

The copied service is `services/single-ui-bff`. Its public HTTP, GraphQL,
authorization, and notification contracts remain unchanged.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next/services/single-ui-bff
mvn test
mvn clean package
```

Private artifacts such as the following require the corporate Maven setup:

- `com.scb.ratan:ratanone-service-spring-boot-starter:6.3.1`;
- `com.scb.ratan:ratanone-hashicorp-integrator-spring-boot-starter:6.3.1`.

An unresolved private artifact is a release blocker. It is not a skipped pass,
and the frontend fixture layer does not substitute for this gate.

Completion criterion: the BFF tests and package build pass in a provisioned
environment without route or schema drift.

## 7. Start and probe the development composition

Start all three origins:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run dev
```

Keep that process running. In another terminal:

```bash
curl -f http://127.0.0.1:8001/
curl -f http://127.0.0.1:8009/remoteEntry.js
curl -f http://127.0.0.1:8015/remoteEntry.js
```

The Base development server owns the request-aware cross-MFE mock. No backend
process is required for this development-only fixture journey.

Run Playwright against the development origins:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run test:e2e
```

Current Playwright coverage is a smoke gate, not proof of the full captured
journey. Complete the following Live Browser gate as well.

Completion criterion: all origins and remote entries respond, development
Playwright passes, and no origin silently falls back to a stale process.

## 8. Complete the development Live Browser journey

Open
`http://127.0.0.1:8001/?show_normal_login=Y&survey=no` in Live Browser at a wide
desktop viewport, approximately `2048x1152`.

Use `mock.cashflow` / `acceptance` and execute this exact journey without
reloading between steps:

1. Sign in and verify the portal header, theme, UTC control, avatar, workspace
   tabs, and `New Tile` action.
2. Select `New Tile`; verify the drawer and open `Cashflow Blotter`.
3. Verify `Quick Search`, `Custom Search/View`, grid controls, and all four
   predefined metrics render with production-consistent styling.
4. Verify the initial grid renders production-shaped records, readable values,
   selection controls, result count, borders, row/header styles, and contained
   scrolling.
5. Search for Cashflow ID `M0P56753524`; verify exactly the captured row and
   successful result state.
6. Double-click that row. Verify Cashflow Detail opens and shows the same ID,
   trade `56753524`, state `WAITING`, currency `USD`, amount `11.10`, payment
   date `2026-08-14`, and Pending Operator state.
7. Open `Accounting Detail`; verify its empty response renders as an intentional
   empty state, not an error or indefinite spinner.
8. Close the detail dialog. Open Custom Search and verify the dialog is dark,
   closable, viewport-contained, and shows `Pending operator cashflows`.
9. Open Custom View and verify the selector shows `Cashflow operations`.
10. Open View Builder and verify its name, search, role/private controls,
    Available Fields, Display View, and close action are visible and aligned.
11. Close the application using its workspace-tab delete action; verify other
    workspace state remains usable.

Inspect computed presentation and behavior throughout:

- Poppins and compact Base component defaults are present;
- MUI controls match the accepted Material UI styling and have not been reset
  by a later Emotion/MUI injection;
- Ant Design controls and portals retain the dark theme;
- `.ag-theme-alpine-dark` has readable text, stable row height, and visible
  borders;
- dialogs remain within the viewport and above the workspace;
- fonts, images, icons, CSS, remote chunks, and API calls return successfully;
- loading, empty, selected, disabled, hover, and close states are coherent;
- no content overlap or document-level horizontal overflow occurs.

Repeat the workspace, Blotter, details, and builder checks at `1024x768`.

### Console and network gate

Capture the browser console and failed-request list. In development, any
notification reconnect alert, SockJS/JSONP syntax error, uncaught exception,
failed remote/chunk request, unexpected HTTP 4xx/5xx, or blank application is a
failure. The development mock implements SockJS JSONP; these symptoms are not
accepted legacy warnings.

Apollo `addTypename`, AG Grid v32, React lifecycle, Ant Design, or Redux
serializability warnings may be inherited debt only when each exact warning is
recorded and demonstrated not to break the journey. A new warning is a failure
until classified.

Completion criterion: the uninterrupted journey passes at both viewports with
screenshots, console export, and network evidence, and with no notification or
JSONP mock error.

## 9. Inspect target independence and built artifacts

After successful builds, search source and generated artifacts for forbidden
active dependencies. Review every match rather than trusting a raw count.

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
rg -n "single-spa|single-spa-react|single-spa-layout|System\.import|importmap" web package.json package-lock.json
rg -n "(/|\.\./)scb/|fdc3-broker-next/scb/" web devops package.json package-lock.json
rg -n "single-spa|System\.import|importmap|fdc3-broker-next/scb/" web/*/dist
```

Source retained only as unreachable migration history must be identified and
proved absent from the active bundle. Inspect `remoteEntry.js` and its chunks
to verify remote public bases, a compatible React share scope, and no
host-relative remote asset URL.

Completion criterion: active source and built artifacts have no runtime/build
dependency on legacy composition or `scb/`, and every historical-only match is
documented.

## 10. Classify the deployment paths

SCB Next has three distinct deployment paths. Do not combine their evidence:

| Path                | Purpose                                   | Acceptance scope                                |
| ------------------- | ----------------------------------------- | ----------------------------------------------- |
| VM/Ansible          | current production method                 | real environment and real-BFF certification     |
| Kubernetes/Minikube | portable deployment proof                 | frontend, routing, workload controls, and mocks |
| Docker Compose      | local production-style fixture acceptance | bundled local edge and deterministic mock only  |

The Compose commands remain useful for regression diagnosis:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
npm run build:production
npm run serve:production
PLAYWRIGHT_BASE_URL=http://127.0.0.1:9081 \
PLAYWRIGHT_PRODUCTION_EDGE=1 \
npm run test:e2e
npm run stop:production
```

Completion criterion: the evidence labels this path `local fixture-backed
acceptance`; it never describes the bundled Compose image as production.

## 11. Manually verify the VM edge contract

VM/Ansible is the supported production method. Base, the three portal domain
services, retained `single-ui-bff` fallback, Ratan container, Cashflow, tenant
backends, and the platform edge are independently versioned release units.

Create a local environment file without committing it:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
test -f devops/vm/scb-next.env || \
  cp devops/vm/scb-next.env.example devops/vm/scb-next.env
# Replace every *.internal example with the approved environment address.
SCB_NEXT_VM_ENV_FILE=devops/vm/scb-next.env npm run vm:render-nginx
! rg -n '\$\{' devops/vm/rendered/scb-next.conf
```

The rendered config must contain no unresolved `${...}` value, credential,
private key, or secret. Record the independent image/artifact version, source
SHA, build ID, and digest for every unit. After Ansible stages the rendered
file and `proxy-headers.conf` in their target locations, run the estate's
approved `nginx -t` command before reload.

After Ansible deploys the candidate, run:

```bash
export SCB_NEXT_EDGE_ORIGIN="https://<approved-host>"
npm run vm:verify
curl -f -i "$SCB_NEXT_EDGE_ORIGIN/api/healthz"
curl -f -i "$SCB_NEXT_EDGE_ORIGIN/api/auth/v2/sso/validate"
curl -f -i "$SCB_NEXT_EDGE_ORIGIN/api/auth/v1/fmo/admin/importmap/active"
curl -f -i "$SCB_NEXT_EDGE_ORIGIN/api/analytics/v1/fmo/print"
curl -f -i "$SCB_NEXT_EDGE_ORIGIN/api/ratan/healthz"
curl -f -I "$SCB_NEXT_EDGE_ORIGIN/static/ratan/container/remoteEntry.js"
curl -f -I "$SCB_NEXT_EDGE_ORIGIN/static/ratan/cashflow/remoteEntry.js"
curl -f -I "$SCB_NEXT_EDGE_ORIGIN/remotes/ratan/remoteEntry.js"
curl -f -I "$SCB_NEXT_EDGE_ORIGIN/remotes/cashflow/remoteEntry.js"
```

Use approved credentials or authorization headers for protected portal probes.
Verify their expected payloads and confirm edge/upstream access logs name the
route owner: tile administration before general auth, general auth and SSO to
`portal-auth-service`, analytics to `portal-telemetry-service`, and unmatched
platform API to `single-ui-bff`. Expect HTTP 200 where the real contract does,
`Cache-Control: no-store` on each federation manifest, the approved security
headers, and no direct public address for an upstream. Use an approved
WebSocket client to verify the real notification endpoint returns 101 and
stays connected. Run the section 17 browser journey with an approved user.

Rollback rehearsal must restore only the selected failed unit by its recorded
version. If the route config fails, restore the previous rendered edge config
before reloading Nginx. Rerun health, both alias remotes, platform login, Ratan
API, WebSocket, and Cashflow checks after rollback.

Completion criterion: VM routing and browser gates pass against real services,
and independent rollback commands plus owners are recorded.

## 12. Prepare an isolated Minikube verification environment

Required commands:

```bash
docker version
minikube version
kubectl version --client
node --version
npm --version
npx playwright --version
```

The scripted equivalent records missing prerequisites early:

```bash
npm run k8s:preflight
npm run k8s:validate:local
```

When using workspace-local binaries or an isolated profile, configure every
terminal consistently before running an npm script:

```bash
cd /Users/lushevol/code/github/fdc3-broker-next/scb-next
export PATH="/tmp:$PATH" # only when minikube/kubectl are installed in /tmp
export MINIKUBE_HOME=/tmp/scb-next-minikube-home
export KUBECONFIG=/tmp/scb-next-kubeconfig
export SCB_NEXT_MINIKUBE_PROFILE=scb-next
export SCB_NEXT_KUBECTL_CONTEXT=scb-next
export SCB_NEXT_MINIKUBE_MEMORY=3500
```

Run the static gates before creating workloads:

```bash
npm test
kubectl kustomize devops/kubernetes/base > /tmp/scb-next-base.yaml
kubectl kustomize devops/kubernetes/overlays/minikube > /tmp/scb-next-minikube.yaml
find devops/vm/scripts devops/kubernetes/scripts \
  -type f -name '*.sh' -exec sh -n {} +
cd ..
openspec validate separate-vm-and-k8s-scb-next-delivery --strict
openspec validate isolate-tenant-nginx-edges --strict
openspec validate split-platform-bff-services --strict
cd scb-next
```

Completion criterion: the complete SCB Next test suite passes, both manifests
render, shell validation is silent, and OpenSpec validation is strict-green.

## 13. Build and deploy the Minikube proof

Run each lifecycle stage separately so its output and exit code are retained:

```bash
npm run k8s:minikube:start
npm run k8s:minikube:build
npm run k8s:minikube:deploy
```

For a workstation learning run, `npm run k8s:minikube:up` executes preflight,
local manifest policy, start, build, deploy, and the section 14 verification in
that order. Keep the separate commands for formal evidence. Use
`SCB_NEXT_MINIKUBE_RUN_VERIFY=false` only when pausing after deployment for
inspection.

The build must compile Cashflow, Ratan, then Base and build five images directly
inside the selected Minikube profile. Direct profile builds prevent a running
container from retaining a stale mutable `:dev` tag. Existing large-chunk or
legacy framework warnings must be recorded, but a compilation error is a
failed gate.

Inspect the result:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube get deployments,pods,services,ingress,networkpolicies,pdb -o wide
```

Expected proof inventory:

- ten Ready Deployments with zero unexpected restarts, including separate
  `scb-next-edge`, `ratan-edge`, three portal services, and retained fallback;
- thirteen Services, all type `ClusterIP`;
- one Ingress whose only application backend is `scb-next-edge`;
- seven NetworkPolicy objects and five PodDisruptionBudgets.

The constrained Minikube overlay uses one replica per Deployment. Production
availability is verified from the base manifest and must be retested on the
production substrate; one local edge replica cannot demonstrate failover.

Completion criterion: all rollouts complete and inventory matches without a
`NodePort`, `LoadBalancer`, pending pod, or crash loop.

## 14. Verify ingress, edge routes, caching, and WebSocket

Run the automated route and browser command first:

```bash
npm run k8s:minikube:verify
```

It port-forwards the platform edge to `http://127.0.0.1:9083`, checks expected
mock-service identity for auth, tile-management, telemetry, and fallback paths,
checks tenant routes through both Nginx tiers, and asserts federation cache
headers. It then scales `ratan-edge` and each portal service to zero in turn,
proves only owned paths fail, restores each Deployment, proves recovery, and
runs Playwright. Its cleanup trap restores the active Deployment's original
replica count after an interrupted run. Preserve the full output even when the
browser portion fails.

For manual edge probes, keep this running in terminal A:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube port-forward service/scb-next-edge 9084:8080
```

Run in terminal B:

```bash
curl -f -i http://127.0.0.1:9084/healthz
curl -f -i http://127.0.0.1:9084/
curl -f -i http://127.0.0.1:9084/api/healthz
curl -f -D - -o /dev/null http://127.0.0.1:9084/api/auth/v2/sso/validate
curl -f -D - -o /dev/null http://127.0.0.1:9084/api/auth/v1/fmo/admin/importmap/active
curl -f -D - -o /dev/null http://127.0.0.1:9084/api/analytics/v1/fmo/print
curl -f -i http://127.0.0.1:9084/api/ratan/bff/healthz
curl -f -i http://127.0.0.1:9084/api/ratan/notification/healthz
curl -f -i http://127.0.0.1:9084/api/ratan/da/healthz
curl -f -i http://127.0.0.1:9084/api/ratan/healthz
curl -f -I http://127.0.0.1:9084/static/ratan/container/remoteEntry.js
curl -f -I http://127.0.0.1:9084/static/ratan/cashflow/remoteEntry.js
curl -f -I http://127.0.0.1:9084/remotes/ratan/remoteEntry.js
curl -f -I http://127.0.0.1:9084/remotes/cashflow/remoteEntry.js
```

All must return 200. The four platform API responses must respectively include
`X-SCB-Next-Mock-Service: single-ui-bff`, `portal-auth-service`,
`portal-tile-management-service`, and `portal-telemetry-service`. Federation manifests must include `Cache-Control:
no-store` plus the edge security headers. Because the Minikube tenant routes
share one deterministic mock Deployment, runtime responses do not prove real
backend ownership; the architecture tests prove the Nginx upstream mapping.

Confirm the tenant edge has no public Ingress and reports its own health by
keeping this additional port-forward running in terminal C:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube port-forward service/ratan-edge 9086:8080
curl -f -i http://127.0.0.1:9086/healthz
```

Expect `{"status":"ok","component":"ratan-edge"}`. Do not expose this
Service as `NodePort` or `LoadBalancer` to simplify verification.

Verify the actual SockJS path, not a made-up `/socket/healthz` route:

```bash
curl --http1.1 -i --max-time 3 \
  -H 'Connection: Upgrade' \
  -H 'Upgrade: websocket' \
  -H 'Sec-WebSocket-Version: 13' \
  -H 'Sec-WebSocket-Key: SGVsbG9Xb3JsZDEyMzQ1Ng==' \
  http://127.0.0.1:9084/api/ratan/notification/subscriptions/733/manual/websocket
```

Expect `101 Switching Protocols` and a STOMP `CONNECTED` frame. Curl timing out
after the response is expected because the upgraded connection remains open.

To exercise the Ingress without `minikube tunnel`, keep this running in a third
terminal:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n ingress-nginx port-forward service/ingress-nginx-controller 9085:80
```

Then run:

```bash
curl -f -i http://127.0.0.1:9085/api/ratan/healthz
curl -f -I http://127.0.0.1:9085/remotes/ratan/remoteEntry.js
```

Do not use the ingress controller's own `/healthz` as evidence for the
application edge.

### Manual portal-service failure containment

Repeat this block for the three service/path pairs shown below while the
platform-edge port-forward remains active. The trap restores the selected
Deployment if a probe or command fails.

```bash
PORTAL_SERVICE=portal-auth-service
OWNED_PATH=/api/auth/v2/sso/validate
# Repeat with portal-tile-management-service and
# /api/auth/v1/fmo/admin/importmap/active, then portal-telemetry-service and
# /api/analytics/v1/fmo/print.
PORTAL_REPLICAS=$(kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube get "deployment/$PORTAL_SERVICE" \
  -o jsonpath='{.spec.replicas}')
restore_portal() {
  trap - EXIT INT TERM
  kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" -n scb-next-minikube \
    scale "deployment/$PORTAL_SERVICE" --replicas="$PORTAL_REPLICAS"
  kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" -n scb-next-minikube \
    rollout status "deployment/$PORTAL_SERVICE" --timeout=180s
}
trap restore_portal EXIT INT TERM

kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" -n scb-next-minikube \
  scale "deployment/$PORTAL_SERVICE" --replicas=0
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" -n scb-next-minikube \
  wait --for=delete pod -l "app.kubernetes.io/name=$PORTAL_SERVICE" --timeout=60s
! curl -f --max-time 5 "http://127.0.0.1:9084$OWNED_PATH"
curl -f -D - -o /dev/null http://127.0.0.1:9084/api/healthz
curl -f -D - -o /dev/null http://127.0.0.1:9084/api/auth/v1/fmo/admin/importmap/active
curl -f -D - -o /dev/null http://127.0.0.1:9084/api/analytics/v1/fmo/print
curl -f http://127.0.0.1:9084/api/ratan/healthz

restore_portal
curl --retry 30 --retry-delay 1 --retry-all-errors -f \
  "http://127.0.0.1:9084$OWNED_PATH"
```

When the selected service appears among the unaffected example probes, omit
that probe and instead run the two other portal route probes. Confirm their
`X-SCB-Next-Mock-Service` identities, the fallback identity, and Ratan remain
available. Record pod UIDs before and after; only the selected portal pod may
change.

### Manual tenant-edge failure containment

Keep the platform-edge port-forward running and execute:

```bash
RATAN_REPLICAS=$(kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube get deployment/ratan-edge -o jsonpath='{.spec.replicas}')
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube scale deployment/ratan-edge --replicas=0
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube wait --for=delete pod \
  -l app.kubernetes.io/name=ratan-edge --timeout=60s

curl -f http://127.0.0.1:9084/healthz
curl -f http://127.0.0.1:9084/
curl -f http://127.0.0.1:9084/api/healthz
! curl -f --max-time 5 http://127.0.0.1:9084/api/ratan/healthz
! curl -f --max-time 5 http://127.0.0.1:9084/remotes/ratan/remoteEntry.js

kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube scale deployment/ratan-edge --replicas="$RATAN_REPLICAS"
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube rollout status deployment/ratan-edge --timeout=180s
curl --retry 30 --retry-delay 1 --retry-all-errors -f \
  http://127.0.0.1:9084/api/ratan/healthz
```

Restore `ratan-edge` even if a probe fails. Confirm the `scb-next-edge` pod UID
did not change during the test.

Completion criterion: ingress and both edge tiers return the expected owners,
headers, manifests, and WebSocket upgrade; stopping and restoring each portal
service affects only its path family; stopping and restoring `ratan-edge`
affects only Ratan paths; no isolation cycle restarts an unrelated service.

## 15. Verify workload security and release independence

Inspect enforceable pod fields:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube get deploy -o yaml
```

For every Deployment verify `runAsNonRoot: true`, `readOnlyRootFilesystem:
true`, `allowPrivilegeEscalation: false`, dropped `ALL` capabilities,
`RuntimeDefault` seccomp, `automountServiceAccountToken: false`, readiness and
liveness probes, and resource requests/limits.

Record pod UIDs, restart only the Ratan edge, and record them again:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube get pods -o wide
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube rollout restart deployment/ratan-edge
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube rollout status deployment/ratan-edge --timeout=180s
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube get pods -o wide
```

Only the Ratan edge pod identity may change. The platform edge, platform
workloads, Ratan container, Cashflow, and backend pod identities must remain
unchanged. Probe the Ratan API, canonical remote, and WebSocket again after the
rollout.

Completion criterion: security fields are present and a tenant rollout does
not replace platform, edge, Cashflow, or BFF pods.

## 16. Verify NetworkPolicy only with an enforcing CNI

First identify the CNI:

```bash
minikube -p "$SCB_NEXT_MINIKUBE_PROFILE" ssh -- \
  'ls -1 /etc/cni/net.d && cat /etc/cni/net.d/*'
```

If the result is only the basic Minikube bridge plugin, mark runtime
NetworkPolicy enforcement `blocked`; Kubernetes stores the objects but traffic
is not denied. Do not report a static manifest pass as runtime isolation.

For a full local policy check, create a separate profile with Calico or use the
intended enterprise CNI. A separate profile avoids changing the evidence from
the basic proof:

```bash
export SCB_NEXT_MINIKUBE_PROFILE=scb-next-policy
export SCB_NEXT_KUBECTL_CONTEXT=scb-next-policy
minikube start -p "$SCB_NEXT_MINIKUBE_PROFILE" \
  --driver=docker --cpus=2 --memory=3500 --cni=calico
minikube -p "$SCB_NEXT_MINIKUBE_PROFILE" addons enable ingress
npm run k8s:minikube:build
npm run k8s:minikube:deploy
```

Then run:

```bash
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube exec deployment/scb-next-edge -- \
  wget -q -T 5 -O - http://ratan-edge:8080/healthz
kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube exec deployment/ratan-edge -- \
  wget -q -T 5 -O - http://ratan-container:8080/healthz
! kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube exec deployment/scb-next-edge -- \
  wget -q -T 5 -O - http://ratan-container:8080/healthz
! kubectl --context "$SCB_NEXT_KUBECTL_CONTEXT" \
  -n scb-next-minikube exec deployment/mfe-base -- \
  wget -q -T 5 -O - http://ratan-edge:8080/healthz
```

The first two requests must succeed. The direct platform-edge-to-Ratan-workload
and Base-to-Ratan-edge requests must time out or be denied. If either negative
request succeeds, NetworkPolicy enforcement failed or the selectors are wrong.

Completion criterion: positive and negative connectivity behave as specified
on the production-selected CNI.

## 17. Complete automated and manual browser acceptance

The production-edge Playwright scenario must complete login, both federation
boundaries, metrics, grid, `M0P56753524` search/details, accounting empty state,
Custom Search, View Builder, styling, and notification startup. Three
development-only scenarios are expected to be skipped in production-edge mode.

Run the section 8 manual journey at both documented viewports. Additionally,
inspect the avatar/profile-photo request. The current frontend requests the
corporate `axess.sc.net` profile-photo endpoint. If it is unreachable and
Chromium reports `ERR_CONNECTION_CLOSED`, the functional Cashflow journey may
still complete, but the strict console-clean browser gate is `fail` or
`blocked`, not pass. Retain:

- `test-results/**/test-failed-1.png`;
- `test-results/**/error-context.md`;
- `test-results/**/trace.zip`;
- the exact external URL and browser error;
- edge and relevant pod logs.

Do not remove the console assertion or ignore the request merely to obtain a
green run. An approved test environment may supply a reachable corporate
endpoint or an explicitly accepted fixture for that external dependency.

Completion criterion: the automated test exits zero and the manual journey has
no unclassified page error, console error, failed same-origin asset/API, or
notification failure.

## 18. Verify against real platform and tenant backends

This gate is mandatory for production certification and cannot be completed by
the Minikube mocks.

1. Deploy `portal-auth-service`, `portal-tile-management-service`,
   `portal-telemetry-service`, and retained `single-ui-bff` using approved
   immutable artifacts, identity, database, secrets, discovery, and platform
   dependencies. The three new coordinates may initially contain the same
   compatible artifact, but must remain independent runtime instances.
2. Deploy or configure the Ratan BFF, notification, data-ambassador, and API
   gateway owners.
3. Bind each edge upstream independently; do not collapse all `/api/*` traffic
   into one BFF.
4. Repeat sections 11, 14, 16, and 17 with an approved test identity.
5. Verify real search, filtering, paging, details, writes, maker/checker,
   export, permission gates, errors, and SockJS/STOMP notifications.
6. Verify enterprise TLS, WAF/trusted proxy behavior, CSP/CORS, secrets,
   workload identity, image digests/signatures, logs, metrics, traces, alerts,
   capacity, availability, backup, and rollback.
7. Confirm fixture credentials and fixture-only IDs are absent from real
   environment evidence.

Completion criterion: real platform and tenant integrations plus enterprise
infrastructure gates pass. Fixture evidence alone never closes this section.

## 19. Diagnose deployment-specific failures

| Symptom                                            | Likely boundary                     | First required check                                              |
| -------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| remote entry loads but chunk is 404                | `VITE_PUBLIC_BASE` or edge rewrite  | inspect remote entry, request URL, and matching edge location     |
| tile admin reaches auth service                    | Nginx location precedence           | confirm admin location precedes general auth and inspect identity |
| portal route returns wrong identity                | stale mutable Minikube image        | use `minikube image build`, restart owner, and inspect image ID   |
| platform request reaches tenant mock               | Nginx location precedence           | run architecture tests and inspect rendered edge config           |
| WebSocket returns 200 or handshake fails           | missing upgrade on either Nginx hop | inspect `Upgrade`/`Connection` at platform and tenant edges       |
| `ERR_CONNECTION_CLOSED` for `axess.sc.net`         | external profile-photo dependency   | inspect Playwright trace; do not classify as an SCB edge route    |
| NetworkPolicy objects exist but traffic is allowed | non-enforcing CNI                   | inspect `/etc/cni/net.d` and rerun on Calico/Cilium               |
| direct node IP times out on macOS                  | Docker Desktop Minikube networking  | verify through ingress-controller port-forward or approved tunnel |
| pod is Ready but edge returns 502                  | Service selector/port or policy     | inspect endpoints, pod logs, and edge upstream name               |
| only one pod per edge is running                   | Minikube replica patch              | inspect production base replicas/PDBs; do not claim local HA      |
| browser requests Node `net` from STOMP             | wrong browser STOMP entry           | verify the browser-compatible alias                               |
| JSONP syntax error or reconnect alert              | generic mock handled SockJS script  | inspect mock route precedence and executable frame                |

Completion criterion: each failure is owned and classified; generated `dist/`
or rendered manifests are never patched in place.

## 20. Retain a complete evidence manifest

Return this record with the handoff:

```text
Verifier and UTC date:
Environment (OS, Node, npm, browser, Docker, Minikube, Kubernetes, CNI):
Candidate SHA and pre-existing worktree changes:
Artifact/image tags and digests:
Architecture/OpenSpec/render/shell results:
Cashflow, Ratan, and Base test/build results:
VM render and nginx -t result:
VM deployment and rollback result:
Kubernetes inventory and rollout result:
Ingress and two-edge route results:
Canonical and compatibility cache headers:
WebSocket 101/STOMP evidence:
Pod security evidence:
Independent tenant-edge rollout and outage/recovery evidence:
Independent portal-service identity, rollout, and outage/recovery evidence:
NetworkPolicy static result:
NetworkPolicy runtime result and CNI:
Automated Playwright result:
Manual desktop and 1024x768 result:
Console and failed-network evidence:
Screenshots/traces/log paths:
Real platform BFF result:
Real portal auth/tile-management/telemetry result:
Real tenant backend result:
TLS/WAF/secrets/observability/capacity/DR results:
Known warnings and failed or blocked gates:
Rollback revision, owner, and routing action:
```

Every field contains evidence, `not applicable` with a reason, or `blocked`
with the command, exact cause, owner, and prerequisite. A previous dated report
does not replace current output.

## 21. Stop and clean up

Stop local Compose and development processes when used:

```bash
npm run stop:production
```

Remove only proof-owned Kubernetes resources:

```bash
npm run k8s:minikube:cleanup
```

The command preserves the Minikube profile by default. Confirm namespace
`scb-next-minikube` no longer exists. Delete the profile only when explicitly
intended and recorded.

## Final acceptance

Approve frontend composition only when build, architecture, route, federation,
WebSocket, automated browser, and manual browser gates pass from the candidate
checkout. Approve Kubernetes workload controls only when the selected CNI,
availability, security, ingress, observability, and rollback gates pass on the
target substrate. Approve the complete system for production only when VM or
approved Kubernetes deployment, real platform and tenant backends, enterprise
infrastructure, and browser acceptance are all green.

Any failed or blocked required gate keeps that acceptance level open.
Historical reports and fixture-only results cannot close it.
