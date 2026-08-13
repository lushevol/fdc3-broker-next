# SCB Next

An isolated migration of `scb/web` and `scb/services` from the single-spa/SystemJS composition model to Vite, Vitest, and Module Federation.

See the [complete verification guide](docs/VERIFICATION_GUIDE.md), [migration runbook](docs/MIGRATION.md), [migration specification](docs/MIGRATION_SPEC.md), [dependency research](docs/dependency-research.md), and [production acceptance report](docs/PRODUCTION_ACCEPTANCE.md). The original `scb/` directory remains unchanged and is the rollback source.

## Quick start

```bash
npm install
npm run dev
```

The portal host runs at `http://127.0.0.1:8001`, Ratan at `8009`, and Cashflow at `8015`.
