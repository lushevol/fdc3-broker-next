# SCB Next deployment operator guide

This directory provides repeatable local learning, VM release preparation, and
Kubernetes adoption checks. The scripts fail closed on missing prerequisites or
production placeholders. They never install workstation tools, modify a
production cluster, create secrets, reload Nginx, or run Ansible.

Run commands from `scb-next`. Generated verification evidence is written under
`artifacts/verification/` and is ignored by Git.

## Command map

| Goal                                      | Command                                                       | Mutates runtime state             |
| ----------------------------------------- | ------------------------------------------------------------- | --------------------------------- |
| Record candidate and tool versions        | `npm run ops:capture-environment`                             | No                                |
| Run static local release gates            | `npm run ops:verify-static`                                   | No                                |
| Probe an already-running edge             | `SCB_NEXT_EDGE_ORIGIN=<url> npm run ops:smoke`                | No                                |
| Generate a tenant onboarding bundle       | `npm run tenant:onboard`                                      | Local ignored files only          |
| Check VM tools and environment values     | `npm run vm:preflight`                                        | No                                |
| Render and validate the VM edge config    | `npm run vm:validate`                                         | Writes ignored rendered config    |
| Collect VM route timing evidence          | `npm run vm:diagnostics`                                      | No                                |
| Validate the hardened Kubernetes base     | `npm run k8s:validate`                                        | No                                |
| Validate the local Minikube overlay       | `npm run k8s:validate:local`                                  | No                                |
| Start, build, deploy, and verify Minikube | `npm run k8s:minikube:up`                                     | Yes, dedicated local profile      |
| Inspect the local cluster                 | `npm run k8s:minikube:status`                                 | No                                |
| Collect Kubernetes diagnostics            | `npm run k8s:minikube:diagnostics`                            | No                                |
| Remove local proof resources              | `npm run k8s:minikube:cleanup`                                | Yes, SCB Next namespace resources |
| Gate an enterprise production overlay     | `SCB_NEXT_K8S_OVERLAY=<path> npm run k8s:validate:production` | No                                |

## Tenant onboarding

Start with [`../docs/TENANT_ONBOARDING_GUIDE.md`](../docs/TENANT_ONBOARDING_GUIDE.md)
and run `npm run tenant:onboard`. The processor captures business ownership,
portal composition, workloads, identity, dependencies, security, and service
objectives, then generates a descriptor and incomplete evidence checklist. It
does not provision infrastructure, modify shared routing, or collect raw
credentials.

## 1. Local static verification

Install dependencies and run the complete non-runtime gate:

```bash
npm install
npm run ops:verify-static
```

The static gate runs shell parsing, dependency isolation, the root Vitest suite,
Kubernetes base policy, VM template rendering, and the production frontend
build. Use these switches only when classifying existing debt or iterating:

```bash
SCB_NEXT_STATIC_RUN_BUILD=false npm run ops:verify-static
SCB_NEXT_STATIC_RUN_TYPECHECK=true npm run ops:verify-static
```

The first switch shortens an inner loop; it is not a release pass. The second
enables the documented legacy typecheck debt gate. Every stage gets its own log
inside the evidence directory printed by the command.

## 2. Local fixture-backed edge

Docker Compose is the quickest production-build and same-origin federation
exercise. It is not the VM or Kubernetes production topology.

```bash
npm run serve:production
SCB_NEXT_EDGE_ORIGIN=http://127.0.0.1:9081 npm run ops:smoke
PLAYWRIGHT_BASE_URL=http://127.0.0.1:9081 \
  PLAYWRIGHT_PRODUCTION_EDGE=1 npm run test:e2e
npm run stop:production
```

Use `mock.cashflow` / `acceptance` for the fixture journey. This proves frontend
artifacts, federation URLs, edge caching, and browser composition. It does not
prove corporate identity, authorization, data, messaging, or secrets.

## 3. VM release preparation

Create an environment-owned file, replace every documentation hostname, and
validate it before invoking the external Ansible pipeline:

```bash
cp devops/vm/scb-next.env.example devops/vm/scb-next.env
npm run vm:preflight
npm run vm:validate
```

