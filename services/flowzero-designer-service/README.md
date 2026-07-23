# Flowzero Designer Service

Java 17 / Spring Boot 3.3.7 service providing the Flowzero designer backend APIs. The local npm wrapper loads the selected root environment profile and starts the service with the `dev` Spring profile on port 11611.

## Commands

```bash
npm --workspace services/flowzero-designer-service run dev
npm --workspace services/flowzero-designer-service run test
npm --workspace services/flowzero-designer-service run build
```

Deployment assets include the Dockerfile, `app.conf`, Maven configuration, and CI pipeline definitions in this workspace.
