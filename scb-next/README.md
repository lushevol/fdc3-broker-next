# SCB Next

An isolated migration of `scb/web` and `scb/services` from the single-spa/SystemJS composition model to Vite, Vitest, and Module Federation.

Start with the [migration runbook](docs/MIGRATION.md) when porting legacy changes or planning a cutover. Use the [migration specification](docs/MIGRATION_SPEC.md) for non-negotiable contracts, the [manual verification guide](docs/VERIFICATION_GUIDE.md) for release gates, [dependency research](docs/dependency-research.md) for version decisions, and the [production acceptance report](docs/PRODUCTION_ACCEPTANCE.md) for historical evidence. The original `scb/` directory remains unchanged and is the rollback source.

## Quick start

```bash
npm install
npm run dev
```

The portal host runs at `http://127.0.0.1:8001`, Ratan at `8009`, and Cashflow at `8015`.

## Deployment

Production currently uses independently deployed VM/Ansible release units behind one platform-owned Nginx edge. Start with the [deployment operator guide](devops/README.md), then use the [VM production runbook](devops/vm/README.md). The `serve:production` Docker Compose command is local, fixture-backed production-style acceptance and is not the production deployment topology.

The portable Kubernetes proof is under [devops/kubernetes](devops/kubernetes/README.md). It preserves the same edge route contract and declares every platform and tenant upstream as private `ClusterIP`. Minikube proves build, deployment, routing, federation, mock API, and browser composition behavior only. Runtime NetworkPolicy enforcement requires a policy-capable CNI, and production certification still requires the real BFFs and enterprise infrastructure.

For a reproducible manual check, follow [docs/VERIFICATION_GUIDE.md](docs/VERIFICATION_GUIDE.md) rather than relying on a previous evidence report.

## Tenant onboarding

Use the [tenant onboarding guide](docs/TENANT_ONBOARDING_GUIDE.md) and
[master checklist](docs/TENANT_ONBOARDING_CHECKLIST.md) when integrating a new
front-to-back business application into the portal. Run `npm run tenant:onboard`
for the guided eight-stage intake, or use its non-interactive mode to generate a
reviewable tenant descriptor and evidence checklist from a public input file.
The processor never applies Kubernetes resources or accepts raw credentials.
