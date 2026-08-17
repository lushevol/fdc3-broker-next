# SCB Next Kubernetes proof

This proof keeps one platform-owned Nginx edge in front of independently deployed platform and Ratan workloads. The infrastructure Ingress has one catch-all backend, and every application Service is `ClusterIP`.

## Local verification

Prerequisites are Docker, Minikube, `kubectl`, Node/npm dependencies, and Playwright browsers.

```bash
npm run k8s:minikube:start
npm run k8s:minikube:build
npm run k8s:minikube:deploy
npm run k8s:minikube:verify
```

The verify command uses port `9083` by default and runs the fixture-backed production Playwright journey. It proves manifest rendering, pod readiness, edge routing, federation static delivery, mock API reachability, and browser composition. It does not certify corporate identity, databases, messaging, secrets, or downstream systems.

The dedicated profile defaults to 2 CPUs and 3072 MB. Override `SCB_NEXT_MINIKUBE_CPUS` or `SCB_NEXT_MINIKUBE_MEMORY` when the workstation has more capacity.

Cleanup removes only the `scb-next-minikube` overlay resources. Set `SCB_NEXT_DELETE_MINIKUBE_PROFILE=true` to also delete the dedicated profile:

```bash
npm run k8s:minikube:cleanup
```

## Production adoption gates

Before creating a production overlay, approve and record:

- ingress controller, TLS/certificate ownership, DNS, WAF, and trusted proxy behavior;
- immutable registry paths, signatures, provenance, SBOM, scanning, and workload identity;
- secret provider/CSI integration and prohibition of secret values in ConfigMaps;
- Ratan backend placement, service ownership, prefix-rewrite contracts, and external egress;
- network-policy implementation and DNS/telemetry/database/message-broker allowances;
- logs, metrics, traces, release dimensions, synthetic journeys, alerting, and audit retention;
- replica counts, requests/limits, autoscaling, zone spread, disruption budgets, and capacity tests;
- backup, artifact retention, RPO/RTO, regional failover, rollout, and VM fallback procedures;
- real-BFF authentication, authorization, API, notification, and Cashflow browser certification.

The Kubernetes base contains placeholder image names and no production Secret. Enterprise overlays must replace image tags by immutable digest and attach tenant backend implementations to the declared Services.
