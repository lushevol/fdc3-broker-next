# Flowzero Orchestration Service

Java 17 / Spring Boot 3.3.7 service for Flowzero workflow orchestration. The local npm wrapper loads the selected root environment profile and starts the service on port 11210.

## Commands

```bash
npm --workspace services/flowzero-orchestration-service run dev
npm --workspace services/flowzero-orchestration-service run test
npm --workspace services/flowzero-orchestration-service run build
```

Deployment assets include the Dockerfile, `app.conf`, Maven configuration, and CI pipeline definitions in this workspace.
