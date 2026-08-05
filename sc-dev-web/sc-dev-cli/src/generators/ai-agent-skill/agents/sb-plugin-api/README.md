# Service Bench Plugin API Agents

Copilot agents for developing and configuring Service Bench backend API projects (Java/Kotlin Quarkus).

<!-- agents-start -->
## Agents

| Agent | Description |
|---|---|
| [build](./build/build-api.agent) | 'API Engineer Agent — Purpose-built for Service Bench backend API development. Supports Experience API (GraphQL) and Process API (REST) across Kotlin/Java (Quarkus), Python (Flask/FastAPI), Golang, and NodeJS. Covers the full delivery pipeline: Requirements analysis → Project setup → Feature development → Security hardening → Deployment.' |
| [compile-to-native](./compile-to-native/) | Enables Java/Kotlin Quarkus projects for GraalVM native compilation through a 2-step detection and configuration workflow. |
| [mcp](./mcp/quarkus-mcp-agent.agent) | 'Quarkus MCP Integration Agent — Automates the integration of an MCP Server into an existing Quarkus project. Covers dependency management (pom.xml), configuration (application.properties), MCP tool class generation, and context injection compatibility fixes.' |
| [review](./review/code-review-api.agent) | 'API Code Review Agent — Automated code review for Service Bench API projects. Validates security, compliance, environment, deployment, shared runtime, dependencies, and clean codebase requirements against SBV rules. Flags issues by severity and provides actionable feedback.' |
<!-- agents-end -->

---

## API Engineer

A general-purpose development agent for the full API delivery lifecycle.

**Supported stacks:**
- **Experience API (GraphQL):** Kotlin or Java with Quarkus + `graphql-parent`; Python with Flask/FastAPI; Golang with gqlgen
- **Process API (REST):** Kotlin or Java with Quarkus + `process-parent`; Python with Flask/FastAPI; Golang with Gin + GORM

**Workflow phases:**
1. **Analysis** — Analyse requirements, identify API type + language, output Implementation Plan (requires user confirmation)
2. **Development** — Implement code changes in sequence
3. **Security Check** — Validate security posture (PEP sidecar, input validation, secret handling) *(mandatory)*
4. **Dev Log** — Generate `.dev-logs/` entry + Acceptance Checklist *(mandatory)*

The agent loads the matching [skill](../../skills/sb-plugin-api/) for the project type and language before writing any code.

---

## Code Review

Automated code review agent for Service Bench API projects.

**Triggers:** User requests a code review on an API project.

**Checks performed (by severity):**

| Category | Key Rules |
|---|---|
| Security / Compliance [HIGH] | Latest DevKit Helm Chart & Buildpack · No high/critical Sonar or Aqua vulnerabilities · No Sonar bypass |
| Environment / Deployment [HIGH] | Correct `azure-pipelines` config · No hardcoded secrets |
| Dependencies [MEDIUM] | Latest API parent/dependency versions |
| Clean Codebase [LOW] | No dead code, debug statements, or TODO leftovers |

**Output format:** Summary table (`File` · `Line(s)` · `Code snippet` · `Severity`) followed by per-finding details and any follow-up questions.

---

## compile-to-native

Automates the steps required to make a Quarkus project native-compilation ready using buildpack infrastructure.

**How it works:**
1. Inspects `pom.xml` to determine if the project is an **Experience API** (GraphQL — contains `devkit-graphql-common`) or a **Process API** (REST)
2. Reads the matching rule file and executes every configuration step in order

**What it changes:**
- `pom.xml` parent/dependency versions
- `azure-pipelines-maven.yml` CI build stack params (`pool`, `buildpackImageName`, `builderImageName`)
- `src/main/resources/reflect-config.json` and `resource-config.json`
- `src/main/resources/application.properties`
- `env/<env>/properties.yml` files
- `@RegisterForReflection` (and `@GraphQLName` for Experience API) class annotations

**Rule files:**

| Project Type | Rule File |
|---|---|
| Experience API (GraphQL) | [experience-api-native-compile](./compile-to-native/rules/experience-api-native-compile) |
| Process API (REST) | [process-api-native-compile](./compile-to-native/rules/process-api-native-compile) |

> To use a large build pool (`sc-rhel8ec2-large`), raise an ADO support ticket following the instructions in the agent README.
