# SCB Next

An isolated migration of `scb/web` and `scb/services` from the single-spa/SystemJS composition model to Vite, Vitest, and Module Federation.

Start with the [migration runbook](docs/MIGRATION.md) when porting legacy changes or planning a cutover. Use the [migration specification](docs/MIGRATION_SPEC.md) for non-negotiable contracts, the [complete verification guide](docs/VERIFICATION_GUIDE.md) for release gates, [dependency research](docs/dependency-research.md) for version decisions, and the [production acceptance report](docs/PRODUCTION_ACCEPTANCE.md) for evidence. The original `scb/` directory remains unchanged and is the rollback source.

## Quick start

```bash
npm install
npm run dev
```

The portal host runs at `http://127.0.0.1:8001`, Ratan at `8009`, and Cashflow at `8015`.

## Deployment

Production currently uses independently deployed VM/Ansible release units behind one platform-owned Nginx edge. See the [VM production runbook](devops/vm/README.md). The `serve:production` Docker Compose command is local, fixture-backed production-style acceptance and is not the production deployment topology.

The portable Kubernetes proof is under `devops/kubernetes`. It preserves the same edge route contract and keeps every platform and tenant upstream private; passing Minikube tests does not replace real-BFF production certification.
