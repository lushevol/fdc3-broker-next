# Service Bench Plugin UI Agents

Copilot agents for designing and building Service Bench plugin UIs using LitElement + TypeScript + `@scdevkit`.

<!-- agents-start -->
## Agents

| Agent | Description |
|---|---|
| [build](./build/build-ui.agent) | 'UI Engineer Agent — Purpose-built for LitElement + TypeScript + @scdevkit plugin development. Covers the full delivery pipeline: Figma / screenshot / description analysis → Mock setup → Feature development → Unit testing (~85% coverage) → Dev Log generation.' |
| [figma-to-scwebkit](./figma-to-scwebkit/) | Converts Figma designs into SC WebKit component code through a guided 4-step workflow. |
| [leapkit-to-sb-plugin](./leapkit-to-sb-plugin/) | Converts a leap-kit React project into a Service Bench UI plugin (LitElement 3 + TypeScript + @scdevkit) through a guided 6-step workflow. |
| [review](./review/code-review-ui.agent) | 'UI Code Review Agent — Automated code review for Service Bench UI projects. Validates security, compliance, environment, deployment, shared runtime, dependencies, integration, user experience, and clean codebase requirements against SBV rules. Flags issues by severity and provides actionable feedback.' |
| [security](./security/security-fix.agent) | Automatic security scanning and fixing for Service Bench plugin projects. |
<!-- agents-end -->

---

## Service Bench Plugin UI Engineer

A general-purpose development agent for the full plugin delivery lifecycle.

**Workflow phases:**
1. **Design Analysis** — Figma URL / screenshot / description → Component Plan (requires user confirmation)
2. **Mock Setup** — Mock infrastructure and feature fixtures (skippable)
3. **Development** — Routes, components, API wiring, i18n, styles
4. **Unit Testing** — Jest + `@open-wc/testing`, target ~85% coverage
5. **Dev Log & Checklist** — `.dev-logs/` entry + Acceptance Checklist (mandatory)

The agent automatically selects and loads the right [skill](../../skills/sb-plugin-ui/) for each task type before writing any code.

---

## Figma to SC WebKit

A 4-step pipeline that takes a Figma design from raw URL to fully integrated, validated SC WebKit UI components.

| Step | Agent File | What it does |
|---|---|---|
| 1 | [step-1-sb-mapping-context-setup.agent](./figma-to-scwebkit/step-1-sb-mapping-context-setup.agent) | Builds/updates `components-map.json` from SC WebKit Storybook — run once per WebKit version update |
| 2 | [step-2-figma-to-sc-webkit.agent](./figma-to-scwebkit/step-2-figma-to-sc-webkit.agent) | Analyses Figma design and generates TypeScript/Lit component code |
| 3 | [step-3-integrate-api.agent](./figma-to-scwebkit/step-3-integrate-api.agent) | Creates API services, mock data files, and data bindings for `sc-data-grid` and dropdowns |
| 4 | [step-4-implement-ui-validation.agent](./figma-to-scwebkit/step-4-implement-ui-validation.agent) | Adds form validation with regex patterns, length constraints, and custom rules |

**Supporting resources:**
- [components-map.json](./figma-to-scwebkit/resources/components-map.json) — Figma description → SC WebKit component mappings
- [figma-analysis-instructions](./figma-to-scwebkit/rules/figma-analysis-instructions)
- [framework-guidelines](./figma-to-scwebkit/rules/framework-guidelines)
- [coding-standards](./figma-to-scwebkit/rules/coding-standards)

---

## Code Review

Automated code review agent for Service Bench UI projects.

**Triggers:** User requests a code review on a UI plugin project.

**Checks performed (by severity):**

| Category | Key Rules |
|---|---|
| Security / Compliance [HIGH] | Latest DevKit Helm Chart & Buildpack · No high/critical `npm audit` vulnerabilities · No Sonar bypass · No sensitive data in `src/` |
| Environment / Deployment [HIGH] | Correct `azure-pipelines-npm.yml` config · Environment variables via DevKit secrets only |
| Dependencies / Integration [MEDIUM] | Latest `@scdevkit` packages · Correct GraphQL namespace usage |
| User Experience [LOW] | Loading/error/empty states present · i18n applied to all user-visible text |
| Clean Codebase [LOW] | No dead code, debug statements, or TODO leftovers |

**Output format:** Summary table (`File` · `Line(s)` · `Code snippet` · `Severity`) followed by per-finding details and any follow-up questions.

---

## Security Fix

Scans and auto-fixes security and compliance issues in a Service Bench plugin project.

**Triggers:** `fix`, `security-fix`, `scan`, `security`, `validate`

**Workflow:**

| Step | Description |
|---|---|
| 1 — Scan | Runs `@scdevkit/cli --action validate`. If triggered by `fix`/`security-fix`, also runs `npm audit fix` in the same step |
| 2 — Present & Decide | Displays all detected issues; if triggered by `scan`/`security`/`validate`, asks user to confirm before proceeding |
| 3 — Apply Fixes | Applies all config-file fixes in one pass (never modifies `src/`; no `--force`) |
| 4 — Report | Outputs a structured report: fixed items ✅, manual actions ⚠️, changed npm packages, and next steps |
