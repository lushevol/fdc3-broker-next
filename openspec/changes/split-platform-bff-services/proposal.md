## Why

The platform edge currently sends authentication, portal administration, telemetry, and every unmatched platform API to one `single-ui-bff` runtime. This prevents those domains from scaling, rolling out, and failing independently even though their browser path families already provide stable routing seams.

## What Changes

- Keep `single-ui-bff` as an independently deployed compatibility and fallback service.
- Add standalone `portal-auth-service`, `portal-tile-management-service`, and `portal-telemetry-service` runtime services using the compatible `single-ui-bff` artifact during the additive migration stage.
- Route authentication and SSO paths to `portal-auth-service`, portal administration paths to `portal-tile-management-service`, and analytics paths to `portal-telemetry-service` before the legacy platform fallback.
- Preserve public URLs, path rewrites, request/response payloads, headers, and browser behavior.
- Give each new service its own Deployment, ClusterIP Service, health probes, resources, security controls, replicas, ownership labels, and PodDisruptionBudget.
- Update VM runtime variables and Nginx routing without removing the existing `single-ui-bff` fallback.
- Update Kubernetes NetworkPolicies, Minikube mock deployments, lifecycle scripts, route probes, failure-isolation checks, evidence, and manual verification.
- Prove that stopping one new portal service affects only its owned path family while the platform UI, remaining portal domains, tenant edge, and legacy fallback remain available.

## Capabilities

### New Capabilities

- `scb-next-portal-service-decomposition`: Additive platform-service ownership, routing, independent lifecycle, and failure containment across VM and Kubernetes deployment methods.

### Modified Capabilities

None. The existing SCB Next deployment changes have not been archived into the main specification set.

## Impact

- Affects SCB Next VM Nginx configuration and environment rendering.
- Affects Kubernetes edge configuration, Deployments, Services, PDBs, NetworkPolicies, Minikube patches/scripts, architecture tests, evidence, and deployment documentation.
- Adds three runtime release units but does not duplicate or rewrite the Spring business implementation in this stage.
- Keeps `single-ui-bff` deployed and reachable only through the unmatched platform `/api/*` fallback.
- Adds three service hops only as alternatives selected by path; it does not add hops to any individual request.
