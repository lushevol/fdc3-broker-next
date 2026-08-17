# Minikube verification evidence

Date: 2026-08-17 23:22 +08 (Asia/Singapore)
Candidate: working tree based on `f1634372` (tenant-edge change not yet committed when recorded)
Evidence scope: frontend, routing, failure containment, and portable workload controls only

This file is a dated record, not a substitute for a current run of [the verification guide](../../docs/VERIFICATION_GUIDE.md).

## Environment

- Minikube 1.38.1 with Docker driver and Kubernetes 1.35.1
- kubectl 1.36.3 and Kustomize 5.8.1
- two CPUs and 3500 MB assigned to the proof profile
- default Minikube bridge CNI, which stores but does not enforce Kubernetes NetworkPolicy
- seven independently deployed proof workloads and ten `ClusterIP` Services
- one Nginx Ingress with `scb-next-edge` as its only application backend
- separate `scb-next-edge` and `ratan-edge` Deployments, Services, ConfigMaps, and PodDisruptionBudgets

## Verified

- The Kubernetes base and Minikube overlay rendered successfully.
- All 38 SCB Next Vitest tests passed; the deployment suite contains 15 topology and shell-contract tests.
- Strict OpenSpec validation passed for `isolate-tenant-nginx-edges`.
- All seven Deployments reached `1/1 Ready` with zero container restarts.
- All ten Services were `ClusterIP`; the Ingress exposed only `scb-next-edge`.
- Seven NetworkPolicy objects and two edge PodDisruptionBudgets rendered and were accepted by Kubernetes.
- The platform edge configuration named only `mfe-base`, `single-ui-bff`, and `ratan-edge`; it contained no Ratan application/backend upstreams.
- The Ratan edge owned container, Cashflow, BFF, socket, notification, data-ambassador, and fallback API routes.
- Platform UI/API, Ratan API, canonical static paths, and `/remotes/*` compatibility aliases returned HTTP 200 through `scb-next-edge -> ratan-edge` where applicable.
- Ratan and Cashflow federation manifests returned `Cache-Control: no-store, max-age=0`.
- Scaling `ratan-edge` to zero made Ratan API and static requests fail while platform `/healthz`, `/`, and `/api/healthz` continued to succeed.
- Restoring `ratan-edge` recovered Ratan API and static traffic without restarting `scb-next-edge`.
- The first two-edge Playwright run exposed a missing platform-hop WebSocket upgrade and failed with `Unexpected response code: 200`. After forwarding `Upgrade` and `Connection` across that hop, the architecture regression test and live rerun passed.
- The final production-edge Playwright run passed the captured Cashflow journey in 4.2 seconds with three development-only scenarios skipped and no console errors.
- Both edges declared independent local health probes, bounded resources, non-root execution, read-only root filesystems, no privilege escalation, dropped capabilities, disabled service-account token mounting, and `RuntimeDefault` seccomp.
- `ratan-edge` resources carry `scb-next.io/owner: ratan` and `scb-next.io/tenant: ratan`; its egress and workload-ingress selectors also require the Ratan tenant label.

## Not verified locally

- Runtime NetworkPolicy denial was not verified. `/etc/cni/net.d/1-k8s.conflist` uses the basic bridge plugin, so the manifest topology is statically verified but packet enforcement requires Calico, Cilium, or the production CNI.
- Multi-node scheduling, two-replica failover, PDB eviction behavior, autoscaling, load, and zone failure were not verified. The constrained Minikube overlay uses one replica per Deployment.
- Direct Minikube node-IP access through Docker Desktop was not used; application traffic was verified through Service port-forwarding. The Ingress object and backend were verified structurally.
- A manual visual pass at both documented desktop viewports was not repeated for this routing-only change. Automated Playwright exercised the production-edge Cashflow journey.

## Cannot certify with this proof

The proof uses deterministic platform and Ratan backend mocks. It cannot certify corporate identity and authorization, databases, Kafka/Solace/MQ, real notification infrastructure, enterprise secrets, external Ratan services, the corporate profile-photo endpoint, TLS/WAF, observability, production capacity, multi-node availability, disaster recovery, namespace/RBAC governance, image signing, or production rollout and rollback. Complete the real-backend and production-infrastructure gates in [the verification guide](../../docs/VERIFICATION_GUIDE.md) before approving a Kubernetes production overlay.
