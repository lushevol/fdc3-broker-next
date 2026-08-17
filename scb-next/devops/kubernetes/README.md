# SCB Next Kubernetes proof

This proof keeps one platform-owned Nginx edge in front of independently deployed platform and Ratan workloads. The infrastructure Ingress has one catch-all backend, and every application Service is `ClusterIP`.

## What this proof establishes

- production builds for Base, Ratan container, and Cashflow;
- separate edge, platform, and tenant images and Deployments;
- Ingress to edge to owning upstream routing;
- platform and tenant HTTP paths, federation assets, cache policy, and WebSocket upgrade;
- non-root workload controls, probes, resources, disruption configuration, and independent rollout;
- fixture-backed Cashflow browser composition.

It does not certify real corporate identity, authorization, databases, messaging, notification infrastructure, secrets, external tenant services, TLS/WAF, observability, capacity, or disaster recovery.

## Quick verification

Prerequisites are Docker, Minikube, `kubectl`, Node/npm dependencies, and the Playwright Chromium browser. Run from `scb-next`:

```bash
npm run k8s:minikube:start
npm run k8s:minikube:build
npm run k8s:minikube:deploy
npm run k8s:minikube:verify
```

The verify command uses port `9083` by default. A passing run proves the HTTP probes and fixture-backed browser journey. A browser failure caused by an unavailable external URL is still a failed gate: retain the Playwright trace and classify the external dependency instead of suppressing the console error.

The dedicated profile defaults to 2 CPUs and 3072 MB. Override `SCB_NEXT_MINIKUBE_CPUS` or `SCB_NEXT_MINIKUBE_MEMORY` when the workstation has more capacity. Use the isolated `MINIKUBE_HOME` and `KUBECONFIG` procedure in [the manual verification guide](../../docs/VERIFICATION_GUIDE.md) when the tools are not installed globally.

## NetworkPolicy prerequisite

Kubernetes accepts NetworkPolicy objects even when the CNI does not enforce them. Minikube's default bridge CNI does not prove runtime isolation. Use Calico, Cilium, or the intended enterprise CNI and run the positive edge-to-upstream plus negative non-edge-to-upstream checks in the manual guide before claiming NetworkPolicy enforcement.

## Cleanup

Cleanup removes only the `scb-next-minikube` overlay resources. Set `SCB_NEXT_DELETE_MINIKUBE_PROFILE=true` only when the dedicated profile should also be deleted:

```bash
npm run k8s:minikube:cleanup
```

See [MINIKUBE_EVIDENCE.md](MINIKUBE_EVIDENCE.md) for the latest recorded run and [the manual verification guide](../../docs/VERIFICATION_GUIDE.md) for the complete reproducible procedure.

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
