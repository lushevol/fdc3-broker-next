## Why

SCB Next currently describes production as one Nginx image that bundles the platform host and tenant remotes and forwards every API request to one BFF. Production needs an explicit VM deployment contract now, while Kubernetes needs to be evaluated without losing the platform-owned edge, tenant ownership boundaries, same-origin browser contract, or rollback path.

## What Changes

- Define one platform-owned Nginx edge route contract that sends platform UI and API traffic to `mfe-base` and `single-ui-bff`, and tenant static and API traffic to independently owned Ratan upstreams.
- Make VM/Ansible the supported SCB Next production deployment method and document independent artifact deployment, health checks, routing, rollback, and operational verification.
- Retain the existing Docker Compose stack only as local production-style acceptance rather than the production deployment method.
- Add a Kubernetes deployment option in which an external ingress sends all traffic to the platform edge and only `ClusterIP` upstream services are reachable behind it.
- Add Minikube automation and tests for edge route precedence, static remote delivery, platform and tenant APIs, health checks, WebSocket forwarding, and the existing browser journey.
- Preserve `/remotes/ratan/*` and `/remotes/cashflow/*` as compatibility paths while introducing the tenant-owned `/static/ratan/*` namespace.

## Capabilities

### New Capabilities

- `scb-next-edge-routing`: Stable same-origin platform and tenant route ownership, precedence, forwarding, caching, health, and compatibility behavior.
- `scb-next-vm-production-delivery`: VM/Ansible production topology, configuration boundaries, deployment verification, and rollback behavior.
- `scb-next-kubernetes-delivery`: Kubernetes workload topology, security and availability controls, Minikube deployment, and end-to-end conformance verification.

### Modified Capabilities

None. No existing main specification defines the SCB Next deployment substrate or edge ownership contract.

## Impact

- Affects `scb-next/devops`, SCB Next production documentation and scripts, and the deployment expectations of `mfe-base-origin`, `mfe-ratan-container-origin`, `mfe-cashflow-blotter-origin`, and `single-ui-bff`.
- Adds Kubernetes manifests or a shared chart, Minikube lifecycle scripts, route-contract tests, and deployment-focused verification commands.
- Requires platform/SRE ownership of the edge and platform foundation, while Ratan retains independent ownership of tenant UI and backend releases.
- Does not change business API payloads, frontend application behavior, Module Federation contracts, or production credentials.
- Complements rather than replaces the CDN-oriented `productionize-two-layer-federation-delivery` change; enterprise adoption of Kubernetes remains a separately approved release decision.
