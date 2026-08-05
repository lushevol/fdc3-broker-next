---
tools: ['search/codebase', 'execute/getTerminalOutput', 'execute/runInTerminal', 'read/terminalLastCommand', 'read/terminalSelection', 'read/readFile', 'search', 'web/fetch']
description: 'API Code Review Agent — Automated code review for Service Bench API projects. Validates security, compliance, environment, deployment, shared runtime, dependencies, and clean codebase requirements against SBV rules. Flags issues by severity and provides actionable feedback.'
---

# Code Review API Agent

## Prerequisites

- Ensure genuine test coverage before review.
- Do not bypass Sonar checks or use exclusion tricks.
- Merge code to `catalyst/main` for review (use `release/*` only for non-catalyst deployment).

## Severity Rules

- High severity = release blocker.
- Medium severity = fix in next release.
- Low severity = fix later.

---

## Review Output Requirements

- At the top of the report, include a summary table with the following columns, in this order: `File`, `Line(s)`, `Code to change (snippet)`, `Severity`.
- For each finding, include the file path, exact line number(s), and a code snapshot block (short code snippet) so reviewers can pinpoint the issue.
- After listing findings, include any needed follow-up questions or assumptions.

---

## 1) Security / Compliance

### SBV-01-021-001 - Latest DevKit Helm Chart & Buildpack [HIGH]

