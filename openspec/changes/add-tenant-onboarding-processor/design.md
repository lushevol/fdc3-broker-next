## Context

SCB Next currently demonstrates one tenant, Ratan, behind a tenant-owned edge. The proof establishes private `ClusterIP` workloads, path-family delegation, hardened pod controls, and tenant failure containment, but production namespace/RBAC governance and real enterprise integrations remain adoption gates. A new tenant therefore needs coordinated decisions across business ownership, portal composition, Kubernetes, identity, security, data, observability, and release operations.

The first onboarding processor must be useful without claiming authority over enterprise systems. It will run locally, collect only non-secret contract data, and generate artifacts for review. Platform and SRE automation can consume the approved descriptor in a later change.

## Goals / Non-Goals

**Goals:**

- Give a new application team one front-to-back onboarding guide and evidence checklist.
- Capture a stable, machine-readable tenant contract using Kubernetes-safe identifiers and same-origin portal paths.
- Guide the operator through eight confirmed stages and show progress throughout the interactive run.
- Generate deterministic, idempotent artifacts suitable for pull-request review.
- Reject raw secret material and record secret-provider references only.
- Make the wizard testable through help and non-interactive generation modes.

**Non-Goals:**

- Applying Kubernetes resources or changing the platform edge.
- Creating identity clients, secrets, DNS, certificates, repositories, or CI pipelines.
- Generating application source code or tenant-specific production manifests.
- Certifying real identity, authorization, data segregation, network enforcement, HA, or disaster recovery.

## Decisions

### Use one canonical tenant descriptor

The wizard generates `tenant.yaml` as the durable handoff and `tenant.env` as the rerunnable intake state. The descriptor groups business ownership, portal integration, workloads, security, dependencies, and service objectives. A generated checklist references the same tenant ID and artifact paths.

Alternative: treat the Markdown checklist as the source of truth. Rejected because free-form Markdown is difficult to validate and unsafe to use as future deployment input.

### Keep the first processor generate-only

The wizard writes only beneath its configured output directory. It prints commands and approval gates but never invokes `kubectl`, changes shared routing, writes GitHub secrets, or calls enterprise APIs.

Alternative: provision a namespace and workloads directly. Rejected because cluster context, RBAC, secret provider, ingress, and production overlay governance are unresolved, and an interactive intake tool must not silently become a deployment authority.

### Store secret references, never secret values

The contract accepts secret references using provider-qualified identifiers such as `vault:path/to/secret` or `externalsecret:name`. Values matching common private-key, bearer-token, password-assignment, or cloud-key patterns are rejected before any output is generated. Generated files are created with user-only permissions where supported.

Alternative: use hidden input and write credentials to a local `.env`. Rejected because the onboarding bundle is designed for review and must remain safe to commit when policy allows.

### Test the public CLI seam

Vitest invokes the Bash script as a user would. Tests verify `--help`, generate-only behavior from a complete input file, invalid tenant IDs, raw-secret rejection, generated document content, and identical rerun output. Tests do not couple to individual shell functions.

Alternative: source the script and unit-test helpers. Rejected because that would bind tests to implementation details rather than the supported CLI contract.

### Separate generic guidance from tenant-specific evidence

The repository contains a canonical guide and master checklist. Each wizard run creates a tenant-specific descriptor and checklist so evidence and approvals are not shared across tenants.

## Risks / Trade-offs

- [A descriptor may imply that onboarding is complete] -> Generated checklists begin incomplete and explicitly require human evidence and approvals.
- [Free-form dependency fields may be inconsistent] -> The MVP defines stable top-level keys and documents delimiter conventions; schema validation can be added before deployment automation consumes the file.
- [Pattern-based secret detection cannot identify every credential] -> Accept only secret references by contract, warn prominently, restrict file permissions, and retain mandatory human review.
- [The wizard template is Bash-specific] -> Keep POSIX-facing commands simple, validate with `bash -n` and ShellCheck when available, and support macOS and Linux Bash.
- [A single active intake state can be overwritten] -> Support explicit `--input` and `--output-dir` paths and make reruns deterministic.

## Migration Plan

1. Add the guide, master checklist, descriptor example, and generated-output policy.
2. Add failing CLI contract tests.
3. Add the interactive wizard with help and non-interactive generation modes.
4. Link the processor from SCB Next documentation and package scripts.
5. Validate locally with Vitest, `bash -n`, ShellCheck when available, and strict OpenSpec validation.

Rollback removes the new documentation, tooling, tests, and npm command. No runtime or cluster state is changed.

## Open Questions

- Which production secret provider and reference syntax will be authoritative?
- Whether namespace-per-tenant is mandatory or selected by data and administrative trust classification remains a platform governance decision.
- A future change must define how an approved descriptor becomes a tenant Kustomize overlay and a platform-edge delegation update.
