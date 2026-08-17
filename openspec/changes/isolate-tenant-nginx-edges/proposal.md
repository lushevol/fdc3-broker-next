## Why

The Kubernetes proof currently places platform and Ratan routing rules in one platform-owned Nginx edge, so platform operators must understand tenant internals and the platform edge can connect directly to every tenant workload. Each standalone application team needs an independently operated routing tier whose health, releases, configuration, and failures cannot affect other tenants or the platform foundation.

## What Changes

- Keep the infrastructure Ingress and public browser entry point attached only to the platform-owned edge.
- Restrict the platform edge to platform routes plus one small Ratan interface covering `/api/ratan/*`, `/static/ratan/*`, `/remotes/ratan/*`, and `/remotes/cashflow/*`.
- Add a Ratan-owned Nginx edge that owns all Ratan static, BFF, socket, notification, data-ambassador, and fallback routing rules.
- Give the Ratan edge its own Deployment, `ClusterIP` Service, health endpoint, security controls, resources, replica/disruption controls, and ownership labels.
- Update NetworkPolicies so the platform edge can reach only platform upstreams and tenant edges, while each tenant edge can reach only its declared tenant workloads.
- Prove that stopping or making the Ratan edge unready affects only Ratan paths while platform health, UI, and API traffic remain available.
- Update Minikube automation, route probes, browser evidence, diagrams, operational ownership, and manual verification instructions for the two-edge request path.

## Capabilities

### New Capabilities

- `scb-next-tenant-edge-isolation`: Team-owned tenant routing edges, platform-to-tenant interfaces, network isolation, independent lifecycle, and failure containment in Kubernetes.

### Modified Capabilities

None. The previous deployment change has not been archived into the main specification set.

## Impact

- Affects SCB Next Kubernetes edge ConfigMaps, Deployments, Services, PDBs, NetworkPolicies, Minikube scripts, architecture tests, evidence, and deployment documentation.
- Adds one Ratan-owned Nginx workload and one internal platform-to-Ratan hop; no browser URL, frontend federation contract, or backend payload changes.
- Removes Ratan internal upstream variables and route knowledge from the platform edge in Kubernetes.
- Does not change the currently supported VM/Ansible production topology in this change; adopting the same team edge there requires a separately coordinated VM rollout.
