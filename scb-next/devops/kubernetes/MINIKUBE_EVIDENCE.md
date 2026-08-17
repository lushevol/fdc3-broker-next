# Minikube verification evidence

Date: 2026-08-17 (Asia/Singapore)
Candidate commit: `020947d4`
Evidence scope: frontend, routing, and portable workload controls only

This file is a dated record, not a substitute for a current run of [the verification guide](../../docs/VERIFICATION_GUIDE.md).

## Environment

- Minikube 1.38.1 with Docker driver, Kubernetes 1.35.1
- two CPUs and 3500 MB assigned to the proof profile
- default Minikube bridge CNI, which does not enforce Kubernetes NetworkPolicy
- six independently deployed proof workloads and nine `ClusterIP` Services
- one Nginx Ingress with `scb-next-edge` as its only application backend

## Verified

- Base, Ratan container, and Cashflow production builds completed.
- Five local images built and loaded into Minikube.
- All six Deployments reached Ready with zero container restarts.
- Both Kustomize layers rendered, all 36 SCB Next tests passed, and strict OpenSpec validation passed.
- Platform UI/API, all specific Ratan API namespaces, canonical tenant static paths, and `/remotes/*` compatibility aliases returned HTTP 200 through the edge.
- The ingress-controller path returned tenant API and federation content through the catch-all Ingress.
- Ratan and Cashflow federation manifests returned `Cache-Control: no-store, max-age=0` and edge security headers.
- The actual SockJS notification path returned HTTP 101 and a STOMP `CONNECTED` frame.
- All workloads declared non-root execution, read-only root filesystem, no privilege escalation, dropped capabilities, `RuntimeDefault` seccomp, probes, and bounded resources.
- Restarting only `ratan-container` changed only that pod UID; platform, edge, Cashflow, and backend mock pods were unchanged.
- The VM Nginx template rendered and passed `nginx -t` in `nginxinc/nginx-unprivileged:1.28-alpine`.

## Failed or blocked

- The latest strict Playwright run completed login, Cashflow loading, search, details, accounting, Custom Search, View Builder, and WebSocket startup, but the test failed its empty-console-error assertion. Chromium could not load `https://axess.sc.net/scb-axess-cms/api/users/mock.cashflow/photo` and reported `net::ERR_CONNECTION_CLOSED`. This is an external corporate dependency and remains a failed browser gate until it is reachable or intentionally replaced by an approved test fixture.
- Runtime NetworkPolicy isolation was not verified. Both the edge and a Base pod could reach the tenant Service because the profile uses the non-enforcing bridge CNI. The policy manifests and selectors passed static tests, but denial must be rerun with Calico, Cilium, or the enterprise CNI.
- Direct access to the Minikube node IP was unavailable through Docker Desktop networking. Ingress behavior was verified by port-forwarding the ingress-controller Service instead.

## Not certified

The proof uses deterministic mocks. It does not certify corporate identity, authorization, databases, Kafka/Solace/MQ, real notification infrastructure, enterprise secrets, external Ratan services, TLS/WAF, observability, production capacity, multi-node availability, or disaster recovery. Complete the real-BFF and production-infrastructure gates in [the verification guide](../../docs/VERIFICATION_GUIDE.md) before approving a Kubernetes production overlay.