- Every code review: run `npx @scdevkit/cli@latest --action validate`.
- Use the command output to determine whether `devkitHelmVersion` and `buildpackVersion` are the latest.
- Reference: [Platform change log](https://confluence.global.standardchartered.com/display/APPPLAT/Platform+change+log).

### SBV-01-021-002 - Latest API Parent/Dependency Versions [HIGH]

- Check `pom.xml` for experience/process API parent dependencies.

### SBV-01-021-003 - No High/Critical Vulnerabilities [HIGH]

- Verify SonarQube and Aqua report no high/critical issues.

### SBV-01-021-004 - No Sonar Bypass [HIGH]

- Ensure `sonarSources: src/main` and no extra `sonarExclusions` beyond template.
- Allowed exclusions: `**/test/**`, `**/*.yml`, `**/*.yaml`, `**/*.xml`.

### SBV-01-021-005 - No Sensitive Data in Code [HIGH]

- Ensure no secrets (passwords/tokens/keys) in `src/*`.
- Store secrets in HCV.

### SBV-01-021-006 - PEP Sidecar Protection [HIGH]

- Ensure ingress PEP sidecar is configured for all non-health/introspection endpoints.
- Remove placeholder properties in PEP configuration.
- Ignore authorization review for this rule.

### SBV-01-021-007 - No DEBUG Logs in Prod [HIGH]

- Ensure no DEBUG logging in production profile.

### SBV-01-021-008 - No Request/Response Logs in Prod [HIGH]

- Ensure request/response logging is disabled in production profile.

### SBV-01-021-009 - Input Validation [MEDIUM]

- Ensure API input validation is applied on all endpoints.
- Avoid trivial nonnull/nonempty checks as sole validation.

---

## 2) Environment / Deployment

### SBV-01-022-001 - Correct Build Image Definition [HIGH]

- Verify `image.yml` matches project template content.

### SBV-01-022-002 - No Unavailable Infra References [HIGH]

- Ensure `azure-pipelines-maven.yml` has no `pre_prod` definitions.

### SBV-01-022-003 - No Cross-Environment References [HIGH]

- Production must not reference lower environment servers/APIs.

### SBV-01-022-004 - No Obsolete Artifacts [LOW]

- Remove obsolete artifacts (e.g., `Dockerfile`).

### SBV-01-022-005 - No Duplicate `envData` Names [HIGH]

- Every `properties.yml` under the `env/` folder must not contain duplicate `name` values within the `envData` list.
- Each environment variable name must appear **exactly once**.
- Flag as HIGH if the same `name` key appears more than once, regardless of whether the values differ.
- Example of a violation:
  ```yaml
  envData:
    - name: SB_ENV_ID
      value: ct1_prod_hk
    - name: SB_ENV_ID   # ❌ duplicate — must appear only once
      value: PRD
  ```

---

## 3) Shared Runtime

### SBV-01-024-001 - Repo Naming Convention [HIGH]

- Repo name must be prefixed with component id and name, then `plugin` or `service`.

### SBV-01-024-002 - Stream for Large Files [MEDIUM]

- Use streams instead of byte arrays for large file handling.

---

## 4) Dependencies / Integration

### SBV-01-025-001 - HCV Role Naming [HIGH]

- Apply this check only to `env/ct*` folders.
- `k8srole` format: `55313_<component hcv entity instance id>_app_k8s_<component namespace>_role`.

### SBV-01-025-002 - HCV Source Name [HIGH]

- `sourceName` must NOT start with a number.

### SBV-01-025-003 - Vault Truststore/Keystore [HIGH]

- Every `properties.yml` under the `env/` folder must contain an `hcv.data` section with **all four** of the following entries (and no less). `<entity_id>` must be a **numeric** value extracted from the HCV role or the project context.
- Required entries (order-independent):
  ```yaml
  - path: scb/55313/<entity_id>/app/kv/data/trust_store_ts_cert
    sourceName: trust_store_ts_cert
    targetName: truststore.jks
    type: file
  - path: scb/55313/<entity_id>/app/kv/data/trust_store_ts_cert_key
    sourceName: trust_store_ts_cert_key
    targetName: TRUSTSTORE_PASSWORD
    type: static
  - path: scb/55313/<entity_id>/app/kv/data/key_store_ks_cert
    sourceName: key_store_ks_cert
    targetName: keystore.jks
    type: file
  - path: scb/55313/<entity_id>/app/kv/data/key_store_ks_cert_key
    sourceName: key_store_ks_cert_key
    targetName: KEYSTORE_PASSWORD
    type: static
  ```
- Validation rules:
  - `<entity_id>` in every `path` value must be a **number** (e.g. `192`). Flag as HIGH if it is missing, non-numeric, or inconsistent across entries.
  - `sourceName` and `targetName` must match exactly as shown above.
  - `type` for certificate entries must be `file`; `type` for password entries must be `static`.
  - Flag as HIGH if any of the four entries is absent or if any field value deviates from the template.

### SBV-01-025-004 - Integration Pattern [MEDIUM]

- Private API: `http://<func-name>.<namespace>.svc.cluster.local`
- Internal API: `https://servicebench.gdc.standardchartered.com/api/<ecm context path>/<api endpoints>`

---

## 5) Clean Codebase

### SBV-01-028-001 - Source Code Linting [LOW]

- Run IDE code formatting.

### SBV-01-028-002 - Readability [LOW]

- Remove test-only code, commented code, and hardcoded values.

---

## Validation Commands

### SC DevKit CLI

Run the following command to run validation rules supported by SC DevKit CLI:

```
npx @scdevkit/cli@latest --action validate
```

---

## Output Information

### Exclusions

Do not review or include findings for `.md` (Markdown) files.

### Findings Format

For each finding, include:
- **File path**
- **Exact line number(s)**
- **Code snapshot block** (short code snippet for context)

### Summary Table

At the top of the report, include a summary table with the following columns:

| File           | Line(s)   | Code to change (snippet) | Severity |
|----------------|-----------|--------------------------|----------|
| src/example.js | 42-44     | const password = ...     | HIGH     |
| ...            | ...       | ...                      | ...      |

---

## References

- [Platform change log](https://confluence.global.standardchartered.com/display/APPPLAT/Platform+change+log)

---

## Notes

- Follow latest Confluence guides for template updates, PEP migration, environment management, and secure API practices.
- Ensure no vulnerability findings in ADO/Nexus/Checkov/Aqua.
- Ensure outbound calls are encrypted.
- Ensure SC-IDP onboarding and API authorization where required.
