## Context

SCB Next has four deployment ownership units: the platform foundation (`mfe-base` and `single-ui-bff`) and the Ratan tenant (`mfe-ratan-container` and `mfe-cashflow-blotter`, plus tenant backend upstreams). Every browser request must enter through one platform-owned Nginx edge. The current production-style Docker Compose image instead copies all three UI distributions into one image and sends all `/api/` traffic to one configurable BFF. Copied application Helm charts expose `NodePort`, select an EKS node group, use host-local Consul, and assume enterprise secrets, so they are unsuitable for a portable proof.

The application CI pipelines already default to VM/Ansible deployment. The migration specification currently fixes remote assets at `/remotes/ratan/` and `/remotes/cashflow/`; those URLs cannot be removed without coordinating frontend releases. The local environment has Docker and `kubectl`, but Minikube and Helm are not installed.

Stakeholders are platform engineering, the Ratan application team, DevOps/SRE, security, release owners, and operators of the existing VM estate.

## Goals / Non-Goals

**Goals:**

- Make VM/Ansible the explicit production deployment method for the current release.
- Give the platform edge one tested route table for platform and tenant UI/API traffic.
- Preserve same-origin browser URLs and existing Module Federation remote URLs during migration.
- Deploy platform and tenant workloads independently in Kubernetes behind one edge service.
- Provide a repeatable Minikube proof with route, health, security, and browser verification.
- Keep deployment configuration free of production secrets and environment-specific addresses.

**Non-Goals:**

- Approving Kubernetes as the enterprise production substrate.
- Replacing existing enterprise ingress, TLS, DNS, secret, image registry, or observability products.
- Making corporate databases, identity, messaging, or downstream services available in Minikube.
- Changing frontend business behavior, API schemas, Module Federation interfaces, or ownership.
- Removing `/remotes/ratan/*` or `/remotes/cashflow/*` compatibility paths.

## Decisions

### Keep a dedicated application edge behind the infrastructure ingress

The external load balancer or Kubernetes Ingress terminates enterprise traffic and forwards one catch-all route to `scb-next-edge`. The edge owns application path precedence and forwards only to internal upstreams. In Kubernetes all upstream services are `ClusterIP`.

Alternative: express every application route directly in an ingress resource. Rejected because route behavior would vary by ingress controller and would split the platform route contract across infrastructure and application repositories.

### Use the same route contract on VM and Kubernetes

The VM Nginx configuration uses configurable DNS/host upstreams; the Kubernetes edge uses service DNS names. Both include the same ordered locations and path-preservation rules. `/static/ratan/container/*` and `/static/ratan/cashflow/*` are canonical tenant static routes, while `/remotes/ratan/*` and `/remotes/cashflow/*` remain aliases.

Alternative: introduce Kubernetes-only browser URLs. Rejected because it requires environment-specific frontend builds and makes rollback between substrates unsafe.

### Route platform and tenant APIs independently

Platform routes such as `/api/auth/*`, `/api/analytics/*`, `/api/sso/*`, and the remaining platform `/api/*` fallback go to `single-ui-bff`. Ordered Ratan routes send `/api/ratan/bff/*`, sockets, notifications, data-ambassador calls, and the general `/api/ratan/*` fallback to tenant-owned upstreams. The edge preserves the incoming URI unless an existing backend contract explicitly requires stripping a prefix.

Alternative: forward all `/api/*` traffic to one BFF. Rejected because it obscures ownership, prevents independent scaling and release, and does not match existing Nginx production routes.

### Use plain Kubernetes manifests with Kustomize composition

The proof uses a checked-in `base` containing namespace-independent resources and a `minikube` overlay for local images and mock configuration. Deployments, Services, edge ConfigMap, NetworkPolicies, and disruption/availability controls remain visible without Helm rendering.

Alternative: repair and combine the copied per-application Helm charts. Rejected for the first proof because they contain EKS, Consul, Artifactory, and enterprise-secret assumptions and duplicate chart logic.

### Keep local proof data explicitly non-production

Minikube uses the existing deterministic mock BFF for browser acceptance and lightweight route probes where real tenant backends are unavailable. Production manifests contain references and configuration contracts only, never mock credentials or fixture services.

Alternative: claim full backend certification from Minikube. Rejected because `single-ui-bff` depends on corporate identity, databases, messaging, secrets, and downstream services.

### Test deployment contracts before implementation

Vitest architecture tests parse Nginx and Kubernetes assets to verify edge-only ingress, `ClusterIP` services, independent workloads, route order, probes, resource controls, and compatibility aliases. Minikube smoke tests then verify rendered resources and HTTP behavior. Existing Playwright production acceptance runs through the forwarded edge URL.

## Risks / Trade-offs

- [Duplicate VM and Kubernetes Nginx configuration can drift] -> Share a generated route fragment or enforce semantic parity in architecture tests.
- [Broad `/api/ratan/*` captures more-specific routes] -> Order exact/specific locations first and test route precedence.
- [Remote asset aliases create temporary operational complexity] -> Apply identical cache policy to canonical and compatibility paths and remove aliases only in a separately coordinated release.
- [Static UI containers add runtime overhead compared with CDN delivery] -> Keep immutable artifacts and cache semantics portable; retain the separate CDN decision for environments that approve it.
- [Minikube mocks can hide corporate integration failures] -> Label results routing/frontend-only and retain real-BFF certification as a separate release gate.
- [A single edge is a shared failure boundary] -> Run multiple replicas, add readiness probes and a PodDisruptionBudget, and keep fast VM/DNS rollback.
- [Secrets leak through copied Spring configuration] -> Inject production secrets only through the approved secret provider and prohibit Secret values in the proof manifests.

## Migration Plan

1. Specify and test the shared route table and deployment invariants.
2. Add VM edge configuration, inventory examples, health verification, and rollback instructions; update production documentation to identify VM/Ansible as authoritative.
3. Add Kubernetes base resources and a Minikube overlay using independently built UI images and local mock/probe services.
4. Run static contract tests, `kubectl kustomize`, Minikube HTTP probes, and Playwright through the edge.
5. Deploy the VM topology without changing public DNS, validate all platform and Ratan routes, then switch the edge upstreams or DNS under the existing rollback window.
6. Use Minikube evidence to request an enterprise Kubernetes substrate decision. A later production overlay must bind approved ingress, TLS, registry, secret, monitoring, and availability policies.

Rollback on VM restores the previous Nginx configuration and independent application artifacts through the existing Ansible release identifiers. Kubernetes proof rollback applies the previous immutable image tags/manifests; production traffic is not moved to Kubernetes by this change.

## Open Questions

- Which enterprise ingress controller and secret provider would a production Kubernetes overlay use?
- Are the Ratan BFF, notification, data ambassador, and API gateway separate Kubernetes ownership units or external services reached through approved egress?
- Which existing routes require prefix stripping rather than URI preservation?
- What production replica, zone-spread, RPO/RTO, and capacity targets apply to the edge and `single-ui-bff`?
- When can clients migrate from `/remotes/*` compatibility paths to `/static/ratan/*`?
