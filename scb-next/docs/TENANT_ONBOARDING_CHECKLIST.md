# SCB Next tenant onboarding master checklist

Copy this checklist into the tenant's controlled evidence location. Link every
checked item to a ticket, pull request, command log, test report, dashboard, or
approval. A generated tenant checklist is created by `npm run tenant:onboard`.

## Intake and ownership

- [ ] Application tenant versus configured business customer is classified.
- [ ] Immutable tenant ID and portal display name are approved.
- [ ] Business, tenant engineering, platform, SRE, security, IAM, data, and integration owners are named.
- [ ] Business capability, user population, criticality, funding, environments, and regions are recorded.
- [ ] Data classification, residency, retention, recovery, and audit obligations are approved.

## Portal integration

- [ ] Unique same-origin API and static path families are reserved.
- [ ] Tenant edge is the only platform-visible tenant upstream.
- [ ] Remote name, remote entry, shared dependency policy, and cache behavior are approved.
- [ ] Navigation, feature flags, identity groups, entitlements, OpenFin behavior, and FDC3 contracts are tested.
- [ ] Existing platform and tenant paths are protected by regression tests.

## Kubernetes and delivery

- [ ] Namespace, shared namespace, or dedicated-cluster decision is approved.
- [ ] RBAC, workload identity, quota, limit range, admission, cost, and ownership labels are defined.
- [ ] Tenant edge, UI, API, notification, and integration workloads have independent release units.
- [ ] All application services are private `ClusterIP` services.
- [ ] Images use immutable digests, signatures, provenance, SBOMs, and approved scans.
- [ ] Probes, resources, replicas, topology spread, disruption budgets, autoscaling, and shutdown are tested.
- [ ] CI/CD promotion, approval, rollback, and artifact retention are owned.

## Security, identity, and data

- [ ] Default-deny NetworkPolicy and least-privilege allow rules are reviewed.
- [ ] Production-CNI positive and negative connectivity tests pass.
- [ ] Workload and human identities use least privilege and feature-level entitlements.
- [ ] Raw credentials are absent from Git, descriptors, logs, tickets, and command arguments.
- [ ] Approved secret references, access policies, rotation, and revocation are tested.
- [ ] Cross-tenant authorization and data segregation tests pass with real services.
- [ ] Audit events identify actor, tenant, action, result, and correlation ID without protected payloads.

## Dependencies and operations

- [ ] Every database, message system, downstream API, DNS entry, certificate, and egress destination has an owner.
- [ ] Timeouts, retries, circuit behavior, dependency health, and failure modes are tested.
- [ ] Logs, metrics, traces, dashboards, alerts, synthetics, and retention identify the tenant.
- [ ] Capacity, load, failover, backup/restore, RTO, RPO, and regional behavior are evidenced.
- [ ] Tenant-edge outage affects only the tenant and recovers without a platform-edge restart.
- [ ] On-call, incident routing, runbooks, diagnostics, and escalation paths are exercised.

## Activation and rollback

- [ ] Tenant resources pass direct internal verification before shared routing changes.
- [ ] Platform-edge delegation is reviewed and activated as the last rollout step.
- [ ] Authenticated UI, API, static asset, WebSocket, FDC3, and business journeys pass publicly.
- [ ] Platform and other tenants remain healthy during tenant rollout and failure tests.
- [ ] Rollback restores platform delegation first and uses recorded immutable versions.
- [ ] Hypercare entry, exit, monitoring, and support handoff are approved.

## Approvals

- [ ] Platform owner approval and evidence link
- [ ] Tenant technical owner approval and evidence link
- [ ] Security/IAM approval and evidence link
- [ ] Data/integration owner approval and evidence link
- [ ] SRE production-readiness approval and evidence link
- [ ] Business owner go-live approval and evidence link

## Offboarding readiness

- [ ] Data export, retention, deletion, and audit preservation owners are recorded.
- [ ] Platform routes and portal discovery entries have removal procedures.
- [ ] Identities, entitlements, secrets, certificates, and external access have revocation procedures.
- [ ] Workloads, storage, DNS, telemetry, alerts, backups, and cost allocation have removal procedures.
