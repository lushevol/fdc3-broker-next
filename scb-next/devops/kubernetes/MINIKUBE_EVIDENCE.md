# Minikube verification evidence

Date: 2026-08-17 (Asia/Singapore)
Evidence scope: frontend and routing only

## Environment

- Minikube 1.38.1, Docker driver
- Kubernetes 1.35.1
- Docker Desktop limited to 2 CPUs and 3905 MB; proof started with 2 CPUs and 3500 MB
- Six independently deployed proof workloads and nine private `ClusterIP` Services
- One Nginx Ingress forwarding only to `scb-next-edge`

## Results

- Kubernetes base and Minikube overlay rendered successfully with `kubectl kustomize`.
- Edge, Base, platform mock BFF, Ratan container, Cashflow blotter, and Ratan backend mock reached Ready state.
- Platform UI, platform API, Ratan API, canonical tenant static paths, and `/remotes/*` compatibility paths returned successful responses through the edge.
- Ratan and Cashflow federation manifests returned `Cache-Control: no-store, max-age=0`.
- The existing production-edge Playwright Cashflow journey passed in 4.4 seconds; three development-only scenarios were skipped as designed.
- Restricted in-sandbox Chromium launch failed because macOS denied Mach port registration. The same test passed when run with the required browser-process permission.

## Remaining production gates

This evidence uses deterministic mocks and does not certify corporate identity, authorization, database, Kafka/Solace/MQ, notification infrastructure, enterprise secrets, external Ratan services, TLS/WAF, observability, or production capacity. Complete the real-BFF gate in `docs/VERIFICATION_GUIDE.md` and every production-adoption item in `devops/kubernetes/README.md` before approving a Kubernetes production overlay.
