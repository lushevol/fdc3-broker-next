# Minikube verification evidence

Date: 2026-08-18 00:05 +08 (Asia/Singapore)
Candidate: working tree based on `a2982c28`
Evidence scope: frontend, routing, independent runtime lifecycle, failure containment, and portable workload controls only

This file is a dated record, not a substitute for a current run of [the verification guide](../../docs/VERIFICATION_GUIDE.md).

## Environment

- Minikube 1.38.1 with Docker driver and Kubernetes 1.35.1
- kubectl 1.36.3 and Kustomize 5.8.1
- two CPUs and 3500 MB assigned to the proof profile
- default Minikube bridge CNI, which stores but does not enforce Kubernetes NetworkPolicy
- ten independently deployed proof workloads and thirteen `ClusterIP` Services
- seven NetworkPolicy objects and five PodDisruptionBudgets
- one Nginx Ingress with `scb-next-edge` as its only application backend
- separate platform edge, Ratan edge, three portal domain services, retained platform fallback, platform UI, tenant UI, and mock backend workloads

## Verified

- The Kubernetes base and Minikube overlay rendered successfully.
- All 44 SCB Next Vitest tests passed across four test files; the deployment suite contains 20 topology and shell-contract tests.
- Strict OpenSpec validation passed for `split-platform-bff-services` and the earlier deployment changes.
- All ten Deployments reached `1/1 Ready`; all thirteen Services were `ClusterIP`; the Ingress exposed only `scb-next-edge`.
- Seven NetworkPolicy objects and five PodDisruptionBudgets rendered and were accepted by Kubernetes.
- The complete production frontend build and all five direct `minikube image build` operations completed; redeploying restarted and readied all ten workloads from the profile images.
- Route identity headers proved `/api/auth/v2/sso/validate` selected `portal-auth-service`, `/api/auth/v1/fmo/admin/importmap/active` selected `portal-tile-management-service`, `/api/analytics/v1/fmo/print` selected `portal-telemetry-service`, and `/api/healthz` selected the retained `single-ui-bff` fallback.
- The three portal services ran as separate Deployments and Services using the same deterministic mock image under independent service-specific configuration. The new mock digest was `sha256:41d76b6a48296be64b1ac1a702e1187582faac4e67d3352e5961e369cd58ca76`.
- Scaling each portal service to zero made only its owned route fail. The other two portal routes, `single-ui-bff` fallback, and Ratan route continued to succeed. Restoring each Deployment recovered its route without restarting the other services or either edge.
- Platform UI/API, Ratan API, canonical static paths, and `/remotes/*` compatibility aliases returned HTTP 200 through the owning edge tier.
- Ratan and Cashflow federation manifests returned `Cache-Control: no-store, max-age=0`.
- Scaling `ratan-edge` to zero made Ratan API and static requests fail while platform `/healthz`, `/`, and `/api/healthz` continued to succeed. Restoring it recovered Ratan traffic without restarting `scb-next-edge`.
- The final production-edge Playwright run passed the captured Cashflow journey in 4.3 seconds. Three development-origin scenarios were intentionally skipped by `PLAYWRIGHT_PRODUCTION_EDGE=1`.
- All workloads declared probes, bounded resources, non-root execution, read-only root filesystems, no privilege escalation, dropped capabilities, disabled service-account token mounting, and `RuntimeDefault` seccomp.
- `ratan-edge` resources retain `scb-next.io/owner: ratan` and `scb-next.io/tenant: ratan`; platform edge policy selectors do not grant direct access to Ratan application workloads.

## Not done locally

- The manual two-viewport visual journey was not repeated because this change affects deployment routing only. The automated production-edge Cashflow journey completed.
- The real Spring artifact was not split into three Java source projects. The new services intentionally use compatible `single-ui-bff` artifacts during this deployment-first stage.
- VM/Ansible deployment, production rollback rehearsal, and authenticated real-service probes were not run because no approved production host, inventory, or credentials were available.

## Not verified locally

- Runtime NetworkPolicy denial was not verified. `/etc/cni/net.d/1-k8s.conflist` uses the basic bridge plugin, so manifest topology is statically verified but packet enforcement requires Calico, Cilium, or the production CNI.
- Multi-node scheduling, two-replica failover, PDB eviction behavior, autoscaling, load, and zone failure were not verified. The constrained Minikube overlay uses one replica per Deployment.
- Direct Minikube node-IP access through Docker Desktop was not used; application traffic was verified through Service port-forwarding. The Ingress object and backend were verified structurally.
- Independent runtime processes do not prove independent session stores, databases, downstream clients, or defect domains because the initial services share compatible application code.

## Cannot certify with this proof

The proof uses deterministic platform and Ratan backend mocks. It cannot certify corporate identity and authorization, real portal controller behavior, databases, session and entitlement ownership, Kafka/Solace/MQ, real notification infrastructure, enterprise secrets, external Ratan services, the corporate profile-photo endpoint, TLS/WAF, observability, production capacity, multi-node availability, disaster recovery, namespace/RBAC governance, image signing, or production rollout and rollback. Complete the real-backend and production-infrastructure gates in [the verification guide](../../docs/VERIFICATION_GUIDE.md) before approving a Kubernetes production overlay.