For a production gate, require the estate's real Nginx syntax command:

```bash
SCB_NEXT_VM_MODE=production \
SCB_NEXT_NGINX_TEST_COMMAND='<approved nginx -t command using $SCB_NEXT_RENDERED_NGINX_CONFIG>' \
  npm run vm:validate
```

The command is intentionally environment-owned because production include
paths, DNS, modules, certificates, and permissions are outside this repository.
Validation fails in production mode when the file contains example values or
when no approved `nginx -t` command is supplied.

After Ansible deploys the immutable units:

```bash
SCB_NEXT_EDGE_ORIGIN=https://approved-host npm run vm:verify
SCB_NEXT_EDGE_ORIGIN=https://approved-host \
  SCB_NEXT_REQUIRE_SECURITY_HEADERS=true npm run ops:smoke
SCB_NEXT_EDGE_ORIGIN=https://approved-host npm run vm:diagnostics
```

Protected probes can use a mode-`0600` curl config outside the repository:

```bash
SCB_NEXT_CURL_CONFIG=/secure/path/scb-next.curlrc \
SCB_NEXT_EDGE_ORIGIN=https://approved-host npm run ops:smoke
```

Do not place bearer tokens directly in command arguments or commit the curl
config. Diagnostics records only status, remote address, and timing; it does not
copy request credentials, response bodies, or process environment variables.

## 4. Minikube learning environment

Install Docker, Minikube, `kubectl`, Node/npm dependencies, and Playwright
Chromium through approved sources. Then run the entire local lifecycle:

```bash
npm run k8s:minikube:up
```

The command performs preflight, policy validation, profile startup, production
frontend build, five local image builds, deployment rollout, route identity and
failure-isolation tests, and Playwright. For learning or failure diagnosis, run
the same stages separately:

```bash
npm run k8s:preflight
npm run k8s:validate:local
npm run k8s:minikube:start
npm run k8s:minikube:build
npm run k8s:minikube:deploy
npm run k8s:minikube:status
npm run k8s:minikube:verify
```

Skip only the final destructive failure-isolation/browser stage when inspecting
a fresh deployment:

```bash
SCB_NEXT_MINIKUBE_RUN_VERIFY=false npm run k8s:minikube:up
```

On failure, run `npm run k8s:minikube:diagnostics` before cleanup. It captures
inventory, pod descriptions, events, pod JSON, rendered manifests, and Minikube
logs without reading Kubernetes Secret values.

## 5. Production Kubernetes adoption

The committed base is a hardened contract, not a deployable production overlay.
Create an environment-owned overlay that replaces image placeholders and adds
enterprise ingress, identity, secret provider, observability, and policy
configuration. Then run:

```bash
SCB_NEXT_K8S_PREFLIGHT_MODE=production \
SCB_NEXT_KUBECTL_CONTEXT=<read-only-approved-context> npm run k8s:preflight

SCB_NEXT_K8S_OVERLAY=/path/to/production/overlay \
  npm run k8s:validate:production
```

The production policy rejects mutable images, images without `@sha256:<digest>`,
single-replica Deployments, missing per-workload disruption budgets, public Services, ingress paths that bypass
`scb-next-edge`, missing Ingress TLS, missing probes/resources/restricted
security, missing default-deny policy, and secret-like ConfigMap keys. When
`kubeconform` is installed, the same command also performs strict schema
validation.

Passing this static gate does not authorize deployment. Production approval
still requires registry signature/SBOM evidence, admission-policy results,
policy-capable CNI tests, real-BFF and WebSocket tests, authenticated browser
acceptance, capacity/failover tests, observability checks, backup/restore, and a
recorded per-unit rollback rehearsal.

## Evidence handling

Keep each command's unedited output and exit code with the generated metadata.
Before attaching evidence to a ticket, review it for internal hostnames and user
paths. Never add `artifacts/verification`, `scb-next.env`, curl configs,
kubeconfigs, tokens, certificates, or Secret exports to Git.

The detailed release criteria remain in
[`docs/VERIFICATION_GUIDE.md`](../docs/VERIFICATION_GUIDE.md).
