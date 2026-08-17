## Context

The Kubernetes proof currently has one platform-owned Nginx Deployment, `scb-next-edge`, that routes both platform and Ratan traffic. Its configuration names every Ratan UI and backend Service, and its NetworkPolicy allows direct connections to platform and tenant workloads. This couples platform releases and access privileges to tenant internals and makes a tenant routing change part of the platform edge lifecycle.

The public URL contract must remain stable. Infrastructure Ingress still terminates at the platform edge, while Ratan paths make one additional internal hop through a Ratan-owned Nginx edge. The VM production deployment is intentionally unchanged by this Kubernetes design.

## Goals / Non-Goals

**Goals:**

- Give the Ratan team exclusive ownership of Ratan route details and upstream names.
- Limit the platform edge to a small path-based tenant interface.
- Isolate deployment health, rollouts, disruption budgets, and network permissions for each edge.
- Demonstrate that a failed Ratan edge affects only Ratan paths.
- Preserve all existing browser paths, rewrites, WebSocket behavior, and cache headers.

**Non-Goals:**

- Moving the Kubernetes platform and tenant resources into separate namespaces.
- Changing public URLs, frontend import-map contracts, or backend payloads.
- Converting the VM production topology to tenant-owned edges in this change.
- Claiming runtime NetworkPolicy enforcement from Minikube's default bridge CNI.

## Decisions

### Platform edge delegates tenant path families

`scb-next-edge` retains platform UI and BFF routes. It defines one Ratan upstream, `ratan_edge`, and delegates `/api/ratan/`, `/static/ratan/`, `/remotes/ratan/`, and `/remotes/cashflow/` without stripping their prefixes. It does not name or connect to Ratan UI or backend Services.

Keeping the original path at the delegation boundary makes the interface observable and lets the tenant edge own all matching, precedence, rewrites, WebSocket headers, and caching rules. A shared sidecar was rejected because it would couple pod lifecycle and availability to platform workloads.

### Ratan edge is a standalone tenant workload

`ratan-edge` has its own ConfigMap, Deployment, ClusterIP Service, `/healthz`, replicas, probes, resources, security context, topology spreading, PodDisruptionBudget, and `scb-next.io/owner: ratan` plus `scb-next.io/tenant: ratan` labels. It uses the existing edge image because the image is a generic hardened Nginx runtime; ownership and behavior come from separate Kubernetes resources and configuration.

The Ratan configuration contains the container, Cashflow, BFF, socket, notification, data-ambassador, and fallback API upstreams. This creates a deep tenant routing module with four path-family entry points and hides all tenant internals from the platform.

### Network policy mirrors the routing chain

Default deny remains in place. Explicit policies allow:

1. Ingress infrastructure to reach `scb-next-edge`.
2. `scb-next-edge` to reach `mfe-base`, `single-ui-bff`, and `ratan-edge` only.
3. `mfe-base` and `single-ui-bff` to accept traffic from `scb-next-edge` only.
4. `ratan-edge` to accept traffic from `scb-next-edge` only.
5. `ratan-edge` to reach Ratan UI and backend pods only.
6. Ratan UI and backend pods to accept traffic from `ratan-edge` only.
7. Both Nginx edges to reach cluster DNS.

This is verified structurally in rendered manifests. Runtime denial requires a NetworkPolicy-capable CNI such as Calico or Cilium and is not certified by the default Minikube bridge CNI.

### Availability is independent

The platform edge health endpoint is local and never checks `ratan-edge`. Kubernetes readiness for either edge depends only on that edge's own `/healthz`. Scaling `ratan-edge` to zero must make Ratan paths fail while `/healthz`, `/`, and platform `/api/*` remain successful. Restoring the tenant edge must recover the same Ratan paths without restarting the platform edge.

The automated Minikube verifier records this by scaling `ratan-edge` down, probing both traffic classes, restoring its original replica count through a cleanup trap, waiting for rollout completion, and re-probing Ratan traffic.

## Risks / Trade-offs

- The additional proxy hop adds small latency and another tenant-path failure point. This is accepted to obtain operational and security isolation.
- A malformed broad route in the platform edge could still shadow traffic. Architecture tests assert the exact delegated path families and absence of tenant-internal upstreams.
- Shared namespace labels are easier to deploy but provide less administrative isolation than separate namespaces. Namespace-per-tenant can be added later without changing the public routing contract.
- Default Minikube cannot prove packet denial. Static policy tests and rendered evidence are authoritative for this proof; a production CNI conformance test remains required.
- Scaling to zero is a deliberate destructive availability test for the local proof namespace only. The script restores the replica count on normal exit and signals.

## Migration Plan

1. Apply the new Ratan ConfigMap, Deployment, Service, PDB, and policies while the existing platform edge still serves traffic.
2. Verify `ratan-edge` directly inside the cluster and confirm all Ratan route families.
3. deploy the restricted platform-edge configuration that delegates the four Ratan path families.
4. Verify platform and Ratan traffic through the public edge, including WebSocket upgrade behavior.
5. Run the Ratan edge outage/recovery proof and retain command output as evidence.
6. Roll back by reapplying the prior platform ConfigMap and workload manifests; removal of `ratan-edge` is safe only after the platform edge no longer delegates to it.

## Open Questions

- Whether production will require namespace-per-tenant and separate Kubernetes RBAC is an environment governance decision. The resource labels and routing boundary in this design are compatible with that later split.
- Production NetworkPolicy behavior must be reverified against the selected cluster CNI before rollout.
